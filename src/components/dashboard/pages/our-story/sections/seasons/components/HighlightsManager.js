// frontend/src/components/dashboard/pages/our-story/sections/seasons/components/HighlightsManager.js
import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiStar, FiExternalLink } from 'react-icons/fi';
import { useSeasonHighlights, useSeasonsMutations } from '../../../../../../../hooks/useSeasonsQueries';
import LoadingSpinner from '../../../../../../shared/LoadingSpinner';
import ConfirmDialog from '../../../../../shared/ConfirmDialog';
import HighlightForm from './HighlightForm';

const HighlightsManager = ({ seasonId }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [deleteHighlight, setDeleteHighlight] = useState(null);

  // Fetch highlights
  const { data: highlights = [], isLoading, error } = useSeasonHighlights(seasonId);
  
  // Get mutations
  const {
    deleteHighlightMutation,
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
              {highlights.filter(h => h.url).length}
            </div>
            <div className="text-sm text-green-800">With Links</div>
          </div>
        </div>

        {/* Highlights List */}
        {highlights.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FiStar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
            {highlights.map((highlight, index) => (
              <div
                key={highlight._id}
                className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <HighlightCard
                  highlight={highlight}
                  onEdit={handleEditHighlight}
                  onDelete={handleDeleteHighlight}
                />
              </div>
            ))}
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
const HighlightCard = ({ highlight, onEdit, onDelete }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Highlight Icon */}
      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
        <FiStar className="w-6 h-6 text-white" />
      </div>

      {/* Highlight Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h5 className="font-medium text-gray-900 truncate">{highlight.title}</h5>
          {highlight.url && (
            <FiExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" title="Has link" />
          )}
        </div>
        {highlight.url && (
          <p className="text-sm text-blue-600 truncate mt-1">
            <a 
              href={highlight.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {highlight.url}
            </a>
          </p>
        )}
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
