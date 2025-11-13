// frontend/src/components/dashboard/pages/trainings/sections/TrainingHeroManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiUpload, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TrainingHeroManager = () => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    heading: {
      text: 'Expand Your Skills',
      color: '#FFFFFF'
    },
    subheading: {
      text: 'Discover our specialized training programs designed to enhance your personal and professional growth',
      color: '#FFFFFF'
    },
    backgroundImage: {
      url: '',
      public_id: ''
    },
    overlay: {
      enabled: true,
      color: '#000000',
      opacity: 0.5
    },
    cta: {
      enabled: true,
      text: 'View Trainings',
      icon: 'ChevronDown'
    },
    layout: {
      textAlign: 'center',
      verticalAlign: 'center',
      height: '600px'
    },
    isActive: true
  });

  // Fetch existing hero
  const { data: hero, isLoading } = useQuery({
    queryKey: ['training-hero'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE_URL}/api/training-hero/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }
  });

  useEffect(() => {
    if (hero) {
      setFormData(hero);
    }
  }, [hero]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.backgroundImage?.url) {
      alert('Please upload a background image');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${API_BASE_URL}/api/training-hero/admin`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await queryClient.invalidateQueries(['training-hero']);
      alert('Hero section saved successfully!');
    } catch (error) {
      console.error('Error saving hero:', error);
      alert('Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);

      const { data } = await axios.post(
        `${API_BASE_URL}/api/training-hero/admin/background-image`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        backgroundImage: data.backgroundImage
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.response?.data?.message || 'Failed to upload image. Please create hero first by saving the form.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/training-hero/admin/toggle-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
      await queryClient.invalidateQueries(['training-hero']);
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('Failed to toggle active status');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
        <p className="mt-4 text-gray-600">Loading hero section...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training Page Hero Section</h2>
          <p className="text-gray-600 mt-1">Customize the hero section of your trainings page</p>
        </div>
        {hero && (
          <button
            onClick={handleToggleActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              formData.isActive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formData.isActive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image *
          </label>
          
          {formData.backgroundImage?.url ? (
            <div className="relative">
              <img
                src={formData.backgroundImage.url}
                alt="Hero Background"
                className="w-full h-64 object-cover rounded-lg"
              />
              <label className="absolute bottom-4 right-4 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                {uploadingImage ? 'Uploading...' : 'Change Image'}
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FBB859] transition-colors">
              <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload background image</p>
              <p className="text-xs text-gray-500 mt-1">Recommended: 1920x600px</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
          )}
          
          {uploadingImage && (
            <div className="mt-2 text-center text-sm text-gray-600">
              Uploading image...
            </div>
          )}
        </div>

        {/* Heading */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heading Text *
          </label>
          <input
            type="text"
            value={formData.heading?.text || ''}
            onChange={(e) => setFormData({
              ...formData,
              heading: { ...formData.heading, text: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            required
          />
        </div>

        {/* Heading Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heading Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={formData.heading?.color || '#FFFFFF'}
              onChange={(e) => setFormData({
                ...formData,
                heading: { ...formData.heading, color: e.target.value }
              })}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.heading?.color || '#FFFFFF'}
              onChange={(e) => setFormData({
                ...formData,
                heading: { ...formData.heading, color: e.target.value }
              })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Subheading */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subheading Text
          </label>
          <textarea
            value={formData.subheading?.text || ''}
            onChange={(e) => setFormData({
              ...formData,
              subheading: { ...formData.subheading, text: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Subheading Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subheading Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={formData.subheading?.color || '#FFFFFF'}
              onChange={(e) => setFormData({
                ...formData,
                subheading: { ...formData.subheading, color: e.target.value }
              })}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.subheading?.color || '#FFFFFF'}
              onChange={(e) => setFormData({
                ...formData,
                subheading: { ...formData.subheading, color: e.target.value }
              })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Overlay Settings */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overlay Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.overlay?.enabled || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    overlay: { ...formData.overlay, enabled: e.target.checked }
                  })}
                  className="rounded text-[#FBB859] focus:ring-[#FBB859]"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Overlay</span>
              </label>
            </div>

            {formData.overlay?.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={formData.overlay?.color || '#000000'}
                      onChange={(e) => setFormData({
                        ...formData,
                        overlay: { ...formData.overlay, color: e.target.value }
                      })}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.overlay?.color || '#000000'}
                      onChange={(e) => setFormData({
                        ...formData,
                        overlay: { ...formData.overlay, color: e.target.value }
                      })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Opacity: {formData.overlay?.opacity || 0.5}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.overlay?.opacity || 0.5}
                    onChange={(e) => setFormData({
                      ...formData,
                      overlay: { ...formData.overlay, opacity: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Layout Settings */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Layout Settings</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Alignment
              </label>
              <select
                value={formData.layout?.textAlign || 'center'}
                onChange={(e) => setFormData({
                  ...formData,
                  layout: { ...formData.layout, textAlign: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vertical Alignment
              </label>
              <select
                value={formData.layout?.verticalAlign || 'center'}
                onChange={(e) => setFormData({
                  ...formData,
                  layout: { ...formData.layout, verticalAlign: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Height
            </label>
            <input
              type="text"
              value={formData.layout?.height || '600px'}
              onChange={(e) => setFormData({
                ...formData,
                layout: { ...formData.layout, height: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="600px"
            />
          </div>
        </div>

        {/* CTA Settings */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Call to Action</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.cta?.enabled || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    cta: { ...formData.cta, enabled: e.target.checked }
                  })}
                  className="rounded text-[#FBB859] focus:ring-[#FBB859]"
                />
                <span className="ml-2 text-sm text-gray-700">Show CTA Button</span>
              </label>
            </div>

            {formData.cta?.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Text
                </label>
                <input
                  type="text"
                  value={formData.cta?.text || 'View Trainings'}
                  onChange={(e) => setFormData({
                    ...formData,
                    cta: { ...formData.cta, text: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t pt-6 mt-6 flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              saving
                ? 'bg-gray-100 text-gray-500 cursor-wait'
                : 'bg-[#FBB859] text-white hover:bg-[#e9a748]'
            }`}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave size={20} />
                <span>Save Hero Section</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingHeroManager;
