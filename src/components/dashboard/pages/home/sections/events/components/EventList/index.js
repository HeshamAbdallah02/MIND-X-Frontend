//frontend/src/components/dashboard/pages/home/sections/events/components/EventList/index.js
import React, { useState, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FiPlus } from 'react-icons/fi';
import EventCard from './EventCard';
import useEventsConfig from '../../hooks/useEventsConfig';
import VirtualizedEventList from './VirtualizedEventList';
import useIntersection from '../../../../../../../../hooks/useIntersection';

const EventList = React.memo(({ events, onDelete, onToggleActive, onReorder, onSuccess }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const eventsConfig = useEventsConfig({ fetchEvents: onSuccess });
  const [containerRef] = useIntersection({ threshold: 0.1 });

  const [activeEvents, inactiveEvents] = useMemo(() => 
    events.reduce((acc, event) => {
      acc[event.active ? 0 : 1].push(event);
      return acc;
    }, [[], []]), 
  [events]);

  const sortedActive = useMemo(() => 
    [...activeEvents].sort((a, b) => a.order - b.order), 
  [activeEvents]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    onReorder(result.draggableId, result.destination.index);
  }, [onReorder]);

  // Memoized handlers
  const memoizedHandlers = useMemo(() => ({
    handleAddNew: () => {
      setActiveCardId('new');
      eventsConfig.resetForm();
    },
    handleEdit: (event) => {
      setActiveCardId(event._id);
      eventsConfig.editEvent(event);
    },
    handleCancel: () => {
      setActiveCardId(null);
      eventsConfig.resetForm();
    },
    handleSuccess: () => {
      setActiveCardId(null);
      onSuccess();
    }
  }), [eventsConfig, onSuccess]);

  const renderDraggableItem = useCallback((event, index, isActive = true) => (
    <Draggable 
      key={event._id} 
      draggableId={event._id} 
      index={index}
      isDragDisabled={activeCardId !== null}
    >
     {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <EventCard
          event={event}
          config={eventsConfig}
          isEditing={activeCardId === event._id}
          onEdit={() => memoizedHandlers.handleEdit(event)}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onCancel={memoizedHandlers.handleCancel}
          onSuccess={memoizedHandlers.handleSuccess}
          draggableProps={provided.draggableProps}
          dragHandleProps={provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        />
      </div>
    )}
  </Draggable>
), [activeCardId, eventsConfig, memoizedHandlers, onDelete, onToggleActive]);

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Add New Card */}
      <div 
        className={`p-6 border-3 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
          ${activeCardId === 'new' ? 'border-[#FBB859] bg-[#FBB859]/10' : 'border-[#81C99C]/30 hover:border-[#81C99C]'}
          hover:shadow-lg group`}
        onClick={() => !activeCardId && memoizedHandlers.handleAddNew()}
      >
        {activeCardId === 'new' ? (
          <EventCard
            isNew
            config={eventsConfig}
            onCancel={memoizedHandlers.handleCancel}
            onSuccess={memoizedHandlers.handleSuccess}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <FiPlus className="w-10 h-10 text-[#81C99C] transition-transform group-hover:rotate-90" />
            <span className="text-lg font-medium text-[#606161] group-hover:text-[#81C99C]">
              Add New Event
            </span>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Active Events */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-[#81C99C]">
            Active Events ({activeEvents.length})
          </h3>
          <Droppable droppableId="active-events" type="EVENT">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {sortedActive.map((event, index) => renderDraggableItem(event, index))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Inactive Events - Virtualized */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4 text-[#FBB859]">
            Inactive Drafts ({inactiveEvents.length})
          </h3>
          <VirtualizedEventList
            events={inactiveEvents}
            Component={({ event, style }) => (
              <div style={style} className="px-4">
                <EventCard
                  event={event}
                  config={eventsConfig}
                  isEditing={activeCardId === event._id}
                  onEdit={() => memoizedHandlers.handleEdit(event)}
                  onDelete={onDelete}
                  onToggleActive={onToggleActive}
                  onCancel={memoizedHandlers.handleCancel}
                  onSuccess={memoizedHandlers.handleSuccess}
                  isDragging={false}
                />
              </div>
            )}
          />
        </div>
      </DragDropContext>
    </div>
  );
});

export default EventList;