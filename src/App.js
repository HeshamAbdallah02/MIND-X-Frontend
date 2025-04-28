// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { IntersectionObserverProvider } from './context/IntersectionObserverContext';
import { HeaderConfigProvider } from './context/HeaderConfigContext';
import { BrandSettingsProvider } from './context/BrandSettingsContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import AppContent from './AppContent';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrandSettingsProvider>
          <HeaderConfigProvider>
            <IntersectionObserverProvider>
              <Router future={{ 
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}>
                <SpeedInsights />
                <Analytics />
                <AppContent />
              </Router>
            </IntersectionObserverProvider>
          </HeaderConfigProvider>
        </BrandSettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;