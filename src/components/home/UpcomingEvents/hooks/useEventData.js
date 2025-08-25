// frontend/src/components/home/UpcomingEvents/hooks/useEventData.js
import { useActiveEvents } from '../../../../hooks/queries/useEventsData';

const useEventData = () => {
  const { data: events = [], isLoading: loading, error } = useActiveEvents();
  
  return {
    events,
    loading,
    error: error?.message || null
  };
};

export default useEventData;