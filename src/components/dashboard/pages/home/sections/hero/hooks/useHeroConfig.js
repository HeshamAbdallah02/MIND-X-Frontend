//frontend/src/components/dashboard/pages/home/sections/hero/hooks/useHeroConfig.js
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const initialFormData = {
    mediaType: 'image',
    mediaUrl: '',
    displayDuration: 5000,
    heading: {
        text: '',
        color: '#ffffff',
        size: 'text-[64px]'
    },
    subheading: {
        text: '',
        color: '#ffffff',
        size: 'text-[32px]'
    },
    description: {
        text: '',
        color: '#ffffff',
        size: 'text-[16px]'
    },
    button: {
        text: '',
        backgroundColor: '#FBB859',
        textColor: '#ffffff',
        action: {
        type: 'url',
        target: ''
        }
    }
};

const useHeroConfig = ({fetchContents}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedContent, setSelectedContent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const cleanPayload = (data) => {
        // Helper function to format size
        const formatSize = (size) => {
        if (!size) return 'text-[16px]'; // Default fallback
        if (size.startsWith('text-[')) return size; // Already in correct format
        if (size.startsWith('text-')) {
            // Convert text-64px to text-[64px]
            const numMatch = size.match(/\d+/);
            return numMatch ? `text-[${numMatch[0]}px]` : 'text-[16px]';
        }
        // Handle plain numbers or other formats
        const numMatch = size.match(/\d+/);
        return numMatch ? `text-[${numMatch[0]}px]` : 'text-[16px]';
        };
    
        // Format sizes in the data
        const withSizes = {
        ...data,
        heading: {
            ...data.heading,
            text: data.heading.text,
            color: data.heading.color,
            size: formatSize(data.heading.size)
        },
        subheading: data.subheading ? {
            ...data.subheading,
            text: data.subheading.text,
            color: data.subheading.color,
            size: formatSize(data.subheading.size)
        } : undefined,
        description: data.description ? {
            ...data.description,
            text: data.description.text,
            color: data.description.color,
            size: formatSize(data.description.size)
        } : undefined
        };
    
        // Build the cleaned payload
        const cleaned = {
        mediaType: withSizes.mediaType,
        mediaUrl: withSizes.mediaUrl,
        displayDuration: withSizes.displayDuration,
        heading: withSizes.heading,
        order: withSizes.order
        };
    
        // Add optional fields if they exist
        if (withSizes.subheading?.text) {
        cleaned.subheading = withSizes.subheading;
        }
    
        if (withSizes.description?.text) {
        cleaned.description = withSizes.description;
        }
    
        if (withSizes.button?.text) {
        cleaned.button = {
            text: withSizes.button.text,
            backgroundColor: withSizes.button.backgroundColor,
            textColor: withSizes.button.textColor,
            action: withSizes.button.action.target ? withSizes.button.action : undefined
        };
        }
    
        return cleaned;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          // Basic validation check
          if (!formData.mediaUrl) {
              toast.error('Media URL is required');
              return;
          }
  
          console.log('Submitting form data:', formData); // Add this log
  
          const token = localStorage.getItem('token');
          if (!token) {  // Add token check
              toast.error('Authentication token not found');
              return;
          }
  
          const config = {
              headers: { Authorization: `Bearer ${token}` }
          };
  
          // Clean the payload before sending
          const payload = cleanPayload(formData);
          console.log('Cleaned payload:', payload); // Add this log
  
          if (isEditing) {
              console.log('Updating content...'); // Add this log
              await axios.put(
                  `http://localhost:5000/api/hero/${selectedContent._id}`,
                  payload,
                  config
              );
          } else {
              console.log('Creating new content...'); // Add this log
              // Remove order for new content
              delete payload.order;
              await axios.post(
                  'http://localhost:5000/api/hero',
                  payload,
                  config
              );
          }
  
          toast.success(`Content ${isEditing ? 'updated' : 'created'} successfully`);
          await fetchContents();
          resetForm();
  
      } catch (error) {
          const errorMessage = error.response?.data?.error || 
                              error.message || 
                              'Failed to save content';
          
          console.error('Full error details:', error); // Add this log
          toast.error(`Error: ${errorMessage}`);
          console.error('Hero content save error:', {
              message: errorMessage,
              response: error.response?.data,
              request: error.config?.data
          });
      }
  };

    const handleFileUpload = async (file) => {
        setIsUploading(true);
        console.log('Starting upload:', file.name, file.size);
        const startTime = Date.now();
        
        const formData = new FormData();
        formData.append('file', file);
      
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post(
            'http://localhost:5000/api/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          const duration = Date.now() - startTime;
          console.log(`Upload completed in ${duration}ms:`, response.data);
          
          setFormData(prev => ({
            ...prev,
            mediaUrl: response.data.url
          }));
          toast.success('File uploaded successfully');
        } catch (error) {
          console.error('Upload error details:', {
            message: error.message,
            response: error.response?.data,
            duration: Date.now() - startTime
          });
          toast.error('Error uploading file');
        } finally {
          setIsUploading(false);
        }
    };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedContent(null);
    setIsEditing(false);
  };

  const editContent = (content) => {
    const cleanedContent = cleanPayload(content);
    setSelectedContent(content);
    setFormData(cleanedContent);
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
    editContent
  };
};

export default useHeroConfig;