import { useState, useEffect, useCallback } from 'react';
import { fetchSettings, updateSettings, uploadFile } from '../../../../../../../utils/brandSettingsAPI';
import { toast } from 'react-hot-toast';

const initialBrandData = {
  logo: { url: '', alt: '' },
  missionText: '',
  visionText: '',
  missionBgColor: '#FBB859',
  visionBgColor: '#81C99C',
  missionTextColor: '#606161',
  visionTextColor: '#606161'
};

const useBrandData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState(initialBrandData);
  const [serverSettings, setServerSettings] = useState(initialBrandData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchSettings();
      setSettings(data);
      setServerSettings(data);
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateField = useCallback((field, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [field]: value };
      setHasUnsavedChanges(!isEqual(newSettings, serverSettings));
      return newSettings;
    });
  }, [serverSettings]);

  const handleFileUpload = useCallback(async (file) => {
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await uploadFile(file, token);
      
      setSettings(prev => {
        const newSettings = {
          ...prev,
          logo: { url: data.url, alt: 'MIND-X Logo' }
        };
        setHasUnsavedChanges(!isEqual(newSettings, serverSettings));
        return newSettings;
      });
      
      return data.url;
    } catch (error) {
      toast.error('Failed to upload logo');
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [serverSettings]);

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Clean up MongoDB-specific fields
      const { _id, createdAt, updatedAt, __v, ...cleanSettings } = settings;
      
      const updatedSettings = await updateSettings(cleanSettings, token);
      setServerSettings(updatedSettings);
      setHasUnsavedChanges(false);
      
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } bg-green-50 px-6 py-4 rounded-lg flex items-center space-x-4 border border-green-200 shadow-lg`}>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-green-800 font-medium">Changes saved!</p>
            <p className="text-green-600 text-sm">Your brand settings were updated successfully</p>
          </div>
        </div>
      ), {
        position: 'top-center',
        duration: 4000,
      });
  
      return true;
    } catch (error) {
        toast.custom((t) => (
            <div className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-50 px-6 py-4 rounded-lg flex items-center space-x-4 border border-green-200 shadow-lg z-[9999]`}>
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-red-800 font-medium">Update failed!</p>
                <p className="text-red-600 text-sm">{error.response?.data?.message || error.message}</p>
              </div>
            </div>
          ), {
            position: 'top-center',
            duration: 5000,
          });

        return false;
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const handleDiscard = useCallback(() => {
    setSettings(serverSettings);
    setHasUnsavedChanges(false);
  }, [serverSettings]);

  return {
    settings,
    isLoading,
    isUploading,
    isSaving,
    hasUnsavedChanges,
    handleSubmit,
    handleFileUpload,
    updateField,
    handleDiscard
  };
};

// Simple object comparison helper
function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default useBrandData;