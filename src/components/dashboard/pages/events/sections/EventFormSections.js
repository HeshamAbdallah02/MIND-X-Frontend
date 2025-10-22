// frontend/src/components/dashboard/pages/events/sections/EventFormSections.js
import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import ImageUploadField from './ImageUploadField';

// Speakers Section Component
export const SpeakersSection = ({ formData, setFormData, SectionCard, expandedSections, toggleSection, sectionVisibility, toggleSectionVisibility }) => {
  const addSpeaker = () => {
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, {
        name: '',
        position: '',
        bio: '',
        image: { url: '', alt: '' },
        linkedin: ''
      }]
    }));
  };

  const updateSpeaker = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map((speaker, i) =>
        i === index
          ? field === 'image'
            ? { ...speaker, image: { ...speaker.image, ...value } }
            : { ...speaker, [field]: value }
          : speaker
      )
    }));
  };

  const removeSpeaker = (index) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  return (
    <SectionCard
      title="Speakers"
      expanded={expandedSections.speakers}
      onToggle={() => toggleSection('speakers')}
      showVisibility={true}
      visibilityChecked={sectionVisibility.showSpeakers}
      onVisibilityToggle={() => toggleSectionVisibility('showSpeakers')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Headline
          </label>
          <input
            type="text"
            value={formData.speakersHeadline}
            onChange={(e) => setFormData(prev => ({ ...prev, speakersHeadline: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            placeholder="e.g., Meet Our Expert Speakers"
          />
        </div>

        <div className="space-y-4">
          {formData.speakers.map((speaker, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Speaker {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSpeaker(index)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={speaker.name}
                  onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={speaker.position}
                  onChange={(e) => updateSpeaker(index, 'position', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Position/Title"
                />
              </div>

              <textarea
                value={speaker.bio}
                onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="Bio"
              />

              <div className="grid grid-cols-2 gap-3">
                <ImageUploadField
                  label="Speaker Photo"
                  value={speaker.image.url}
                  onChange={(url) => updateSpeaker(index, 'image', { url })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={speaker.linkedin}
                    onChange={(e) => updateSpeaker(index, 'linkedin', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSpeaker}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-[#FBB859] hover:border-[#FBB859] hover:bg-[#FBB859]/5 transition-colors flex items-center justify-center gap-2"
        >
          <FiPlus size={18} />
          Add Speaker
        </button>
      </div>
    </SectionCard>
  );
};

// Schedule Section Component
export const ScheduleSection = ({ formData, setFormData, SectionCard, expandedSections, toggleSection, sectionVisibility, toggleSectionVisibility }) => {
  const addScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, {
        time: '',
        title: '',
        type: '',
        description: '',
        speaker: ''
      }]
    }));
  };

  const updateScheduleItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeScheduleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  return (
    <SectionCard
      title="Schedule"
      expanded={expandedSections.schedule}
      onToggle={() => toggleSection('schedule')}
      showVisibility={true}
      visibilityChecked={sectionVisibility.showSchedule}
      onVisibilityToggle={() => toggleSectionVisibility('showSchedule')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Headline
          </label>
          <input
            type="text"
            value={formData.scheduleHeadline}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduleHeadline: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            placeholder="e.g., Event Schedule"
          />
        </div>

        <div className="space-y-3">
          {formData.schedule.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Session {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Time (e.g., 9:00 AM)"
                />
                <input
                  type="text"
                  value={item.type}
                  onChange={(e) => updateScheduleItem(index, 'type', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Type (e.g., Keynote)"
                />
                <input
                  type="text"
                  value={item.speaker}
                  onChange={(e) => updateScheduleItem(index, 'speaker', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Speaker"
                />
              </div>

              <input
                type="text"
                value={item.title}
                onChange={(e) => updateScheduleItem(index, 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="Session Title"
              />

              <textarea
                value={item.description}
                onChange={(e) => updateScheduleItem(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="Description"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addScheduleItem}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-[#FBB859] hover:border-[#FBB859] hover:bg-[#FBB859]/5 transition-colors flex items-center justify-center gap-2"
        >
          <FiPlus size={18} />
          Add Schedule Item
        </button>
      </div>
    </SectionCard>
  );
};

// Gallery Albums Section Component
export const GallerySection = ({ formData, setFormData, SectionCard, expandedSections, toggleSection, sectionVisibility, toggleSectionVisibility }) => {
  const addAlbum = () => {
    setFormData(prev => ({
      ...prev,
      galleryAlbums: [...prev.galleryAlbums, {
        name: '',
        media: []
      }]
    }));
  };

  const updateAlbum = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.map((album, i) =>
        i === index ? { ...album, [field]: value } : album
      )
    }));
  };

  const removeAlbum = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.filter((_, i) => i !== index)
    }));
  };

  const addMediaItem = (albumIndex) => {
    setFormData(prev => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.map((album, i) =>
        i === albumIndex
          ? {
              ...album,
              media: [...album.media, { url: '', type: 'image', thumbnail: '', alt: '' }]
            }
          : album
      )
    }));
  };

  const updateMediaItem = (albumIndex, mediaIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.map((album, i) =>
        i === albumIndex
          ? {
              ...album,
              media: album.media.map((item, j) =>
                j === mediaIndex ? { ...item, [field]: value } : item
              )
            }
          : album
      )
    }));
  };

  const removeMediaItem = (albumIndex, mediaIndex) => {
    setFormData(prev => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.map((album, i) =>
        i === albumIndex
          ? { ...album, media: album.media.filter((_, j) => j !== mediaIndex) }
          : album
      )
    }));
  };

  return (
    <SectionCard
      title="Gallery Albums"
      expanded={expandedSections.gallery}
      onToggle={() => toggleSection('gallery')}
      showVisibility={true}
      visibilityChecked={sectionVisibility.showGallery}
      onVisibilityToggle={() => toggleSectionVisibility('showGallery')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Headline
          </label>
          <input
            type="text"
            value={formData.galleryHeadline}
            onChange={(e) => setFormData(prev => ({ ...prev, galleryHeadline: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            placeholder="e.g., Event Gallery"
          />
        </div>

        <div className="space-y-4">
          {formData.galleryAlbums.map((album, albumIndex) => (
            <div key={albumIndex} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={album.name}
                  onChange={(e) => updateAlbum(albumIndex, 'name', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent font-medium"
                  placeholder="Album Name (e.g., Sessions, Panels)"
                />
                <button
                  type="button"
                  onClick={() => removeAlbum(albumIndex)}
                  className="ml-3 text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="space-y-2 ml-4">
                {album.media.map((item, mediaIndex) => (
                  <div key={mediaIndex} className="p-3 bg-white rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Media {mediaIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMediaItem(albumIndex, mediaIndex)}
                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Media Type
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) => updateMediaItem(albumIndex, mediaIndex, 'type', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>

                    <ImageUploadField
                      label={item.type === 'video' ? 'Video URL' : 'Image'}
                      value={item.url}
                      onChange={(url) => updateMediaItem(albumIndex, mediaIndex, 'url', url)}
                      accept={item.type === 'video' ? 'video/*' : 'image/*'}
                    />

                    {item.type === 'video' && (
                      <ImageUploadField
                        label="Video Thumbnail"
                        value={item.thumbnail || ''}
                        onChange={(url) => updateMediaItem(albumIndex, mediaIndex, 'thumbnail', url)}
                        accept="image/*"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addMediaItem(albumIndex)}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-[#FBB859] hover:border-[#FBB859] hover:bg-[#FBB859]/5 transition-colors flex items-center justify-center gap-1"
                >
                  <FiPlus size={16} />
                  Add Media to {album.name || 'Album'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addAlbum}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-[#FBB859] hover:border-[#FBB859] hover:bg-[#FBB859]/5 transition-colors flex items-center justify-center gap-2"
        >
          <FiPlus size={18} />
          Add Album
        </button>
      </div>
    </SectionCard>
  );
};

// Registration Section Component
export const RegistrationSection = ({ formData, setFormData, SectionCard, expandedSections, toggleSection, sectionVisibility, toggleSectionVisibility }) => {
  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      registration: {
        ...prev.registration,
        benefits: [...prev.registration.benefits, '']
      }
    }));
  };

  const updateBenefit = (index, value) => {
    setFormData(prev => ({
      ...prev,
      registration: {
        ...prev.registration,
        benefits: prev.registration.benefits.map((b, i) => i === index ? value : b)
      }
    }));
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      registration: {
        ...prev.registration,
        benefits: prev.registration.benefits.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <SectionCard
      title="Registration (for upcoming events)"
      expanded={expandedSections.registration}
      onToggle={() => toggleSection('registration')}
      showVisibility={true}
      visibilityChecked={sectionVisibility.showRegister}
      onVisibilityToggle={() => toggleSectionVisibility('showRegister')}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
            </label>
            <input
              type="text"
              value={formData.registration.headline}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                registration: { ...prev.registration, headline: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="e.g., Secure Your Spot Today!"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={formData.registration.buttonText}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                registration: { ...prev.registration, buttonText: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="e.g., Register Now"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.registration.description}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              registration: { ...prev.registration, description: e.target.value }
            }))}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            placeholder="Describe the registration details..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Deadline
            </label>
            <input
              type="date"
              value={formData.registration.deadline}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                registration: { ...prev.registration, deadline: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Spots
            </label>
            <input
              type="number"
              value={formData.registration.spots.available}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                registration: {
                  ...prev.registration,
                  spots: { ...prev.registration.spots, available: parseInt(e.target.value) || 0 }
                }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Spots
            </label>
            <input
              type="number"
              value={formData.registration.spots.total}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                registration: {
                  ...prev.registration,
                  spots: { ...prev.registration.spots, total: parseInt(e.target.value) || 0 }
                }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.registration.isFree}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                registration: { ...prev.registration, isFree: e.target.checked }
              }))}
              className="w-4 h-4 text-[#FBB859] rounded focus:ring-[#FBB859]"
            />
            <span className="text-sm font-medium text-gray-700">Free Event</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Benefits
          </label>
          <div className="space-y-2 mb-2">
            {formData.registration.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="e.g., Access to all sessions"
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addBenefit}
            className="text-sm text-[#FBB859] hover:text-[#FBB859]/80 flex items-center gap-1"
          >
            <FiPlus size={16} />
            Add Benefit
          </button>
        </div>
      </div>
    </SectionCard>
  );
};

// Testimonials Section Component
export const TestimonialsSection = ({ formData, setFormData, SectionCard, expandedSections, toggleSection, sectionVisibility, toggleSectionVisibility }) => {
  const addTestimonial = () => {
    setFormData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, {
        author: { name: '', role: '', company: '' },
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0]
      }]
    }));
  };

  const updateTestimonial = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) =>
        i === index
          ? field === 'author'
            ? { ...testimonial, author: { ...testimonial.author, ...value } }
            : { ...testimonial, [field]: value }
          : testimonial
      )
    }));
  };

  const removeTestimonial = (index) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  return (
    <SectionCard
      title="Testimonials (for past events)"
      expanded={expandedSections.testimonials}
      onToggle={() => toggleSection('testimonials')}
      showVisibility={true}
      visibilityChecked={sectionVisibility.showTestimonials}
      onVisibilityToggle={() => toggleSectionVisibility('showTestimonials')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Headline
          </label>
          <input
            type="text"
            value={formData.testimonialsHeadline}
            onChange={(e) => setFormData(prev => ({ ...prev, testimonialsHeadline: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            placeholder="e.g., What Attendees Say"
          />
        </div>

        <div className="space-y-4">
          {formData.testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Review {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeTestimonial(index)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={testimonial.author.name}
                  onChange={(e) => updateTestimonial(index, 'author', { name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={testimonial.author.role}
                  onChange={(e) => updateTestimonial(index, 'author', { role: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Role"
                />
                <input
                  type="text"
                  value={testimonial.author.company}
                  onChange={(e) => updateTestimonial(index, 'author', { company: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Company"
                />
              </div>

              <textarea
                value={testimonial.comment}
                onChange={(e) => updateTestimonial(index, 'comment', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="Review comment"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    value={testimonial.rating}
                    onChange={(e) => updateTestimonial(index, 'rating', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  >
                    {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(rating => (
                      <option key={rating} value={rating}>
                        {rating} {'⭐'.repeat(Math.floor(rating))}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={testimonial.date ? testimonial.date.split('T')[0] : ''}
                    onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addTestimonial}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-[#FBB859] hover:border-[#FBB859] hover:bg-[#FBB859]/5 transition-colors flex items-center justify-center gap-2"
        >
          <FiPlus size={18} />
          Add Testimonial
        </button>
      </div>
    </SectionCard>
  );
};
