//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroForm/MediaSection.js
import React from 'react';
import FileUpload from '../../../../../../shared/FileUpload';

const MediaSection = ({ formData, setFormData, handleFileUpload }) => {
  return (
    <div>
      {/* Media Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Media Type
          </label>
          <select
            value={formData.mediaType}
            onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="gif">GIF</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Duration (ms)
          </label>
          <input
            type="number"
            value={formData.displayDuration}
            onChange={(e) => setFormData({ ...formData, displayDuration: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md"
            min="1000"
            step="1000"
          />
        </div>
      </div>

      {/* Media Upload */}
      <div className="space-y-2 mt-4">
        <FileUpload
          onUpload={handleFileUpload}
          accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
          label="Upload Media"
        />
        {formData.mediaUrl && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Media URL
            </label>
            <input
              type="text"
              value={formData.mediaUrl}
              onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSection;