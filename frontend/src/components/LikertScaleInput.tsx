import React from 'react';

interface LikertScaleInputProps {
  questionId: string;
  questionText: string;
  onChange: (value: number) => void;
  value: number | undefined; // Current selected value for this question
  options?: { value: number; label: string }[];
  disabled?: boolean;
}

const defaultOptions = [
  { value: 1, label: 'Disagree strongly' },
  { value: 2, label: 'Disagree a little' },
  { value: 3, label: 'Neither agree nor disagree' },
  { value: 4, label: 'Agree a little' },
  { value: 5, label: 'Agree strongly' },
];

const LikertScaleInput: React.FC<LikertScaleInputProps> = ({
  questionId,
  questionText,
  onChange,
  value,
  options = defaultOptions,
  disabled = false,
}) => {
  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
      <p className="text-md font-medium text-gray-800 mb-3">{questionText}</p>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={`${questionId}-${option.value}`}
            className={`flex-1 flex items-center justify-center px-2 py-3 sm:px-3 sm:py-3 border rounded-md text-center text-xs sm:text-sm
                        cursor-pointer transition-all duration-150 ease-in-out
                        ${
                          value === option.value
                            ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400 shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              id={`${questionId}-${option.value}`}
              name={questionId}
              value={option.value}
              checked={value === option.value}
              onChange={() => !disabled && onChange(option.value)}
              className="sr-only" // Hide the actual radio button
              disabled={disabled}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LikertScaleInput;
