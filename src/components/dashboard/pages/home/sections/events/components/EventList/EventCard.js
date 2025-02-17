// frontend/src/components/dashboard/pages/home/sections/events/components/EventList/EventCard.js
import React from 'react';
import { FaEdit, FaTrash, FaGripVertical, FaTimes } from 'react-icons/fa';
import EventForm from '../EventForm';
import useIntersection from '../../../../../../../../hooks/useIntersection';

const EventCard = React.forwardRef(({
  event = {}, 
  config,
  isNew,
  isEditing,
  onEdit,
  onDelete,
  onToggleActive,
  onCancel,
  onSuccess,
  dragHandleProps,
  draggableProps,
  isDragging
}, ref) => {
  const [intersectionRef, isVisible] = useIntersection({ threshold: 0.1 });

  const setRefs = (node) => {
    intersectionRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  if (isEditing || isNew) {
    return (
      <div
        ref={setRefs}
        {...draggableProps}
        className="p-6 rounded-2xl border-2 border-[#FBB859] bg-[#FBB859]/05"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#606161]">
            {isNew ? 'Add New Event' : 'Edit Event'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 text-[#606161] hover:text-[#FBB859]"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <EventForm
          formData={config.formData}
          setFormData={config.setFormData}
          isEditing={!isNew}
          isUploading={config.isUploading}
          hasChanges={config.hasChanges}
          handleSubmit={async (e) => {
            await config.handleSubmit(e);
            onSuccess();
          }}
          handleFileUpload={config.handleFileUpload}
          resetForm={onCancel}
        />
      </div>
    );
  }

  return (
    <div
      ref={setRefs}
      {...draggableProps}
      className={`group flex items-center p-4 rounded-lg transition-colors ${
        event?.active 
          ? 'bg-white shadow-sm border hover:bg-gray-50'
          : 'bg-gray-50 border-dashed opacity-75'
      } ${
        isDragging ? 'border-[#81C99C]' : 'border-gray-200'
      } relative`}
      style={{
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="flex-shrink-0 p-2 mr-2 text-gray-400 hover:text-[#81C99C] cursor-grab"
      >
        <FaGripVertical className="text-lg transform hover:scale-125 transition-transform" />
      </div>

      {isVisible && (
        <>
          <div className="flex-1 flex items-center space-x-4 min-w-0">
            <div className="flex-shrink-0 relative w-16 h-16 rounded overflow-hidden">
              <img
                src={event?.coverImage?.url || ''}
                alt={event?.coverImage?.alt || ''}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 
                className="text-lg font-medium truncate"
                style={{ color: event?.title?.color || '#606161' }}
              >
                {event?.title?.text || 'New Event'}
              </h3>
              <p 
                className="text-sm line-clamp-2"
                style={{ color: event?.description?.color || '#606161' }}
              >
                {event?.description?.text || ''}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span 
                  className="text-sm font-medium truncate"
                  style={{ color: event?.date?.color || '#FBB859' }}
                >
                  {event?.date?.text || ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
            {event?.active && (
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-gray-500 hover:text-[#81C99C] transition-colors"
              >
                <FaEdit className="text-lg" />
              </button>
            )}
            
            <button
              onClick={() => onDelete(event?._id)}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <FaTrash className="text-lg" />
            </button>

            <button
              onClick={() => onToggleActive(event?._id, event?.active)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                event?.active 
                  ? 'bg-[#81C99C] text-white hover:bg-[#6ba986]' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {event?.active ? 'Active' : 'Draft'}
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default React.memo(EventCard, (prevProps, nextProps) => {
  // Basic prop comparison
  const basicPropsEqual = (
    prevProps.event?._id === nextProps.event?._id &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.event?.active === nextProps.event?.active &&
    JSON.stringify(prevProps.event?.title) === JSON.stringify(nextProps.event?.title) &&
    JSON.stringify(prevProps.event?.description) === JSON.stringify(nextProps.event?.description) &&
    JSON.stringify(prevProps.event?.date) === JSON.stringify(nextProps.event?.date)
  );

  // Additional check for form data when editing
  if (nextProps.isEditing || nextProps.isNew) {
    const formDataEqual = JSON.stringify(prevProps.config.formData) === 
                         JSON.stringify(nextProps.config.formData);
    return basicPropsEqual && formDataEqual;
  }

  return basicPropsEqual;
});