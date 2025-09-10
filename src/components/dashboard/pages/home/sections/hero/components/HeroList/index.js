//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroList/index.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FiPlus } from 'react-icons/fi';
import HeroCard from './HeroCard';
import useHeroConfig from '../../hooks/useHeroConfig';

const HeroList = ({ contents = [], onDelete, onReorder, onSuccess, isReordering = false }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const heroConfig = useHeroConfig({ fetchContents: onSuccess });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    if (source.index === destination.index) {
      return; // Item dropped in the same position
    }

    // Create reordered array
    const reorderedContents = Array.from(contents);
    const [movedContent] = reorderedContents.splice(source.index, 1);
    reorderedContents.splice(destination.index, 0, movedContent);

    // Pass the full reordered array to the parent
    onReorder(reorderedContents);
  };

  const handleAddNew = () => {
    setActiveCardId('new');
    heroConfig.setFormData(heroConfig.initialFormData); // Just reset to initial state
  };

  const handleEdit = (content) => {
    setActiveCardId(content._id);
    heroConfig.editContent(content);
  };

  const handleCancel = () => {
    setActiveCardId(null);
    heroConfig.resetForm();
  };

  const handleSuccess = () => {
    setActiveCardId(null);
    onSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Add New Card */}
      <div 
        className={`p-6 border-3 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
          ${activeCardId === 'new' ? 'border-[#FBB859] bg-[#FBB859]/10' : 'border-[#81C99C]/30 hover:border-[#81C99C]'}
          hover:shadow-lg group`}
        onClick={() => !activeCardId && handleAddNew()}
      >
        {activeCardId === 'new' ? (
          <HeroCard
            isNew
            config={heroConfig}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <FiPlus className="w-10 h-10 text-[#81C99C] transition-transform group-hover:rotate-90" />
            <span className="text-lg font-medium text-[#606161] group-hover:text-[#81C99C]">
              Add New Hero Content
            </span>
          </div>
        )}
      </div>

      {/* Content List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="hero-contents" type="hero">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {contents.map((content, index) => (
                <Draggable
                  key={content._id}
                  draggableId={content._id.toString()}
                  index={index}
                  isDragDisabled={activeCardId !== null || isReordering}
                >
                  {(provided, snapshot) => (
                    <HeroCard
                      content={content}
                      config={heroConfig}
                      isEditing={activeCardId === content._id}
                      onEdit={() => handleEdit(content)}
                      onDelete={onDelete}
                      onCancel={handleCancel}
                      onSuccess={handleSuccess}
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