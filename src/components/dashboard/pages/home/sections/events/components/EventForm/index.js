// frontend/src/components/dashboard/pages/home/sections/events/components/EventForm/index.js
import React from 'react';
import MediaSection from './MediaSection';
import TitleSection from './TitleSection';
import DescriptionSection from './DescriptionSection';
import DateSection from './DateSection';
import ColorPickerSection from './ColorPickerSection';
import URLSection from './URLSection';

const EventForm = React.forwardRef(({ 
  formData, 
  setFormData, 
  isEditing, 
  isUploading, 
  handleSubmit, 
  handleFileUpload, 
  resetForm 
}, ref) => {

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.coverImage?.url) {
      alert('Cover image is required');
      return;
    }
    handleSubmit(e);
  };

  return (
    <div ref={ref} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#606161]">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <MediaSection
          formData={formData}
          setFormData={setFormData}
          handleFileUpload={handleFileUpload}
        />

        <TitleSection
          formData={formData}
          setFormData={setFormData}
        />

        <DescriptionSection
          formData={formData}
          setFormData={setFormData}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateSection
            formData={formData}
            setFormData={setFormData}
          />
          
          <ColorPickerSection
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <URLSection
          formData={formData}
          setFormData={setFormData}
        />

        <div className="flex justify-end space-x-4 border-t pt-6">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2.5 bg-[#81C99C] text-white rounded-lg hover:bg-[#6ba986] disabled:opacity-50 transition-all"
          >
            {isUploading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
});

export default EventForm;