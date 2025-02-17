// frontend/src/components/dashboard/pages/home/sections/events/EventsManager.js
import React from 'react';
import useEventsData from './hooks/useEventsData';
import EventList from './components/EventList';

const EventsManager = () => {
  const { 
    events, 
    isLoading, 
    fetchEvents, 
    deleteEvent, 
    toggleActive, 
    updateOrder 
  } = useEventsData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81C99C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-content mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#606161]">
          Manage Events
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h2>

        <EventList
          events={events}
          onDelete={deleteEvent}
          onToggleActive={toggleActive}
          onReorder={updateOrder}
          onSuccess={fetchEvents}
        />
      </div>
    </div>
  );
};

export default EventsManager;