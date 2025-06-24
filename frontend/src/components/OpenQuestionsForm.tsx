import React, { useState, useEffect, FormEvent } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { getPersonalizedQuestions, submitPersonalizedQuestionAnswer } from '../services/userService';
import { PersonalizedQuestion as PersonalizedQuestionType } from '../types/api';

const OpenQuestionsForm: React.FC = () => {
  const {
    user,
    setUser, // To update user object with answers if needed by backend response
    setIsLoading,
    setError,
    setCurrentStep,
    addQuestionResponse // To store answers in context if not returned by backend
  } = useApplicationContext();

  const [questions, setQuestions] = useState<PersonalizedQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isFetchingQuestions, setIsFetchingQuestions] = useState<boolean>(true);

  useEffect(() => {
    if (user && user.uuid) {
      setIsFetchingQuestions(true);
      setError(null);
      getPersonalizedQuestions(user.uuid)
        .then(fetchedQuestions => {
          // Filter out questions that might already be in user.questions from context, if any
          // This depends on how state is managed across sessions/refreshes.
          // For a simple linear flow, we assume fetchedQuestions is the source of truth for this step.
          setQuestions(fetchedQuestions || []); // Ensure questions is always an array
          if (!fetchedQuestions || fetchedQuestions.length === 0) {
            // No questions, proceed to next step
            setCurrentStep(4);
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch personalized questions.');
          console.error(err);
          // Optionally, allow retry or skip
        })
        .finally(() => {
          setIsFetchingQuestions(false);
          setIsLoading(false); // Global loading state
        });
    } else {
        setError('User not found. Please complete previous steps.');
        setIsFetchingQuestions(false);
    }
  }, [user, setError, setCurrentStep, setIsLoading]);

  const handleSubmitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.uuid || !questions.length || currentAnswer.trim() === '') {
      setError('Please provide an answer.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const currentQuestion = questions[currentQuestionIndex];

    try {
      await submitPersonalizedQuestionAnswer(user.uuid, currentQuestion.id, currentAnswer.trim());

      // Store answer in context (useful if backend doesn't return full user object)
      // The addQuestionResponse in context was an example; let's refine it or use setUser.
      // For now, let's assume the user object in context should reflect submitted answers.
      // This might be better handled if the backend returns the updated user object.
      // Or, we can update the local user object and set it.
      const updatedUserQuestions = user.questions ? [...user.questions] : [];
      const existingQuestionIndex = updatedUserQuestions.findIndex(q => q.id === currentQuestion.id);
      if (existingQuestionIndex > -1) {
        updatedUserQuestions[existingQuestionIndex] = { ...updatedUserQuestions[existingQuestionIndex], answer: currentAnswer.trim() };
      } else {
        updatedUserQuestions.push({ ...currentQuestion, answer: currentAnswer.trim() });
      }
      setUser({ ...user, questions: updatedUserQuestions });


      setCurrentAnswer(''); // Clear textarea for next question

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        // All questions answered
        setCurrentStep(4); // Move to Job Recommendations
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingQuestions) {
    return <p>Loading personalized questions...</p>;
  }

  if (!user) {
    return <p>User not available. Please complete the CV upload and personality test first.</p>;
  }

  if (questions.length === 0 && !isFetchingQuestions) {
    // This case is also handled in useEffect by advancing the step, but good to have a message.
    return <p>No personalized questions available for you at this time. Proceeding to the next step.</p>;
  }

  if (currentQuestionIndex >= questions.length) {
      // Should have been navigated away by setCurrentStep(4)
      return <p>All questions answered. Loading next step...</p>;
  }

  const questionToShow = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Personalized Question ({currentQuestionIndex + 1} of {questions.length})</h2>
      <p style={{ fontSize: '1.1em', marginBottom: '15px' }}>{questionToShow?.text}</p>
      <form onSubmit={handleSubmitAnswer}>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          rows={5}
          placeholder="Type your answer here..."
          required
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', borderColor: '#ccc' }}
        />
        <button type="submit" style={{ marginTop: '10px' }}>
          {currentQuestionIndex < questions.length - 1 ? 'Submit and Next Question' : 'Submit Final Answer'}
        </button>
      </form>
    </div>
  );
};

export default OpenQuestionsForm;
