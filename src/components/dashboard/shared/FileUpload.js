//frontend/src/components/dashboard/shared/FileUpload.js
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const FileUpload = ({ 
  onFileSelect, 
  accept, 
  label, 
  disabled,
  maxSize = 5 * 1024 * 1024 
}) => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const attemptUpload = async (file, attemptNumber, maxAttempts) => {
    try {
        await onFileSelect(file);
        return true;
    } catch (error) {
        if (attemptNumber === maxAttempts) {
            throw error;
        }
        const backoffTime = Math.min(1000 * Math.pow(2, attemptNumber - 1), 10000);
        await delay(backoffTime);
        return false;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploadStatus('Uploading...');
    const maxAttempts = 3;

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const success = await attemptUpload(file, attempt, maxAttempts);
        if (success) {
          setUploadStatus('');
          break;
        }
        
        if (attempt < maxAttempts) {
          setUploadStatus('Retrying...');
        }
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploadStatus('');
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        {disabled ? uploadStatus || 'Uploading...' : label}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
      />
      {uploadStatus && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">{uploadStatus}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;