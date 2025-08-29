// frontend/src/pages/Dashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChangeTrackerProvider } from '../components/dashboard/context/ChangeTrackerContext';
import SaveChangesBar from '../components/dashboard/shared/SaveChangesBar';
import HomeManager from '../components/dashboard/pages/home/HomeManager';
import BlogManager from '../components/dashboard/pages/blog/BlogManager';
import OurStoryManager from '../components/dashboard/pages/our-story/OurStoryManager';

const Dashboard = () => {
  return (
    <ChangeTrackerProvider>
      <div className="h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
        <Routes>
          <Route path="/" element={<HomeManager />} />
          <Route path="/our-story" element={<OurStoryManager />} />
          <Route path="/events" element={<div>Events Page</div>} />
          <Route path="/trainings" element={<div>Trainings Page</div>} />
          <Route path="/crew" element={<div>Crew Page</div>} />
          <Route path="/daily-life" element={<div>Daily Life Page</div>} />
          <Route path="/blog" element={<BlogManager />} />
        </Routes>
        <SaveChangesBar />
      </div>
    </ChangeTrackerProvider>
  );
};

export default Dashboard;