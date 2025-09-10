import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../../../../../utils/api';

const INITIAL_EMPTY_STATE = {
  title: { text: '', color: '#606161' },
  description: { text: '', color: '#606161' },
  date: { text: '', color: '#FBB859' },
  coverImage: { url: '', alt: '' },
  contentAreaColor: '#81C99C',
  url: '',
  active: true
};

const useEventsConfig = ({ fetchEvents }) => {
  const [originalData, setOriginalData] = useState(INITIAL_EMPTY_STATE);
  const [formData, setFormData] = useState(INITIAL_EMPTY_STATE);
  const [isUploading, setIsUploading] = useState(false);

  // Smart change detection with deep comparison
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const editEvent = (event) => {
    const fullData = {
      ...event,
      title: { 
        text: event.title?.text || '', 
        color: event.title?.color || '#606161' 
      },
      description: { 
        text: event.description?.text || '', 
        color: event.description?.color || '#606161' 
      },
      date: { 
        text: event.date?.text || '', 
        color: event.date?.color || '#FBB859' 
      },
      coverImage: event.coverImage || { url: '', alt: '' },
      contentAreaColor: event.contentAreaColor || '#81C99C',
      url: event.url || '',
      active: event.active ?? true
    };
    
    setOriginalData(fullData);
    setFormData(fullData);
  };

  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': undefined, // Let browser set the correct multipart/form-data with boundary
        },
        timeout: 60000 // 60 seconds for file uploads
      });
      setFormData(prev => ({
        ...prev,
        coverImage: {
          url: response.data.url,
          alt: prev.coverImage.alt || file.name.slice(0, 30)
        }
      }));
    } catch (error) {
      console.error('Events file upload error:', error);
      toast.error('Failed to upload image: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData._id ? 'put' : 'post';
      const url = formData._id ? `/events/${formData._id}` : '/events';

      await api[method](url, formData);
      toast.success(`Event ${formData._id ? 'updated' : 'created'} successfully`);
      fetchEvents();
    } catch (error) {
      toast.error(`Failed to ${formData._id ? 'update' : 'create'} event`);
    }
  };

  const resetForm = () => {
    const newData = originalData._id ? originalData : INITIAL_EMPTY_STATE;
    setFormData(newData);
    if (!originalData._id) setOriginalData(INITIAL_EMPTY_STATE);
  };

  return {
    formData,
    setFormData,
    isUploading,
    hasChanges,
    editEvent,
    handleFileUpload,
    handleSubmit,
    resetForm
  };
};

export default useEventsConfig;