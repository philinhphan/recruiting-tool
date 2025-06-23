export enum UserLevel {
  INITIAL = 'initial',
  PERSONALITY = 'personality',
  QUESTIONS = 'questions',
  DONE = 'done'
}

export interface Personality {
  openness: number
  neuroticism: number
  agreeableness: number
  extraversion: number
  conscientiousness: number
}

export interface Question {
  question: string
  answer: string
}

export interface UserBase {
  name_first: string
  name_second: string
  file_id?: string
  level: UserLevel
  personality: Personality
  questions: Question[]
}

export interface User extends UserBase {
  uuid: string
}

export interface UserUpdate {
  file_id?: string
  level?: UserLevel
  personality?: Personality
}

export interface JobBase {
  name: string
}

export interface Job extends JobBase {
  uuid: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
} 