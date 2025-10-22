// frontend/src/pages/EventDetailsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import EventNavbar from '../components/eventDetails/EventNavbar';
import HeroSection from '../components/eventDetails/HeroSection';
import OverviewSection from '../components/eventDetails/OverviewSection';
import SpeakersSection from '../components/eventDetails/SpeakersSection';
import ScheduleSection from '../components/eventDetails/ScheduleSection';
import GallerySection from '../components/eventDetails/GallerySection';
import RegisterSection from '../components/eventDetails/RegisterSection';
import TestimonialsSection from '../components/eventDetails/TestimonialsSection';
import Footer from '../components/home/Footer';
import EventDetailsSkeleton from '../components/eventDetails/EventDetailsSkeleton';
import ErrorState from '../components/eventDetails/ErrorState';
import NotFoundState from '../components/eventDetails/NotFoundState';
import { useEventById } from '../services/featuredEventService';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  
  // Section refs for intersection observer
  const sectionsRef = useRef({});
  
  // Fetch event data
  const { data: event, isLoading, isError, error } = useEventById(eventId);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const section = sectionsRef.current[sectionId];
    if (section) {
      const navbarHeight = 64; // Height of sticky navbar
      const targetPosition = section.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash without jumping
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  // Intersection Observer for active section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66% 0px', // Navbar height + buffer at top, more space at bottom
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Store reference to current sections for cleanup
    const currentSections = sectionsRef.current;

    // Observe all sections
    Object.values(currentSections).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(currentSections).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [event]); // Re-run when event data loads

  // Handle initial hash navigation
  useEffect(() => {
    if (event && window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  }, [event]);

  // Loading state
  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  // Error state - 404
  if (error?.response?.status === 404 || !event) {
    return <NotFoundState onBack={() => navigate('/events')} />;
  }

  // Error state - other errors
  if (isError) {
    return (
      <ErrorState 
        error={error} 
        onRetry={() => window.location.reload()} 
        onBack={() => navigate('/events')}
      />
    );
  }

  // Check if event is past or upcoming
  const eventDate = new Date(event.eventDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const isPastEvent = eventDate < now;

  // Define navigation sections dynamically based on event date
  const navSections = [
    { id: 'hero', label: 'Home' },
    { id: 'overview', label: 'Overview' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'gallery', label: 'Gallery' },
    { id: isPastEvent ? 'testimonials' : 'register', label: isPastEvent ? 'Reviews' : 'Register' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Special Event Navigation */}
      <EventNavbar
        sections={navSections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Floating Back to Events Button */}
      <button
        onClick={() => navigate('/events')}
        className="fixed top-20 left-4 z-50 inline-flex items-center gap-2 px-4 py-3 bg-white text-[#606161] hover:text-white hover:bg-[#FBB859] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={20} />
        <span className="font-medium">Back to Events</span>
      </button>

      {/* Hero Section */}
      <section
        id="hero"
        ref={(el) => (sectionsRef.current.hero = el)}
        className="scroll-mt-16"
      >
        <HeroSection event={event} />
      </section>

      {/* Content Sections with smooth scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Overview Section */}
        <section
          id="overview"
          ref={(el) => (sectionsRef.current.overview = el)}
          className="scroll-mt-16"
        >
          <OverviewSection event={event} />
        </section>

        {/* Speakers Section */}
        <section
          id="speakers"
          ref={(el) => (sectionsRef.current.speakers = el)}
          className="scroll-mt-16 bg-gray-50"
        >
          <SpeakersSection 
            speakers={event.speakers} 
            headline={event.speakersHeadline}
          />
        </section>

        {/* Schedule Section */}
        <section
          id="schedule"
          ref={(el) => (sectionsRef.current.schedule = el)}
          className="scroll-mt-16"
        >
          <ScheduleSection 
            schedule={event.schedule}
            headline={event.scheduleHeadline}
          />
        </section>

        {/* Gallery Section */}
        <section
          id="gallery"
          ref={(el) => (sectionsRef.current.gallery = el)}
          className="scroll-mt-16 bg-gray-50"
        >
          <GallerySection 
            galleryAlbums={event.galleryAlbums}
            headline={event.galleryHeadline}
          />
        </section>

        {/* Conditional Section - Register OR Testimonials based on event date */}
        {isPastEvent ? (
          // Testimonials Section - for past events
          <section
            id="testimonials"
            ref={(el) => (sectionsRef.current.testimonials = el)}
            className="scroll-mt-16"
          >
            <TestimonialsSection 
              testimonials={event.testimonials}
              headline={event.testimonialsHeadline}
            />
          </section>
        ) : (
          // Register Section - for upcoming events
          <section
            id="register"
            ref={(el) => (sectionsRef.current.register = el)}
            className="scroll-mt-16"
          >
            <RegisterSection 
              registration={event.registration}
              price={event.price}
              registrationLink={event.registrationLink}
              maxAttendees={event.maxAttendees}
              attendeeCount={event.attendeeCount}
            />
          </section>
        )}
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventDetailsPage;
