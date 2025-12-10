// frontend/src/components/eventDetails/EventDetailsPage.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import EventNavbar from './EventNavbar';
import HeroSection from './HeroSection';
import OverviewSection from './OverviewSection';
import SpeakersSection from './SpeakersSection';
import ScheduleSection from './ScheduleSection';
import GallerySection from './GallerySection';
import RegisterSection from './RegisterSection';
import TestimonialsSection from './TestimonialsSection';
import Footer from '../home/Footer';
import EventDetailsSkeleton from './EventDetailsSkeleton';
import ErrorState from './ErrorState';
import NotFoundState from './NotFoundState';
import useEventDetails from './hooks/useEventDetails';

const EventDetailsPage = () => {
    const {
        event,
        isLoading,
        isError,
        error,
        activeSection,
        navSections,
        isPastEvent,
        scrollToSection,
        goBack,
        retryLoad,
        registerSectionRef
    } = useEventDetails();

    // Loading state
    if (isLoading) {
        return <EventDetailsSkeleton />;
    }

    // Error state - 404
    if (error?.response?.status === 404 || !event) {
        return <NotFoundState onBack={goBack} />;
    }

    // Error state - other errors
    if (isError) {
        return (
            <ErrorState
                error={error}
                onRetry={retryLoad}
                onBack={goBack}
            />
        );
    }

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
                onClick={goBack}
                className="fixed top-20 left-4 z-50 inline-flex items-center gap-2 px-4 py-3 bg-white text-[#606161] hover:text-white hover:bg-[#FBB859] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={20} />
                <span className="font-medium">Back to Events</span>
            </button>

            {/* Hero Section */}
            <section
                id="hero"
                ref={registerSectionRef('hero')}
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
                    ref={registerSectionRef('overview')}
                    className="scroll-mt-16"
                >
                    <OverviewSection event={event} />
                </section>

                {/* Speakers Section */}
                <section
                    id="speakers"
                    ref={registerSectionRef('speakers')}
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
                    ref={registerSectionRef('schedule')}
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
                    ref={registerSectionRef('gallery')}
                    className="scroll-mt-16 bg-gray-50"
                >
                    <GallerySection
                        galleryAlbums={event.galleryAlbums}
                        headline={event.galleryHeadline}
                    />
                </section>

                {/* Conditional Section - Register OR Testimonials based on event date */}
                {isPastEvent ? (
                    <section
                        id="testimonials"
                        ref={registerSectionRef('testimonials')}
                        className="scroll-mt-16"
                    >
                        <TestimonialsSection
                            testimonials={event.testimonials}
                            headline={event.testimonialsHeadline}
                        />
                    </section>
                ) : (
                    <section
                        id="register"
                        ref={registerSectionRef('register')}
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
