// frontend/src/components/dashboard/pages/home/sections/events/hooks/useEventsData.js
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../../../../../utils/api';

const useEventsData = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async () => {
    try {
        setIsLoading(true);
        const response = await api.get('/events/admin');
        
        // No need to sort here as backend handles it
        setEvents(response.data);
    } catch (error) {
        console.error('Fetch events error:', error);
        toast.error('Error loading events');
        setEvents([]); // Set empty array on error
    } finally {
        setIsLoading(false);
    }
    };

const deleteEvent = async (id) => {
    try {
    await api.delete(`/events/${id}`);
    await fetchEvents();
    toast.success('Event deleted');
    } catch (error) {
    toast.error('Error deleting event');
    }
};

const toggleActive = async (id, currentStatus) => {
    const originalEvents = [...events];
  
    try {
      setEvents(prev => {
        const newEvents = prev.map(e => ({ ...e }));
        const targetIndex = newEvents.findIndex(e => e._id === id);
        if (targetIndex === -1) return prev;
  
        const event = newEvents[targetIndex];
        event.active = !currentStatus;
  
        if (currentStatus) {
          // Deactivating
          const oldOrder = event.order;
          event.order = -1;
          newEvents.forEach(e => {
            if (e.active && e.order > oldOrder) e.order--;
          });
        } else {
          // Activating: Find max order among active
          const maxOrder = newEvents
            .filter(e => e.active)
            .reduce((max, e) => Math.max(max, e.order), -1);
          event.order = maxOrder + 1;
        }
  
        return [...newEvents].sort((a, b) => {
          if (a.active !== b.active) return a.active ? -1 : 1;
          return a.active ? a.order - b.order : new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      });
  
      const { data } = await api.patch(`/events/${id}/toggle-active`);
      setEvents(data);
    } catch (error) {
      toast.error('Failed to update event status');
      setEvents(originalEvents);
    }
  };

const updateOrder = async (draggedId, newIndex) => {
    try {
    // Optimistic update
    setEvents(prev => {
        const newEvents = [...prev];
        const draggedItem = newEvents.find(e => e._id === draggedId);
        const oldIndex = newEvents.findIndex(e => e._id === draggedId);
        
        newEvents.splice(oldIndex, 1);
        newEvents.splice(newIndex, 0, draggedItem);
        
        return newEvents.map((e, index) => ({ 
        ...e, 
        order: index 
        }));
    });

    // API call with fresh data
    const response = await api.patch(`/events/${draggedId}/order`, { 
      order: newIndex 
    });

    // Update with server response
    setEvents(response.data);
    
  } catch (error) {
    console.error('Reorder error:', error);
    toast.error('Error updating order');
    // Revert to server state
    const response = await api.get('/events/admin');
    setEvents(response.data);
  }
};

useEffect(() => { fetchEvents(); }, []);

return {
    events,
    isLoading,
    fetchEvents,
    deleteEvent,
    toggleActive,
    updateOrder
};
};

export default useEventsData;