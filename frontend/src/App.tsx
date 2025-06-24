import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import CvUploadPage from './pages/CvUploadPage';
import PersonalityTestPage from './pages/PersonalityTestPage';
import OpenQuestionsPage from './pages/OpenQuestionsPage';
import JobRecommendationsPage from './pages/JobRecommendationsPage';
import { UserLevel } from './types';

// A wrapper for protected routes to ensure user context is loaded and at appropriate level
const ProtectedRoute: React.FC<{ element: React.ReactElement; requiredLevels?: UserLevel[]}> = ({ element, requiredLevels }) => {
  const { currentUser } = useUser();

  if (!currentUser) {
    // If no user, always redirect to home (CV upload)
    return <Navigate to="/" replace />;
  }

  if (requiredLevels && currentUser && !requiredLevels.includes(currentUser.level)) {
    // If user's level is not one of the required levels for this route,
    // redirect them to a page appropriate for their current level.
    // This is a simple redirect logic, could be more sophisticated.
    switch (currentUser.level) {
      case UserLevel.INITIAL:
        return <Navigate to="/" replace />; // Or /cv-upload if different
      case UserLevel.PERSONALITY:
        return <Navigate to="/personality-test" replace />;
      case UserLevel.QUESTIONS:
        return <Navigate to="/questions" replace />;
      case UserLevel.DONE:
         // If they are DONE, they can access recommendations.
         // If trying to access an earlier page while DONE, let them, or redirect to recommendations.
         // For this setup, if requiredLevels are specified and DONE is not among them,
         // but they are DONE, it implies they are trying to go back to an earlier step.
         // We can allow this or redirect to recommendations.
         // For now, let's assume if they are DONE, they should mostly be on /recommendations.
         // If accessing a page like /questions while DONE, and /questions does not list DONE as a requiredLevel,
         // it will redirect based on the logic below (e.g. back to /recommendations).
        if (window.location.pathname !== "/recommendations") {
            return <Navigate to="/recommendations" replace />;
        }
        break; // Fall through to allow access if current path IS recommendations
      default:
        return <Navigate to="/" replace />;
    }
  }

  return element;
};


const AppContent: React.FC = () => {
  // useUser can be used here if App-wide logic depending on user state is needed
  // For example, a global header/navbar that changes based on login state.
  // const { currentUser } = useUser();

  return (
    <div className="App">
      {/* Global header could go here, e.g. a nav bar with the ProgressBar, though pages manage it now */}
      {/* {currentUser && <ProgressBar currentLevel={currentUser.level} />} */}
      <Routes>
        <Route path="/" element={<CvUploadPage />} />
        <Route
          path="/personality-test"
          element={
            <ProtectedRoute
              element={<PersonalityTestPage />}
              requiredLevels={[UserLevel.INITIAL, UserLevel.PERSONALITY]} // Can access if just finished CV or returning to personality
            />
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute
              element={<OpenQuestionsPage />}
              requiredLevels={[UserLevel.PERSONALITY, UserLevel.QUESTIONS]} // Can access if just finished personality or returning to questions
            />
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute
              element={<JobRecommendationsPage />}
              requiredLevels={[UserLevel.QUESTIONS, UserLevel.DONE]} // Can access if just finished questions or returning to recommendations
            />
          }
        />
        {/* Catch-all for undefined routes, redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;
