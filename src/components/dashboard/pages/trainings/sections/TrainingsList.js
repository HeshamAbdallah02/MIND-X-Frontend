// frontend/src/components/dashboard/pages/trainings/sections/TrainingsList.js
import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiUsers, FiEye, FiEyeOff, FiPlus, FiStar, FiClock } from 'react-icons/fi';
import { API_BASE_URL } from '../../../../../config/api';

const TrainingsList = ({ onEdit, onCreateNew }) => {
  const [filter, setFilter] = useState('all'); // all, upcoming, past, ongoing
  const [deleting, setDeleting] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [featuring, setFeaturing] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all trainings
  const { data: trainings = [], isLoading, error } = useQuery({
    queryKey: ['dashboard-trainings'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/trainings/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  });

  // Delete training
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this training? This will also delete all associated images.')) return;

    if (deleting === id) return;

    setDeleting(id);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/trainings/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await queryClient.invalidateQueries(['dashboard-trainings']);
    } catch (error) {
      console.error('Error deleting training:', error);
      alert('Failed to delete training');
    } finally {
      setDeleting(null);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (id) => {
    if (publishing === id) return;

    setPublishing(id);

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/trainings/admin/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await queryClient.invalidateQueries(['dashboard-trainings']);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status');
    } finally {
      setPublishing(null);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (training) => {
    if (!training.isPublished && !training.isFeatured) {
      alert('Only published trainings can be featured. Please publish the training first.');
      return;
    }

    if (training.status === 'completed') {
      alert('Only upcoming or ongoing trainings can be featured.');
      return;
    }

    if (featuring === training._id) return;

    setFeaturing(training._id);

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/trainings/admin/${training._id}/feature`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await queryClient.invalidateQueries(['dashboard-trainings']);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update featured status');
    } finally {
      setFeaturing(null);
    }
  };

  // Filter trainings
  const filteredTrainings = trainings.filter(training => {
    if (filter === 'all') return true;
    return training.status === filter;
  });

  // Sort trainings by start date (newest first)
  const sortedTrainings = [...filteredTrainings].sort((a, b) =>
    new Date(b.startDate) - new Date(a.startDate)
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
        <p className="mt-4 text-gray-600">Loading trainings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Failed to load trainings. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trainings Management</h2>
          <p className="text-gray-600 mt-1">Manage your training programs</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
        >
          <FiPlus size={20} />
          <span>Create New Training</span>
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
              ? 'bg-[#FBB859] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          All ({trainings.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'upcoming'
              ? 'bg-[#FBB859] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          Upcoming ({trainings.filter(t => t.status === 'upcoming').length})
        </button>
        <button
          onClick={() => setFilter('ongoing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'ongoing'
              ? 'bg-[#FBB859] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          Ongoing ({trainings.filter(t => t.status === 'ongoing').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'completed'
              ? 'bg-[#FBB859] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          Past ({trainings.filter(t => t.status === 'completed').length})
        </button>
      </div>

      {/* Trainings List */}
      {sortedTrainings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiCalendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No trainings found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Get started by creating your first training program'
              : `No ${filter} trainings found`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
            >
              Create First Training
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedTrainings.map((training) => (
            <div
              key={training._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex">
                {/* Cover Image */}
                <div className="w-64 h-48 flex-shrink-0 bg-gray-200">
                  {training.coverImage?.url ? (
                    <img
                      src={training.coverImage.url}
                      alt={training.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiCalendar size={48} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {training.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                          {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                        </span>
                        {training.isFeatured && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <FiStar size={12} />
                            Featured
                          </span>
                        )}
                        {!training.isPublished && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Draft
                          </span>
                        )}
                      </div>
                      {training.shortDescription && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {training.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Training Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCalendar className="text-[#FBB859]" />
                      <span>{training.displayDate}</span>
                    </div>
                    {training.location?.venue && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMapPin className="text-[#FBB859]" />
                        <span className="truncate">{training.location.venue}</span>
                      </div>
                    )}
                    {training.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiClock className="text-[#FBB859]" />
                        <span>{training.duration}</span>
                      </div>
                    )}
                    {training.registration?.spots?.total && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiUsers className="text-[#FBB859]" />
                        <span>
                          {training.registration.spots.registered || 0}/{training.registration.spots.total}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onEdit(training)}
                      className="px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors flex items-center gap-2"
                    >
                      <FiEdit2 size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleTogglePublish(training._id)}
                      disabled={publishing === training._id}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${publishing === training._id
                          ? 'bg-gray-100 text-gray-500 cursor-wait'
                          : training.isPublished
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {publishing === training._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          {training.isPublished ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                          <span>{training.isPublished ? 'Published' : 'Draft'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(training)}
                      disabled={featuring === training._id}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${featuring === training._id
                          ? 'bg-gray-100 text-gray-500 cursor-wait'
                          : training.isFeatured
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {featuring === training._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FiStar size={16} />
                          <span>{training.isFeatured ? 'Featured' : 'Feature'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(training._id)}
                      disabled={deleting === training._id}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${deleting === training._id
                          ? 'bg-gray-100 text-gray-500 cursor-wait'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                    >
                      {deleting === training._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <FiTrash2 size={16} />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingsList;
