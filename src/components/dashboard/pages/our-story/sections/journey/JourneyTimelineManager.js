//frontend/src/components/dashboard/pages/our-story/sections/journey/JourneyTimelineManager.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTimelinePhases, useTimelineMutations } from '../../../../../../hooks/useTimelineQueries';
import ConfirmDialog from '../../../../shared/ConfirmDialog';
import JourneyPhaseForm from './JourneyPhaseForm';

const JourneyTimelineManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [deletePhase, setDeletePhase] = useState(null);

  // Use React Query hooks
  const { data: phases = [], isLoading, error } = useTimelinePhases();
  const { 
    createPhaseMutation, 
    updatePhaseMutation, 
    deletePhaseMutation, 
    reorderPhasesMutation 
  } = useTimelineMutations();

  // Filter phases based on search
  const filteredPhases = phases.filter(phase =>
    phase.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phase.year?.toString().includes(searchTerm) ||
    phase.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedPhases = Array.from(filteredPhases);
    const [removed] = reorderedPhases.splice(result.source.index, 1);
    reorderedPhases.splice(result.destination.index, 0, removed);

    // Update the order field for each phase
    const updatedPhases = reorderedPhases.map((phase, index) => ({
      ...phase,
      order: index + 1
    }));

    reorderPhasesMutation.mutate({
      sectionId: 'default', // We'll use a default section since it's a single timeline
      phases: updatedPhases
    });
  };

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

        {/* Search and Stats */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search phases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent w-full"
            />
          </div>
          <div className="text-sm text-gray-600 ml-4">
            {filteredPhases.length} of {phases.length} phases
          </div>
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="bg-white rounded-lg border">
        {filteredPhases.length === 0 ? (
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
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="timeline-phases">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="p-4">
                  {filteredPhases.map((phase, index) => (
                    <Draggable key={`phase-${phase.id}`} draggableId={`phase-${phase.id}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-gray-50 rounded-lg border p-4 mb-4 transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                  </svg>
                                </div>
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
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Position: {phase.position}</span>
                                <span>Order: {phase.order}</span>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
