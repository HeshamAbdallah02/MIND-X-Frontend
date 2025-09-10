// frontend/src/components/dashboard/pages/our-story/sections/seasons/components/HighlightsManager.js
import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiImage, FiMove } from 'react-icons/fi';
import { useSeasonHighlights, useSeasonsMutations } from '../../../../../../../hooks/useSeasonsQueries';
import LoadingSpinner from '../../../../../../shared/LoadingSpinner';
import ConfirmDialog from '../../../../../shared/ConfirmDialog';
import HighlightForm from './HighlightForm';
// Using react-beautiful-dnd for drag and drop (will be replaced with @dnd-kit in the future)
let DragDropContext, Droppable, Draggable;
try {
  const dnd = require('react-beautiful-dnd');
  DragDropContext = dnd.DragDropContext;
  Droppable = dnd.Droppable;
  Draggable = dnd.Draggable;
} catch (e) {
  // Fallback if drag-and-drop library is not available
  DragDropContext = ({ children, onDragEnd }) => <div>{children}</div>;
  Droppable = ({ children }) => <div>{children({ droppableProps: {}, innerRef: () => {} })}</div>;
  Draggable = ({ children, index }) => <div>{children({ innerRef: () => {}, draggableProps: {}, dragHandleProps: {} }, {})}</div>;
}

const HighlightsManager = ({ seasonId }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [deleteHighlight, setDeleteHighlight] = useState(null);

  // Fetch highlights
  const { data: highlights = [], isLoading, error } = useSeasonHighlights(seasonId);
  
  // Get mutations
  const {
    deleteHighlightMutation,
    reorderHighlightsMutation,
  } = useSeasonsMutations();

  const handleCreateHighlight = () => {
    setEditingHighlight(null);
    setShowForm(true);
  };

  const handleEditHighlight = (highlight) => {
    setEditingHighlight(highlight);
    setShowForm(true);
  };

  const handleDeleteHighlight = (highlight) => {
    setDeleteHighlight(highlight);
  };

  const confirmDelete = () => {
    if (deleteHighlight) {
      deleteHighlightMutation.mutate({
        seasonId,
        highlightId: deleteHighlight._id
      });
      setDeleteHighlight(null);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingHighlight(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.index === destination.index) return;

    const reorderedHighlights = Array.from(highlights);
    const [removed] = reorderedHighlights.splice(source.index, 1);
    reorderedHighlights.splice(destination.index, 0, removed);

    // Update display orders
    const updates = reorderedHighlights.map((highlight, index) => ({
      id: highlight._id,
      displayOrder: index
    }));

    reorderHighlightsMutation.mutate({
      seasonId,
      updates
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
        <p className="text-red-800">Error loading highlights: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Season Highlights</h3>
            <p className="text-gray-600">Showcase key achievements and moments</p>
          </div>
          <button
            onClick={handleCreateHighlight}
            className="bg-[#81C99C] hover:bg-[#6db885] text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Highlight
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{highlights.length}</div>
            <div className="text-sm text-purple-800">Total Highlights</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {highlights.filter(h => h.image).length}
            </div>
            <div className="text-sm text-green-800">With Images</div>
          </div>
        </div>

        {/* Highlights List */}
        {highlights.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No highlights yet</h4>
            <p className="text-gray-600 mb-4">
              Start showcasing your achievements by adding highlights.
            </p>
            <button
              onClick={handleCreateHighlight}
              className="bg-[#81C99C] hover:bg-[#6db885] text-white px-4 py-2 rounded-lg inline-flex items-center font-medium transition-colors"
            >
              <FiPlus className="mr-2" />
              Add First Highlight
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="highlights">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {highlights.map((highlight, index) => (
                      <Draggable
                        key={highlight._id}
                        draggableId={highlight._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border-b border-gray-200 last:border-b-0 transition-colors ${
                              snapshot.isDragging ? 'bg-blue-50 shadow-lg' : 'hover:bg-gray-50'
                            }`}
                          >
                            <HighlightCard
                              highlight={highlight}
                              onEdit={handleEditHighlight}
                              onDelete={handleDeleteHighlight}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>

      {/* Highlight Form Modal */}
      {showForm && (
        <HighlightForm
          seasonId={seasonId}
          highlight={editingHighlight}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteHighlight}
        onClose={() => setDeleteHighlight(null)}
        onConfirm={confirmDelete}
        title="Delete Highlight"
        message={
          deleteHighlight 
            ? `Are you sure you want to delete the highlight "${deleteHighlight.title}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete Highlight"
        type="danger"
      />
    </>
  );
};

// Highlight Card Component
const HighlightCard = ({ highlight, onEdit, onDelete, dragHandleProps }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="p-2 text-gray-400 hover:text-gray-600 cursor-move"
        title="Drag to reorder"
      >
        <FiMove className="w-4 h-4" />
      </div>

      {/* Highlight Image */}
      {highlight.image ? (
        <img
          src={highlight.image}
          alt={highlight.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <FiImage className="w-6 h-6 text-gray-400" />
        </div>
      )}

      {/* Highlight Content */}
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-gray-900 truncate">{highlight.title}</h5>
        <p className="text-sm text-gray-600 truncate">{highlight.description}</p>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <span>Order: {highlight.displayOrder || 0}</span>
          {highlight.image && <span>Has Image</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(highlight)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Edit highlight"
        >
          <FiEdit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(highlight)}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete highlight"
        >
          <FiTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HighlightsManager;
