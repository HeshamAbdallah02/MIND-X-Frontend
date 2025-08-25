// frontend/src/App.js
import React from 'react';
import { AppProviders } from './context/AppProviders';
import AppContent from './AppContent';

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;