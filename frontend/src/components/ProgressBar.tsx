import React from 'react';
import { UserLevel } from '../types';

interface ProgressBarProps {
  currentLevel: UserLevel;
}

const steps = [
  { level: UserLevel.INITIAL, label: 'CV Upload' },
  { level: UserLevel.PERSONALITY, label: 'Personality Test' },
  { level: UserLevel.QUESTIONS, label: 'Open Questions' },
  { level: UserLevel.DONE, label: 'Recommendations' },
];

// Determine the order for comparison
const levelOrder: UserLevel[] = [
    UserLevel.INITIAL,
    UserLevel.PERSONALITY,
    UserLevel.QUESTIONS,
    UserLevel.DONE,
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel }) => {
  const currentIndex = levelOrder.indexOf(currentLevel);

  return (
    <div className="w-full px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          // For "Done", if it's the current step, it should also be visually "completed" in terms of the bar leading to it.
          // And "Done" itself should appear active.
          const isDoneActive = currentLevel === UserLevel.DONE && step.level === UserLevel.DONE;

          return (
            <React.Fragment key={step.level}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm
                    ${(isCompleted || isActive || isDoneActive) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                >
                  {isCompleted && !isActive ? '✓' : index + 1}
                </div>
                <p className={`mt-1 text-xs sm:text-sm text-center ${(isActive || isDoneActive) ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 sm:h-2 mx-1 sm:mx-2
                    ${(isCompleted || (isActive && index < currentIndex) || (currentLevel === UserLevel.DONE && index < steps.length -1) ) ? 'bg-blue-500' : 'bg-gray-300'}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
