// frontend/src/AppContent.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import FormViewPage from './pages/FormViewPage';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import SplashScreen from './components/SplashScreen';
import { useInitialLoad } from './hooks/useInitialLoad';

const Layout = ({ children, hideHeader = false }) => (
  <div className="min-h-screen bg-white">
    {!hideHeader && <Header />}
    <div className={!hideHeader ? "pt-16" : ""}>
      {children}
    </div>
  </div>
);

const DevelopmentPage = ({ title }) => (
  <div>
    <h1 className="text-4xl font-bold text-center mt-10">{title}</h1>
    <p className="text-lg text-center mt-5">
      This Page Is still under development.
    </p>
  </div>
);

export default function AppContent() {
  const { isLoading, progress } = useInitialLoad();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsInitialLoad(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      {isInitialLoad && <SplashScreen progress={progress} />}
      <Toaster position="top-center" />
      
      <Routes>
        <Route path={`/${process.env.REACT_APP_ADMIN_PATH}/access`} element={
          <Layout hideHeader>
            <AdminLogin />
          </Layout>
        } />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/our-story" element={<Layout><OurStory /></Layout>} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="/forms/:slug" element={<Layout><FormViewPage /></Layout>} />
        <Route path="/trainings" element={<Layout><DevelopmentPage title="Trainings" /></Layout>} />
        <Route path="/crew" element={<Layout><DevelopmentPage title="Crew" /></Layout>} />
        <Route path="/daily-life" element={<Layout><DevelopmentPage title="Daily Life" /></Layout>} />
        <Route path="/blog" element={<Layout><DevelopmentPage title="Blog" /></Layout>} />
        <Route path={`/${process.env.REACT_APP_DASHBOARD_PATH}/*`} element={
          <Layout>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </Layout>
        } />
      </Routes>
    </>
  );
}