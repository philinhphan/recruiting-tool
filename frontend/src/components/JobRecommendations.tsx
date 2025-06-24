import React, { useState, useEffect, useRef } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { getJobRecommendations, applyForJob } from '../services/userService';
import type { JobRecommendation as JobRecommendationType } from '../types/api';

const JobRecommendations: React.FC = () => {
  const { user, setIsLoading, setError, setCurrentStep } = useApplicationContext();
  const [recommendations, setRecommendations] = useState<JobRecommendationType[]>([]);
  const [isFetchingRecommendations, setIsFetchingRecommendations] = useState<boolean>(true);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!user || !user.uuid) {
      setError('User not found. Please complete previous steps.');
      setIsFetchingRecommendations(false);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setIsLoading(true);
    setIsFetchingRecommendations(true);
    setError(null);

    getJobRecommendations(user.uuid)
      .then(fetchedRecommendations => {
        setRecommendations(fetchedRecommendations || []);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch job recommendations.');
        console.error(err);
      })
      .finally(() => {
        setIsFetchingRecommendations(false);
        setIsLoading(false);
      });
  }, [user, setError, setIsLoading]);

  const handleViewDetails = (job: JobRecommendationType) => {
    // For now, just log or set selectedJob. Could open a modal or new view.
    console.log('Viewing details for:', job);
    // If job.detailsUrl exists, could navigate: window.open(job.detailsUrl, '_blank');
    alert(`Job Details:\nTitle: ${job.title}\nDescription: ${job.description}\nJob Fit: ${job.jobFitScore}%\nCompany Fit: ${job.companyFitScore}%`);
  };

  const handleApply = async (jobId: string) => {
    if (!user || !user.uuid) {
      setError('User not identified. Cannot apply.');
      return;
    }
    setIsLoading(true);
    setApplicationStatus(null);
    setError(null);
    try {
      // Using the optional applyForJob service.
      // This is a placeholder; actual application might be an external link or different process.
      const response = await applyForJob(user.uuid, jobId);
      if (response.success) {
        setApplicationStatus(`Successfully applied for job ID: ${jobId}. Application ID: ${response.applicationId || 'N/A'}`);
        // Potentially disable apply button for this job or mark as applied
      } else {
        setError(response.message || 'Application failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const jobCardStyles: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  };

  const jobTitleStyles: React.CSSProperties = {
    margin: '0 0 10px 0',
    color: '#333',
  };

  const jobDescriptionStyles: React.CSSProperties = {
    fontSize: '0.9em',
    color: '#555',
    marginBottom: '15px',
    lineHeight: '1.6',
  };

  const fitScoreStyles: React.CSSProperties = {
    fontSize: '0.85em',
    color: '#777',
    marginBottom: '5px',
  };

  const buttonContainerStyles: React.CSSProperties = {
      marginTop: '15px',
      display: 'flex',
      gap: '10px',
  }


  if (isFetchingRecommendations) {
    return <p>Loading job recommendations...</p>;
  }

  if (!user) {
    return <p>User not available. Please complete the previous steps first.</p>;
  }

  if (recommendations.length === 0 && !isFetchingRecommendations) {
    return (
      <div style={jobCardStyles}>
        <h3>Thank You for Your Interest!</h3>
        <p>
          Based on your profile, we don't have an immediate open position that's a perfect match right now.
          However, your qualifications are impressive, and we'd like to add you to our exclusive talent pool.
          We'll reach out if a suitable role opens up!
        </p>
        {/* Optionally, a button to acknowledge or proceed */}
         <button onClick={() => setCurrentStep(5) /* Or some other final step */ } style={{marginTop: '10px'}}>
            Okay, Got It!
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Job Recommendations</h2>
      {applicationStatus && <div style={{ color: 'green', marginBottom: '15px', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>{applicationStatus}</div>}
      {recommendations.map(job => (
        <div key={job.id} style={jobCardStyles}>
          <h3 style={jobTitleStyles}>{job.title}</h3>
          <p style={jobDescriptionStyles}>{job.description}</p>
          <p style={fitScoreStyles}><strong>Job Fit Score:</strong> {job.jobFitScore}%</p>
          <p style={fitScoreStyles}><strong>Company Fit Score:</strong> {job.companyFitScore}%</p>
          <div style={buttonContainerStyles}>
            <button onClick={() => handleViewDetails(job)}>View Details</button>
            <button onClick={() => handleApply(job.id)}>Apply Now</button>
          </div>
        </div>
      ))}
      {/* Placeholder for selectedJob details display if needed */}
      {/* {selectedJob && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #eee' }}>
          <h4>Details for: {selectedJob.title}</h4>
          <p>{selectedJob.description}</p>
        </div>
      )} */}
    </div>
  );
};

export default JobRecommendations;
