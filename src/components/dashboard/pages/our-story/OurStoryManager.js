//frontend/src/components/dashboard/pages/our-story/OurStoryManager.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import StoryHeroManager from './sections/hero/StoryHeroManager';
import AwardsManager from './sections/awards/AwardsManager';

const OurStoryManager = () => {
  const [activeSection, setActiveSection] = useState('hero');

  // Sections configuration
  const sections = [
    { id: 'hero', name: 'Hero Section', component: StoryHeroManager },
    { id: 'journey', name: 'Journey Timeline', component: null }, // Future implementation
    { id: 'awards', name: 'Awards & Recognition', component: AwardsManager },
    { id: 'season', name: 'Season Highlights', component: null }, // Future implementation
    { id: 'join', name: 'Join Us CTA', component: null }, // Future implementation
  ];

  const renderContent = () => {
    const ActiveComponent = sections.find(section => section.id === activeSection)?.component;
    
    if (!ActiveComponent) {
      return (
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Section Under Development</h3>
          <p className="text-gray-600">This section is not yet available for editing.</p>
        </div>
      );
    }
    
    return <ActiveComponent />;
  };

  return (
    <>
      <Helmet>
        <title>MIND-X: Our Story Management</title>
      </Helmet>
      <div className="h-full grid grid-cols-[280px,1fr]">
        {/* Sidebar */}
        <div className="bg-white border-r h-[calc(100vh-4rem)]">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Our Story</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your story content</p>
          </div>
          <nav className="p-6 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                disabled={!section.component}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#81C99C]/10 text-[#81C99C]'
                    : section.component 
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{section.name}</span>
                  {!section.component && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                      Soon
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content - Scrollable area */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
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

export default OurStoryManager;
