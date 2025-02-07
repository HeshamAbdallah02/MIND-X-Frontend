//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroForm/HeadingSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';
import TextSizeSelector from '../../../../../../shared/TextSizeSelector';

const HeadingSection = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Heading (Required)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3">
          <input
            type="text"
            value={formData.heading.text}
            onChange={(e) => setFormData({
              ...formData,
              heading: { ...formData.heading, text: e.target.value }
            })}
            placeholder="Heading Text"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <ColorPicker
          color={formData.heading.color}
          onChange={(color) => setFormData({
            ...formData,
            heading: { ...formData.heading, color }
          })}
          label="Heading Color"
        />
        <TextSizeSelector
          value={formData.heading.size}
          onChange={(size) => setFormData({
            ...formData,
            heading: { ...formData.heading, size }
          })}
          label="Heading Size"
        />
      </div>
    </div>
  );
};

export default HeadingSection;