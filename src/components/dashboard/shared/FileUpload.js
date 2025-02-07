// components/dashboard/shared/FileUpload.js
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
      const startTime = Date.now();
      console.log(`Upload attempt ${attemptNumber} for:`, file.name, file.size);
      
      await onFileSelect(file);
      
      const duration = Date.now() - startTime;
      console.log(`Upload completed in ${duration}ms`);
      return true;
    } catch (error) {
      console.error(`Upload attempt ${attemptNumber} failed:`, error);
      
      if (attemptNumber === maxAttempts) {
        throw error;
      }
      
      // Wait before retrying
      await delay(1000 * attemptNumber);
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
        setUploadStatus(`Upload attempt ${attempt}/${maxAttempts}`);
        
        const success = await attemptUpload(file, attempt, maxAttempts);
        if (success) {
          setUploadStatus('');
          break;
        }
        
        if (attempt < maxAttempts) {
          setUploadStatus(`Retrying... (Attempt ${attempt + 1}/${maxAttempts})`);
        }
      }
    } catch (error) {
      console.error('All upload attempts failed:', error);
      toast.error('Upload failed after multiple attempts');
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