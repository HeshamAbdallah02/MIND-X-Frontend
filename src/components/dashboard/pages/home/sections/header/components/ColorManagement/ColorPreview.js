// components/ColorManagement/ColorPreview.js
import React from 'react';

const ColorPreview = ({ colors }) => (
  <div className="mt-6 p-4 rounded" style={{ backgroundColor: colors.background }}>
    <div className="flex gap-4 justify-center">
      <span style={{ color: colors.text.default }}>Normal Text</span>
      <span style={{ color: colors.text.hover }}>Hover Text</span>
    </div>
  </div>
);

export default ColorPreview;