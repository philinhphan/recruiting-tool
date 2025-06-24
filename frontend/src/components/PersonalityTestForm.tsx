import React, { useState, FormEvent } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { updateUser } from '../services/userService';
import { BIG_FIVE_QUESTIONS, LIKERT_SCALE_OPTIONS, PersonalityQuestion, TRAIT_MAPPING, TraitKey } from '../constants/personalityTest';
import { PersonalityScores } from '../types/api';

interface Answers {
  [questionId: string]: number;
}

const PersonalityTestForm: React.FC = () => {
  const { user, setUser, setIsLoading, setError, setCurrentStep } = useApplicationContext();
  const [answers, setAnswers] = useState<Answers>({});

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScores = (): PersonalityScores => {
    const scores: PersonalityScores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    BIG_FIVE_QUESTIONS.forEach(question => {
      let value = answers[question.id];
      if (value === undefined) {
        // Or handle as an error, ensuring all questions are answered
        // For now, defaulting to neutral if not answered, though form validation should prevent this.
        value = 3;
      }

      if (question.isReverseScored) {
        value = 6 - value; // Reverse score (e.g., 1 becomes 5, 2 becomes 4, etc.)
      }

      const traitKey = TRAIT_MAPPING[question.trait];
      scores[traitKey] += value;
    });

    return scores;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.keys(answers).length < BIG_FIVE_QUESTIONS.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    if (!user || !user.uuid) {
      setError('User information is missing. Please go back and complete the CV upload.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const personalityScores = calculateScores();

    try {
      const updatedUserData = {
        // Ensure we only send fields the backend expects for personality update
        // The backend might expect a nested 'personality' object or flat scores.
        // Assuming the backend expects a 'personality' object based on UserBase in api.ts
        personality: personalityScores,
      };

      const updatedUser = await updateUser(user.uuid, updatedUserData);
      setUser(updatedUser); // Update user in context with new scores
      setCurrentStep(3); // Move to Open Questions
    } catch (err: any) {
      setError(err.message || 'Failed to submit personality test. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p>Please complete the CV upload step first.</p>;
  }

  // Group questions by trait for display
  const questionsByTrait: Record<string, PersonalityQuestion[]> = BIG_FIVE_QUESTIONS.reduce((acc, q) => {
    acc[q.trait] = acc[q.trait] || [];
    acc[q.trait].push(q);
    return acc;
  }, {} as Record<string, PersonalityQuestion[]>);

  return (
    <div>
      <h2>Big Five Personality Test</h2>
      <p>Please rate how much you agree or disagree with each statement.</p>
      <form onSubmit={handleSubmit}>
        {Object.entries(questionsByTrait).map(([trait, qs]) => (
          <div key={trait} style={{ marginBottom: '25px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>{trait}</h3>
            {qs.map(question => (
              <div key={question.id} style={{ marginBottom: '15px' }}>
                <p>{question.text}</p>
                {LIKERT_SCALE_OPTIONS.map(option => (
                  <label key={option.value} style={{ marginRight: '10px', display: 'inline-block', fontWeight: 'normal' }}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswerChange(question.id, option.value)}
                      required
                      style={{ marginRight: '5px' }}
                    />
                    {option.label} ({option.value})
                  </label>
                ))}
              </div>
            ))}
          </div>
        ))}
        <button type="submit" disabled={Object.keys(answers).length < BIG_FIVE_QUESTIONS.length}>
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default PersonalityTestForm;
