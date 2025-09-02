//frontend/src/components/dashboard/pages/our-story/sections/journey/JourneyPhaseForm.js
import React, { useState, useEffect } from 'react';

const JourneyPhaseForm = ({ phase, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    year: '',
    headline: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    accentColor: '#81C99C',
    position: 'auto',
    isActive: true,
    expandable: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (phase) {
      setFormData({
        year: phase.year || '',
        headline: phase.headline || '',
        description: phase.description || '',
        imageUrl: phase.imageUrl || phase.image?.url || '',
        imageAlt: phase.imageAlt || '',
        backgroundColor: phase.backgroundColor || '#ffffff',
        textColor: phase.textColor || '#1e293b',
        accentColor: phase.accentColor || '#81C99C',
        position: phase.position || 'auto',
        isActive: phase.isActive !== false,
        expandable: phase.expandable || false
      });
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
              <input
                type="text"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                  errors.year ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 2024"
              />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
              >
                <option value="auto">Auto</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
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

          {/* Image Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                value={formData.imageAlt}
                onChange={(e) => handleChange('imageAlt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
                placeholder="Describe the image"
              />
            </div>
          </div>

          {/* Color Customization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
                  placeholder="#1e293b"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
                  placeholder="#81C99C"
                />
              </div>
            </div>
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

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.expandable}
                onChange={(e) => handleChange('expandable', e.target.checked)}
                className="rounded border-gray-300 text-[#81C99C] focus:ring-[#81C99C]"
              />
              <span className="ml-2 text-sm text-gray-700">Expandable</span>
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
