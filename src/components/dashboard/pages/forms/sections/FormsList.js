// frontend/src/components/dashboard/pages/forms/sections/FormsList.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiCopy, FiEye, FiEyeOff, FiPlus, FiExternalLink, FiList } from 'react-icons/fi';
import { API_BASE_URL } from '../../../../../config/api';

const FormsList = ({ onEdit, onCreateNew }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all forms
  const { data: forms = [], isLoading, error } = useQuery({
    queryKey: ['dashboard-forms'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/forms/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  });

  // Delete form
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form? All submissions will also be deleted.')) return;

    if (deleting === id) return;
    setDeleting(id);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/forms/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await queryClient.invalidateQueries(['dashboard-forms']);
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Failed to delete form');
    } finally {
      setDeleting(null);
    }
  };

  // Toggle published status
  const handleTogglePublish = async (id) => {
    if (publishing === id) return;
    setPublishing(id);

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/forms/admin/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await queryClient.invalidateQueries(['dashboard-forms']);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update form status');
    } finally {
      setPublishing(null);
    }
  };

  // Copy form URL
  const handleCopyUrl = (form) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/forms/${form.slug}`;
    navigator.clipboard.writeText(url);
    alert('Form URL copied to clipboard!');
  };

  // Navigate to responses
  const handleViewResponses = (form) => {
    const dashboardPath = process.env.REACT_APP_DASHBOARD_PATH;
    navigate(`/${dashboardPath}/forms/${form._id}/responses`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
        <p className="mt-4 text-gray-600">Loading forms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Failed to load forms. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forms Management</h2>
          <p className="text-gray-600">Create and manage custom forms for events, registrations, and more</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-[#FBB859] hover:bg-[#FBB859]/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <FiPlus size={20} />
          Create New Form
        </button>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FiList className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-2">No forms found</p>
          <p className="text-sm text-gray-500">Create your first form to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* Form Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {form.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${form.settings.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {form.settings.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      {form.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {form.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form Meta */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="text-gray-600">
                      <span className="font-medium">{form.questions?.length || 0}</span> questions
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">{form.submissionCount || 0}</span> responses
                    </div>
                    <div className="text-gray-600">
                      Created {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onEdit(form)}
                      className="px-4 py-2 bg-[#FBB859] hover:bg-[#FBB859]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleTogglePublish(form._id)}
                      disabled={publishing === form._id}
                      className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${publishing === form._id
                          ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-wait'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                    >
                      {publishing === form._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          {form.settings.isPublished ? 'Unpublishing...' : 'Publishing...'}
                        </>
                      ) : (
                        <>
                          {form.settings.isPublished ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          {form.settings.isPublished ? 'Unpublish' : 'Publish'}
                        </>
                      )}
                    </button>

                    {form.settings.isPublished && (
                      <button
                        onClick={() => handleCopyUrl(form)}
                        className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <FiCopy size={16} />
                        Copy URL
                      </button>
                    )}

                    <button
                      onClick={() => handleViewResponses(form)}
                      className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <FiExternalLink size={16} />
                      View Responses ({form.submissionCount || 0})
                    </button>

                    <button
                      onClick={() => handleDelete(form._id)}
                      disabled={deleting === form._id}
                      className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${deleting === form._id
                          ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-wait'
                          : 'bg-white hover:bg-red-50 text-red-600 border border-red-200'
                        }`}
                    >
                      {deleting === form._id ? (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsList;
