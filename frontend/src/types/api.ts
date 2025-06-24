// Based on the product specification:
// get_user_info_by_file(FID) → userBase
// {
//   uuid: UUID("e4ac5386-6e08-436d-8112-e02449027729"),
//   name_first: 'Alessandro',
//   name_second: 'Bianchi',
//   file_id: UUID("97bb0dcb-14bd-478c-b182-676aa2c023d0"),
//   openai_file_id: 'file-5oCRywRrZZwqH3XAp4voLZ',
//   level: 'initial',
//   personality: {
//     openness: 0,
//     neuroticism: 0,
//     agreeableness: 0,
//     extraversion: 0,
//     conscientiousness: 0
//   },
//   questions: []
// }
// create_user(userBase) → UID

export interface PersonalityScores {
  openness: number;
  neuroticism: number;
  agreeableness: number;
  extraversion: number;
  conscientiousness: number;
}

export interface UserQuestion {
  // Define structure if known, otherwise keep as any
  [key: string]: any;
}

export interface UserBase {
  uuid?: string; // Optional on creation, present in response
  name_first: string | null;
  name_second: string | null;
  file_id: string; // FID from upload_file
  openai_file_id?: string; // Optional, might be backend assigned
  level?: string; // Optional, might be backend assigned
  personality?: PersonalityScores;
  questions?: UserQuestion[];
}

export interface User extends UserBase {
  uuid: string; // UID, should be present after creation or fetching
  // Questions array in UserBase might be populated by personalized questions later
}

// --- Personalized Questions ---
export interface PersonalizedQuestion {
  id: string; // Unique ID for the question
  text: string; // The question text
  type?: 'technical' | 'teamworking' | 'interest' | 'generic'; // Optional category
  answer?: string; // To store user's answer, might not be part of fetch response initially
}

// Response for fetching personalized questions
export type PersonalizedQuestionsResponse = PersonalizedQuestion[];

// Request for submitting an answer to a personalized question
export interface SubmitAnswerRequest {
  answer: string;
}
// Response for submitting an answer (could be simple success message or updated question/user)
// For now, let's assume no specific response body is needed beyond a 200 OK.
// If the backend returns the updated user or question, this can be adjusted.

// --- Job Recommendations ---
export interface JobRecommendation {
  id: string; // Unique ID for the job position
  title: string;
  description: string;
  jobFitScore: number; // Example: 0-1 or 0-100
  companyFitScore: number; // Example: 0-1 or 0-100
  detailsUrl?: string; // Optional: A URL to more detailed job description
  // other relevant fields like location, department, requirements_summary etc.
}

export type JobRecommendationsResponse = JobRecommendation[];

// For "Apply" action, if it involves an API call
export interface ApplyJobRequest {
  jobId: string;
  userId: string;
  // any other relevant application details
}
// Response for applying could be a simple success message
export interface ApplyJobResponse {
  success: boolean;
  message?: string;
  applicationId?: string;
}


// For upload_file response, assuming it returns a File ID (FID)
export interface FileUploadResponse {
  file_id: string;
  // Potentially other details like filename, size, etc.
  // As per spec: upload_file → FID
  // Let's assume the backend returns something like:
  // { "file_id": "some-uuid-string", "openai_file_id": "file-..." }
  // openai_file_id is also mentioned in userBase, so it might come from here
  // or from get_user_info_by_file. For now, let's assume FID is the primary key.
  openai_file_id?: string;
}

// For get_user_info_by_file(FID) response
// This seems to return the UserBase structure.
export type UserInfoByFileResponse = UserBase;

// For create_user(userBase) request
export type CreateUserRequest = UserBase;

// For create_user(userBase) response → UID
// Assuming UID is the uuid in the User object
export interface CreateUserResponse {
  uuid: string;
  // The spec says "create_user(userBase) → UID"
  // and then "update_user(UID, userUpdate) → user"
  // This suggests the create_user response might just be the UID,
  // or the full user object. Let's assume full user object for consistency.
  // If it's just UID, the service will adapt.
  // For now, let's assume it returns the created User object
  user: User;
}

export interface ApiError {
  message: string;
  details?: any;
}
