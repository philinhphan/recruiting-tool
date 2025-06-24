import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import * as api from '../services/api';
import { useUser } from '../contexts/UserContext';
import { UserLevel, Question as ApiQuestion } from '../types';

const TOTAL_OPEN_QUESTIONS = 3; // Corresponds to qid 0, 1, 2

const OpenQuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, updateUserLevel } = useUser();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // 0, 1, 2
  const [currentQuestionText, setCurrentQuestionText] = useState<string>('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Determine initial question index based on user's answered questions
  useEffect(() => {
    if (currentUser?.questions) {
      const answeredCount = currentUser.questions.length;
      if (answeredCount < TOTAL_OPEN_QUESTIONS) {
        setCurrentQuestionIndex(answeredCount);
      } else {
        // All questions answered, should ideally be on recommendations page or level should be DONE
        if (currentUser.level === UserLevel.QUESTIONS) {
            // This means they finished questions, but level update to DONE might not have happened or they navigated back.
            // We can try to finalize or redirect. For now, let's assume they're done with questions.
            navigate('/recommendations');
        }
      }
    }
  }, [currentUser, navigate]);


  const fetchQuestion = useCallback(async (uid: string, qid: number) => {
    setIsLoadingQuestion(true);
    setError(null);
    try {
      const questionText = await api.getQuestionForUser(uid, qid);
      setCurrentQuestionText(questionText);
    } catch (err: any) {
      console.error(`Error fetching question ${qid}:`, err);
      setError(err.message || `Failed to load question ${qid + 1}.`);
      // Potentially navigate back or offer retry
    } finally {
      setIsLoadingQuestion(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/'); // Redirect if no user
      return;
    }
    if (currentUser.level === UserLevel.DONE) {
        navigate('/recommendations'); // Already completed this stage
        return;
    }
    if (currentUser.level === UserLevel.INITIAL) {
        navigate('/'); // Should complete CV upload first
        return;
    }
     if (currentUser.level === UserLevel.PERSONALITY && currentUser.uuid && currentQuestionIndex < TOTAL_OPEN_QUESTIONS) {
        // Or if currentUser.level is QUESTIONS but not all answered (e.g. browser refresh)
        fetchQuestion(currentUser.uuid, currentQuestionIndex);
    } else if (currentUser.level === UserLevel.QUESTIONS && currentUser.uuid && currentQuestionIndex < TOTAL_OPEN_QUESTIONS) {
        fetchQuestion(currentUser.uuid, currentQuestionIndex);
    }


  }, [currentUser, currentQuestionIndex, fetchQuestion, navigate]);

  const handleAnswerSubmit = async (answer: string) => {
    if (!currentUser?.uuid || !currentQuestionText) {
      setError('User session or question text is missing.');
      return;
    }

    setIsSubmittingAnswer(true);
    setError(null);

    const questionPayload: ApiQuestion = {
      question: currentQuestionText, // Send the actual question text that was answered
      answer: answer,
    };

    try {
      const updatedUser = await api.submitAnswer(currentUser.uuid, questionPayload);
      setCurrentUser(updatedUser); // Update context with user object that includes the new answer

      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < TOTAL_OPEN_QUESTIONS) {
        setCurrentQuestionIndex(nextQuestionIndex);
        // fetchQuestion will be called by the useEffect dependency change
      } else {
        // All questions answered, now update level to QUESTIONS_COMPLETE or DONE
        const finalUpdate = await api.updateUser(currentUser.uuid, { level: UserLevel.QUESTIONS });
        setCurrentUser(finalUpdate); // Update user with the new level
        // updateUserLevel(UserLevel.QUESTIONS); // Or use this if only level needs update in context
        navigate('/recommendations');
      }
    } catch (err: any) {
      console.error('Error submitting answer:', err);
      setError(err.message || 'Failed to submit answer.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Show loading if fetching question, or if user is not yet at a stage to see questions
  if (!currentUser || (currentUser.level !== UserLevel.QUESTIONS && currentUser.level !== UserLevel.PERSONALITY) ) {
    // Or a loading spinner, or redirect handled by useEffect
    // ProgressBar will show current level if currentUser exists
  }


  return (
    <div className="page-container"> {/* Use page-container class */}
      <div className="w-full max-w-4xl"> {/* ProgressBar container */}
        <ProgressBar currentLevel={currentUser?.level || UserLevel.QUESTIONS} />
      </div>

      <div className="content-card max-w-lg flex flex-col items-center"> {/* Use content-card class and keep max-width & flex properties */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Open Questions
        </h1>

        {isLoadingQuestion && (
          <div className="text-center p-10">
            <p className="text-blue-600">Loading question...</p>
            {/* Add spinner here */}
          </div>
        )}

        {!isLoadingQuestion && currentQuestionText && currentUser?.level !== UserLevel.DONE && (
          <QuestionCard
            questionText={currentQuestionText}
            onSubmitAnswer={handleAnswerSubmit}
            isLoading={isSubmittingAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_OPEN_QUESTIONS}
          />
        )}

        {!isLoadingQuestion && !currentQuestionText && currentUser?.level !== UserLevel.DONE && !error && (
             <div className="text-center p-10">
                <p className="text-gray-600">Preparing your questions...</p>
             </div>
        )}


        {error && (
          <p className="text-red-500 text-sm text-center mt-4 bg-red-100 p-3 rounded-md">{error}</p>
        )}
      </div>
    </div>
  );
};

export default OpenQuestionsPage;
