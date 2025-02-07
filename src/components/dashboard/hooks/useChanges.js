// useChanges.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useChangeTracker } from '../context/ChangeTrackerContext';
import isEqual from 'lodash/isEqual';

const useChanges = (initialData) => {
  const { setHasChanges, registerCallbacks } = useChangeTracker();
  const [currentData, setCurrentData] = useState(initialData);
  const initialDataRef = useRef(initialData);

  // Stabilize discard handler with ref
  const handleDiscard = useCallback(() => {
    setCurrentData(initialDataRef.current);
  }, []);

  // Stabilize save handler
  const handleSave = useCallback(async () => true, []);

  // Update ref when initial data changes
  useEffect(() => {
    initialDataRef.current = initialData;
    setCurrentData(initialData);
  }, [initialData]);

  // Detect changes and register stable callbacks
  useEffect(() => {
    const hasUnsavedChanges = !isEqual(currentData, initialDataRef.current);
    setHasChanges(hasUnsavedChanges);
    registerCallbacks(handleSave, handleDiscard);
  }, [currentData, setHasChanges, registerCallbacks, handleSave, handleDiscard]);

  // Stabilized update function
  const updateData = useCallback((newData) => {
    setCurrentData(prev => typeof newData === 'function' ? newData(prev) : newData);
  }, []);

  return { currentData, updateData };
};

export default useChanges;