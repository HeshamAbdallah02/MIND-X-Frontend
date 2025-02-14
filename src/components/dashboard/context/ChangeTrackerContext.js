// frontend/src/components/dashboard/context/ChangeTrackerContext.js
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ChangeTrackerContext = createContext();

export const ChangeTrackerProvider = ({ children }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveCallbackRef = useRef(null);
  const discardCallbackRef = useRef(null);

  const registerCallbacks = useCallback((save, discard) => {
    saveCallbackRef.current = save;
    discardCallbackRef.current = discard;
  }, []);

  const handleSave = async () => {
    if (!saveCallbackRef.current) return false;
    
    setIsSaving(true);
    try {
      const success = await saveCallbackRef.current();
      if (success) {
        setHasChanges(false);
        // Ensure state is properly synchronized
        setTimeout(() => {
          setHasChanges(false);
        }, 0);
      }
      return success;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (discardCallbackRef.current) {
      discardCallbackRef.current();
      setHasChanges(false);
      // Ensure state is properly synchronized
      setTimeout(() => {
        setHasChanges(false);
      }, 0);
    }
  };

  const value = {
    hasChanges,
    setHasChanges,
    isSaving,
    registerCallbacks,
    onSave: handleSave,
    onDiscard: handleDiscard
  };

  return (
    <ChangeTrackerContext.Provider value={value}>
      {children}
    </ChangeTrackerContext.Provider>
  );
};

export const useChangeTracker = () => {
  const context = useContext(ChangeTrackerContext);
  if (!context) {
    throw new Error('useChangeTracker must be used within a ChangeTrackerProvider');
  }
  return context;
};