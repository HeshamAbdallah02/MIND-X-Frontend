import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useHeaderConfig from './hooks/useHeaderConfig';
import useChanges from '../../../../hooks/useChanges';
import { useChangeTracker } from '../../../../context/ChangeTrackerContext';
import ColorManagement from './components/ColorManagement';
import LogoManagement from './components/LogoManagement';

const HeaderManager = () => {
  const { config, updateConfig } = useHeaderConfig();
  const { currentData, updateData } = useChanges(config);
  const { registerCallbacks, setHasChanges } = useChangeTracker(); // Added setHasChanges here
  const [isUploading, setIsUploading] = useState(false);
  const [tempLogoData, setTempLogoData] = useState(null);

  // Refs to track latest currentData and config
  const currentDataRef = useRef(currentData);
  const configRef = useRef(config);

  useEffect(() => {
    currentDataRef.current = currentData;
    configRef.current = config;
  }, [currentData, config]);

  // Clear change tracking on unmount
  useEffect(() => {
    return () => {
      setHasChanges(false);
    };
  }, [setHasChanges]);

  // Memoized save handler using refs
  const handleSave = useCallback(async () => {
    try {
      const success = await updateConfig(currentDataRef.current);
      if (success) {
        setTempLogoData(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving changes:', error);
      return false;
    }
  }, [updateConfig]);

  // Memoized discard handler using refs
  const handleDiscard = useCallback(() => {
    updateData(configRef.current);
    setTempLogoData(null);
  }, [updateData]);

  // Register callbacks with memoized handlers
  useEffect(() => {
    registerCallbacks(handleSave, handleDiscard);
  }, [handleSave, handleDiscard, registerCallbacks]);

  const handleColorChange = (colorType, value) => {
    updateData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...(colorType === 'background'
          ? { background: value }
          : {
              text: {
                ...prev.colors.text,
                [colorType]: value
              }
            })
      }
    }));
  };

  useEffect(() => {
    return () => {
      if (tempLogoData?.publicId) {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:5000/api/upload/${tempLogoData.publicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
      }
    };
  }, [tempLogoData]);

  const handleLogoUpload = async (file) => {
    setIsUploading(true);
    
    if (tempLogoData?.publicId) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/upload/${tempLogoData.publicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error deleting previous temp upload:', error);
      }
    }

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
      
      setTempLogoData({
        url: response.data.url,
        publicId: response.data.publicId
      });
      
      updateData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          imageUrl: response.data.url
        }
      }));
      
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Error uploading logo');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!currentData.logo.imageUrl && tempLogoData) {
      setTempLogoData(null);
    }
  }, [currentData.logo.imageUrl, tempLogoData]);

  const handleLogoDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      let publicIdToDelete = null;

      // Determine which logo to delete
      if (tempLogoData?.publicId) {
        publicIdToDelete = tempLogoData.publicId;
      } else if (currentData.logo?.publicId) {
        publicIdToDelete = currentData.logo.publicId;
      }

      if (publicIdToDelete) {
        await axios.delete(`http://localhost:5000/api/upload/${publicIdToDelete}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Update the configuration
      updateData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          imageUrl: '',
          publicId: null
        }
      }));

      setTempLogoData(null);
      toast.success('Logo removed successfully');
    } catch (error) {
      toast.error('Error removing logo');
      console.error('Error deleting logo:', error);
    }
  };

  return (
    <div className="space-y-6">
      <ColorManagement 
        colors={currentData.colors}
        onColorChange={handleColorChange}
      />
      <LogoManagement
        logo={currentData.logo}
        onLogoUpload={handleLogoUpload}
        onLogoDelete={handleLogoDelete}
        isUploading={isUploading}
      />
    </div>
  );
};

export default HeaderManager;