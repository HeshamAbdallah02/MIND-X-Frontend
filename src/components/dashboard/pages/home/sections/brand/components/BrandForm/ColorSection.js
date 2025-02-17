// frontend/src/components/dashboard/pages/home/sections/brand/components/BrandForm/ColorSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';

const ColorSection = ({ settings, onUpdateField }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#606161]">Colors</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Mission Section</h4>
          <ColorPicker
            label="Background Color"
            color={settings.missionBgColor}
            onChange={(color) => onUpdateField('missionBgColor', color)}
          />
          <ColorPicker
            label="Text Color"
            color={settings.missionTextColor}
            onChange={(color) => onUpdateField('missionTextColor', color)}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Vision Section</h4>
          <ColorPicker
            label="Background Color"
            color={settings.visionBgColor}
            onChange={(color) => onUpdateField('visionBgColor', color)}
          />
          <ColorPicker
            label="Text Color"
            color={settings.visionTextColor}
            onChange={(color) => onUpdateField('visionTextColor', color)}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSection;