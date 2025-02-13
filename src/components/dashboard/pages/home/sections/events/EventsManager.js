// frontend/src/components/dashboard/pages/home/sections/events/EventsManager.js
import React, { useRef, useEffect } from 'react';
import useEventsData from './hooks/useEventsData';
import useEventsConfig from './hooks/useEventsConfig';
import EventForm from './components/EventForm';
import EventList from './components/EventList';

const EventsManager = () => {
  const formRef = useRef();
  const { 
    events, 
    isLoading, 
    fetchEvents, 
    deleteEvent, 
    toggleActive, 
    updateOrder 
  } = useEventsData();

  const {
    formData,
    setFormData,
    isEditing,
    isUploading,
    handleSubmit,
    handleFileUpload,
    resetForm,
    editEvent
  } = useEventsConfig({ fetchEvents });

  useEffect(() => {
    if (isEditing && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isEditing]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81C99C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EventForm
        ref={formRef}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        isUploading={isUploading}
        handleSubmit={handleSubmit}
        handleFileUpload={handleFileUpload}
        resetForm={resetForm}
      />

      <EventList
        events={events}
        onEdit={editEvent}
        onDelete={deleteEvent}
        onToggleActive={toggleActive}
        onReorder={updateOrder}
      />
    </div>
  );
};

export default EventsManager;