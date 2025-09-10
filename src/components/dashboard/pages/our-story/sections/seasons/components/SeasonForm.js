// frontend/src/components/dashboard/pages/our-story\sections\seasons\components\SeasonForm.js
import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiUsers, FiStar, FiImage } from 'react-icons/fi';
import { useSeasonsMutations } from '../../../../../../../hooks/useSeasonsQueries';
import ImageUploader from '../../../../../../shared/ImageUploader';
import BoardMembersManager from './BoardMembersManager';
import HighlightsManager from './HighlightsManager';

const SeasonForm = ({ season, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    academicYear: '',
    theme: '',
    description: '',
    badgeColor: '#606161',
    isActive: true,
    order: 0
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    createSeasonMutation,
    updateSeasonMutation,
    uploadCoverImageMutation,
  } = useSeasonsMutations();

  // Populate form data when editing
  useEffect(() => {
    if (season) {
      setFormData({
        academicYear: season.academicYear || '',
        theme: season.theme || '',
        description: season.description || '',
        badgeColor: season.badgeColor || '#606161',
        isActive: season.isActive ?? true,
        order: season.order || 0
      });
      setCoverImagePreview(season.coverImage?.url || '');
    }
  }, [season]);

  // Create preview URL when image is selected
  useEffect(() => {
    if (coverImage) {
      const previewUrl = URL.createObjectURL(coverImage);
      setCoverImagePreview(previewUrl);
      
      // Cleanup URL when component unmounts or image changes
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [coverImage]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.academicYear.trim()) {
      newErrors.academicYear = 'Academic year is required';
    } else if (!/^\d{4}-\d{4}$/.test(formData.academicYear.trim())) {
      newErrors.academicYear = 'Academic year must be in format YYYY-YYYY (e.g., 2023-2024)';
    }

    if (!formData.theme.trim()) {
      newErrors.theme = 'Theme is required';
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
      setActiveTab('basic'); // Switch to basic tab if there are validation errors
      return;
    }

    setIsSubmitting(true);

    try {
      let savedSeason;
      
      if (season) {
        // Updating existing season
        savedSeason = await updateSeasonMutation.mutateAsync({
          id: season._id,
          data: formData
        });
      } else {
        // Creating new season
        savedSeason = await createSeasonMutation.mutateAsync(formData);
      }
      
      // Upload cover image if a new one is selected
      if (coverImage && savedSeason._id) {
        await uploadCoverImageMutation.mutateAsync({
          seasonId: savedSeason._id,
          imageFile: coverImage
        });
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving season:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save season' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const predefinedColors = [
    { name: 'Gray', value: '#606161' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiStar },
    { id: 'members', label: 'Board Members', icon: FiUsers, disabled: !season },
    { id: 'highlights', label: 'Highlights', icon: FiImage, disabled: !season }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {season ? `Edit Season: ${season.academicYear}` : 'Create New Season'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50">
          <div className="flex space-x-8 px-6">
            {tabs.map(({ id, label, icon: Icon, disabled }) => (
              <button
                key={id}
                onClick={() => !disabled && setActiveTab(id)}
                disabled={disabled}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === id
                    ? 'border-[#81C99C] text-[#81C99C]'
                    : disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
                {disabled && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                    Save first
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'basic' && (
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023-2024"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                      errors.academicYear ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.academicYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>
                  )}
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme *
                  </label>
                  <input
                    type="text"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    placeholder="e.g., Innovation & Growth"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                      errors.theme ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.theme && (
                    <p className="mt-1 text-sm text-red-600">{errors.theme}</p>
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
                    placeholder="Describe the key focus and achievements of this season..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <ImageUploader
                    onImageSelect={setCoverImage}
                    maxSize={10 * 1024 * 1024} // 10MB
                    className="w-full"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {coverImagePreview ? (
                        <div className="space-y-4">
                          <img 
                            src={coverImagePreview} 
                            alt="Cover preview" 
                            className="max-h-48 mx-auto rounded-lg shadow-md object-contain"
                          />
                          <div className="text-sm text-gray-600">
                            Click to change image or drag & drop a new one
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setCoverImage(null);
                              setCoverImagePreview('');
                            }}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <FiImage className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Click to upload or drag & drop
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              PNG, JPG, WEBP up to 10MB
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ImageUploader>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a cover image for this season. The image will be displayed with its original aspect ratio.
                  </p>
                </div>

                {/* Badge Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Color
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {predefinedColors.map(({ name, value }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, badgeColor: value }))}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.badgeColor === value
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: value }}
                          title={name}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Custom:</span>
                      <input
                        type="color"
                        value={formData.badgeColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                        className="w-8 h-8 rounded border border-gray-300"
                      />
                      <span className="text-sm text-gray-500 font-mono">
                        {formData.badgeColor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Lower numbers appear first
                    </p>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-[#81C99C] focus:ring-[#81C99C]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active Season
                      </span>
                    </label>
                    <p className="ml-3 text-xs text-gray-500">
                      Show on website
                    </p>
                  </div>
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
                        {season ? 'Update Season' : 'Create Season'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'members' && season && (
            <BoardMembersManager seasonId={season._id} />
          )}

          {activeTab === 'highlights' && season && (
            <HighlightsManager seasonId={season._id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonForm;
