// frontend/src/components/dashboard/pages/home/sections/events/components/EventForm/TitleSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';

const TitleSection = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      title: { ...prev.title, [field]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#606161]">Event Title</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title Text
          </label>
          <input
            type="text"
            value={formData.title.text}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#81C99C]"
            maxLength={60}
          />
        </div>
        <ColorPicker
          color={formData.title.color}
          onChange={(color) => handleChange('color', color)}
          label="Title Color"
        />
      </div>
    </div>
  );
};

export default TitleSection;