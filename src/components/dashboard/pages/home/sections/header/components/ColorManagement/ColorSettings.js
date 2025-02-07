// components/ColorManagement/ColorSettings.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';

const ColorSettings = ({ colors, onColorChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <ColorPicker
      color={colors.background}
      onChange={(color) => onColorChange('background', color)}
      label="Background Color"
    />
    <ColorPicker
      color={colors.text.default}
      onChange={(color) => onColorChange('default', color)}
      label="Text Color"
    />
    <ColorPicker
      color={colors.text.hover}
      onChange={(color) => onColorChange('hover', color)}
      label="Hover Color"
    />
  </div>
);

export default ColorSettings;