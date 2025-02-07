// components/LogoManagement/index.js
import React, { useState } from 'react';
import FileUpload from '../../../../../../shared/FileUpload';
import LogoPreview from './LogoPreview';

const LogoManagement = ({ logo, onLogoUpload, onLogoDelete, isUploading }) => {
  const [tempPreviewUrl, setTempPreviewUrl] = useState(null);

  const handleFileSelect = async (file) => {
    // Create temporary preview
    const tempUrl = URL.createObjectURL(file);
    setTempPreviewUrl(tempUrl);

    try {
      // Upload file
      await onLogoUpload(file);
    } catch (error) {
      // If upload fails, clear preview
      setTempPreviewUrl(null);
    }

    // Cleanup temporary URL
    URL.revokeObjectURL(tempUrl);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Logo Management</h2>
      <div className="space-y-4">
        <FileUpload
          onFileSelect={handleFileSelect}
          accept="image/*"
          label="Upload Logo"
          disabled={isUploading}
        />
        <LogoPreview 
          logo={logo} 
          tempPreviewUrl={tempPreviewUrl}
          onDelete={onLogoDelete}
        />
      </div>
    </div>
  );
};

export default LogoManagement;