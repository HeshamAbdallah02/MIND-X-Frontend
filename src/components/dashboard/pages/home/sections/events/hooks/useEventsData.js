// frontend/src/components/dashboard/pages/home/sections/events/hooks/useEventsData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../../../../../utils/api';

const useEventsData = () => {
  const [events, setEvents] = useState([]);
  const eventsRef = useRef(events);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize all API call functions
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/events/admin');
      setEvents(response.data);
    } catch (error) {
      console.error('Fetch events error:', error);
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id) => { 
    const toastId = toast.loading('Deleting event...');
    try {
      await api.delete(`/events/${id}`);
      await fetchEvents();
      toast.success('Event deleted successfully', { id: toastId });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete event', { id: toastId });
    }
  }, [fetchEvents]);

  const toggleActive = useCallback(async (id, currentStatus) => {
    const toastId = toast.loading(
      `${currentStatus ? 'Deactivating' : 'Activating'} event...`
    );

    const originalEvents = [...eventsRef.current];

    try {
      // Optimistic update
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
      toast.success(
        `Event ${currentStatus ? 'deactivated' : 'activated'} successfully`, 
        { id: toastId }
      );
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update event status', { id: toastId });
      setEvents(originalEvents);
    }
  }, []);

  const updateOrder = useCallback(async (draggedId, newPosition) => {
    const toastId = toast.loading('Updating order...');

    const originalEvents = [...eventsRef.current];
    
    try {
      // Optimistic update
      setEvents(prev => {
        const activeEvents = prev.filter(e => e.active).sort((a, b) => a.order - b.order);
        const targetEvent = activeEvents.find(e => e._id === draggedId);
        
        if (!targetEvent) return prev;

        const updatedEvents = activeEvents
          .filter(e => e._id !== draggedId)
          .toSpliced(newPosition, 0, targetEvent)
          .map((e, index) => ({ ...e, order: index }));

        return [
          ...updatedEvents,
          ...prev.filter(e => !e.active)
        ];
      });

      const { data } = await api.patch(`/events/${draggedId}/order`, { 
        order: newPosition 
      });
      
      setEvents(data);
      toast.success('Event order updated successfully', { 
        id: toastId,
        duration: 2000 
      });
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to update event order', { id: toastId });
      setEvents(originalEvents);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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