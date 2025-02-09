//frontend/src/components/dashboard/pages/home/sections/header/hooks/useHeaderConfig.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useHeaderConfig = () => {
  const [config, setConfig] = useState({
    logo: {
      imageUrl: '',
      altText: 'MIND-X Logo'
    },
    colors: {
      background: '#81C99C',
      text: {
        default: '#606161',
        hover: '#FBB859'
      }
    }
  });

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/header', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      toast.error('Error fetching header configuration');
    }
  };

  const updateConfig = async (newConfig) => {
    console.log('Updating config with:', newConfig); // Debug log
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/header',
        newConfig,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('API Response:', response.data); // Debug log
      setConfig(response.data);
      toast.success('Header settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error updating config:', error);
      toast.error('Error saving header settings');
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, updateConfig, fetchConfig };
};

export default useHeaderConfig;