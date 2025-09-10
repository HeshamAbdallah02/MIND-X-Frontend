// frontend/src/components/dashboard/pages/our-story/sections/seasons/SeasonsManager.js
import React, { useState } from 'react';
import { FiPlus, FiUsers, FiStar, FiEdit, FiTrash, FiToggleLeft, FiToggleRight, FiImage, FiMove } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSeasons, useSeasonsMutations } from '../../../../../../hooks/useSeasonsQueries';
import LoadingSpinner from '../../../../../shared/LoadingSpinner';
import ConfirmDialog from '../../../../shared/ConfirmDialog';
import SeasonForm from './components/SeasonForm';

const SeasonsManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSeason, setEditingSeason] = useState(null);
  const [deleteSeason, setDeleteSeason] = useState(null);
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'

  // Fetch seasons data
  const { data: seasons = [], isLoading, error } = useSeasons();
  
  // Get mutations
  const {
    deleteSeasonMutation,
    updateSeasonMutation,
    reorderSeasonsMutation,
  } = useSeasonsMutations();

  // Filter and sort seasons based on active filter and order
  const filteredSeasons = seasons
    .filter(season => {
      if (filterActive === 'active') return season.isActive;
      if (filterActive === 'inactive') return !season.isActive;
      return true;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order field

  const handleCreateSeason = () => {
    setEditingSeason(null);
    setShowForm(true);
  };

  const handleEditSeason = (season) => {
    setEditingSeason(season);
    setShowForm(true);
  };

  const handleDeleteSeason = (season) => {
    setDeleteSeason(season);
  };

  const confirmDelete = () => {
    if (deleteSeason) {
      deleteSeasonMutation.mutate(deleteSeason._id);
      setDeleteSeason(null);
    }
  };

  const handleToggleActive = (season) => {
    updateSeasonMutation.mutate({
      id: season._id,
      data: { isActive: !season.isActive }
    });
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingSeason(null);
  };

  // Handle drag and drop reordering (React Query handles optimistic updates)
  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return; // Item dropped outside the list
    }

    const { source, destination } = result;
    
    if (source.index === destination.index) {
      return; // Item dropped in the same position
    }

    // Create reordered array based on the current filtered seasons
    const reorderedSeasons = Array.from(filteredSeasons);
    const [movedSeason] = reorderedSeasons.splice(source.index, 1);
    reorderedSeasons.splice(destination.index, 0, movedSeason);

    // Create the seasons array for the reorder API with updated order values
    const seasonsForAPI = reorderedSeasons.map((season, index) => ({
      id: season._id,
      order: index
    }));

    // Execute reorder - React Query will handle optimistic updates
    reorderSeasonsMutation.mutate(seasonsForAPI);
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading seasons: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seasons & Board Management</h1>
              <p className="text-gray-600 mt-1">
                Manage academic seasons, board members, and achievements
              </p>
            </div>
            <button
              onClick={handleCreateSeason}
              className="bg-[#81C99C] hover:bg-[#6db885] text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
            >
              <FiPlus className="mr-2" />
              Add New Season
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{seasons.length}</div>
              <div className="text-sm text-blue-800">Total Seasons</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {seasons.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-green-800">Active Seasons</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {seasons.reduce((acc, season) => acc + (season.boardMembers?.length || 0), 0)}
              </div>
              <div className="text-sm text-purple-800">Total Members</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Seasons' },
                  { key: 'active', label: 'Active' },
                  { key: 'inactive', label: 'Inactive' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilterActive(key)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filterActive === key
                        ? 'bg-[#81C99C] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {filteredSeasons.length > 1 && (
              <div className="flex items-center text-sm text-gray-500">
                <FiMove className="w-4 h-4 mr-1" />
                <span>Drag to reorder seasons</span>
              </div>
            )}
          </div>
        </div>

        {/* Seasons List with Drag & Drop */}
        <div className="bg-white rounded-lg border overflow-visible">
          {filteredSeasons.length === 0 ? (
            <div className="p-8 text-center">
              <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {seasons.length === 0 ? 'No seasons yet' : 'No seasons match your filter'}
              </h3>
              <p className="text-gray-600 mb-4">
                {seasons.length === 0 
                  ? 'Get started by creating your first season.'
                  : 'Try adjusting your filter criteria.'
                }
              </p>
              {seasons.length === 0 && (
                <button
                  onClick={handleCreateSeason}
                  className="bg-[#81C99C] hover:bg-[#6db885] text-white px-4 py-2 rounded-lg inline-flex items-center font-medium transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Create First Season
                </button>
              )}
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="seasons-list" type="SEASON">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                    style={{ 
                      minHeight: 'auto',
                      overflow: 'visible' // Prevent scroll conflicts
                    }}
                  >
                    {filteredSeasons.map((season, index) => (
                      <Draggable key={season._id} draggableId={season._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border-b last:border-b-0 transition-colors ${
                              snapshot.isDragging 
                                ? 'bg-white shadow-xl rounded-lg border border-blue-200 z-50' 
                                : 'hover:bg-gray-50'
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              // Ensure dragged item appears above everything
                              ...(snapshot.isDragging && {
                                transform: provided.draggableProps.style?.transform,
                              })
                            }}
                          >
                            <div className="p-6">
                              <div className="flex items-center justify-between">
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex-shrink-0 mr-3 p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Drag to reorder"
                                >
                                  <FiMove className="w-4 h-4" />
                                </div>

                                {/* Cover Image Preview */}
                                <div className="flex-shrink-0 mr-4">
                                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 border">
                                    {season.coverImage?.url ? (
                                      <img
                                        src={season.coverImage.url}
                                        alt={`${season.academicYear} cover`}
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <FiImage className="w-4 h-4 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                      <span 
                                        className="inline-block w-4 h-4 rounded-full"
                                        style={{ backgroundColor: season.badgeColor || '#606161' }}
                                      ></span>
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        {season.academicYear}
                                      </h3>
                                    </div>
                                    {!season.isActive && (
                                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                        Inactive
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 mt-1">{season.theme}</p>
                                  
                                  <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <FiUsers className="w-4 h-4 mr-1" />
                                      <span>{season.boardMembers?.length || 0} members</span>
                                      {season.boardMembers?.find(m => m.isLeader) && (
                                        <FiStar className="w-3 h-3 ml-1 text-yellow-500" />
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <FiStar className="w-4 h-4 mr-1" />
                                      <span>{season.highlights?.length || 0} highlights</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleToggleActive(season)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      season.isActive
                                        ? 'text-green-600 hover:bg-green-50'
                                        : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                                    title={season.isActive ? 'Deactivate season' : 'Activate season'}
                                  >
                                    {season.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                                  </button>
                                  <button
                                    onClick={() => handleEditSeason(season)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit season"
                                  >
                                    <FiEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSeason(season)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete season"
                                  >
                                    <FiTrash />
                                  </button>
                                </div>
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
      </div>

      {/* Season Form Modal */}
      {showForm && (
        <SeasonForm
          season={editingSeason}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteSeason}
        onClose={() => setDeleteSeason(null)}
        onConfirm={confirmDelete}
        title="Delete Season"
        message={
          deleteSeason 
            ? `Are you sure you want to delete the season "${deleteSeason.academicYear}"? This will also delete all board members and highlights. This action cannot be undone.`
            : ''
        }
        confirmText="Delete Season"
        type="danger"
      />
    </>
  );
};

export default SeasonsManager;
