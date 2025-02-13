// frontend/src/components/dashboard/pages/home/sections/events/components/EventForm/ColorPickerSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';

const ColorPickerSection = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-[#606161]">Content Styling</h3>
    <ColorPicker
      color={formData.contentAreaColor}
      onChange={(color) => setFormData(prev => ({ ...prev, contentAreaColor: color }))}
      label="Content Area Color"
    />
  </div>
);

export default ColorPickerSection;