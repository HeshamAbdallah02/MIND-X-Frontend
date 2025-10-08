// frontend/src/pages/EventsPage.js
// Events Page - Display featured and past events
import React from 'react';
import { FeaturedEventSection, EventsCTA, PastEventsSection } from '../components/events';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navbar - Already exists */}
      <Header />

      {/* Featured Event Section */}
      <FeaturedEventSection />

      {/* Past Events Section with Search & Filters */}
      <PastEventsSection />

      {/* Host Event CTA Section */}
      <EventsCTA />

      {/* Footer - Already exists */}
      <Footer />
    </div>
  );
};

export default EventsPage;
