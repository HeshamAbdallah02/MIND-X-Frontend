// frontend/src/components/dashboard/pages/events/sections/EventForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { FiSave, FiX, FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ImageUploadField from './ImageUploadField';
import {
  SpeakersSection,
  ScheduleSection,
  GallerySection,
  RegistrationSection,
  TestimonialsSection
} from './EventFormSections';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EventForm = ({ event, onCancel, onSaved }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    visibility: true,
    overview: false,
    speakers: false,
    schedule: false,
    gallery: false,
    registration: false,
    testimonials: false
  });

  // Section visibility toggles
  const [sectionVisibility, setSectionVisibility] = useState({
    showOverview: true,
    showSpeakers: true,
    showSchedule: true,
    showGallery: true,
    showRegister: true, // For upcoming events
    showTestimonials: true // For past events
  });

  const [formData, setFormData] = useState({
    // Basic Info
    title: { text: '', color: '#606161' },
    description: { text: '', color: '#606161' },
    date: { text: '', color: '#FBB859' },
    eventDate: '',
    eventTime: { start: '', end: '' },
    location: { venue: '', address: '' },
    
    // Registration & Pricing
    registrationLink: '',
    attendeeCount: 0,
    maxAttendees: null,
    category: '',
    tags: [],
    price: { regular: 0, student: 0, currency: '$' },
    
    // Event Details
    highlights: [],
    
    // Speakers
    speakers: [],
    speakersHeadline: '',
    
    // Schedule
    schedule: [],
    scheduleHeadline: '',
    
    // Gallery Albums
    galleryAlbums: [],
    galleryHeadline: '',
    
    // Registration (for upcoming events)
    registration: {
      headline: '',
      description: '',
      buttonText: 'Register Now',
      isFree: true,
      benefits: [],
      deadline: '',
      spots: { available: 0, total: 0 }
    },
    
    // Testimonials (for past events)
    testimonials: [],
    testimonialsHeadline: '',
    
    // Media
    coverImage: { url: '', alt: '' },
    heroImage: { url: '', alt: '' },
    
    // Additional
    contentAreaColor: '#81C99C',
    url: '',
    order: 0,
    active: true
  });

  // Load event data if editing
  useEffect(() => {
    if (event) {
      const loadedData = {
        title: event.title || { text: '', color: '#606161' },
        description: event.description || { text: '', color: '#606161' },
        date: event.date || { text: '', color: '#FBB859' },
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
        eventTime: event.eventTime || { start: '', end: '' },
        location: event.location || { venue: '', address: '' },
        registrationLink: event.registrationLink || '',
        attendeeCount: event.attendeeCount || 0,
        maxAttendees: event.maxAttendees || null,
        category: event.category || '',
        tags: event.tags || [],
        price: event.price || { regular: 0, student: 0, currency: '$' },
        highlights: event.highlights || [],
        speakers: event.speakers || [],
        speakersHeadline: event.speakersHeadline || '',
        schedule: event.schedule || [],
        scheduleHeadline: event.scheduleHeadline || '',
        galleryAlbums: event.galleryAlbums || [],
        galleryHeadline: event.galleryHeadline || '',
        registration: event.registration || {
          headline: '',
          description: '',
          buttonText: 'Register Now',
          isFree: true,
          benefits: [],
          deadline: '',
          spots: { available: 0, total: 0 }
        },
        testimonials: event.testimonials || [],
        testimonialsHeadline: event.testimonialsHeadline || '',
        coverImage: event.coverImage || { url: '', alt: '' },
        heroImage: event.heroImage || { url: '', alt: '' },
        contentAreaColor: event.contentAreaColor || '#81C99C',
        url: event.url || '',
        order: event.order || 0,
        active: event.active !== undefined ? event.active : true
      };

      setFormData(loadedData);
      setInitialData(loadedData);

      // Load section visibility (check if sections have content)
      const visibilityData = {
        showOverview: true,
        showSpeakers: (event.speakers && event.speakers.length > 0) || true,
        showSchedule: (event.schedule && event.schedule.length > 0) || true,
        showGallery: (event.galleryAlbums && event.galleryAlbums.length > 0) || true,
        showRegister: true,
        showTestimonials: (event.testimonials && event.testimonials.length > 0) || true
      };
      setSectionVisibility(visibilityData);
    } else {
      // For new events, set hasChanges to false initially
      setHasChanges(false);
    }
  }, [event]);

  // Track changes - compare current data with initial data
  useEffect(() => {
    if (event && initialData) {
      // For edit mode, compare with initial data
      const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
      setHasChanges(hasFormChanges);
    } else if (!event) {
      // For create mode, check if any required fields are filled
      const hasRequiredData = 
        formData.title.text.trim() !== '' ||
        formData.description.text.trim() !== '' ||
        formData.coverImage.url.trim() !== '';
      setHasChanges(hasRequiredData);
    }
  }, [formData, initialData, event]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSectionVisibility = (section) => {
    setSectionVisibility(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Prepare data with section visibility flags
      const submitData = {
        ...formData,
        sectionVisibility,
        eventDate: new Date(formData.eventDate)
      };

      if (event?._id) {
        // Update existing event
        await axios.put(`${API_BASE_URL}/api/page-events/${event._id}`, submitData, config);
      } else {
        // Create new event
        await axios.post(`${API_BASE_URL}/api/page-events`, submitData, config);
      }

      queryClient.invalidateQueries(['dashboard-events']);
      alert(event ? 'Event updated successfully!' : 'Event created successfully!');
      onSaved();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for array fields
  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const updateHighlight = (index, value) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }));
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    const tag = prompt('Enter tag name:');
    if (tag) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {event ? 'Edit Event' : 'Create New Event'}
        </h2>
        <p className="text-gray-600">
          Fill in the event details below. Required fields are marked with *
        </p>
      </div>

      {/* Basic Information */}
      <SectionCard
        title="Basic Information *"
        expanded={expandedSections.basic}
        onToggle={() => toggleSection('basic')}
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title.text}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                title: { ...prev.title, text: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="e.g., MIND-X Annual Innovation Conference 2025"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Description *
            </label>
            <textarea
              value={formData.description.text}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: { ...prev.description, text: e.target.value }
              }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="Provide a detailed description of the event..."
              required
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Display Text *
              </label>
              <input
                type="text"
                value={formData.date.text}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  date: { ...prev.date, text: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="e.g., December 15-17, 2025"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date (for filtering) *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="text"
                value={formData.eventTime.start}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  eventTime: { ...prev.eventTime, start: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="e.g., 9:00 AM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="text"
                value={formData.eventTime.end}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  eventTime: { ...prev.eventTime, end: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="e.g., 5:00 PM"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                value={formData.location.venue}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, venue: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="e.g., University Conference Center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="e.g., Main Campus, Building A"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Competition">Competition</option>
                <option value="Networking">Networking</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#FBB859]/10 text-[#FBB859] rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-red-600"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addTag}
                className="text-sm text-[#FBB859] hover:text-[#FBB859]/80 flex items-center gap-1"
              >
                <FiPlus size={16} />
                Add Tag
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regular Price
              </label>
              <input
                type="number"
                value={formData.price.regular}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  price: { ...prev.price, regular: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Price
              </label>
              <input
                type="number"
                value={formData.price.student}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  price: { ...prev.price, student: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.price.currency}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  price: { ...prev.price, currency: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              >
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
                <option value="EGP">EGP</option>
              </select>
            </div>
          </div>

          {/* Attendance */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Attendees
              </label>
              <input
                type="number"
                value={formData.attendeeCount}
                onChange={(e) => setFormData(prev => ({ ...prev, attendeeCount: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                value={formData.maxAttendees || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || null }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="Unlimited"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Link
              </label>
              <input
                type="url"
                value={formData.registrationLink}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Highlights
            </label>
            <div className="space-y-2 mb-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="e.g., 20+ Industry Expert Speakers"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addHighlight}
              className="text-sm text-[#FBB859] hover:text-[#FBB859]/80 flex items-center gap-1"
            >
              <FiPlus size={16} />
              Add Highlight
            </button>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField
              label="Cover Image"
              value={formData.coverImage.url}
              onChange={(url) => setFormData(prev => ({
                ...prev,
                coverImage: { ...prev.coverImage, url }
              }))}
              required
            />
            
            <ImageUploadField
              label="Hero Image"
              value={formData.heroImage.url}
              onChange={(url) => setFormData(prev => ({
                ...prev,
                heroImage: { ...prev.heroImage, url }
              }))}
            />
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Area Color
              </label>
              <input
                type="color"
                value={formData.contentAreaColor}
                onChange={(e) => setFormData(prev => ({ ...prev, contentAreaColor: e.target.value }))}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 pt-7">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-[#FBB859] rounded focus:ring-[#FBB859]"
                />
                <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
              </label>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Overview Section (Highlights) */}
      <SectionCard
        title="Overview Section"
        expanded={expandedSections.overview}
        onToggle={() => toggleSection('overview')}
        showVisibility={true}
        visibilityChecked={sectionVisibility.showOverview}
        onVisibilityToggle={() => toggleSectionVisibility('showOverview')}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Highlights that appear in the Overview section
          </p>
          <div className="space-y-2 mb-2">
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => updateHighlight(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="e.g., 20+ Industry Expert Speakers"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addHighlight}
            className="text-sm text-[#FBB859] hover:text-[#FBB859]/80 flex items-center gap-1"
          >
            <FiPlus size={16} />
            Add Highlight
          </button>
        </div>
      </SectionCard>

      {/* Speakers Section */}
      <SpeakersSection
        formData={formData}
        setFormData={setFormData}
        SectionCard={SectionCard}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        sectionVisibility={sectionVisibility}
        toggleSectionVisibility={toggleSectionVisibility}
      />

      {/* Schedule Section */}
      <ScheduleSection
        formData={formData}
        setFormData={setFormData}
        SectionCard={SectionCard}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        sectionVisibility={sectionVisibility}
        toggleSectionVisibility={toggleSectionVisibility}
      />

      {/* Gallery Section */}
      <GallerySection
        formData={formData}
        setFormData={setFormData}
        SectionCard={SectionCard}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        sectionVisibility={sectionVisibility}
        toggleSectionVisibility={toggleSectionVisibility}
      />

      {/* Registration Section */}
      <RegistrationSection
        formData={formData}
        setFormData={setFormData}
        SectionCard={SectionCard}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        sectionVisibility={sectionVisibility}
        toggleSectionVisibility={toggleSectionVisibility}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        formData={formData}
        setFormData={setFormData}
        SectionCard={SectionCard}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        sectionVisibility={sectionVisibility}
        toggleSectionVisibility={toggleSectionVisibility}
      />

      {/* Form Actions (Sticky Footer) */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 mt-6 -mx-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <FiX size={18} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !hasChanges}
          className="px-8 py-3 bg-[#FBB859] hover:bg-[#FBB859]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FiSave size={18} />
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

// Section Card Component
const SectionCard = ({ title, children, expanded, onToggle, showVisibility, visibilityChecked, onVisibilityToggle }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
        {showVisibility && (
          <label 
            className="ml-4 flex items-center gap-2 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={visibilityChecked}
              onChange={onVisibilityToggle}
              className="w-4 h-4 text-[#FBB859] rounded focus:ring-[#FBB859]"
            />
            <span className="text-sm text-gray-600">Show on page</span>
          </label>
        )}
      </div>
      {expanded && (
        <div className="px-6 py-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default EventForm;
