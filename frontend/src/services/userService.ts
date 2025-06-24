import apiClient from './apiClient';
import {
  UserBase,
  User,
  FileUploadResponse,
  UserInfoByFileResponse,
  CreateUserRequest,
  // CreateUserResponse, // Assuming create_user returns the user object directly
} from '../types/api';

/**
 * Uploads a CV file.
 * Corresponds to: upload_file → FID
 * @param file The CV file to upload.
 * @returns A promise that resolves to FileUploadResponse containing the file_id (FID).
 */
export const uploadCvFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file); // The backend endpoint will expect a field named 'file'

  // Assuming the endpoint is /users/upload_cv or similar.
  // This needs to match the actual backend API endpoint.
  // Based on the spec "upload_file -> FID", let's assume a generic file upload endpoint
  // that the backend might map to CV processing.
  // Or it could be something like /cv/upload
  return apiClient<FileUploadResponse>('/files/upload', { // Endpoint needs to be confirmed
    method: 'POST',
    body: formData,
  });
};

/**
 * Retrieves user base information by file ID (FID).
 * Corresponds to: get_user_info_by_file(FID) → userBase
 * @param fileId The File ID (FID) obtained from CV upload.
 * @returns A promise that resolves to UserInfoByFileResponse (UserBase).
 */
export const getUserInfoByFileId = async (fileId: string): Promise<UserInfoByFileResponse> => {
  // Endpoint needs to be confirmed. Example: /users/info_by_file/{file_id}
  return apiClient<UserInfoByFileResponse>(`/files/${fileId}/user_info`);
};

/**
 * Creates a new user.
 * Corresponds to: create_user(userBase) → UID (which is user.uuid)
 * The product spec says "create_user(userBase) → UID".
 * And "update_user(UID, userUpdate) → user".
 * We'll assume create_user returns the full user object for convenience,
 * which includes the UID as `uuid`.
 * @param userData The base user data, potentially including info from CV and manual input.
 * @returns A promise that resolves to the created User object.
 */
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  // Endpoint needs to be confirmed. Example: /users
  // The backend route for user creation.
  // The spec "create_user(userBase) -> UID" implies the response might just be the UID.
  // However, typical REST APIs return the created resource.
  // For now, assuming it returns the full user object.
  // If it returns { uuid: string }, the type in api.ts (CreateUserResponse) will need adjustment.
  // Let's align with the User type directly if it returns the full user.
  return apiClient<User>('/users', {
    method: 'POST',
    body: userData,
  });
};

/**
 * Updates an existing user.
 * Corresponds to: update_user(UID, userUpdate) → user
 * @param userId The User ID (UID).
 * @param userData The user data to update.
 * @returns A promise that resolves to the updated User object.
 */
export const updateUser = async (userId: string, userData: Partial<UserBase>): Promise<User> => {
  // Endpoint needs to be confirmed. Example: /users/{user_id}
  return apiClient<User>(`/users/${userId}`, {
    method: 'PATCH', // Or PUT, depending on backend implementation
    body: userData,
  });
};

/**
 * Fetches personalized questions for the user.
 * @param userId The User ID (UID).
 * @returns A promise that resolves to an array of PersonalizedQuestion objects.
 */
export const getPersonalizedQuestions = async (userId: string): Promise<PersonalizedQuestion[]> => {
  // Endpoint needs to be confirmed. Example: /users/{userId}/personalized_questions
  return apiClient<PersonalizedQuestion[]>(`/users/${userId}/personalized_questions`);
};

/**
 * Submits an answer for a specific personalized question.
 * @param userId The User ID (UID).
 * @param questionId The ID of the question being answered.
 * @param answer The answer text.
 * @returns A promise that resolves when the answer is successfully submitted.
 *          Backend might return the updated question or user, or just a success status.
 *          apiClient handles empty responses for 204s.
 */
export const submitPersonalizedQuestionAnswer = async (
  userId: string,
  questionId: string,
  answer: string
): Promise<void> => { // Assuming no specific content in response for now
  // Endpoint needs to be confirmed. Example: /users/{userId}/questions/{questionId}/answer
  return apiClient<void>(`/users/${userId}/questions/${questionId}/answer`, {
    method: 'POST',
    body: { answer }, // SubmitAnswerRequest
  });
};


// Add other user-related API functions here as needed (e.g., get_user_by_id)
// export const getUserById = async (userId: string): Promise<User> => {
//   return apiClient<User>(`/users/${userId}`);
// };

/**
 * Fetches job recommendations for the user.
 * @param userId The User ID (UID).
 * @returns A promise that resolves to an array of JobRecommendation objects.
 */
export const getJobRecommendations = async (userId: string): Promise<JobRecommendation[]> => {
  // Endpoint needs to be confirmed. Example: /users/{userId}/job_recommendations
  return apiClient<JobRecommendation[]>(`/users/${userId}/job_recommendations`);
};

/**
 * (Optional) Submits an application for a job.
 * This is a placeholder in case "Apply" button triggers an API call.
 * If it's a redirect or mailto link, this won't be needed.
 * @param userId The User ID (UID).
 * @param jobId The ID of the job being applied for.
 * @returns A promise that resolves to an ApplyJobResponse.
 */
export const applyForJob = async (userId: string, jobId: string): Promise<ApplyJobResponse> => {
  // Endpoint needs to be confirmed. Example: /jobs/apply or /users/{userId}/applications
  return apiClient<ApplyJobResponse>(`/applications`, { // General endpoint, or could be /users/${userId}/applications
    method: 'POST',
    body: { userId, jobId }, // ApplyJobRequest
  });
};
