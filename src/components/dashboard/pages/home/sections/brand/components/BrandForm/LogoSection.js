// frontend/src/components/dashboard/pages/home/sections/brand/components/BrandForm/LogoSection.js
import React from 'react';
import FileUpload from '../../../../../../shared/FileUpload';

const LogoSection = ({ logo, onFileUpload, isUploading }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#606161]">Logo</h3>
      
      <div className="flex items-start space-x-6">
        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
          {logo?.url && (
            <img
              src={logo.url}
              alt={logo.alt || 'Brand Logo'}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="flex-1">
          <FileUpload
            onUpload={onFileUpload}
            accept="image/*"
            label="Upload Logo"
            disabled={isUploading}
          />
          <p className="mt-2 text-sm text-gray-500">
            Recommended size: 200x200px. Max file size: 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;