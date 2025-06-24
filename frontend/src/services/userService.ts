import apiClient from './apiClient';
import type {
  UserBase,
  User,
  FileUploadResponse,
  UserInfoByFileResponse,
  CreateUserRequest,
  PersonalizedQuestion,
  JobRecommendation,
  ApplyJobResponse,
  // CreateUserResponse, // Assuming create_user returns the user object directly
  OfferingRequest,
} from '../types/api';

/**
 * Uploads a CV file.
 * Corresponds to: upload_file → FID
 * @param file The CV file to upload.
 * @returns A promise that resolves to FileUploadResponse containing the file_id (FID).
 */
export const uploadCvFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // Backend expects POST /file and returns raw UUID string
  const fid = await apiClient<string>('/file', {
    method: 'POST',
    body: formData,
  });

  return { file_id: fid } as FileUploadResponse;
};

/**
 * Retrieves user base information by file ID (FID).
 * Corresponds to: get_user_info_by_file(FID) → userBase
 * @param fileId The File ID (FID) obtained from CV upload.
 * @returns A promise that resolves to UserInfoByFileResponse (UserBase).
 */
export const getUserInfoByFileId = async (fileId: string): Promise<UserInfoByFileResponse> => {
  return apiClient<UserInfoByFileResponse>(`/file/${fileId}/userdata`);
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
  return apiClient<User>('/user', {
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
  return apiClient<User>(`/user/${userId}`, {
    method: 'PATCH',
    body: userData,
  });
};

/**
 * Fetches personalized questions for the user.
 * @param userId The User ID (UID).
 * @returns A promise that resolves to an array of PersonalizedQuestion objects.
 */
export const getPersonalizedQuestions = async (userId: string): Promise<PersonalizedQuestion[]> => {
  // Backend exposes GET /user/{uid}/question/{qid} for qid 0..n
  const QUESTION_COUNT = 3; // Currently backend generates three questions
  const requests = Array.from({ length: QUESTION_COUNT }, (_, idx) =>
    apiClient<string>(`/user/${userId}/question/${idx}`)
  );

  const questionsTexts = await Promise.all(requests);

  // Map to PersonalizedQuestion objects
  return questionsTexts.map((text, idx) => ({ id: String(idx), text }));
};

/**
 * Submits an answer for a specific personalized question.
 * @param userId The User ID (UID).
 * @param question The question text.
 * @param answer The answer text.
 * @returns A promise that resolves when the answer is successfully submitted.
 *          Backend might return the updated question or user, or just a success status.
 *          apiClient handles empty responses for 204s.
 */
export const submitPersonalizedQuestionAnswer = async (
  userId: string,
  question: string,
  answer: string
): Promise<void> => {
  // Backend expects POST /user/{uid}/question with {question, answer}
  return apiClient<void>(`/user/${userId}/question`, {
    method: 'POST',
    body: { question, answer },
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
  const res = await apiClient<OfferingRequest>(`/user/${userId}/offerings`);

  // Map backend jobs to existing JobRecommendation type expected by UI
  return res.output.map((job, idx) => ({
    id: String(idx),
    title: job.title,
    description: job.description,
    jobFitScore: 0,
    companyFitScore: 0,
  }));
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
