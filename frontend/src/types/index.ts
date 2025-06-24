// Based on backend/src/backend/models.py

export type UUID = string;

export enum UserLevel {
  INITIAL = "initial",
  PERSONALITY = "personality",
  QUESTIONS = "questions",
  DONE = "done",
}

export interface Personality {
  openness: number;
  neuroticism: number;
  agreeableness: number;
  extraversion: number;
  conscientiousness: number;
}

export interface Question {
  question: string;
  answer: string;
}

export interface UserBase {
  name_first: string;
  name_second: string;
  file_id?: UUID;
  openai_file_id?: string;
  level: UserLevel;
  personality: Personality;
  questions: Question[];
}

export interface User extends UserBase {
  uuid: UUID;
}

export interface UserUpdate {
  file_id?: UUID;
  level?: UserLevel;
  personality?: Personality;
  // questions can only be added via specific endpoint, not through general update
}

export interface Jobs {
  title: string;
  locations: string[];
  description: string;
}

export interface OfferingRequest {
  reasoning: string;
  output: Jobs[];
}

// Frontend specific types
export interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

// Personality test questions structure from product spec
export interface PersonalityQuestion {
  id: string;
  text: string;
  trait: keyof Personality;
  reverseScored: boolean;
}

export type PersonalityAnswers = {
  [key: string]: number; // question_id: score (1-5)
};
