// frontend/src/context/AppProviders.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthContext';
import { IntersectionObserverProvider } from './IntersectionObserverContext';
import { HeaderConfigProvider } from './HeaderConfigContext';
import { BrandSettingsProvider } from './BrandSettingsContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from '../components/ErrorBoundary';

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Combined providers component to reduce nesting
const CombinedProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrandSettingsProvider>
            <HeaderConfigProvider>
              <IntersectionObserverProvider>
                {children}
              </IntersectionObserverProvider>
            </HeaderConfigProvider>
          </BrandSettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

// Main App Providers component
export const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <CombinedProviders>
        <Router future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          <SpeedInsights />
          <Analytics />
          {children}
        </Router>
      </CombinedProviders>
    </ErrorBoundary>
  );
};

export { queryClient };