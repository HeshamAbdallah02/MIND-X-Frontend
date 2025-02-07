// components/ColorManagement/index.js
import React from 'react';
import ColorSettings from './ColorSettings';
import ColorPreview from './ColorPreview';

const ColorManagement = ({ colors, onColorChange }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">Color Management</h2>
    <ColorSettings colors={colors} onColorChange={onColorChange} />
    <ColorPreview colors={colors} />
  </div>
);

export default ColorManagement;