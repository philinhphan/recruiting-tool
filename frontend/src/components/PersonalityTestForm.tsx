import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { updateUser } from '../services/userService';
import { BIG_FIVE_QUESTIONS, LIKERT_SCALE_OPTIONS, TRAIT_MAPPING, type PersonalityQuestion } from '../constants/personalityTest';
import type { PersonalityScores } from '../types/api';

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

  return (
    <div>
      {/* Headline & helper copy */}
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Personality Assessment</h2>
      <p style={{ textAlign: 'center', margin: 0, color: '#555' }}>We would like to get to know you better.</p>
      <p style={{ textAlign: 'center', marginTop: '6px', marginBottom: '26px', color: '#555' }}>Please answer the following statements describing your personality as accurately as possible.</p>

      {/* Inline CSS block for component-scoped styling */}
      <style>{`
        .likert-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 14px; /* vertical gap for "pill" effect */
        }
        .likert-table th {
          font-weight: 600;
          font-size: 0.85rem;
          color: #666;
          padding-bottom: 6px;
        }
        .likert-table .statement-cell {
          text-align: left;
          padding-right: 10px;
          white-space: nowrap;
        }
        .likert-table tr {
          background: #f5f5f5;
          border-radius: 40px;
        }
        .likert-table tr td:first-child {
          border-top-left-radius: 40px;
          border-bottom-left-radius: 40px;
        }
        .likert-table tr td:last-child {
          border-top-right-radius: 40px;
          border-bottom-right-radius: 40px;
        }
        .likert-table td {
          text-align: center;
          padding: 12px 8px;
        }
        .likert-radio {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #bdbdbd;
          background: #fff;
          cursor: pointer;
          position: relative;
        }
        .likert-radio:checked {
          background: #05C960;
          border-color: #05C960;
        }
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
        }
        .btn-back {
          background: #ffffff;
          color: #05C960;
          border: 2px solid #05C960;
          padding: 10px 32px;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-continue {
          background: #05C960;
          color: #ffffff;
          border: 2px solid #05C960;
          padding: 10px 32px;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-continue:disabled {
          background: #9edfb6;
          border-color: #9edfb6;
          cursor: not-allowed;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <table className="likert-table">
          <thead>
            <tr>
              <th className="statement-cell">I see myself as someone who...</th>
              {LIKERT_SCALE_OPTIONS.map(option => (
                <th key={option.value}>{option.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BIG_FIVE_QUESTIONS.map(question => (
              <tr key={question.id}>
                <td className="statement-cell">{question.text}</td>
                {LIKERT_SCALE_OPTIONS.map(option => (
                  <td key={option.value}>
                    <input
                      type="radio"
                      className="likert-radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswerChange(question.id, option.value)}
                      required
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="navigation-buttons">
          <button
            type="button"
            className="btn-back"
            onClick={() => setCurrentStep(1)}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn-continue"
            disabled={Object.keys(answers).length < BIG_FIVE_QUESTIONS.length}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalityTestForm;
