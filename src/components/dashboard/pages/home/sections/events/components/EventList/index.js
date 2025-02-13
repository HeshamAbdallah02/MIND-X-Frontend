// frontend/src/components/dashboard/pages/home/sections/events/components/EventList/index.js
import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import EventItem from './EventItem';

const EventList = ({ events, onEdit, onDelete, onToggleActive, onReorder }) => {
  // Log events to understand their structure
  useEffect(() => {
    console.log('All Events:', events);
  }, [events]);

  // Separate active/inactive events with more explicit logging
  const [activeEvents, inactiveEvents] = events.reduce((acc, event) => {
    console.log(`Event: ${event.title.text}, Active: ${event.active}`);
    acc[event.active ? 0 : 1].push(event);
    return acc;
  }, [[], []]);

  // Log separated events
  useEffect(() => {
    console.log('Active Events:', activeEvents);
    console.log('Inactive Events:', inactiveEvents);
  }, [activeEvents, inactiveEvents]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.draggableId, result.destination.index);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#606161]">Manage Events</h2>

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
                {activeEvents.map((event, index) => (
                  <Draggable 
                    key={event._id} 
                    draggableId={event._id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <EventItem
                        event={event}
                        ref={provided.innerRef}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleActive={onToggleActive}
                        isDragging={snapshot.isDragging}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Inactive Events */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4 text-[#FBB859]">
            Inactive Drafts ({inactiveEvents.length})
          </h3>
          <Droppable droppableId="inactive-events" type="EVENT">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {inactiveEvents.map((event, index) => (
                  <Draggable 
                    key={event._id} 
                    draggableId={event._id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <EventItem
                        event={event}
                        ref={provided.innerRef}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleActive={onToggleActive}
                        isDragging={snapshot.isDragging}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default EventList;