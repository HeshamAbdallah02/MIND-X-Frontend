//frontend/src/components/dashboard/hooks/useChanges.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useChangeTracker } from '../context/ChangeTrackerContext';
import isEqual from 'lodash/isEqual';

const useChanges = (initialData) => {
  const { setHasChanges, registerCallbacks } = useChangeTracker();
  const [currentData, setCurrentData] = useState(initialData);
  const initialDataRef = useRef(initialData);
  const currentDataRef = useRef(currentData);

  // Keep currentDataRef in sync
  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  // Update ref when initial data changes
  useEffect(() => {
    initialDataRef.current = initialData;
    setCurrentData(initialData);
  }, [initialData]);

  // Stabilize discard handler
  const handleDiscard = useCallback(() => {
    setCurrentData(initialDataRef.current);
    setHasChanges(false);
  }, [setHasChanges]);

  // Stabilize save handler with proper state sync
  const handleSave = useCallback(async () => {
    try {
      initialDataRef.current = currentDataRef.current;
      setCurrentData(currentDataRef.current);
      setHasChanges(false);
      return true;
    } catch (error) {
      return false;
    }
  }, [setHasChanges]);

  // Detect changes with debounced effect
  useEffect(() => {
    const hasUnsavedChanges = !isEqual(currentData, initialDataRef.current);
    setHasChanges(hasUnsavedChanges);
    registerCallbacks(handleSave, handleDiscard);
  }, [currentData, setHasChanges, registerCallbacks, handleSave, handleDiscard]);

  const updateData = useCallback((newData) => {
    setCurrentData(prev => {
      const updated = typeof newData === 'function' ? newData(prev) : newData;
      return updated;
    });
  }, []);

  // Add sync method with proper state reset
  const syncWithServer = useCallback((serverData) => {
    initialDataRef.current = serverData;
    setCurrentData(serverData);
    setHasChanges(false);
  }, [setHasChanges]);

  return {
    currentData,
    updateData,
    resetToOriginal: handleDiscard,
    syncWithServer,
    hasUnsavedChanges: !isEqual(currentData, initialDataRef.current)
  };
};

export default useChanges;