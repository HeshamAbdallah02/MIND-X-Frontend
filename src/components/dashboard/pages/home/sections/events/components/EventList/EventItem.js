// frontend/src/components/dashboard/pages/home/sections/events/components/EventList/EventItem.js
import React, { forwardRef } from 'react';
import { FaEdit, FaTrash, FaGripVertical } from 'react-icons/fa';

const EventItem = forwardRef(({ 
    event, 
    onEdit, 
    onDelete, 
    onToggleActive, 
    draggableProps, 
    dragHandleProps, 
    isDragging 
  }, ref) => {
  const handleDelete = () => {
    if (window.confirm(`Delete "${event.title.text}" permanently?`)) {
      onDelete(event._id);
    }
  };

  return (
    <div
      ref={ref}
      {...draggableProps}
      className={`group flex items-center p-4 rounded-lg transition-all ${
        event.active 
          ? 'bg-white shadow-sm border hover:shadow-md'
          : 'bg-gray-50 border-dashed opacity-75'
      } ${
        isDragging ? 'shadow-lg border-[#81C99C]' : 'border-gray-200'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="p-2 mr-2 text-gray-400 hover:text-[#81C99C] cursor-grab"
      >
        <FaGripVertical className="text-lg" />
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center space-x-4">
        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
          <img
            src={event.coverImage.url}
            alt={event.coverImage.alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 
            className="text-lg font-medium truncate"
            style={{ color: event.title.color }}
          >
            {event.title.text}
          </h3>
          <p 
            className="text-sm truncate"
            style={{ color: event.description.color }}
          >
            {event.description.text}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span 
              className="text-sm font-medium"
              style={{ color: event.date.color }}
            >
              {event.date.text}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onEdit(event)}
          className="p-2 text-gray-500 hover:text-[#81C99C] transition-colors"
        >
          <FaEdit className="text-lg" />
        </button>
        
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          <FaTrash className="text-lg" />
        </button>

        <button
        onClick={() => onToggleActive(event._id, event.active)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          event.active 
            ? 'bg-[#81C99C] text-white hover:bg-[#6ba986]' 
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
      >
        {event.active ? 'Active' : 'Draft'}
      </button>
      </div>
    </div>
  );
});

export default EventItem;