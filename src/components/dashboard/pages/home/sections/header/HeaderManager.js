//frontend/src/components/dashboard/pages/home/sections/header/HeaderManager.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../../../context/AuthContext';
import useHeaderConfig from './hooks/useHeaderConfig';
import useChanges from '../../../../hooks/useChanges';
import { useChangeTracker } from '../../../../context/ChangeTrackerContext';
import ColorManagement from './components/ColorManagement';
import LogoManagement from './components/LogoManagement';
import api from '../../../../../../utils/api';

const HeaderManager = () => {
  const { admin } = useAuth();
  const { config, updateConfig } = useHeaderConfig();
  const { currentData, updateData } = useChanges(config);
  const { registerCallbacks } = useChangeTracker();
  const [isUploading, setIsUploading] = useState(false);
  const [tempLogoData, setTempLogoData] = useState(null);
  const [lockStatus] = useState({ locked: false });

  // Refs to track latest currentData and config
  const currentDataRef = useRef(currentData);
  const configRef = useRef(config);
  
  useEffect(() => {
    currentDataRef.current = currentData;
    configRef.current = config;
  }, [currentData, config]);

  // Memoized save handler using refs
  const handleSave = useCallback(async () => {
    if (lockStatus.locked && lockStatus.lock.admin._id !== admin._id) {
      toast.error('You no longer have the lock for this section');
      return false;
    }

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
  }, [updateConfig, lockStatus, admin]);

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

  // Updated handleLogoUpload
  const handleLogoUpload = async (file) => {
    setIsUploading(true);
    
    if (tempLogoData?.publicId) {
      try {
        await api.delete(`/upload/${tempLogoData.publicId}`);
      } catch (error) {
        console.error('Error deleting previous temp upload:', error);
      }
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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

  // Updated handleLogoDelete
  const handleLogoDelete = async () => {
    try {
      let publicIdToDelete = null;

      if (tempLogoData?.publicId) {
        publicIdToDelete = tempLogoData.publicId;
      } else if (currentData.logo?.publicId) {
        publicIdToDelete = currentData.logo.publicId;
      }

      if (publicIdToDelete) {
        await api.delete(`/upload/${publicIdToDelete}`);
      }

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