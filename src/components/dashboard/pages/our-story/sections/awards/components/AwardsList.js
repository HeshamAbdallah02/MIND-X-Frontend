// frontend/src/components/dashboard/pages/our-story/sections/awards/components/AwardsList.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaTrophy, FaMedal, FaStar, FaHeart, FaCertificate, FaCrown, FaEdit, FaTrash, FaEyeSlash, FaGripVertical } from 'react-icons/fa';

const iconMap = {
  trophy: FaTrophy,
  medal: FaMedal,
  star: FaStar,
  heart: FaHeart,
  certificate: FaCertificate,
  crown: FaCrown,
};

const typeColors = {
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  silver: 'bg-gray-100 text-gray-800 border-gray-200',
  bronze: 'bg-orange-100 text-orange-800 border-orange-200',
  special: 'bg-purple-100 text-purple-800 border-purple-200',
  achievement: 'bg-blue-100 text-blue-800 border-blue-200',
};

const AwardsList = ({ awards, onEdit, onDelete, onReorder, isLoading }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (start) => {
    setDraggedItem(start.draggableId);
  };

  const handleDragEnd = (result) => {
    setDraggedItem(null);
    
    if (!result.destination) return;

    const items = Array.from(awards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const reorderedAwards = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onReorder(reorderedAwards);
  };

  if (!awards || awards.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FaTrophy className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No awards yet</h3>
        <p className="text-gray-600 mb-4">Create your first award to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Awards ({awards.length})
        </h2>
        <div className="text-sm text-gray-500">
          Drag to reorder
        </div>
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="awards-list">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-3 min-h-[200px] ${
                snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
              }`}
            >
              {awards.map((award, index) => {
                const IconComponent = iconMap[award.iconType] || FaTrophy;
                
                return (
                  <Draggable
                    key={award._id}
                    draggableId={award._id}
                    index={index}
                    isDragDisabled={isLoading}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border rounded-lg p-4 transition-all ${
                          snapshot.isDragging 
                            ? 'shadow-lg scale-105 rotate-1' 
                            : 'shadow-sm hover:shadow-md'
                        } ${
                          draggedItem === award._id ? 'opacity-80' : ''
                        } ${
                          !award.isVisible ? 'opacity-60 border-dashed' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-1"
                          >
                            <FaGripVertical className="w-4 h-4" />
                          </div>

                          {/* Award Icon */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColors[award.type] || typeColors.achievement}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                          </div>

                          {/* Award Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {award.title}
                                  </h3>
                                  {!award.isVisible && (
                                    <FaEyeSlash className="w-4 h-4 text-gray-400" title="Hidden" />
                                  )}
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {award.description}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                  <span className={`px-2 py-1 rounded-full border text-xs font-medium ${typeColors[award.type] || typeColors.achievement}`}>
                                    {award.type}
                                  </span>
                                  
                                  <span className="text-gray-500">
                                    {award.year}
                                  </span>
                                  
                                  {award.organization && (
                                    <span className="text-gray-500">
                                      • {award.organization}
                                    </span>
                                  )}
                                  
                                  {award.state && (
                                    <span 
                                      className="px-2 py-1 text-xs font-medium text-white rounded-full"
                                      style={{ backgroundColor: award.stateColor || '#3B82F6' }}
                                    >
                                      {award.state}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => onEdit(award)}
                                  disabled={isLoading}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Edit award"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                
                                <button
                                  onClick={() => onDelete(award._id)}
                                  disabled={isLoading}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete award"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardsList;
