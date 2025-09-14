// frontend/src/components/admin/CTAForm.js
import React, { useState, useEffect } from 'react';

const CTAForm = ({ initialData, onSubmit, isLoading, hideActiveToggle = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: '',
    buttonUrl: '',
    backgroundColor: '#3B82F6',
    isActive: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        buttonText: initialData.buttonText || '',
        buttonUrl: initialData.buttonUrl || '',
        backgroundColor: initialData.backgroundColor || '#3B82F6',
        isActive: initialData.isActive || false
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.buttonText.trim()) {
      newErrors.buttonText = 'Button text is required';
    }

    if (!formData.buttonUrl.trim()) {
      newErrors.buttonUrl = 'Button URL is required';
    } else {
      // Basic URL validation
      try {
        new URL(formData.buttonUrl);
      } catch {
        newErrors.buttonUrl = 'Please enter a valid URL';
      }
    }

    if (!formData.backgroundColor.trim()) {
      newErrors.backgroundColor = 'Background color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const colorPresets = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#059669' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Pink', value: '#DB2777' },
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Teal', value: '#0D9488' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter CTA title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter CTA description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">
            Button Text *
          </label>
          <input
            type="text"
            id="buttonText"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.buttonText ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Join Now, Learn More"
          />
          {errors.buttonText && (
            <p className="mt-1 text-sm text-red-600">{errors.buttonText}</p>
          )}
        </div>

        <div>
          <label htmlFor="buttonUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Button URL *
          </label>
          <input
            type="url"
            id="buttonUrl"
            name="buttonUrl"
            value={formData.buttonUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.buttonUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com"
          />
          {errors.buttonUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.buttonUrl}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
          Background Color *
        </label>
        
        <div className="space-y-3">
          {/* Color presets */}
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, backgroundColor: color.value }))}
                className={`w-8 h-8 rounded border-2 ${
                  formData.backgroundColor === color.value 
                    ? 'border-gray-800' 
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          
          {/* Custom color input */}
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="backgroundColor"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.backgroundColor}
              onChange={handleChange}
              name="backgroundColor"
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.backgroundColor ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="#3B82F6"
            />
          </div>
        </div>
        
        {errors.backgroundColor && (
          <p className="mt-1 text-sm text-red-600">{errors.backgroundColor}</p>
        )}
      </div>

      {!hideActiveToggle && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
            Set as active CTA (will deactivate all other CTAs)
          </label>
        </div>
      )}

      {/* Preview */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
        <div 
          className="p-6 rounded-lg text-white"
          style={{ backgroundColor: formData.backgroundColor }}
        >
          <h4 className="text-2xl font-bold mb-2">
            {formData.title || 'Your Title Here'}
          </h4>
          <p className="mb-4 opacity-90">
            {formData.description || 'Your description will appear here...'}
          </p>
          <button 
            type="button"
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            style={{ color: formData.backgroundColor }}
          >
            {formData.buttonText || 'Button Text'}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update CTA' : 'Create CTA')}
        </button>
      </div>
    </form>
  );
};

export default CTAForm;
