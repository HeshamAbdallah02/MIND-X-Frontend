// frontend/src/pages/Dashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChangeTrackerProvider } from '../components/dashboard/context/ChangeTrackerContext';
import SaveChangesBar from '../components/dashboard/shared/SaveChangesBar';
import HomeManager from '../components/dashboard/pages/home/HomeManager';
import BlogManager from '../components/dashboard/pages/blog/BlogManager';
import OurStoryManager from '../components/dashboard/pages/our-story/OurStoryManager';
import EventsManager from '../components/dashboard/pages/events/EventsManager';
import FormsManager from '../components/dashboard/pages/forms/FormsManager';
import FormResponses from '../components/dashboard/pages/forms/sections/FormResponses';
import TrainingsManager from '../components/dashboard/pages/trainings/TrainingsManager';
import CrewManager from '../components/dashboard/pages/crew/CrewManager';

const Dashboard = () => {
  return (
    <ChangeTrackerProvider>
      <div className="h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
        <Routes>
          <Route path="/" element={<HomeManager />} />
          <Route path="/our-story" element={<OurStoryManager />} />
          <Route path="/events" element={<EventsManager />} />
          <Route path="/forms" element={<FormsManager />} />
          <Route path="/forms/:id/responses" element={<FormResponses />} />
          <Route path="/trainings" element={<TrainingsManager />} />
          <Route path="/crew" element={<CrewManager />} />
          <Route path="/daily-life" element={<div>Daily Life Page</div>} />
          <Route path="/blog" element={<BlogManager />} />
        </Routes>
        <SaveChangesBar />
      </div>
    </ChangeTrackerProvider>
  );
};

export default Dashboard;