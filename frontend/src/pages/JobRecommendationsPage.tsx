import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import ProgressBar from '../components/ProgressBar';
import * as api from '../services/api';
import { useUser } from '../contexts/UserContext';
import { UserLevel, OfferingRequest as ApiOfferingRequest } from '../types'; // Renamed to avoid conflict

const JobRecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, updateUserLevel } = useUser();

  const [offerings, setOfferings] = useState<ApiOfferingRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set()); // To track applied job titles

  const fetchOfferings = useCallback(async (uid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const offeringsData = await api.getJobOfferings(uid);
      setOfferings(offeringsData);

      // Once offerings are successfully fetched, mark the process as DONE for the user.
      // This could also be tied to an explicit "Finish" button if preferred.
      if (currentUser && currentUser.level !== UserLevel.DONE) {
        const updatedUser = await api.updateUser(uid, { level: UserLevel.DONE });
        setCurrentUser(updatedUser); // Update context with final level
      }

    } catch (err: any) {
      console.error('Error fetching job offerings:', err);
      setError(err.message || 'Failed to load job recommendations.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, setCurrentUser]); // Added setCurrentUser to dependencies

  useEffect(() => {
    if (!currentUser) {
      navigate('/'); // Redirect if no user
      return;
    }
    // Redirect if user hasn't completed previous steps
    if (currentUser.level === UserLevel.INITIAL) navigate('/');
    else if (currentUser.level === UserLevel.PERSONALITY) navigate('/personality-test');
    else if (currentUser.level === UserLevel.QUESTIONS && currentUser.uuid) {
      // If level is QUESTIONS, it implies they should be able to see recommendations
      // or have just finished questions.
      fetchOfferings(currentUser.uuid);
    } else if (currentUser.level === UserLevel.DONE && currentUser.uuid) {
      // Already done, just fetch offerings to display
      fetchOfferings(currentUser.uuid);
    }
  }, [currentUser, navigate, fetchOfferings]);

  const handleApply = (jobTitle: string) => {
    console.log(`User applied for: ${jobTitle}`);
    setAppliedJobs(prev => new Set(prev).add(jobTitle));
    // In a real app, this would trigger a more complex application process.
    // For now, we just log it and update UI if needed.
    alert(`Application for "${jobTitle}" submitted (simulated).`);
  };

  const currentProgressLevel = currentUser?.level || UserLevel.DONE;


  return (
    <div className="page-container"> {/* Use page-container class */}
      <div className="w-full max-w-5xl"> {/* ProgressBar container */}
        <ProgressBar currentLevel={currentProgressLevel} />
      </div>

      <div className="content-card max-w-4xl"> {/* Use content-card class and keep max-width */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Your Job Recommendations
        </h1>

        {isLoading && (
          <div className="text-center p-10">
            <p className="text-blue-600 text-lg">Loading recommendations...</p>
            {/* Add a more prominent spinner/loader here */}
            <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {error && (
          <p className="text-red-600 text-center bg-red-100 p-4 rounded-md shadow">{error}</p>
        )}

        {!isLoading && !error && offerings && (
          <>
            {offerings.reasoning && (
              <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Our Reasoning:</h2>
                <p className="text-gray-700 whitespace-pre-line">{offerings.reasoning}</p>
              </div>
            )}

            {offerings.output && offerings.output.length > 0 ? (
              <div>
                {offerings.output.map((job, index) => (
                  <JobCard
                    key={index} // Prefer stable ID if available from backend
                    job={job}
                    onApply={handleApply}
                    initiallyExpanded={index === 0} // Expand the first job by default
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-3">No Suitable Positions Currently</h2>
                <p className="text-gray-600 text-lg">
                  Thank you for completing the process! While we don't have an exact match for you right now,
                  your profile has been added to our exclusive talent pool. We'll reach out if a suitable position opens up.
                </p>
              </div>
            )}
          </>
        )}
         {!isLoading && !error && !offerings && (
            <div className="text-center p-10">
                <p className="text-gray-600 text-lg">Thank you for completing the application process!</p>
                <p className="text-gray-500">We are generating your job recommendations.</p>
            </div>
         )}
      </div>
       {currentUser?.level === UserLevel.DONE && (
         <div className="mt-8 text-center">
            <p className="text-green-600 font-semibold text-xl">You have completed the application process!</p>
            <button
                onClick={() => {
                    setCurrentUser(null); // Clears user from context and localStorage
                    navigate('/');
                }}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow hover:shadow-md transition-all"
            >
                Start Over / New Applicant
            </button>
         </div>
        )}
    </div>
  );
};

export default JobRecommendationsPage;
