//frontend/src/components/dashboard/pages/our-story/sections/journey/JourneyTimelineManager.js
import React, { useState } from 'react';
import { useTimelinePhases, useTimelineMutations } from '../../../../../../hooks/useTimelineQueries';
import ConfirmDialog from '../../../../shared/ConfirmDialog';
import JourneyPhaseForm from './JourneyPhaseForm';

const JourneyTimelineManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [deletePhase, setDeletePhase] = useState(null);

  // Use React Query hooks
  const { data: phases = [], isLoading, error } = useTimelinePhases();
  const { 
    createPhaseMutation, 
    updatePhaseMutation, 
    deletePhaseMutation 
  } = useTimelineMutations();

  const handleSubmitPhase = (phaseData) => {
    if (editingPhase) {
      updatePhaseMutation.mutate(
        { id: editingPhase.id, data: phaseData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingPhase(null);
          }
        }
      );
    } else {
      createPhaseMutation.mutate(phaseData, {
        onSuccess: () => {
          setShowForm(false);
        }
      });
    }
  };

  const handleEditPhase = (phase) => {
    setEditingPhase(phase);
    setShowForm(true);
  };

  const handleDeletePhase = (phase) => {
    setDeletePhase(phase);
  };

  const confirmDelete = () => {
    if (deletePhase) {
      deletePhaseMutation.mutate(deletePhase.id, {
        onSuccess: () => {
          setDeletePhase(null);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#81C99C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading timeline: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Journey Timeline</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage the phases of your organization's journey
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#81C99C] text-white px-4 py-2 rounded-lg hover:bg-[#6BA57A] transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Phase</span>
          </button>
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="bg-white rounded-lg border">
        {phases.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Timeline Phases</h3>
            <p className="text-gray-600 mb-4">Start building your journey timeline by adding the first phase.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#81C99C] text-white px-4 py-2 rounded-lg hover:bg-[#6BA57A] transition-colors"
            >
              Add First Phase
            </button>
          </div>
        ) : (
          <div className="p-4">
            {phases.map((phase, index) => (
              <div
                key={`phase-${phase.id}`}
                className="bg-gray-50 rounded-lg border p-4 mb-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#81C99C] text-white">
                        {phase.year}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">{phase.headline}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{phase.description}</p>
                    {phase.image && (
                      <div className="mb-3">
                        <img
                          src={phase.image.url || phase.imageUrl}
                          alt={phase.imageAlt || phase.headline}
                          className="w-20 h-auto object-contain rounded-lg max-h-20"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        phase.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {phase.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditPhase(phase)}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                      title="Edit phase"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePhase(phase)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                      title="Delete phase"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phase Form Modal */}
      {showForm && (
        <JourneyPhaseForm
          phase={editingPhase}
          onSubmit={handleSubmitPhase}
          onCancel={() => {
            setShowForm(false);
            setEditingPhase(null);
          }}
          isSubmitting={createPhaseMutation.isLoading || updatePhaseMutation.isLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletePhase && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Timeline Phase"
          message={`Are you sure you want to delete "${deletePhase.headline}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDeletePhase(null)}
          isLoading={deletePhaseMutation.isLoading}
          variant="danger"
        />
      )}
    </div>
  );
};

export default JourneyTimelineManager;
