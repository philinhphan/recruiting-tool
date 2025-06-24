import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LikertScaleInput from '../components/LikertScaleInput';
import ProgressBar from '../components/ProgressBar';
import * as api from '../services/api';
import { useUser } from '../contexts/UserContext';
import { Personality, PersonalityQuestion, UserLevel, PersonalityAnswers } from '../types';

const personalityQuestions: PersonalityQuestion[] = [
  // Extraversion
  { id: 'ext1', text: 'I see myself as someone who is talkative.', trait: 'extraversion', reverseScored: false },
  { id: 'ext2', text: 'I see myself as someone who is reserved.', trait: 'extraversion', reverseScored: true },
  { id: 'ext3', text: 'I see myself as someone who is full of energy.', trait: 'extraversion', reverseScored: false },
  // Agreeableness
  { id: 'agr1', text: 'I see myself as someone who is generally trusting.', trait: 'agreeableness', reverseScored: false },
  { id: 'agr2', text: 'I see myself as someone who tends to find fault with others.', trait: 'agreeableness', reverseScored: true },
  { id: 'agr3', text: 'I see myself as someone who is helpful and unselfish with others.', trait: 'agreeableness', reverseScored: false },
  // Conscientiousness
  { id: 'con1', text: 'I see myself as someone who does a thorough job.', trait: 'conscientiousness', reverseScored: false },
  { id: 'con2', text: 'I see myself as someone who tends to be lazy.', trait: 'conscientiousness', reverseScored: true },
  { id: 'con3', text: 'I see myself as someone who does things efficiently.', trait: 'conscientiousness', reverseScored: false },
  // Neuroticism
  { id: 'neu1', text: 'I see myself as someone who worries a lot.', trait: 'neuroticism', reverseScored: false },
  { id: 'neu2', text: 'I see myself as someone who is relaxed, handles stress well.', trait: 'neuroticism', reverseScored: true },
  { id: 'neu3', text: 'I see myself as someone who gets nervous easily.', trait: 'neuroticism', reverseScored: false },
  // Openness
  { id: 'opn1', text: 'I see myself as someone who has an active imagination.', trait: 'openness', reverseScored: false },
  { id: 'opn2', text: 'I see myself as someone who has few artistic interests.', trait: 'openness', reverseScored: true },
  { id: 'opn3', text: 'I see myself as someone who is curious about many different things.', trait: 'openness', reverseScored: false },
];

const PersonalityTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, updateUserPersonality } = useUser(); // Use updateUserPersonality
  const [answers, setAnswers] = useState<PersonalityAnswers>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/'); // Redirect to CV upload if no user
      return;
    }
    // Optional: If user already completed this stage, redirect them
    if (currentUser.level === UserLevel.QUESTIONS || currentUser.level === UserLevel.DONE) {
        navigate(currentUser.level === UserLevel.QUESTIONS ? '/questions' : '/recommendations');
    } else if (currentUser.level === UserLevel.INITIAL && currentUser.uuid) {
        // Stay on this page or load saved answers if any
        // For now, we assume fresh start if they land here and are INITIAL
    }
  }, [currentUser, navigate]);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScores = (): Personality => {
    const scores: Personality = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0,
    };

    personalityQuestions.forEach(q => {
      let score = answers[q.id];
      if (score === undefined) {
        // Or handle as an error, throw "all questions must be answered"
        score = 3; // Neutral if not answered, though UI should enforce answering
      }
      if (q.reverseScored) {
        score = 6 - score; // Reversing for a 1-5 scale
      }
      scores[q.trait] += score;
    });
    return scores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < personalityQuestions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    if (!currentUser?.uuid) {
      setError('User session not found. Please try logging in again.');
      navigate('/');
      return;
    }

    setIsLoading(true);
    setError(null);

    const personalityScores = calculateScores();

    try {
      const updatedUserData = await api.updateUser(currentUser.uuid, {
        personality: personalityScores,
        level: UserLevel.PERSONALITY,
      });
      // Instead of setCurrentUser directly, use the context's updater function
      // which also handles localStorage persistence and keeps the user object structure consistent.
      updateUserPersonality(personalityScores);
      // The updateUserPersonality from context already sets the level to PERSONALITY.
      // If we want to ensure the full user object from API response is used:
      setCurrentUser(updatedUserData);


      navigate('/questions'); // Navigate to the next step
    } catch (err: any) {
      console.error("Personality update error:", err);
      setError(err.message || 'Failed to save personality scores.');
    } finally {
      setIsLoading(false);
    }
  };

  const allQuestionsAnswered = Object.keys(answers).length === personalityQuestions.length;

  return (
    <div className="page-container"> {/* Use page-container class */}
      <div className="w-full max-w-4xl"> {/* ProgressBar container */}
        <ProgressBar currentLevel={currentUser?.level || UserLevel.PERSONALITY} />
      </div>

      <div className="content-card max-w-2xl"> {/* Use content-card class and keep max-width */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Personality Test</h1>
        <p className="text-gray-600 mb-8 text-center">
          Please rate the following statements based on how well they describe you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {personalityQuestions.map((q) => (
            <LikertScaleInput
              key={q.id}
              questionId={q.id}
              questionText={q.text}
              value={answers[q.id]}
              onChange={(value) => handleAnswerChange(q.id, value)}
              disabled={isLoading}
            />
          ))}

          {error && <p className="text-red-500 text-sm text-center my-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !allQuestionsAnswered}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
          >
            {isLoading ? 'Saving...' : 'Save and Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalityTestPage;
