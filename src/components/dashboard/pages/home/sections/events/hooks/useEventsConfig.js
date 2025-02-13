// frontend/src/components/dashboard/pages/home/sections/events/hooks/useEventsConfig.js
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../../../../../utils/api';

const initialFormData = {
  title: { text: '', color: '#606161' },
  description: { text: '', color: '#606161' },
  date: { text: '', color: '#FBB859' },
  coverImage: { url: '', alt: '' },
  contentAreaColor: '#81C99C',
  url: '',
  order: 0,
  active: true
};

const useEventsConfig = ({ fetchEvents }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateEvent = () => {
    const errors = [];
    if (!formData.title.text) errors.push('Title is required');
    if (!formData.date.text) errors.push('Date is required');
    if (!formData.coverImage.url) errors.push('Cover image is required');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateEvent();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }
  
    try {
      // Remove MongoDB internal fields
      const sanitizedData = (({ _id, __v, createdAt, updatedAt, ...rest }) => rest)(formData);
      
      const payload = {
        ...sanitizedData,
        // Ensure order is only included when editing
        order: isEditing ? formData.order : undefined
      };
  
      if (isEditing) {
        await api.put(`/events/${selectedEvent._id}`, payload);
      } else {
        await api.post('/events', payload);
      }
  
      toast.success(`Event ${isEditing ? 'updated' : 'created'} successfully`);
      await fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Event save error:', error);
      toast.error(error.response?.data?.message || 'Error saving event');
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({
        ...prev,
        coverImage: {
          ...prev.coverImage,
          url: response.data.url,
          alt: file.name
        }
      }));
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const editEvent = (event) => {
    setFormData(event);
    setSelectedEvent(event);
    setIsEditing(true);
  };

  return {
    formData,
    setFormData,
    isEditing,
    isUploading,
    handleSubmit,
    handleFileUpload,
    resetForm,
    editEvent
  };
};

export default useEventsConfig;