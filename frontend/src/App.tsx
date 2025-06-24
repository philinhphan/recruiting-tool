import './App.css';
import CvUploadForm from './components/CvUploadForm';
import PersonalityTestForm from './components/PersonalityTestForm';
import OpenQuestionsForm from './components/OpenQuestionsForm';
import JobRecommendations from './components/JobRecommendations';
import ProgressTracker from './components/ProgressTracker'; // Import ProgressTracker (now supports vertical)
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
    /* --- Global utility classes --- */
    .loading-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: #eee;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    .error-message {
      background-color: #ffdddd;
      border: 1px solid #ffaaaa;
      color: #d8000c;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }

    /* --- New start page layout --- */
    .start-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: sans-serif;
    }

    .hero {
      background: radial-gradient(circle at top left, #05C960 0%, #00A44C 40%, #008E42 70%, #00743A 100%);
      color: #ffffff;
      text-align: center;
      padding: 60px 20px 120px 20px; /* bottom padding leaves space for overlapping card */
      font-size: 1.75rem;
      font-weight: 600;
    }

    .content-wrapper {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 40px;
      padding: 0 20px;
      margin-top: -90px; /* pull the card up to overlap hero */
    }

    .progress-sidebar {
      position: sticky;
      top: 120px;
    }

    .card {
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      max-width: 600px;
      width: 100%;
      padding: 40px 30px;
    }

    /* Form element refinements inside the card */
    label {
      display: block;
      margin: 12px 0 6px 0;
      font-weight: 600;
    }
    input[type="file"], input[type="text"] {
      width: 100%;
      padding: 12px 14px;
      margin-bottom: 18px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 0.95rem;
    }
    button {
      background-color: #05C960;
      color: #ffffff;
      padding: 12px 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
    }
    button:disabled {
      background-color: #9edfb6;
      cursor: not-allowed;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 16px;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div className="start-page">
        {/* Hero Section */}
        <section className="hero">
          Prototyping the future with us
        </section>

        {/* Main content with vertical tracker */}
        <div className="content-wrapper">
          <aside className="progress-sidebar">
            <ProgressTracker orientation="vertical" />
          </aside>

          <main className="card">
            {isLoading && <div className="loading-indicator">Processing... Please wait.</div>}
            {error && <div className="error-message">Error: {error}</div>}
            {renderCurrentStep()}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
