import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { uploadCvFile, getUserInfoByFileId, createUser } from '../services/userService';
import type { UserBase } from '../types/api';

const CvUploadForm: React.FC = () => {
  const {
    setFileId,
    setUser,
    setExtractedCvData,
    extractedCvData,
    isLoading,
    setIsLoading,
    setError,
    setCurrentStep,
    user,
    fileId: contextFileId // Renaming to avoid conflict with local fileId state if any
  } = useApplicationContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localFirstName, setLocalFirstName] = useState<string>('');
  const [localLastName, setLocalLastName] = useState<string>('');
  const [isCvUploaded, setIsCvUploaded] = useState<boolean>(false);
  const [isProcessingCv, setIsProcessingCv] = useState<boolean>(false);

  useEffect(() => {
    // Pre-fill form if extractedCvData becomes available
    if (extractedCvData) {
      setLocalFirstName(extractedCvData.name_first || '');
      setLocalLastName(extractedCvData.name_second || '');
    }
  }, [extractedCvData]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null); // Clear previous errors
    }
  };

  const handleCvUpload = async () => {
    if (!selectedFile) {
      setError('Please select a CV file to upload.');
      return;
    }

    setIsLoading(true);
    setIsProcessingCv(true);
    setError(null);

    try {
      const uploadResponse = await uploadCvFile(selectedFile);
      setFileId(uploadResponse.file_id); // Store FID in context

      // Now get user info by file ID
      const userInfo = await getUserInfoByFileId(uploadResponse.file_id);
      setExtractedCvData(userInfo); // Store extracted data (name, etc.)

      // Pre-fill form fields, even if null initially
      setLocalFirstName(userInfo.name_first || '');
      setLocalLastName(userInfo.name_second || '');

      setIsCvUploaded(true); // Show name input fields
      setCurrentStep(1); // Mark CV upload part as done, move to name confirmation

    } catch (err: any) {
      setError(err.message || 'CV upload or processing failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsProcessingCv(false);
    }
  };

  const handleSubmitUserInfo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contextFileId) {
      setError('File ID is missing. Please upload CV again.');
      return;
    }

    // Validate names
    if (!localFirstName.trim() || !localLastName.trim()) {
        setError('First name and last name are required.');
        return;
    }

    setIsLoading(true);
    setError(null);

    const userBaseData: UserBase = {
      ...extractedCvData, // Include any other data extracted from CV
      file_id: contextFileId,
      name_first: localFirstName.trim(),
      name_second: localLastName.trim(),
      // other fields from extractedCvData like openai_file_id, level will be preserved
    };

    // Ensure required fields from UserBase are present if not already in extractedCvData
    if (!userBaseData.openai_file_id && extractedCvData?.openai_file_id) {
        userBaseData.openai_file_id = extractedCvData.openai_file_id;
    }
    if (!userBaseData.level && extractedCvData?.level) {
        userBaseData.level = extractedCvData.level;
    }


    try {
      // If a user object already exists (e.g., navigating back and forth), update it.
      // Otherwise, create a new user.
      // For this initial step, we always create. Later steps might update.
      // The product spec: create_user(userBase) → UID
      const createdUser = await createUser(userBaseData);
      setUser(createdUser); // Store the full user object in context
      setCurrentStep(2); // Move to the next step (e.g., Personality Test)
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(err.message || 'Failed to save user information. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (user && user.uuid) { // If user is already fully created and has an ID, perhaps show a summary or next step
    return (
      <div>
        <p>CV and user information submitted successfully.</p>
        <p>Name: {user.name_first} {user.name_second}</p>
        <p>Next, please complete the personality test.</p>
        {/* Button to proceed could be here or handled by App.tsx routing */}
      </div>
    );
  }

  return (
    <div>
      {/* Headline & helper text – design-only changes */}
      <h2 style={{ textAlign: 'center', marginBottom: '6px' }}>Making applying easy with FlashHire</h2>
      <p style={{ textAlign: 'center', marginTop: '0', marginBottom: '26px', color: '#555', maxWidth: '480px', marginInline: 'auto', lineHeight: 1.4 }}>
        Hello there! I'm Flash, your personal AI assistant here at Reply! I'm here to help you discover the best job opportunities that match your skills and interests. With my help, applying for positions is simple and straightforward. Let me guide you through the process and make your job search a breeze. Together, we'll find the perfect role for you at Reply. Let's get started on this exciting journey!
      </p>
      {!isCvUploaded && !isProcessingCv && (
        <div>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
          <button onClick={handleCvUpload} disabled={!selectedFile || isLoading}>
            {isLoading ? 'Uploading...' : 'Upload CV'}
          </button>
        </div>
      )}

      {isProcessingCv && <p>Processing CV, please wait...</p>}

      {isCvUploaded && !user?.uuid && (
        <form onSubmit={handleSubmitUserInfo}>
          <p>CV uploaded successfully. Please confirm or enter your name:</p>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={localFirstName}
              onChange={(e) => setLocalFirstName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={localLastName}
              onChange={(e) => setLocalLastName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading || !localFirstName.trim() || !localLastName.trim()}>
            {isLoading ? 'Saving...' : 'Confirm and Continue'}
          </button>
        </form>
      )}
      {/* Error messages displayed by useApplicationContext or a dedicated ErrorDisplay component */}
    </div>
  );
};

export default CvUploadForm;
