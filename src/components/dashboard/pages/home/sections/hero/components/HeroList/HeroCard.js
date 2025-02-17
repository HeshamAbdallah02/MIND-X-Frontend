//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroList/HeroCard.js
import React from 'react';
import { FiEdit, FiTrash, FiX } from 'react-icons/fi';
import HeroForm from '../HeroForm';

const HeroCard = ({ 
  content,
  config,
  isNew,
  isEditing,
  onEdit,
  onDelete,
  onCancel,
  onSuccess,
  dragHandleProps,
  draggableProps,
  innerRef
}) => {
  if (isEditing || isNew) {
    return (
      <div
        ref={innerRef}
        {...draggableProps}
        className="p-6 rounded-2xl border-2 border-[#FBB859] bg-[#FBB859]/05"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#606161]">
            {isNew ? 'Add New Content' : 'Edit Content'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 text-[#606161] hover:text-[#FBB859]"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <HeroForm
          formData={config.formData}
          setFormData={config.setFormData}
          isEditing={!isNew}
          isUploading={config.isUploading}
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
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="p-6 rounded-2xl transition-all duration-300 border border-[#606161]/10 hover:border-[#81C99C]/50 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-[#FBB859] mb-1">
            {content.heading.text || 'Untitled'}
          </p>
          <p className="text-sm text-[#606161]">
            {content.mediaType || 'image'} • {content.displayDuration || 5000}ms display
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-[#81C99C]/10 text-[#606161] hover:text-[#FBB859] transition-colors"
          >
            <FiEdit className="w-6 h-6" />
          </button>
          <button
            onClick={() => onDelete(content._id)}
            className="p-2 rounded-lg hover:bg-red-100/50 text-[#606161] hover:text-red-500 transition-colors"
          >
            <FiTrash className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;