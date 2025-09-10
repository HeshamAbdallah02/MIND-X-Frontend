// frontend/src/components/dashboard/pages/our-story/sections/seasons/components/HighlightForm.js
import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiUpload } from 'react-icons/fi';
import { useSeasonsMutations } from '../../../../../../../hooks/useSeasonsQueries';
import ImageUploader from '../../../../../../shared/ImageUploader';

const HighlightForm = ({ seasonId, highlight, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    displayOrder: 0
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    createHighlightMutation,
    updateHighlightMutation,
    uploadHighlightImageMutation,
  } = useSeasonsMutations();

  // Populate form data when editing
  useEffect(() => {
    if (highlight) {
      setFormData({
        title: highlight.title || '',
        description: highlight.description || '',
        displayOrder: highlight.displayOrder || 0
      });
      setImagePreview(highlight.image || '');
    }
  }, [highlight]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = imagePreview;

      // Upload image if new file is selected
      if (image) {
        const uploadResult = await uploadHighlightImageMutation.mutateAsync({
          seasonId,
          file: image,
          field: 'image'
        });
        imageUrl = uploadResult.url;
      }

      const highlightData = {
        ...formData,
        image: imageUrl
      };

      if (highlight) {
        await updateHighlightMutation.mutateAsync({
          seasonId,
          highlightId: highlight._id,
          data: highlightData
        });
      } else {
        await createHighlightMutation.mutateAsync({
          seasonId,
          data: highlightData
        });
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving highlight:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save highlight' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {highlight ? `Edit Highlight: ${highlight.title}` : 'Add New Highlight'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Highlight Image
              </label>
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Highlight preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  onRemove={handleRemoveImage}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  maxSize={10 * 1024 * 1024}
                  className="w-full"
                >
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-lg text-gray-600 mb-2">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                </ImageUploader>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., National Competition Winner"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the achievement, event, or milestone in detail..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Lower numbers appear first. You can also drag & drop to reorder.
              </p>
            </div>

            {/* Submit Errors */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#81C99C] hover:bg-[#6db885] text-white px-6 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {highlight ? 'Update Highlight' : 'Add Highlight'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HighlightForm;
