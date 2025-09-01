// frontend/src/components/dashboard/pages/our-story/sections/awards/components/AwardForm.js
import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaStar, FaHeart, FaCertificate, FaCrown, FaTimes } from 'react-icons/fa';

const iconOptions = [
  { value: 'trophy', label: 'Trophy', Icon: FaTrophy },
  { value: 'medal', label: 'Medal', Icon: FaMedal },
  { value: 'star', label: 'Star', Icon: FaStar },
  { value: 'heart', label: 'Heart', Icon: FaHeart },
  { value: 'certificate', label: 'Certificate', Icon: FaCertificate },
  { value: 'crown', label: 'Crown', Icon: FaCrown },
];

const typeOptions = [
  { value: 'gold', label: 'Gold', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'silver', label: 'Silver', color: 'bg-gray-100 text-gray-800' },
  { value: 'bronze', label: 'Bronze', color: 'bg-orange-100 text-orange-800' },
  { value: 'special', label: 'Special', color: 'bg-purple-100 text-purple-800' },
  { value: 'achievement', label: 'Achievement', color: 'bg-blue-100 text-blue-800' },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

const AwardForm = ({ award, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: currentYear,
    iconType: 'trophy',
    type: 'achievement',
    organization: '',
    state: '',
    stateColor: '#3B82F6',
    isVisible: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (award) {
      setFormData({
        title: award.title || '',
        description: award.description || '',
        year: award.year || currentYear,
        iconType: award.iconType || 'trophy',
        type: award.type || 'achievement',
        organization: award.organization || '',
        state: award.state || '',
        stateColor: award.stateColor || '#3B82F6',
        isVisible: award.isVisible !== undefined ? award.isVisible : true,
      });
    }
  }, [award]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.year || formData.year < 1900 || formData.year > currentYear + 5) {
      newErrors.year = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
    };

    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {award ? 'Edit Award' : 'Create New Award'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Award Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter award title..."
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the award and its significance..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Awarding organization..."
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State (Optional)
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., 2nd Place, Winner, Participated, Achieved..."
              />
            </div>

            {/* State Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.stateColor}
                  onChange={(e) => handleChange('stateColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.stateColor}
                  onChange={(e) => handleChange('stateColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="#3B82F6"
                />
                {formData.state && (
                  <div className="flex items-center">
                    <span 
                      className="px-3 py-1 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: formData.stateColor }}
                    >
                      {formData.state}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.year ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.year && (
                <p className="text-red-600 text-sm mt-1">{errors.year}</p>
              )}
            </div>

            {/* Icon Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {iconOptions.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange('iconType', value)}
                    className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                      formData.iconType === value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Award Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Award Type
              </label>
              <div className="space-y-2">
                {typeOptions.map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange('type', value)}
                    className={`w-full text-left px-3 py-2 border rounded-lg transition-colors ${
                      formData.type === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${color}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => handleChange('isVisible', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Visible on website
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Uncheck to hide this award from the public website
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {award ? 'Update Award' : 'Create Award'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AwardForm;
