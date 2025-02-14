import React from 'react';
import { useChangeTracker } from '../../../../../../context/ChangeTrackerContext';

const LogoPreview = ({ logo, tempPreviewUrl, onDelete }) => {
  const { hasChanges } = useChangeTracker();
  const displayUrl = tempPreviewUrl || logo.imageUrl;

  return displayUrl ? (
    <div className="mt-4 relative group">
      <img
        src={displayUrl}
        alt={logo.altText}
        className="h-12 object-contain"
      />
      <button
        onClick={onDelete}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete logo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {tempPreviewUrl && hasChanges && (
        <p className="text-sm text-gray-500 mt-2">
          *Unsaved changes
        </p>
      )}
    </div>
  ) : null;
};

export default LogoPreview;