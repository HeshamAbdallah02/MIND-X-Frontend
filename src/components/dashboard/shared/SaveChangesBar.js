import React, { useEffect } from 'react';
import { useChangeTracker } from '../context/ChangeTrackerContext';

const SaveChangesBar = () => {
  const { 
    hasChanges, 
    isSaving,
    onSave,
    onDiscard,
    setHasChanges
  } = useChangeTracker();

  useEffect(() => {
    // Reset hasChanges when component unmounts
    return () => {
      setHasChanges(false);
    };
  }, [setHasChanges]);

  const handleSave = async () => {
    try {
      const success = await onSave();
      if (success) {
        // Ensure hasChanges is reset after successful save
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDiscard = () => {
    onDiscard();
    // Ensure hasChanges is reset after discard
    setHasChanges(false);
  };

  if (!hasChanges) return null;

  return (
    <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t shadow-lg z-[1000]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          You have unsaved changes
        </p>
        <div className="space-x-3">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            disabled={isSaving}
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-[#81C99C] rounded-lg hover:bg-[#81C99C]/90 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveChangesBar;