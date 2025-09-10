// frontend/src/components/dashboard/shared/FileUpload.js
import React, { useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const FileUpload = ({
  onUpload,
  accept,
  label = 'Upload',
  disabled,
  maxSize = 5 * 1024 * 1024, // Default: 5MB
}) => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const attemptUpload = async (file, attemptNumber, maxAttempts) => {
    try {
      await onUpload(file);
      return true;
    } catch (error) {
      if (attemptNumber === maxAttempts) {
        throw error;
      }
      const backoffTime = Math.min(1000 * 2 ** (attemptNumber - 1), 10000); // Exponential backoff
      await delay(backoffTime);
      return false;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log('FileUpload handleFileChange called with file:', {
      file: file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      filesLength: e.target.files.length
    });
    
    if (!file) return;

    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploadStatus('Uploading...');
    const maxAttempts = 3;

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`FileUpload attempt ${attempt}, calling onUpload with file:`, file);
        const success = await attemptUpload(file, attempt, maxAttempts);
        if (success) {
          setUploadStatus('Upload successful');
          return;
        }
        if (attempt < maxAttempts) {
          setUploadStatus(`Retrying... (attempt ${attempt + 1})`);
        }
      }
    } catch (error) {
      console.error('FileUpload final error:', error);
      toast.error('Upload failed after multiple attempts');
      setUploadStatus('Upload failed');
    } finally {
      setTimeout(() => setUploadStatus(''), 2000);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        disabled={disabled}
      >
        {disabled ? (
          uploadStatus || 'Uploading...'
        ) : (
          <div className="flex items-center gap-2">
            <FiUpload className="w-5 h-5 text-gray-600 hover:text-gray-800" />
            <span className="sr-only">{label}</span>
          </div>
        )}
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