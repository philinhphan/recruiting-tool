import { ApiError } from '../types/api';

const API_BASE_URL = '/api/v1'; // Adjust if your backend prefix is different

interface RequestOptions extends RequestInit {
  // You can add custom options here if needed
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, ...customConfig } = options;

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only set Content-Type if body is present and not FormData
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method: options.method || (body ? 'POST' : 'GET'),
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = (body instanceof FormData) ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
        if (typeof errorData.message !== 'string') {
          // Fallback if errorData.message is not a string
          errorData.message = `API request failed with status ${response.status}`;
        }
      } catch (e) {
        errorData = { message: `API request failed with status ${response.status}. Unable to parse error response.` };
      }
      // Enrich with status for better error handling upstream
      (errorData as any).status = response.status;
      return Promise.reject(errorData);
    }

    // Handle cases where the response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
      // If it's a 204 or not JSON, we assume success with no body or non-JSON body.
      // For non-JSON, one might want to return response.text() or response.blob()
      // but for this generic client, we'll return an empty object for simplicity
      // if not a 204. A specific service method can override this.
      // For 204, it's fine to resolve with undefined or null.
      // Let's resolve with undefined for 204, and for non-JSON, let's try to parse as text.
      if (response.status === 204) {
        return Promise.resolve(undefined as unknown as T);
      }
      // For now, let's assume JSON or empty for simplicity as per most backend API designs.
      // If a specific endpoint returns non-JSON, that method should handle it.
      // If content-type is not JSON, but there's content, this might be an issue.
      // For now, we will attempt to parse as JSON, which will likely fail if it's not.
      // A robust client might handle different content types more gracefully.
    }

    return await response.json() as T;

  } catch (error) {
    // Catch network errors or other issues with fetch itself
    const err = error as ApiError; // Type assertion
    if (!err.message) {
        err.message = 'Network error or unable to reach API';
    }
    return Promise.reject(err);
  }
}

export default apiClient;
