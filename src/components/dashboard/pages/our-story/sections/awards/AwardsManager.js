// frontend/src/components/dashboard/pages/our-story/sections/awards/AwardsManager.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import awardsAPI from '../../../../../../utils/awardsAPI';
import AwardsList from './components/AwardsList';
import AwardForm from './components/AwardForm';
import AwardsSettings from './components/AwardsSettings';
import LoadingSpinner from '../../../../../shared/LoadingSpinner';

const AwardsManager = () => {
  const [activeTab, setActiveTab] = useState('awards');
  const [editingAward, setEditingAward] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all awards (including hidden ones)
  const { data: awards, isLoading: awardsLoading, error: awardsError } = useQuery({
    queryKey: ['admin-awards'],
    queryFn: () => awardsAPI.getAllAwards().then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch awards settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['awards-settings'],
    queryFn: () => awardsAPI.getAwardsSettings().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create award mutation
  const createAwardMutation = useMutation({
    mutationFn: (awardData) => awardsAPI.createAward(awardData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-awards']);
      toast.success('Award created successfully!');
      setShowForm(false);
      setEditingAward(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create award');
    },
  });

  // Update award mutation
  const updateAwardMutation = useMutation({
    mutationFn: ({ id, data }) => awardsAPI.updateAward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-awards']);
      toast.success('Award updated successfully!');
      setShowForm(false);
      setEditingAward(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update award');
    },
  });

  // Delete award mutation
  const deleteAwardMutation = useMutation({
    mutationFn: (id) => awardsAPI.deleteAward(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-awards']);
      toast.success('Award deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete award');
    },
  });

  // Reorder awards mutation
  const reorderAwardsMutation = useMutation({
    mutationFn: (reorderedAwards) => awardsAPI.reorderAwards(reorderedAwards),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-awards']);
      toast.success('Awards reordered successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reorder awards');
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (settingsData) => awardsAPI.updateAwardsSettings(settingsData),
    onSuccess: () => {
      queryClient.invalidateQueries(['awards-settings']);
      toast.success('Settings updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });

  const handleCreateAward = (awardData) => {
    createAwardMutation.mutate(awardData);
  };

  const handleUpdateAward = (awardData) => {
    if (editingAward) {
      updateAwardMutation.mutate({ id: editingAward._id, data: awardData });
    }
  };

  const handleDeleteAward = (id) => {
    if (window.confirm('Are you sure you want to delete this award?')) {
      deleteAwardMutation.mutate(id);
    }
  };

  const handleEditAward = (award) => {
    setEditingAward(award);
    setShowForm(true);
  };

  const handleReorderAwards = (reorderedAwards) => {
    reorderAwardsMutation.mutate(reorderedAwards);
  };

  const handleUpdateSettings = (settingsData) => {
    updateSettingsMutation.mutate(settingsData);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAward(null);
  };

  const tabs = [
    { id: 'awards', name: 'Awards', icon: '🏆' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  if (awardsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium mb-2">Error loading awards</h3>
        <p className="text-red-600 text-sm">
          {awardsError.message || 'Failed to load awards. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Awards & Recognition</h1>
            <p className="text-gray-600 mt-1">Manage your awards and recognition section</p>
          </div>
          {activeTab === 'awards' && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Add Award
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowForm(false);
                  setEditingAward(null);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border">
        {activeTab === 'awards' && (
          <>
            {showForm ? (
              <AwardForm
                award={editingAward}
                onSubmit={editingAward ? handleUpdateAward : handleCreateAward}
                onCancel={handleCancelForm}
                isLoading={createAwardMutation.isLoading || updateAwardMutation.isLoading}
              />
            ) : (
              <>
                {awardsLoading ? (
                  <div className="p-8 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <AwardsList
                    awards={awards || []}
                    onEdit={handleEditAward}
                    onDelete={handleDeleteAward}
                    onReorder={handleReorderAwards}
                    isLoading={deleteAwardMutation.isLoading || reorderAwardsMutation.isLoading}
                  />
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {settingsLoading ? (
              <div className="p-8 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <AwardsSettings
                settings={settings}
                onUpdate={handleUpdateSettings}
                isLoading={updateSettingsMutation.isLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AwardsManager;
