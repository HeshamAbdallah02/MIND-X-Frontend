// frontend/src/components/dashboard/pages/events/EventsManager.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EventsList from './sections/EventsList';
import EventForm from './sections/EventForm';

const EventsManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleCreateNew = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEventSaved = () => {
    setEditingEvent(null);
    setShowForm(false);
  };

  return (
    <>
      <Helmet>
        <title>MIND-X: Dashboard - Events Management</title>
      </Helmet>
      
      <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
        {!showForm ? (
          <EventsList onEdit={handleEdit} onCreateNew={handleCreateNew} />
        ) : (
          <div className="p-6">
            <EventForm 
              event={editingEvent} 
              onCancel={handleCancelEdit}
              onSaved={handleEventSaved}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EventsManager;
