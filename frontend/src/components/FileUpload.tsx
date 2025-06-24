import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string; // e.g., ".pdf,.doc,.docx"
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = ".pdf",
  label = "Upload CV (PDF only)",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFileName(null);
    const file = event.target.files?.[0];
    if (file) {
      if (acceptedFileTypes) {
        const fileType = `.${file.name.split('.').pop()?.toLowerCase()}`;
        if (!acceptedFileTypes.toLowerCase().split(',').includes(fileType)) {
          setError(`Invalid file type. Please upload ${acceptedFileTypes}.`);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
          }
          return;
        }
      }
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
        onClick={triggerFileInput}
        onDragOver={(e) => e.preventDefault()} // Necessary for onDrop to work
        onDrop={(e) => { // Basic drag and drop
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Simulate file change event
            if (fileInputRef.current) {
                fileInputRef.current.files = e.dataTransfer.files;
                const event = new Event('change', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>;
                Object.defineProperty(event, 'target', {writable: false, value: { files: e.dataTransfer.files }});
                handleFileChange(event);
            }
          }
        }}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <span className="relative bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <span>Upload a file</span>
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {acceptedFileTypes.replace(/\./g, '').toUpperCase()} files up to 10MB (example size)
          </p>
        </div>
        <input
          id="file-upload-input"
          name="file-upload-input"
          type="file"
          className="sr-only"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
        />
      </div>
      {fileName && <p className="mt-2 text-sm text-green-600">Selected file: {fileName}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;
