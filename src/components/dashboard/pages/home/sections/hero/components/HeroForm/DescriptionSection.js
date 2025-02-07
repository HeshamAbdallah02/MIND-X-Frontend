//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroForm/DescriptionSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';
import TextSizeSelector from '../../../../../../shared/TextSizeSelector';

const DescriptionSection = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Description (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3">
          <textarea
            value={formData.description.text}
            onChange={(e) => setFormData({
              ...formData,
              description: { ...formData.description, text: e.target.value }
            })}
            placeholder="Description Text"
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>
        <ColorPicker
          color={formData.description.color}
          onChange={(color) => setFormData({
            ...formData,
            description: { ...formData.description, color }
          })}
          label="Description Color"
        />
        <TextSizeSelector
          value={formData.description.size}
          onChange={(size) => setFormData({
            ...formData,
            description: { ...formData.description, size }
          })}
          label="Description Size"
        />
      </div>
    </div>
  );
};

export default DescriptionSection;