import React from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';

const STEPS = [
  { id: 0, name: 'Start' }, // Initial, pre-CV upload state
  { id: 1, name: 'CV' }, // CV is uploaded, name form might be shown
  { id: 2, name: 'Personality' },
  { id: 3, name: 'Questions' },
  { id: 4, name: 'Recommendations' },
  { id: 5, name: 'Complete' } // A final step after recommendations or talent pool message
];

interface ProgressTrackerProps {
  /**
   * Orientation of the tracker. Defaults to "horizontal" to preserve current UI.
   * When set to "vertical", a compact vertical bar without labels is rendered – useful for the start page sidebar.
   */
  orientation?: 'horizontal' | 'vertical';
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ orientation = 'horizontal' }) => {
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

  if (orientation === 'vertical') {
    // Compact vertical view (dots + connecting line)
    const verticalContainer: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px',
      gap: '6px',
    };

    const dotStyles: (isActive: boolean, isCompleted: boolean) => React.CSSProperties =
      (isActive, isCompleted) => ({
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: isActive ? '#04B447' : (isCompleted ? '#04B447' : '#D3D3D3'),
        border: isActive ? '2px solid #028436' : 'none',
      });

    const connectorStyles: (isCompleted: boolean) => React.CSSProperties =
      (isCompleted) => ({
        width: '3px',
        height: '24px',
        backgroundColor: isCompleted ? '#04B447' : '#D3D3D3',
      });

    return (
      <div style={verticalContainer}>
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <div style={dotStyles(isActive, isCompleted)} />
              {index < STEPS.length - 1 && (
                <div style={connectorStyles(currentStep > step.id)} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // Default horizontal view (existing)
  return (
    <div style={trackerStyles}>
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
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
