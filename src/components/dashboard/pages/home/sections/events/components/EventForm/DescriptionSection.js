// frontend/src/components/dashboard/pages/home/sections/events/components/EventForm/DescriptionSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';

const DescriptionSection = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, [field]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#606161]">Description</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description Text
          </label>
          <textarea
            value={formData.description.text}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-32 focus:ring-2 focus:ring-[#81C99C]"
            maxLength={200}
          />
        </div>
        <ColorPicker
          color={formData.description.color}
          onChange={(color) => handleChange('color', color)}
          label="Text Color"
        />
      </div>
    </div>
  );
};

export default DescriptionSection;