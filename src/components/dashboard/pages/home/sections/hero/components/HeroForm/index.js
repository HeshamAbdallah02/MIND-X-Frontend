import React, { useState, useEffect } from 'react';
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
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [initialFormState, setInitialFormState] = useState(formData);

  // Update initial form state when editing mode changes
  useEffect(() => {
    setInitialFormState(formData);
    setIsFormChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]); // Remove formData from dependencies

  // Track actual changes by comparing with initial state
  useEffect(() => {
    if (!initialFormState) return; // Guard against initial null state
    
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormState);
    console.log('Form changed:', hasChanges); // Debug log
    setIsFormChanged(hasChanges);
  }, [formData, initialFormState]);

  // Reset form changed state when form is reset
  const handleReset = () => {
    setIsFormChanged(false);
    setInitialFormState(formData);
    resetForm();
  };

  const onSubmit = (e) => {
    e.preventDefault(); // Fix: Prevent default form submission
    console.log('Form submitted'); // Debug log
    console.log('Form data:', formData); // Debug log
    handleSubmit(e);
    setIsFormChanged(false);
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
            onClick={handleReset}
            className="px-4 py-2 border border-[#606161] rounded-md text-[#606161] hover:bg-[#606161] hover:text-white transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || !isFormChanged}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200
              ${isFormChanged 
                ? 'bg-[#FBB859] text-white hover:bg-[#81C99A] active:scale-95' 
                : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}
          >
            {isUploading ? 'Uploading...' : isEditing ? 'Update Content' : 'Create Content'}
          </button>
        </div>
      </form>
    </div>
  );
});

export default HeroForm;