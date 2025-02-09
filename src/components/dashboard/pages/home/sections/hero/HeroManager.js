// frontend/src/components/dashboard/pages/home/sections/hero/HeroManager.js
import React, { useRef, useEffect } from 'react';
import useHeroData from './hooks/useHeroData';
import useHeroConfig from './hooks/useHeroConfig';
import HeroForm from './components/HeroForm';
import HeroList from './components/HeroList';

const HeroManager = () => {
  const formRef = useRef();

  const { 
    contents, 
    isLoading, 
    fetchContents, 
    deleteContent, 
    updateOrder 
  } = useHeroData();

  const {
    formData,
    setFormData,
    isEditing,
    isUploading,
    handleSubmit,
    handleFileUpload,
    resetForm,
    editContent
  } = useHeroConfig({ 
    fetchContents 
  });

  // Scroll to form when entering edit mode
  useEffect(() => {
    if (isEditing && formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [isEditing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeroForm
        ref={formRef}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        isUploading={isUploading}
        handleSubmit={handleSubmit}
        handleFileUpload={handleFileUpload}
        resetForm={resetForm}
      />

      <HeroList
        contents={contents}
        onEdit={editContent}
        onDelete={deleteContent}
        onReorder={updateOrder}
      />
    </div>
  );
};

export default HeroManager;