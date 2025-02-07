//frontend/src/components/dashboard/pages/home/sections/hero/hooks/useHeroData.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useHeroData = () => {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hero');
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
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/hero/${contentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Content deleted successfully');
      await fetchContents();
    } catch (error) {
      toast.error('Error deleting content');
    }
  };

  const updateOrder = async (contentId, newOrder) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/hero/${contentId}/order`,
        { order: newOrder },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
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