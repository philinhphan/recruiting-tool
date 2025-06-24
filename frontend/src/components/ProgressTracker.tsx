import React from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';

const STEPS = [
  { id: 0, name: 'Start' }, // Initial, pre-CV upload state
  { id: 1, name: 'CV Uploaded' }, // CV is uploaded, name form might be shown
  { id: 2, name: 'Personality Test' },
  { id: 3, name: 'Open Questions' },
  { id: 4, name: 'Job Recommendations' },
  { id: 5, name: 'Process Complete' } // A final step after recommendations or talent pool message
];

const ProgressTracker: React.FC = () => {
  const { currentStep } = useApplicationContext();

  const trackerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 0',
    margin: '20px auto', // Centered
    maxWidth: '700px', // Limit width
    borderBottom: '1px solid #eee',
    marginBottom: '30px',
  };

  const stepStyles: (isActive: boolean, isCompleted: boolean) => React.CSSProperties =
    (isActive, isCompleted) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      color: isActive ? '#007bff' : (isCompleted ? '#28a745' : '#aaa'),
      fontWeight: isActive || isCompleted ? 'bold' : 'normal',
      position: 'relative',
      flex: 1, // Distribute space
  });

  const stepCircleStyles: (isActive: boolean, isCompleted: boolean) => React.CSSProperties =
    (isActive, isCompleted) => ({
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: isActive ? '#007bff' : (isCompleted ? '#28a745' : '#e9ecef'),
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '8px',
        border: `2px solid ${isActive ? '#0056b3' : (isCompleted ? '#1e7e34' : '#ced4da')}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
  });

  const stepNameStyles: React.CSSProperties = {
      fontSize: '0.85em',
  };

  const lineStyles: (isCompleted: boolean) => React.CSSProperties =
    (isCompleted) => ({
      flexGrow: 1,
      height: '3px',
      backgroundColor: isCompleted ? '#28a745' : '#e9ecef',
      margin: '0 1px', // Minimal margin between step and line
      position: 'relative',
      top: '15px', // Vertically center with the circle
      zIndex: -1, // Behind the circles
      transition: 'background-color 0.3s ease',
  });


  return (
    <div style={trackerStyles}>
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        // For the line: it's completed if the step *it originates from* is completed.
        // Or, more accurately, if currentStep has passed the step the line leads to.
        // So, if currentStep >= STEPS[index + 1]?.id (the next step)
        // A simpler way: the line after a step is active if that step is completed.
        const isLineAfterStepCompleted = isCompleted || isActive;


        return (
          <React.Fragment key={step.id}>
            <div style={stepStyles(isActive, isCompleted)}>
              <div style={stepCircleStyles(isActive, isCompleted)}>
                {isCompleted ? '✔' : index + 1}
              </div>
              <span style={stepNameStyles}>{step.name}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div style={lineStyles(isLineAfterStepCompleted)} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressTracker;
