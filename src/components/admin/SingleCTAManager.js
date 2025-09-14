// frontend/src/components/admin/SingleCTAManager.js
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  fetchCTA, 
  updateCTA, 
  toggleCTAStatus 
} from '../../services/ctaService';
import CTAForm from './CTAForm';

const SingleCTAManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: cta, isLoading, error } = useQuery({
    queryKey: ['admin-cta'],
    queryFn: fetchCTA,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      console.error('Error fetching CTA:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCTA,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-cta']);
      queryClient.invalidateQueries(['active-cta']); // Also invalidate public cache
      setIsEditing(false);
      toast.success('CTA updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating CTA:', error);
      toast.error(error.response?.data?.message || 'Failed to update CTA');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: toggleCTAStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-cta']);
      queryClient.invalidateQueries(['active-cta']); // Also invalidate public cache
      toast.success(cta?.isActive ? 'CTA deactivated successfully!' : 'CTA activated successfully!');
    },
    onError: (error) => {
      console.error('Error toggling CTA status:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle CTA status');
    }
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  const handleToggle = () => {
    const action = cta?.isActive ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} the CTA section?`)) {
      toggleMutation.mutate();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading CTA...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading CTA</h3>
        <p className="text-red-600">
          {error.message || 'An error occurred while loading the CTA.'}
        </p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Call-to-Action</h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
        
        <CTAForm
          initialData={cta}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isLoading}
          hideActiveToggle={true} // Hide the active toggle in form since we have a separate toggle
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Call-to-Action Section</h2>
        <div className="flex gap-3">
          <button
            onClick={handleToggle}
            disabled={toggleMutation.isLoading}
            className={`px-4 py-2 rounded-md font-medium ${
              cta?.isActive 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {toggleMutation.isLoading 
              ? 'Updating...' 
              : (cta?.isActive ? 'Deactivate Section' : 'Activate Section')
            }
          </button>
          <button
            onClick={handleEdit}
            disabled={updateMutation.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Edit Content
          </button>
        </div>
      </div>

      {cta && (
        <div className={`p-6 rounded-lg border-2 ${
          cta.isActive 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {cta.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                cta.isActive 
                  ? 'text-green-800 bg-green-100' 
                  : 'text-gray-800 bg-gray-100'
              }`}>
                {cta.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
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
          
          <div className="flex items-center gap-4 mb-6">
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

          {/* Live Preview */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Preview</h4>
            <div 
              className="p-6 rounded-lg text-white"
              style={{ backgroundColor: cta.backgroundColor }}
            >
              <h5 className="text-2xl font-bold mb-2">{cta.title}</h5>
              <p className="mb-4 opacity-90">{cta.description}</p>
              <button 
                type="button"
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                style={{ color: cta.backgroundColor }}
              >
                {cta.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {cta?.isActive && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This CTA section is currently active and visible on the Our Story page.
              </p>
            </div>
          </div>
        </div>
      )}

      {!cta?.isActive && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This CTA section is currently inactive and will not appear on the Our Story page.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCTAManager;
