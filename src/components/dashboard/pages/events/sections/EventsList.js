// frontend/src/components/dashboard/pages/events/sections/EventsList.js
import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiUsers, FiEye, FiEyeOff, FiPlus, FiStar } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EventsList = ({ onEdit, onCreateNew }) => {
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [togglingFeatured, setTogglingFeatured] = useState(null); // Track which event is being toggled
  const [togglingActive, setTogglingActive] = useState(null); // Track which event's active status is being toggled
  const [deleting, setDeleting] = useState(null); // Track which event is being deleted
  const queryClient = useQueryClient();

  // Fetch all events
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/page-events/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  });

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    // Prevent multiple simultaneous requests
    if (deleting === id) return;
    
    setDeleting(id);
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/page-events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await queryClient.invalidateQueries(['dashboard-events']);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    // Prevent multiple simultaneous requests
    if (togglingActive === id) return;
    
    setTogglingActive(id);
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/page-events/${id}/toggle-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await queryClient.invalidateQueries(['dashboard-events']);
    } catch (error) {
      console.error('Error toggling event status:', error);
      alert('Failed to update event status');
    } finally {
      setTogglingActive(null);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (event) => {
    const isPast = new Date(event.eventDate) < new Date();
    
    if (isPast) {
      alert('Only upcoming events can be featured');
      return;
    }
    
    if (!event.active && !event.isFeatured) {
      alert('Only active events can be featured. Please activate the event first.');
      return;
    }
    
    // Prevent multiple simultaneous requests
    if (togglingFeatured === event._id) return;
    
    setTogglingFeatured(event._id);
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/page-events/${event._id}/set-featured`,
        { isFeatured: !event.isFeatured },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Wait for both cache invalidations to complete
      await Promise.all([
        queryClient.invalidateQueries(['dashboard-events']),
        queryClient.invalidateQueries(['event', 'featured'])
      ]);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert(error.response?.data?.message || 'Failed to update featured status');
    } finally {
      setTogglingFeatured(null);
    }
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.eventDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') return eventDate >= now;
    if (filter === 'past') return eventDate < now;
    return true;
  });

  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(b.eventDate) - new Date(a.eventDate)
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
        <p className="mt-4 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Failed to load events. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Events Management</h2>
          <p className="text-gray-600">Manage all your events in one place</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-[#FBB859] hover:bg-[#FBB859]/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <FiPlus size={20} />
          Create New Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {[
          { id: 'all', label: 'All Events', count: events.length },
          { id: 'upcoming', label: 'Upcoming', count: events.filter(e => new Date(e.eventDate) >= new Date()).length },
          { id: 'past', label: 'Past', count: events.filter(e => new Date(e.eventDate) < new Date()).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-[#FBB859] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {sortedEvents.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FiCalendar className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-2">No events found</p>
          <p className="text-sm text-gray-500">
            {filter === 'all' ? 'Create your first event to get started' : `No ${filter} events available`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedEvents.map((event) => {
            const eventDate = new Date(event.eventDate);
            const isPast = eventDate < new Date();
            
            return (
              <div
                key={event._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={event.coverImage?.url || event.heroImage?.url || 'https://via.placeholder.com/200'}
                      alt={event.title?.text}
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {event.title?.text}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              event.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {event.active ? 'Active' : 'Hidden'}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              isPast
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {isPast ? 'Past' : 'Upcoming'}
                          </span>
                          {event.isFeatured && (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center gap-1">
                              <FiStar size={12} className="text-yellow-500" />
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {event.description?.text}
                        </p>
                      </div>
                    </div>

                    {/* Event Meta */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar size={16} />
                        <span>{event.date?.text}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin size={16} />
                        <span className="truncate">{event.location?.venue || 'No venue'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiUsers size={16} />
                        <span>
                          {event.attendeeCount || 0}
                          {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(event)}
                        className="px-4 py-2 bg-[#FBB859] hover:bg-[#FBB859]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <FiEdit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(event._id, event.active)}
                        disabled={togglingActive === event._id}
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                          togglingActive === event._id
                            ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-wait'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {togglingActive === event._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            {event.active ? 'Hiding...' : 'Showing...'}
                          </>
                        ) : (
                          <>
                            {event.active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            {event.active ? 'Hide' : 'Show'}
                          </>
                        )}
                      </button>

                      {/* Featured toggle - only for upcoming events */}
                      {!isPast && (
                        <button
                          onClick={() => handleToggleFeatured(event)}
                          disabled={(!event.active && !event.isFeatured) || togglingFeatured === event._id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                            togglingFeatured === event._id
                              ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-wait'
                              : event.isFeatured 
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                                : !event.active 
                                  ? 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed' 
                                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}
                          title={!event.active && !event.isFeatured ? 'Activate event first to feature it' : ''}
                        >
                          {togglingFeatured === event._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                              {event.isFeatured ? 'Unfeaturing...' : 'Featuring...'}
                            </>
                          ) : (
                            <>
                              <FiStar size={16} className={event.isFeatured ? 'text-yellow-500' : 'text-gray-500'} />
                              {event.isFeatured ? 'Featured' : 'Set Featured'}
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={deleting === event._id}
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                          deleting === event._id
                            ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-wait'
                            : 'bg-white hover:bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {deleting === event._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FiTrash2 size={16} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsList;
