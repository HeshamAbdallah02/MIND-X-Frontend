//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroList/index.js
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import HeroItem from './HeroItem';

const HeroList = ({ contents, onEdit, onDelete, onReorder }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.draggableId, result.destination.index);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Hero Contents</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="hero-contents" type="hero">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-4 ${
                snapshot.isDraggingOver ? 'bg-gray-50' : ''
              }`}
            >
              {contents.map((content, index) => (
                <Draggable
                  key={content._id.toString()}
                  draggableId={content._id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <HeroItem
                      content={content}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      dragHandleProps={provided.dragHandleProps}
                      draggableProps={provided.draggableProps}
                      innerRef={provided.innerRef}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default HeroList;