import React, { useState } from 'react';

interface QuestionCardProps {
  questionText: string;
  onSubmitAnswer: (answer: string) => void;
  isLoading?: boolean;
  questionNumber?: number; // Optional, e.g., "Question 1 of 3"
  totalQuestions?: number; // Optional
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  onSubmitAnswer,
  isLoading = false,
  questionNumber,
  totalQuestions,
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Please provide an answer.');
      return;
    }
    setError('');
    onSubmitAnswer(answer);
    // Optionally clear answer field after submission if desired by parent logic
    // setAnswer('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full max-w-lg">
      {questionNumber && totalQuestions && (
        <p className="text-sm text-gray-500 mb-2">
          Question {questionNumber} of {totalQuestions}
        </p>
      )}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{questionText}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (error) setError('');
          }}
          placeholder="Your answer here..."
          className={`w-full h-40 p-3 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none focus:outline-none sm:text-sm`}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || !answer.trim()}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit Answer'}
        </button>
      </form>
    </div>
  );
};

export default QuestionCard;
