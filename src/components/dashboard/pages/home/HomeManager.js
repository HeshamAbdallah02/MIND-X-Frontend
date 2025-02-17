//frontend/src/components/dashboard/pages/home/HomeManager.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Import actual section managers
import HeaderManager from './sections/header/HeaderManager';
import HeroManager from './sections/hero/HeroManager';
import BrandManager from './sections/brand/BrandManager';
import EventsManager from './sections/events/EventsManager';

// Placeholder imports (to be replaced with actual components later)
import StatsManager from './sections/stats/StatsManager';
import TestimonialsManager from './sections/testimonials/TestimonialsManager';
import PartnersManager from './sections/partners/PartnersManager';
import FAQManager from './sections/faq/FAQManager';

const HomeManager = () => {
  const [activeSection, setActiveSection] = useState('header');

  // Sections configuration
  const sections = [
    { id: 'header', name: 'Header', component: HeaderManager },
    { id: 'hero', name: 'Hero Section', component: HeroManager },
    { id: 'mission', name: 'Mission & Vision', component: BrandManager },
    { id: 'stats', name: 'Statistics', component: StatsManager },
    { id: 'events', name: 'Upcoming Events', component: EventsManager },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsManager },
    { id: 'partners', name: 'Sponsors & Partners', component: PartnersManager },
    { id: 'faq', name: 'FAQ', component: FAQManager }
  ];

  const renderContent = () => {
    const ActiveComponent = sections.find(section => section.id === activeSection)?.component;
    return ActiveComponent ? <ActiveComponent /> : null;
  };

  return (
    <>
      <Helmet>
        <title>MIND-X: Dashboard Home</title>
      </Helmet>
      <div className="h-full grid grid-cols-[280px,1fr]">
        {/* Sidebar */}
        <div className="bg-white border-r h-[calc(100vh-4rem)]">
          <nav className="p-6 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#81C99C]/10 text-[#81C99C]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content - Scrollable area */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto"> {/* Fixed height with scroll */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeManager;