// frontend/src/components/admin/CTAManager.js
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  fetchCTAs, 
  createCTA, 
  updateCTA, 
  deleteCTA, 
  activateCTA 
} from '../../services/ctaService';
import CTAForm from './CTAForm';

const CTAManager = () => {
  const [selectedCTA, setSelectedCTA] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: ctas = [], isLoading, error } = useQuery({
    queryKey: ['admin-ctas'],
    queryFn: fetchCTAs,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      console.error('Error fetching CTAs:', error);
    }
  });

  const createMutation = useMutation({
    mutationFn: createCTA,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-ctas']);
      setShowForm(false);
      toast.success('CTA created successfully!');
    },
    onError: (error) => {
      console.error('Error creating CTA:', error);
      toast.error(error.response?.data?.message || 'Failed to create CTA');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCTA(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-ctas']);
      setSelectedCTA(null);
      setShowForm(false);
      toast.success('CTA updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating CTA:', error);
      toast.error(error.response?.data?.message || 'Failed to update CTA');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCTA,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-ctas']);
      toast.success('CTA deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting CTA:', error);
      toast.error(error.response?.data?.message || 'Failed to delete CTA');
    }
  });

  const activateMutation = useMutation({
    mutationFn: activateCTA,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-ctas']);
      toast.success('CTA activated successfully!');
    },
    onError: (error) => {
      console.error('Error activating CTA:', error);
      toast.error(error.response?.data?.message || 'Failed to activate CTA');
    }
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data) => {
    updateMutation.mutate({ id: selectedCTA._id, data });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this CTA?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleActivate = (id) => {
    if (window.confirm('Are you sure you want to set this as the active CTA? This will deactivate all other CTAs.')) {
      activateMutation.mutate(id);
    }
  };

  const handleEdit = (cta) => {
    setSelectedCTA(cta);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedCTA(null);
    setShowForm(false);
  };

  const handleSubmit = (data) => {
    if (selectedCTA) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading CTAs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading CTAs</h3>
        <p className="text-red-600">
          {error.message || 'An error occurred while loading CTAs.'}
        </p>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCTA ? 'Edit CTA' : 'Create New CTA'}
          </h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
        
        <CTAForm
          initialData={selectedCTA}
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Call-to-Action Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New CTA
        </button>
      </div>

      {ctas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No CTAs created yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your First CTA
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {ctas.map((cta) => (
            <div 
              key={cta._id} 
              className={`p-6 rounded-lg border-2 ${
                cta.isActive 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {cta.title}
                    </h3>
                    {cta.isActive && (
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{cta.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Button Text:</span>
                      <p className="text-gray-900">{cta.buttonText}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Button URL:</span>
                      <p className="text-gray-900 break-all">{cta.buttonUrl}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Background:</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: cta.backgroundColor }}
                        ></div>
                        <span className="text-gray-900">{cta.backgroundColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(cta)}
                    disabled={updateMutation.isLoading}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  
                  {!cta.isActive && (
                    <button
                      onClick={() => handleActivate(cta._id)}
                      disabled={activateMutation.isLoading}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Activate
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(cta._id)}
                    disabled={deleteMutation.isLoading}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CTAManager;
