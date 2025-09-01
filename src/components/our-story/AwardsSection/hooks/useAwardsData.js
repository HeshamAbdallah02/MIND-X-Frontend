// frontend/src/components/our-story/AwardsSection/hooks/useAwardsData.js
import { useQuery } from '@tanstack/react-query';
import api from '../../../../utils/api';
import { mockAwards, mockSettings } from '../mockData';

const fetchAwards = async () => {
  try {
    const response = await api.get('/awards');
    return response.data;
  } catch (error) {
    console.warn('Awards API not available, using mock data:', error.message);
    // Return mock data for development
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAwards), 500); // Simulate API delay
    });
  }
};

const fetchAwardsSettings = async () => {
  try {
    const response = await api.get('/awards/settings/config');
    return response.data;
  } catch (error) {
    console.warn('Awards settings API not available, using mock data:', error.message);
    // Return mock settings for development
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSettings), 500); // Simulate API delay
    });
  }
};

export const useAwardsData = () => {
  return useQuery({
    queryKey: ['awards'],
    queryFn: fetchAwards,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAwardsSettings = () => {
  return useQuery({
    queryKey: ['awards-settings'],
    queryFn: fetchAwardsSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
