//frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { IntersectionObserverProvider } from './context/IntersectionObserverContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { HeaderConfigProvider } from './context/HeaderConfigContext';
import { BrandSettingsProvider } from './context/BrandSettingsContext';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, hideHeader = false }) => (
  <div className="min-h-screen bg-white">
    {!hideHeader && <Header />}
    <div className={!hideHeader ? "pt-16" : ""}>
      {children}
    </div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
      <IntersectionObserverProvider>
          <HeaderConfigProvider>
            <BrandSettingsProvider>
                <Router future={{ 
                  v7_startTransition: true,
                  v7_relativeSplatPath: true
                }}>
                  <Routes>
                    <Route path="/admin/login" element={
                      <Layout hideHeader>
                        <AdminLogin />
                      </Layout>
                    } />
                    <Route path="/" element={
                      <Layout>
                        <Home />
                      </Layout>
                    } />
                    <Route path="/our-story" element={
                      <Layout>
                        <OurStory />
                      </Layout>
                    } />
                    <Route path="/dashboard/*" element={
                      <Layout>
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      </Layout>
                    } />
                  </Routes>
                </Router>
                <Toaster position="top-center" />
            </BrandSettingsProvider>
          </HeaderConfigProvider>
        </IntersectionObserverProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;