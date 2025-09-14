// frontend/src/components/dashboard/pages/our-story/sections/seasons/components/HighlightForm.js
import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiExternalLink } from 'react-icons/fi';
import { useSeasonsMutations } from '../../../../../../../hooks/useSeasonsQueries';

const HighlightForm = ({ seasonId, highlight, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    createHighlightMutation,
    updateHighlightMutation,
  } = useSeasonsMutations();

  // Populate form data when editing
  useEffect(() => {
    if (highlight) {
      setFormData({
        title: highlight.title || '',
        url: highlight.url || ''
      });
    }
  }, [highlight]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate URL format if provided
    if (formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL (e.g., https://example.com)';
      }
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
      const highlightData = {
        title: formData.title.trim(),
        url: formData.url.trim()
      };

      if (highlight) {
        await updateHighlightMutation.mutateAsync({
          seasonId,
          highlightId: highlight._id,
          highlightData: highlightData
        });
      } else {
        await createHighlightMutation.mutateAsync({
          seasonId,
          highlightData: highlightData
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
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
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlight Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., National Competition Winner"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (Optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/article"
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                    errors.url ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <FiExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                If provided, the highlight will be clickable and open this URL
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
