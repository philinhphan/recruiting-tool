import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserBase, PersonalityScores, UserQuestion } from '../types/api';

interface ApplicationState {
  fileId: string | null;
  userId: string | null;
  user: User | null; // Full user object once created/fetched
  extractedCvData: UserBase | null; // Data extracted from CV before full user creation
  isLoading: boolean;
  error: string | null;
  currentStep: number; // For progress tracker
}

interface ApplicationContextType extends ApplicationState {
  setFileId: (fileId: string | null) => void;
  setUserId: (userId: string | null) => void;
  setUser: (user: User | null) => void;
  setExtractedCvData: (data: UserBase | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (step: number) => void;
  resetState: () => void; // To clear state, e.g., on new application
  updateUserFields: (fields: Partial<UserBase>) => void;
  updatePersonalityScores: (scores: PersonalityScores) => void;
  addQuestionResponse: (questionId: string, answer: any) => void; // Example for later
}

const initialState: ApplicationState = {
  fileId: null,
  userId: null,
  user: null,
  extractedCvData: null,
  isLoading: false,
  error: null,
  currentStep: 0, // 0: Start, 1: CV Upload, 2: Personality, 3: Questions, 4: Results
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ApplicationState>(initialState);

  const setFileId = (fileId: string | null) => setState(prev => ({ ...prev, fileId }));
  const setUserId = (userId: string | null) => setState(prev => ({ ...prev, userId }));
  const setUser = (user: User | null) => setState(prev => ({ ...prev, user, userId: user?.uuid ?? null }));
  const setExtractedCvData = (data: UserBase | null) => setState(prev => ({ ...prev, extractedCvData: data }));
  const setIsLoading = (isLoading: boolean) => setState(prev => ({ ...prev, isLoading }));
  const setError = (error: string | null) => setState(prev => ({ ...prev, error }));
  const setCurrentStep = (currentStep: number) => setState(prev => ({ ...prev, currentStep }));

  const resetState = () => setState(initialState);

  const updateUserFields = (fields: Partial<UserBase>) => {
    setState(prev => {
      const updatedUser = prev.user ? { ...prev.user, ...fields } : null;
      const updatedCvData = prev.extractedCvData ? { ...prev.extractedCvData, ...fields } : (fields as UserBase);

      // If user exists, update user. Otherwise, update extractedCvData.
      // This handles cases where we update names before full user object is created.
      if (updatedUser) {
        return { ...prev, user: updatedUser };
      }
      return { ...prev, extractedCvData: updatedCvData as UserBase /* type assertion */ };
    });
  };

  const updatePersonalityScores = (scores: PersonalityScores) => {
    setState(prev => {
      if (prev.user) {
        return {
          ...prev,
          user: {
            ...prev.user,
            personality: { ...prev.user.personality, ...scores },
          },
        };
      }
      // Handle case where user might not be fully formed yet but we have scores
      // This depends on application flow, might be better to ensure user exists
      return prev;
    });
  };

  const addQuestionResponse = (questionId: string, answer: any) => {
    setState(prev => {
      if (prev.user) {
        const existingQuestionIndex = prev.user.questions?.findIndex(q => q.id === questionId) ?? -1;
        let newQuestions: UserQuestion[];

        if (prev.user.questions) {
          if (existingQuestionIndex > -1) {
            newQuestions = prev.user.questions.map((q, index) =>
              index === existingQuestionIndex ? { ...q, answer } : q
            );
          } else {
            newQuestions = [...prev.user.questions, { id: questionId, answer }];
          }
        } else {
          newQuestions = [{ id: questionId, answer }];
        }

        return {
          ...prev,
          user: { ...prev.user, questions: newQuestions },
        };
      }
      return prev;
    });
  };


  return (
    <ApplicationContext.Provider
      value={{
        ...state,
        setFileId,
        setUserId,
        setUser,
        setExtractedCvData,
        setIsLoading,
        setError,
        setCurrentStep,
        resetState,
        updateUserFields,
        updatePersonalityScores,
        addQuestionResponse,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider');
  }
  return context;
};
