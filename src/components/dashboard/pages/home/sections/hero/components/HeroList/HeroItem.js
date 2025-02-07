//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroList/HeroItem.js
import React from 'react';

const HeroItem = ({ content, onEdit, onDelete, dragHandleProps, draggableProps, innerRef }) => {
  
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={`border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{content.heading.text}</h3>
          <p className="text-sm text-gray-500">
            {content.mediaType}
          </p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(content)}
            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(content._id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroItem;