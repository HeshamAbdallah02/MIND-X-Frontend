// frontend/src/components/eventDetails/hooks/useEventDetails.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventById } from '../../../services/featuredEventService';

const useEventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');

    // Section refs for intersection observer
    const sectionsRef = useRef({});

    // Fetch event data
    const { data: event, isLoading, isError, error } = useEventById(eventId);

    // Smooth scroll to section
    const scrollToSection = useCallback((sectionId) => {
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
    }, []);

    // Navigation handlers
    const goBack = useCallback(() => {
        navigate('/events');
    }, [navigate]);

    const retryLoad = useCallback(() => {
        window.location.reload();
    }, []);

    // Intersection Observer for active section detection
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -66% 0px',
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

        const currentSections = sectionsRef.current;

        Object.values(currentSections).forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            Object.values(currentSections).forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, [event]);

    // Handle initial hash navigation
    useEffect(() => {
        if (event && window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            setTimeout(() => scrollToSection(sectionId), 100);
        }
    }, [event, scrollToSection]);

    // Computed values
    const eventDate = event ? new Date(event.eventDate) : null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const isPastEvent = eventDate ? eventDate < now : false;

    // Navigation sections
    const navSections = [
        { id: 'hero', label: 'Home' },
        { id: 'overview', label: 'Overview' },
        { id: 'speakers', label: 'Speakers' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'gallery', label: 'Gallery' },
        { id: isPastEvent ? 'testimonials' : 'register', label: isPastEvent ? 'Reviews' : 'Register' }
    ];

    // Register section ref
    const registerSectionRef = (id) => (el) => {
        sectionsRef.current[id] = el;
    };

    return {
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
    };
};

export default useEventDetails;
