//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroForm/SubheadingSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';
import TextSizeSelector from '../../../../../../shared/TextSizeSelector';

const SubheadingSection = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Subheading (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3">
          <input
            type="text"
            value={formData.subheading.text}
            onChange={(e) => setFormData({
              ...formData,
              subheading: { ...formData.subheading, text: e.target.value }
            })}
            placeholder="Subheading Text"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <ColorPicker
          color={formData.subheading.color}
          onChange={(color) => setFormData({
            ...formData,
            subheading: { ...formData.subheading, color }
          })}
          label="Subheading Color"
        />
        <TextSizeSelector
          value={formData.subheading.size}
          onChange={(size) => setFormData({
            ...formData,
            subheading: { ...formData.subheading, size }
          })}
          label="Subheading Size"
        />
      </div>
    </div>
  );
};

export default SubheadingSection;