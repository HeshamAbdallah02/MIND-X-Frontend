// frontend/src/components/dashboard/pages/home/sections/brand/components/BrandForm/index.js
import React from 'react';
import LogoSection from './LogoSection';
import TextSection from './TextSection';
import ColorSection from './ColorSection';

const BrandForm = React.forwardRef(({ 
  settings, 
  isUploading, 
  onSubmit,
  onFileUpload,
  onUpdateField,
  hasUnsavedChanges
}, ref) => {

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <div ref={ref} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#606161]">
        Brand Settings
      </h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <LogoSection
          logo={settings.logo}
          onFileUpload={onFileUpload}
          isUploading={isUploading}
        />

        <TextSection
          settings={settings}
          onUpdateField={onUpdateField}
        />

        <ColorSection
          settings={settings}
          onUpdateField={onUpdateField}
        />

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="submit" // Changed from submit to button
            //onClick={handleFormSubmit}
            className={`px-6 py-2.5 text-white rounded-lg transition-all ${
                hasUnsavedChanges 
                  ? 'bg-[#81C99C] hover:bg-[#6ba986]' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!hasUnsavedChanges || isUploading}
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
});

export default BrandForm;