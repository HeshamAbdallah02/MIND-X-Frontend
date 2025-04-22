// frontend/src/context/IntersectionObserverContext.js
import React, { createContext, useContext, useMemo, useRef } from 'react';

const IntersectionObserverContext = createContext(null);

const optionsToString = (options) => 
  JSON.stringify({
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.15,
    ...options
  });

export const IntersectionObserverProvider = ({ children }) => {
  const observerMap = useRef(new Map()); // Stores observer instances and their element counts
  const callbacks = useRef(new WeakMap());

  const value = useMemo(() => ({
    register: (element, callback, options = {}) => {
      const optionsKey = optionsToString(options);
      
      if (!observerMap.current.has(optionsKey)) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const cb = callbacks.current.get(entry.target);
            if (cb) cb(entry);
          });
        }, JSON.parse(optionsKey));

        observerMap.current.set(optionsKey, {
          observer,
          count: 0
        });
      }

      const { observer, count } = observerMap.current.get(optionsKey);
      callbacks.current.set(element, callback);
      observer.observe(element);
      observerMap.current.set(optionsKey, { 
        observer, 
        count: count + 1 
      });

      return () => {
        observer.unobserve(element);
        callbacks.current.delete(element);
        
        const current = observerMap.current.get(optionsKey);
        if (current.count === 1) {
          observer.disconnect();
          observerMap.current.delete(optionsKey);
        } else {
          observerMap.current.set(optionsKey, {
            observer,
            count: current.count - 1
          });
        }
      };
    }
  }), []);

  return (
    <IntersectionObserverContext.Provider value={value}>
      {children}
    </IntersectionObserverContext.Provider>
  );
};

export const useIntersectionSystem = () => {
  const context = useContext(IntersectionObserverContext);
  if (!context) throw new Error('Missing IntersectionObserverProvider');
  return context;
};