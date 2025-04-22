// frontend/src/components/dashboard/pages/home/sections/header/components/LogoManagement/index.js
import React, { useState } from 'react';
import FileUpload from '../../../../../../shared/FileUpload';
import LogoPreview from './LogoPreview';
import { toast } from 'react-hot-toast';

const LogoManagement = ({ logo, onLogoUpload, onLogoDelete, isUploading }) => {
  const [tempPreviewUrl, setTempPreviewUrl] = useState(null);

  const handleFileSelect = async (file) => {
    let tempUrl;
    try {
      tempUrl = URL.createObjectURL(file);
      setTempPreviewUrl(tempUrl);
      
      // Add delay for state update
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Call upload handler
      await onLogoUpload(file);
    } catch (error) {
      setTempPreviewUrl(null);
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      if (tempUrl) URL.revokeObjectURL(tempUrl);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Logo Management</h2>
      <div className="space-y-4">
        <FileUpload
          onUpload={handleFileSelect}
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