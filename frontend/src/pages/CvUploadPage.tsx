import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom for navigation
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import ProgressBar from '../components/ProgressBar'; // To show progress
import * as api from '../services/api';
import { useUser } from '../contexts/UserContext';
import { UserBase, UUID, UserLevel } from '../types';

const CvUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const [fileId, setFileId] = useState<UUID | null>(null);
  const [formData, setFormData] = useState<Partial<UserBase>>({
    name_first: '',
    name_second: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  // If user already exists and is past this stage, redirect them
  useEffect(() => {
    if (currentUser && currentUser.level !== UserLevel.INITIAL) {
      // Redirect to the appropriate page based on currentUser.level
      // For now, just an example:
      if (currentUser.level === UserLevel.PERSONALITY) navigate('/personality-test');
      else if (currentUser.level === UserLevel.QUESTIONS) navigate('/questions');
      else if (currentUser.level === UserLevel.DONE) navigate('/recommendations');
    }
  }, [currentUser, navigate]);


  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setFileUploadError(null);
    try {
      const newFileId = await api.uploadFile(file);
      setFileId(newFileId);
      const userInfo = await api.getUserInfoByFile(newFileId);
      setFormData({
        name_first: userInfo.name_first,
        name_second: userInfo.name_second,
        file_id: newFileId, // from uploadFile response
        openai_file_id: userInfo.openai_file_id, // from getUserInfoByFile response
      });
    } catch (err: any) {
      console.error("File upload or user info fetch error:", err);
      setFileUploadError(err.message || 'Failed to upload file or retrieve user info.');
      setFileId(null); // Reset fileId on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileId || !formData.name_first || !formData.name_second) {
      setError('Please upload a CV and ensure first and last names are filled.');
      return;
    }
    setIsLoading(true);
    setError(null);

    const userToCreate: UserBase = {
      name_first: formData.name_first,
      name_second: formData.name_second,
      file_id: fileId,
      openai_file_id: formData.openai_file_id || undefined, // Ensure it's optional
      level: UserLevel.INITIAL, // Set initial level
      personality: { // Default empty personality
        openness: 0, neuroticism: 0, agreeableness: 0,
        extraversion: 0, conscientiousness: 0,
      },
      questions: [], // Default empty questions
    };

    try {
      const createdUser = await api.createUser(userToCreate);
      setCurrentUser(createdUser);
      navigate('/personality-test'); // Navigate to the next step
    } catch (err: any) {
      console.error("User creation error:", err);
      setError(err.message || 'Failed to create user profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentProgressLevel = currentUser?.level || UserLevel.INITIAL;


  return (
    <div className="page-container"> {/* Use page-container class */}
      <div className="w-full max-w-4xl"> {/* ProgressBar container can keep its specific width constraint */}
        <ProgressBar currentLevel={currentProgressLevel} />
      </div>

      <div className="content-card max-w-lg"> {/* Use content-card class and keep max-width */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Applicant Information
        </h1>

        {isLoading && fileId === null && !fileUploadError && (
            <div className="text-center p-4">
                <p className="text-blue-600">Processing CV...</p>
                {/* You could add a spinner here */}
            </div>
        )}

        {!fileId && !isLoading && (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Please upload your CV to begin. We'll try to extract your name automatically.
            </p>
            <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".pdf" />
            {fileUploadError && <p className="text-red-500 text-sm mt-2 text-center">{fileUploadError}</p>}
          </>
        )}


        {fileId && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border border-green-500 bg-green-50 rounded-md">
              <p className="text-green-700 text-sm font-medium">CV uploaded successfully! Please confirm your details below.</p>
            </div>
            <TextInput
              label="First Name"
              id="name_first"
              name="name_first"
              value={formData.name_first || ''}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <TextInput
              label="Last Name"
              id="name_second"
              name="name_second"
              value={formData.name_second || ''}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !formData.name_first || !formData.name_second}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md
                         disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
            >
              {isLoading ? 'Submitting...' : 'Save and Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CvUploadPage;
