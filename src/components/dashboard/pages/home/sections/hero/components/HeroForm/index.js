//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroForm/index.js
import React from 'react';
import MediaSection from './MediaSection';
import HeadingSection from './HeadingSection';
import SubheadingSection from './SubheadingSection';
import DescriptionSection from './DescriptionSection';
import ButtonSection from './ButtonSection';

const HeroForm = React.forwardRef(({ 
  formData, 
  setFormData, 
  isEditing, 
  isUploading, 
  handleSubmit, 
  handleFileUpload, 
  resetForm 
}, ref) => {
  const onSubmit = (e) => {
    console.log('Form submitted'); // Debug log
    console.log('Form data:', formData); // Debug log
    handleSubmit(e);
  };

  return (
    <div ref={ref} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Hero Content' : 'Add New Hero Content'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <MediaSection
          formData={formData}
          setFormData={setFormData}
          handleFileUpload={handleFileUpload}
        />
        <HeadingSection
          formData={formData}
          setFormData={setFormData}
        />
        <SubheadingSection
          formData={formData}
          setFormData={setFormData}
        />
        <DescriptionSection
          formData={formData}
          setFormData={setFormData}
        />
        <ButtonSection
          formData={formData}
          setFormData={setFormData}
        />
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            {isUploading ? 'Uploading...' : isEditing ? 'Update Content' : 'Create Content'}
          </button>
        </div>
      </form>
    </div>
  );
});

export default HeroForm;