// frontend/src/components/dashboard/pages/home/sections/stats/components/ColorSettingsForm.js
import React, { useState, useEffect } from 'react';
import ColorPicker from '../../../../../shared/ColorPicker';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

const ColorSettingsForm = ({ initialColors, onSave }) => {
  const [colorDrafts, setColorDrafts] = useState(initialColors);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setColorDrafts(initialColors);
  }, [initialColors]);

  useEffect(() => {
    setHasChanges(JSON.stringify(colorDrafts) !== JSON.stringify(initialColors));
  }, [colorDrafts, initialColors]);

  const handleColorChange = (key, color) => {
    setColorDrafts(prev => ({ ...prev, [key]: color }));
  };

  const handleReset = () => {
    setColorDrafts(initialColors);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#606161]">
          Section Styling
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h2>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 ${
              hasChanges 
                ? 'text-[#606161] hover:text-[#FBB859] bg-white hover:bg-[#FBB859]/10'
                : 'text-[#606161]/50 bg-gray-100 cursor-not-allowed'
            }`}
          >
            <FiRefreshCw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={() => onSave(colorDrafts)}
            disabled={!hasChanges}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 ${
              hasChanges 
                ? 'bg-[#FBB859] text-white hover:bg-[#E0A04D]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiSave className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(colorDrafts).map(([key, value]) => (
          <ColorPicker
            key={key}
            label={key.replace(/([A-Z])/g, ' $1').trim()}
            color={value}
            onChange={(color) => handleColorChange(key, color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSettingsForm;