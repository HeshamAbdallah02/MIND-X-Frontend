// frontend/src/components/dashboard/pages/trainings/sections/TrainingCTAManager.js
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TrainingCTAManager = () => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: '',
    formLink: '',
    backgroundColor: '#FBB859',
    textColor: '#FFFFFF',
    isActive: true
  });

  // Fetch CTA data
  const { data: cta, isLoading } = useQuery({
    queryKey: ['dashboard-training-cta'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE_URL}/api/training-cta/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }
  });

  // Fetch forms for dropdown
  const { data: forms = [] } = useQuery({
    queryKey: ['dashboard-forms-list'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE_URL}/api/forms/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }
  });

  useEffect(() => {
    if (cta) {
      setFormData({
        title: cta.title || '',
        description: cta.description || '',
        buttonText: cta.buttonText || '',
        formLink: cta.formLink || '',
        backgroundColor: cta.backgroundColor || '#FBB859',
        textColor: cta.textColor || '#FFFFFF',
        isActive: cta.isActive !== undefined ? cta.isActive : true
      });
    }
  }, [cta]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form link
    if (!formData.formLink || formData.formLink.trim() === '') {
      alert('Please select a form or enter a form link');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/training-cta/admin`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await queryClient.invalidateQueries(['dashboard-training-cta']);
      await queryClient.invalidateQueries(['training-cta-public']);
      alert('CTA updated successfully!');
    } catch (error) {
      console.error('Error updating CTA:', error);
      alert('Failed to update CTA');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/training-cta/admin/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await queryClient.invalidateQueries(['dashboard-training-cta']);
      await queryClient.invalidateQueries(['training-cta-public']);
    } catch (error) {
      console.error('Error toggling CTA:', error);
      alert('Failed to toggle CTA status');
    }
  };

  const handleFormSelect = (e) => {
    const selectedForm = forms.find(f => f._id === e.target.value);
    if (selectedForm) {
      // Construct the form link
      const formLink = `${window.location.origin}/forms/${selectedForm.slug}`;
      setFormData(prev => ({ ...prev, formLink }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Volunteer CTA Section</h2>
            <p className="text-gray-600 mt-1">Encourage visitors to become trainers</p>
          </div>
          <button
            onClick={handleToggleActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              formData.isActive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formData.isActive ? <FiEye /> : <FiEyeOff />}
            {formData.isActive ? 'Active' : 'Inactive'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              required
              placeholder="Volunteer with us as a trainer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              required
              placeholder="Share your knowledge and expertise with our community..."
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text *
            </label>
            <input
              type="text"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              required
              placeholder="Apply Now"
            />
          </div>

          {/* Form Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Form *
            </label>
            <select
              onChange={handleFormSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            >
              <option value="">Choose a form...</option>
              {forms.filter(f => f.isPublished).map(form => (
                <option key={form._id} value={form._id}>
                  {form.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select a form from the Forms Creator, or enter a custom URL below
            </p>
          </div>

          {/* Form Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Link *
            </label>
            <input
              type="url"
              value={formData.formLink}
              onChange={(e) => setFormData({ ...formData, formLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              required
              placeholder="https://example.com/volunteer-form"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="#FBB859"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div 
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: formData.backgroundColor }}
            >
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ color: formData.textColor }}
              >
                {formData.title || 'Title'}
              </h3>
              <p 
                className="mb-4 opacity-90"
                style={{ color: formData.textColor }}
              >
                {formData.description || 'Description'}
              </p>
              <button
                type="button"
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-lg"
              >
                {formData.buttonText || 'Button Text'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#FBB859] hover:bg-[#e9a748]'
            }`}
          >
            <FiSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainingCTAManager;
