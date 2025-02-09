// frontend/src/components/dashboard/pages/home/sections/hero/hooks/useHeroData.js
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../../../../../utils/api';

const useHeroData = () => {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContents = async () => {
    try {
      const response = await api.get('/hero');
      setContents(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Error fetching hero contents');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContent = async (contentId) => {
    try {
      await api.delete(`/hero/${contentId}`);
      toast.success('Content deleted successfully');
      await fetchContents();
    } catch (error) {
      toast.error('Error deleting content');
    }
  };

  const updateOrder = async (contentId, newOrder) => {
    try {
      await api.patch(`/hero/${contentId}/order`, { order: newOrder });
      await fetchContents();
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Error updating order');
      await fetchContents();
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  return {
    contents,
    isLoading,
    fetchContents,
    deleteContent,
    updateOrder
  };
};

export default useHeroData;