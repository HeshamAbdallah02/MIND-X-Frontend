//frontend/src/components/dashboard/pages/our-story/sections/journey/JourneyPhaseForm.js
import React, { useState, useEffect } from 'react';

const JourneyPhaseForm = ({ phase, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    year: '',
    headline: '',
    description: '',
    imageUrl: '',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    accentColor: '#81C99C',
    position: 'left', // Always left
    isActive: true,
    expandable: true // Always expandable
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Generate year options from 2000 to current year + 5
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 2000; year <= currentYear + 5; year++) {
    yearOptions.push(year);
  }

  useEffect(() => {
    if (phase) {
      const imageUrl = phase.imageUrl || phase.image?.url || '';
      setFormData({
        year: phase.year || '',
        headline: phase.headline || '',
        description: phase.description || '',
        imageUrl: imageUrl,
        backgroundColor: '#ffffff', // Default values for colors
        textColor: '#1e293b',
        accentColor: '#81C99C',
        position: 'left', // Always left
        isActive: phase.isActive !== false,
        expandable: true // Always expandable
      });
      setImagePreview(imageUrl);
    }
  }, [phase]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.year?.trim()) {
      newErrors.year = 'Year is required';
    }
    
    if (!formData.headline?.trim()) {
      newErrors.headline = 'Headline is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }));
        return;
      }
      
      // Clear any previous image errors
      setErrors(prev => ({ ...prev, image: null }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Upload to Cloudinary
      uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file); // Use 'file' as the field name to match backend
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update form data with the uploaded image URL
      handleChange('imageUrl', data.url);
      
    } catch (error) {
      console.error('Image upload error:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to upload image. Please try again.' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    handleChange('imageUrl', '');
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {phase ? 'Edit Timeline Phase' : 'Add Timeline Phase'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                  errors.year ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a year</option>
                {yearOptions.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headline *
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                errors.headline ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Phase headline"
            />
            {errors.headline && <p className="text-red-500 text-xs mt-1">{errors.headline}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe this phase of your journey"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Upload
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                  </span>
                  <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto object-contain rounded-lg border border-gray-300 max-h-64"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="mt-2 flex justify-center">
                  <label
                    htmlFor="image-upload"
                    className="text-sm text-[#81C99C] hover:text-[#6BA57A] cursor-pointer"
                  >
                    Change image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}
            
            {uploadingImage && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#81C99C]"></div>
                <span>Uploading image...</span>
              </div>
            )}
            
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Settings */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-[#81C99C] focus:ring-[#81C99C]"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#81C99C] text-white rounded-lg hover:bg-[#6BA57A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{phase ? 'Update Phase' : 'Create Phase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JourneyPhaseForm;
