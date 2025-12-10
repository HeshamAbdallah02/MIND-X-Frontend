// frontend/src/components/dashboard/pages/events/sections/ImageUploadField.js
import React, { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { API_BASE_URL } from '../../../../../config/api';

const ImageUploadField = ({
  label,
  value,
  onChange,
  required = false,
  accept = "image/*"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload' }));
        throw new Error(errorData.message || 'Failed to upload');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleClearImage = () => {
    onChange('');
    setError('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="space-y-3">
        {/* Upload Button */}
        <div className="flex gap-2">
          <label className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-3
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${uploading
              ? 'border-gray-300 bg-gray-50 cursor-wait'
              : 'border-gray-300 hover:border-[#FBB859] hover:bg-[#FBB859]/5'
            }
          `}>
            <FiUpload className={uploading ? 'animate-pulse' : ''} size={20} />
            <span className="text-sm font-medium text-gray-700">
              {uploading ? 'Uploading...' : value ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {value && (
            <button
              type="button"
              onClick={handleClearImage}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove image"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Image Preview */}
        {value && !error && (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
              onError={() => setError('Failed to load image')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
