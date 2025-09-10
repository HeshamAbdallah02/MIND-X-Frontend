// frontend/src/components/dashboard/pages/our-story/sections/awards/components/AwardsSettings.js
import React, { useState, useEffect, useRef } from 'react';
import { FaSave, FaUndo, FaEye, FaImage, FaUpload, FaTrash } from 'react-icons/fa';
import api from '../../../../../../../utils/api';

const AwardsSettings = ({ settings, onUpdate, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    backgroundImage: {
      url: '',
      opacity: 0.3,
      overlay: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        title: settings.title || 'Our Awards & Recognition',
        subtitle: settings.subtitle || 'Celebrating excellence in education and innovation',
        backgroundImage: {
          url: settings.backgroundImage?.url || '',
          opacity: settings.backgroundImage?.opacity || 0.3,
          overlay: settings.backgroundImage?.overlay !== undefined ? settings.backgroundImage.overlay : true
        }
      });
      setHasChanges(false);
    }
  }, [settings]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setHasChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        title: settings.title || 'Our Awards & Recognition',
        subtitle: settings.subtitle || 'Celebrating excellence in education and innovation',
        backgroundImage: {
          url: settings.backgroundImage?.url || '',
          opacity: settings.backgroundImage?.opacity || 0.3,
          overlay: settings.backgroundImage?.overlay !== undefined ? settings.backgroundImage.overlay : true
        }
      });
      setHasChanges(false);
    }
  };

  // Image upload functions
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'awards-backgrounds');

      const response = await api.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': undefined, // Let browser set the correct multipart/form-data with boundary
        },
        timeout: 60000 // 60 seconds for file uploads
      });

      const imageUrl = response.data.secure_url;
      handleChange('backgroundImage.url', imageUrl);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    handleChange('backgroundImage.url', '');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Awards Section Settings</h2>
          <p className="text-gray-600 text-sm mt-1">Customize the appearance of your awards section</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              previewMode 
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <FaEye className="w-4 h-4" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
        </div>
      </div>

      {previewMode && (
        <div className="mb-6 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div 
            className="rounded-lg p-8 text-center relative overflow-hidden bg-gray-900"
            style={{ 
              backgroundImage: formData.backgroundImage.url ? `url(${formData.backgroundImage.url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {formData.backgroundImage.overlay && formData.backgroundImage.url && (
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: formData.backgroundImage.opacity }}
              />
            )}
            <div className="relative z-10">
              <h2 
                className="text-3xl font-bold mb-4 text-white"
              >
                {formData.title}
              </h2>
              <p 
                className="text-lg text-gray-200"
              >
                {formData.subtitle}
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-600"
                >
                  🏆
                </div>
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center bg-green-600"
                >
                  🥇
                </div>
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center bg-purple-600"
                >
                  ⭐
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <span>📝</span>
            Content Settings
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Our Awards & Recognition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Celebrating excellence in education and innovation"
              />
            </div>
          </div>
        </div>

        {/* Background Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FaImage className="w-5 h-5" />
            Background Settings
          </h3>
          
          <div className="space-y-4">
            {/* Background Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Image
              </label>
              
              {/* Upload Button */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="background-image-upload"
                />
                <label
                  htmlFor="background-image-upload"
                  className={`
                    inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    text-sm font-medium min-h-[40px]
                    ${uploading 
                      ? 'border-blue-300 bg-blue-50 text-blue-600' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload className="w-4 h-4" />
                      Upload Image
                    </>
                  )}
                </label>
              </div>

              {/* Uploaded Image Display */}
              {formData.backgroundImage.url && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img
                      src={formData.backgroundImage.url}
                      alt="Background preview"
                      className="max-w-full h-auto rounded-lg border border-gray-300 shadow-sm"
                      style={{ maxHeight: '400px' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Upload an image file (JPEG, PNG, WebP) up to 5MB
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opacity ({Math.round(formData.backgroundImage.opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.backgroundImage.opacity}
                  onChange={(e) => handleChange('backgroundImage.opacity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dark Overlay
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={formData.backgroundImage.overlay}
                    onChange={(e) => handleChange('backgroundImage.overlay', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enable dark overlay</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <FaUndo className="w-4 h-4" />
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={!hasChanges || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <FaSave className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AwardsSettings;
