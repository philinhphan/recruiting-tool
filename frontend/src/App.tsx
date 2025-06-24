import './App.css';
import CvUploadForm from './components/CvUploadForm';
import PersonalityTestForm from './components/PersonalityTestForm';
import OpenQuestionsForm from './components/OpenQuestionsForm';
import JobRecommendations from './components/JobRecommendations';
import ProgressTracker from './components/ProgressTracker'; // Import ProgressTracker
import { useApplicationContext } from './contexts/ApplicationContext';

// Placeholder components for other steps (none left after this)


function App() {
  const { currentStep, error, isLoading, user } = useApplicationContext();

  const renderCurrentStep = () => {
    // currentStep: 0: Start/CV Upload, 1: CV Uploaded/Name Form, 2: Personality, 3: Questions, 4: Results
    // If user object (with UUID) exists, it means CV and names are submitted.
    // Then, currentStep determines what to show next.
    if (user && user.uuid) {
      switch (currentStep) {
        case 2:
          return <PersonalityTestForm />;
        case 3:
          return <OpenQuestionsForm />;
        case 4:
          return <JobRecommendations />;
        case 0: // Fallback if user exists but step is 0 (should ideally not happen if flow is linear)
        case 1: // User exists, but currentStep is still on name confirmation (e.g. after a refresh or back navigation)
                // CvUploadForm itself should handle showing "already submitted" or allowing edits if needed.
          return <CvUploadForm />;
        default:
          // If user exists but step is unknown, default to CV form or a dashboard (not implemented yet)
          console.warn(`User exists, but currentStep is unhandled: ${currentStep}. Defaulting to CvUploadForm.`);
          return <CvUploadForm />;
      }
    }

    // If no user object (user.uuid is null/undefined), it implies we are at the initial CV upload stage.
    // currentStep 0 or 1 would also lead here if user is not yet created.
    return <CvUploadForm />;
  };

  // Basic styling for error and loading messages
  const globalStyles = `
    .loading-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: #eee;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .error-message {
      background-color: #ffdddd;
      border: 1px solid #ffaaaa;
      color: #d8000c;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    .App {
      font-family: sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .App-header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    label {
      display: block;
      margin-top: 10px;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input[type="file"], input[type="text"] {
      width: calc(100% - 22px); /* Full width minus padding and border */
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      background-color: #007bff;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    h2 {
      margin-top: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div className="App">
        <header className="App-header">
          <h1>Applicant Onboarding System</h1>
          <ProgressTracker /> {/* Add ProgressTracker here */}
        </header>
        <main>
          {isLoading && <div className="loading-indicator">Processing... Please wait.</div>}
          {error && <div className="error-message">Error: {error}</div>}
          {renderCurrentStep()}
        </main>
      </div>
    </>
  );
}

export default App;
