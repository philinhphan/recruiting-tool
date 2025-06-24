import axios, { AxiosError } from 'axios';
import {
  User,
  UserBase,
  UserUpdate,
  UUID,
  Question as ApiQuestion, // Renamed to avoid conflict with PersonalityQuestion if any
  OfferingRequest,
} from '../types';

const API_BASE_URL = '/api/v1'; // Assuming the proxy is set up for this

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling helper
const handleError = (error: AxiosError, context: string): never => {
  // Log error or send to a logging service
  console.error(`API Error in ${context}:`, error.response?.data || error.message);
  throw new Error(
    (error.response?.data as { detail?: string })?.detail ||
    error.message ||
    `An unknown error occurred in ${context}`
  );
};


// 1. CV Upload Flow
export const uploadFile = async (file: File): Promise<UUID> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post<UUID>('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'uploadFile');
  }
};

export const getUserInfoByFile = async (fid: UUID): Promise<UserBase> => {
  try {
    const response = await apiClient.get<UserBase>(`/file/${fid}/userdata`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'getUserInfoByFile');
  }
};

export const createUser = async (userData: UserBase): Promise<User> => {
  try {
    const response = await apiClient.post<User>('/user', userData);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'createUser');
  }
};

// 2. Personality Test
export const updateUser = async (uid: UUID, data: UserUpdate): Promise<User> => {
  try {
    const response = await apiClient.patch<User>(`/user/${uid}`, data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'updateUser');
  }
};

// 3. Open Questions
export const getQuestionForUser = async (uid: UUID, qid: number): Promise<string> => {
  try {
    // The backend returns plain text for the question
    const response = await apiClient.get<string>(`/user/${uid}/question/${qid}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'getQuestionForUser');
  }
};

export const submitAnswer = async (uid: UUID, questionAnswer: ApiQuestion): Promise<User> => {
  // The backend endpoint for submitting an answer is POST /user/{uid}/question
  // It expects a Question model: { question: str, answer: str }
  // The response is User according to openapi spec, but backend code userCRUD.add_question returns None.
  // Assuming the spec is what we should rely on for the frontend.
  try {
    const response = await apiClient.post<User>(`/user/${uid}/question`, questionAnswer);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'submitAnswer');
  }
};

// 4. Job Position Recommendations
export const getJobOfferings = async (uid: UUID): Promise<OfferingRequest> => {
  try {
    const response = await apiClient.get<OfferingRequest>(`/user/${uid}/offerings`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'getJobOfferings');
  }
};

// General User utility
export const getUserById = async (uid: UUID): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/user/${uid}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, 'getUserById');
  }
};

// Function to download CV (example, might not be directly used in flow but good to have)
export const downloadCvByUserId = async (uid: UUID): Promise<Blob> => {
    try {
        const response = await apiClient.get(`/user/${uid}/file`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        handleError(error as AxiosError, 'downloadCvByUserId');
    }
};
