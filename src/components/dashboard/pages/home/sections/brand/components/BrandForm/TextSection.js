// frontend/src/components/dashboard/pages/home/sections/brand/components/BrandForm/TextSection.js
import React from 'react';

const TextSection = ({ settings, onUpdateField }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#606161]">Content</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mission Statement
          </label>
          <textarea
            value={settings.missionText}
            onChange={(e) => onUpdateField('missionText', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vision Statement
          </label>
          <textarea
            value={settings.visionText}
            onChange={(e) => onUpdateField('visionText', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default TextSection;