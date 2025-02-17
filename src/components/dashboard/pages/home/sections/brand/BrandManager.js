// frontend/src/components/dashboard/pages/home/sections/brand/BrandManager.js
import React, { useRef } from 'react';
import useBrandData from './hooks/useBrandData';
import BrandForm from './components/BrandForm';

const BrandManager = () => {
  const formRef = useRef();
  const { 
    settings, 
    isLoading,
    isUploading,
    handleSubmit,
    handleFileUpload,
    updateField,
    hasUnsavedChanges
  } = useBrandData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81C99C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BrandForm
        ref={formRef}
        settings={settings}
        isUploading={isUploading}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        onUpdateField={updateField}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
};

export default BrandManager;