// frontend/src/components/dashboard/pages/trainings/sections/TrainingBuilder.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { FiX, FiUpload, FiTrash2, FiPlus, FiSave } from 'react-icons/fi';
import { API_BASE_URL } from '../../../../../config/api';

const TrainingBuilder = ({ training, onCancel, onSaved }) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, details, instructors, media, pricing

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    startDate: '',
    endDate: '',
    displayDate: '',
    duration: '',
    schedule: '',
    location: {
      venue: '',
      address: '',
      city: '',
      isOnline: false,
      onlineLink: ''
    },
    registration: {
      isOpen: true,
      deadline: '',
      formLink: '',
      externalLink: '',
      spots: {
        total: 0,
        available: 0,
        registered: 0
      }
    },
    pricing: {
      isFree: true,
      regular: 0,
      student: 0,
      earlyBird: {
        amount: 0,
        deadline: ''
      },
      currency: 'EGP'
    },
    topics: [],
    objectives: [],
    prerequisites: [],
    targetAudience: '',
    instructors: [],
    coverImage: { url: '', public_id: '' },
    galleryImages: [],
    category: 'General',
    tags: [],
    level: 'All Levels',
    certificate: {
      isProvided: false,
      type: '',
      requirements: ''
    },
    materials: {
      isProvided: false,
      description: ''
    },
    status: 'upcoming',
    isPublished: false,
    isFeatured: false,
    contactInfo: {
      email: '',
      phone: '',
      whatsapp: ''
    }
  });

  const [newTopic, setNewTopic] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    title: '',
    bio: '',
    linkedin: '',
    website: ''
  });

  useEffect(() => {
    if (training) {
      setFormData({
        ...training,
        startDate: training.startDate ? new Date(training.startDate).toISOString().split('T')[0] : '',
        endDate: training.endDate ? new Date(training.endDate).toISOString().split('T')[0] : '',
        registration: {
          ...training.registration,
          deadline: training.registration?.deadline
            ? new Date(training.registration.deadline).toISOString().split('T')[0]
            : ''
        },
        pricing: {
          ...training.pricing,
          earlyBird: {
            ...training.pricing?.earlyBird,
            deadline: training.pricing?.earlyBird?.deadline
              ? new Date(training.pricing.earlyBird.deadline).toISOString().split('T')[0]
              : ''
          }
        }
      });
    }
  }, [training]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate || !formData.endDate || !formData.displayDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.coverImage?.url) {
      alert('Please upload a cover image');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      if (training?._id) {
        // Update existing training
        await axios.put(
          `${API_BASE_URL}/api/trainings/admin/${training._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new training
        await axios.post(
          `${API_BASE_URL}/api/trainings/admin`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await queryClient.invalidateQueries(['dashboard-trainings']);
      onSaved();
    } catch (error) {
      console.error('Error saving training:', error);
      alert(error.response?.data?.message || 'Failed to save training');
    } finally {
      setSaving(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!training?._id) {
      alert('Please save the training first before uploading images');
      return;
    }

    setUploadingCover(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);

      const { data } = await axios.post(
        `${API_BASE_URL}/api/trainings/admin/${training._id}/cover-image`,
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
        coverImage: data.coverImage
      }));
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const addToList = (field, value, setterFunc) => {
    if (!value.trim()) return;

    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setterFunc('');
  };

  const removeFromList = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addInstructor = () => {
    if (!newInstructor.name.trim()) {
      alert('Instructor name is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      instructors: [...(prev.instructors || []), { ...newInstructor }]
    }));

    setNewInstructor({
      name: '',
      title: '',
      bio: '',
      linkedin: '',
      website: ''
    });
  };

  const removeInstructor = (index) => {
    setFormData(prev => ({
      ...prev,
      instructors: prev.instructors.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {training ? 'Edit Training' : 'Create New Training'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'details', label: 'Details' },
            { id: 'instructors', label: 'Instructors' },
            { id: 'media', label: 'Media' },
            { id: 'pricing', label: 'Pricing & Registration' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-[#FBB859] text-[#FBB859]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 max-h-[calc(100vh-20rem)] overflow-y-auto">

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  rows={2}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.shortDescription?.length || 0}/300 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Date * (e.g., "December 15-17, 2025")
                </label>
                <input
                  type="text"
                  value={formData.displayDate}
                  onChange={(e) => setFormData({ ...formData, displayDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="December 15-17, 2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (e.g., "3 Days")
                  </label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="3 Days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule (e.g., "9:00 AM - 5:00 PM")
                  </label>
                  <input
                    type="text"
                    value={formData.schedule || ''}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="9:00 AM - 5:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.location?.isOnline || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, isOnline: e.target.checked }
                      })}
                      className="rounded text-[#FBB859] focus:ring-[#FBB859]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Online Training</span>
                  </label>
                </div>

                {formData.location?.isOnline ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Online Meeting Link
                    </label>
                    <input
                      type="url"
                      value={formData.location?.onlineLink || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, onlineLink: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      placeholder="https://zoom.us/..."
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={formData.location?.venue || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, venue: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.location?.address || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, address: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.location?.city || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Topics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topics Covered
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('topics', newTopic, setNewTopic);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="Add a topic"
                  />
                  <button
                    type="button"
                    onClick={() => addToList('topics', newTopic, setNewTopic)}
                    className="px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.topics?.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1 text-sm">{topic}</span>
                      <button
                        type="button"
                        onClick={() => removeFromList('topics', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('objectives', newObjective, setNewObjective);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="Add an objective"
                  />
                  <button
                    type="button"
                    onClick={() => addToList('objectives', newObjective, setNewObjective)}
                    className="px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.objectives?.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1 text-sm">{objective}</span>
                      <button
                        type="button"
                        onClick={() => removeFromList('objectives', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisites
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('prerequisites', newPrerequisite, setNewPrerequisite);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="Add a prerequisite"
                  />
                  <button
                    type="button"
                    onClick={() => addToList('prerequisites', newPrerequisite, setNewPrerequisite)}
                    className="px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.prerequisites?.map((prerequisite, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1 text-sm">{prerequisite}</span>
                      <button
                        type="button"
                        onClick={() => removeFromList('prerequisites', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <textarea
                  value={formData.targetAudience || ''}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  rows={3}
                  placeholder="Who is this training for?"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('tags', newTag, setNewTag);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={() => addToList('tags', newTag, setNewTag)}
                    className="px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeFromList('tags', index)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certificate */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate</h3>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certificate?.isProvided || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        certificate: { ...formData.certificate, isProvided: e.target.checked }
                      })}
                      className="rounded text-[#FBB859] focus:ring-[#FBB859]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Certificate Provided</span>
                  </label>
                </div>

                {formData.certificate?.isProvided && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certificate Type
                      </label>
                      <input
                        type="text"
                        value={formData.certificate?.type || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          certificate: { ...formData.certificate, type: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        placeholder="e.g., Certificate of Completion"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements
                      </label>
                      <textarea
                        value={formData.certificate?.requirements || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          certificate: { ...formData.certificate, requirements: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        rows={2}
                        placeholder="What's required to get the certificate?"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Materials */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Training Materials</h3>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.materials?.isProvided || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        materials: { ...formData.materials, isProvided: e.target.checked }
                      })}
                      className="rounded text-[#FBB859] focus:ring-[#FBB859]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Materials Provided</span>
                  </label>
                </div>

                {formData.materials?.isProvided && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Materials Description
                    </label>
                    <textarea
                      value={formData.materials?.description || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        materials: { ...formData.materials, description: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      rows={3}
                      placeholder="What materials will participants receive?"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructors Tab */}
          {activeTab === 'instructors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Instructor</h3>
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newInstructor.name}
                      onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newInstructor.title}
                      onChange={(e) => setNewInstructor({ ...newInstructor, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={newInstructor.bio}
                      onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={newInstructor.linkedin}
                        onChange={(e) => setNewInstructor({ ...newInstructor, linkedin: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={newInstructor.website}
                        onChange={(e) => setNewInstructor({ ...newInstructor, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addInstructor}
                    className="w-full px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPlus size={20} />
                    <span>Add Instructor</span>
                  </button>
                </div>
              </div>

              {/* Instructors List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Instructors ({formData.instructors?.length || 0})
                </h3>
                <div className="space-y-4">
                  {formData.instructors?.map((instructor, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{instructor.name}</h4>
                          {instructor.title && (
                            <p className="text-sm text-gray-600">{instructor.title}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInstructor(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      {instructor.bio && (
                        <p className="text-sm text-gray-600 mt-2">{instructor.bio}</p>
                      )}
                      {(instructor.linkedin || instructor.website) && (
                        <div className="flex gap-4 mt-2">
                          {instructor.linkedin && (
                            <a
                              href={instructor.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#FBB859] hover:underline"
                            >
                              LinkedIn
                            </a>
                          )}
                          {instructor.website && (
                            <a
                              href={instructor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#FBB859] hover:underline"
                            >
                              Website
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image * {!training && <span className="text-gray-500 text-xs">(Save training first)</span>}
                </label>

                {formData.coverImage?.url ? (
                  <div className="relative">
                    <img
                      src={formData.coverImage.url}
                      alt="Cover"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {training && (
                      <label className="absolute bottom-4 right-4 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                          disabled={uploadingCover}
                        />
                        {uploadingCover ? 'Uploading...' : 'Change Image'}
                      </label>
                    )}
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg ${training ? 'cursor-pointer hover:border-[#FBB859]' : 'cursor-not-allowed'} transition-colors`}>
                    <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {training ? 'Click to upload cover image' : 'Save training first to upload'}
                    </p>
                    {training && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                        disabled={uploadingCover}
                      />
                    )}
                  </label>
                )}

                {uploadingCover && (
                  <div className="mt-2 text-center text-sm text-gray-600">
                    Uploading image...
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                Note: Gallery images and instructor avatars can be uploaded after creating the training.
              </p>
            </div>
          )}

          {/* Pricing & Registration Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              {/* Pricing */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.pricing?.isFree || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        pricing: { ...formData.pricing, isFree: e.target.checked }
                      })}
                      className="rounded text-[#FBB859] focus:ring-[#FBB859]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Free Training</span>
                  </label>
                </div>

                {!formData.pricing?.isFree && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <input
                          type="text"
                          value={formData.pricing?.currency || 'EGP'}
                          onChange={(e) => setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, currency: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Regular Price
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.regular || 0}
                          onChange={(e) => setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, regular: parseFloat(e.target.value) || 0 }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student Price
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.student || 0}
                          onChange={(e) => setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, student: parseFloat(e.target.value) || 0 }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Early Bird Price
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.earlyBird?.amount || 0}
                          onChange={(e) => setFormData({
                            ...formData,
                            pricing: {
                              ...formData.pricing,
                              earlyBird: {
                                ...formData.pricing?.earlyBird,
                                amount: parseFloat(e.target.value) || 0
                              }
                            }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Early Bird Deadline
                        </label>
                        <input
                          type="date"
                          value={formData.pricing?.earlyBird?.deadline || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            pricing: {
                              ...formData.pricing,
                              earlyBird: {
                                ...formData.pricing?.earlyBird,
                                deadline: e.target.value
                              }
                            }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Registration</h3>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.registration?.isOpen || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        registration: { ...formData.registration, isOpen: e.target.checked }
                      })}
                      className="rounded text-[#FBB859] focus:ring-[#FBB859]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Registration Open</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.registration?.deadline || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        registration: { ...formData.registration, deadline: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Spots
                      </label>
                      <input
                        type="number"
                        value={formData.registration?.spots?.total || 0}
                        onChange={(e) => {
                          const total = parseInt(e.target.value) || 0;
                          const registered = formData.registration?.spots?.registered || 0;
                          setFormData({
                            ...formData,
                            registration: {
                              ...formData.registration,
                              spots: {
                                ...formData.registration?.spots,
                                total,
                                available: total - registered,
                                registered
                              }
                            }
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registered
                      </label>
                      <input
                        type="number"
                        value={formData.registration?.spots?.registered || 0}
                        onChange={(e) => {
                          const registered = parseInt(e.target.value) || 0;
                          const total = formData.registration?.spots?.total || 0;
                          setFormData({
                            ...formData,
                            registration: {
                              ...formData.registration,
                              spots: {
                                ...formData.registration?.spots,
                                registered,
                                available: total - registered
                              }
                            }
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available
                      </label>
                      <input
                        type="number"
                        value={formData.registration?.spots?.available || 0}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Form Link (slug)
                    </label>
                    <input
                      type="text"
                      value={formData.registration?.formLink || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        registration: { ...formData.registration, formLink: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      placeholder="training-registration-2025"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the slug of your internal form (e.g., "training-registration-2025")
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      External Registration Link
                    </label>
                    <input
                      type="url"
                      value={formData.registration?.externalLink || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        registration: { ...formData.registration, externalLink: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      placeholder="https://forms.google.com/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Or provide an external registration link (e.g., Google Forms)
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactInfo?.email || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactInfo: { ...formData.contactInfo, email: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.contactInfo?.phone || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, phone: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.contactInfo?.whatsapp || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, whatsapp: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Save Button */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${saving
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
                <span>{training ? 'Update Training' : 'Create Training'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingBuilder;
