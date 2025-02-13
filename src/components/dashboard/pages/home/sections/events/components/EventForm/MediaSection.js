// frontend/src/components/dashboard/pages/home/sections/events/components/EventForm/MediaSection.js
import React from 'react';
import FileUpload from '../../../../../../shared/FileUpload';

const MediaSection = ({ formData, setFormData, handleFileUpload }) => {
  const handleImageUpload = async (file) => {
    await handleFileUpload(file);
    setFormData(prev => ({
      ...prev,
      coverImage: {
        ...prev.coverImage,
        alt: file.name.slice(0, 30) // Truncate alt text
      }
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#606161]">Event Media</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          onFileSelect={handleImageUpload}
          accept="image/*"
          label="Upload Cover Image"
          maxSize={10 * 1024 * 1024}
        />
        
        {formData.coverImage?.url && (
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <img
              src={formData.coverImage.url}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm">
              {formData.coverImage.alt}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSection;