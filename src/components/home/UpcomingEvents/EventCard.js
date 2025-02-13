// frontend/src/components/home/Events/EventCard.js
import React, { useRef, useCallback, useLayoutEffect } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

const EventCard = React.memo(({ event, className }) => {
  const cardRef = useRef();

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateZ(0)';
      }
    }, { threshold: 0.1 });

    if (cardRef.current) observer.observe(cardRef.current);
    
    return () => observer.disconnect();
  }, []);

  const handleCardClick = useCallback((e) => {
    if (!event?.url) return;
    if (e.type !== 'click') e.preventDefault();
    const newWindow = window.open(event.url, '_blank', 'noopener,noreferrer');
    newWindow?.focus();
  }, [event?.url]);

  if (!event) return null;

  return (
    <div
      role={event.url ? 'link' : 'article'}
      tabIndex={event.url ? 0 : -1}
      onClick={handleCardClick}
      onKeyDown={handleCardClick}
      className={`relative rounded-lg overflow-hidden shadow-lg h-full flex flex-col 
        transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]
        hover:scale-[0.97] hover:shadow-xl 
        active:scale-95 focus:scale-[0.97] focus:outline-none
        ${event.url ? 
          'cursor-pointer focus:ring-2 focus:ring-[#81C99C]' : 
          'cursor-default'}
        ${className}`}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)' // GPU acceleration
      }}
    >
      {/* Image container with isolated hover */}
      <div className="relative pb-[56.25%] bg-gray-100 overflow-hidden">
        <img
          src={event.coverImage?.url}
          alt={event.coverImage?.alt || event.title?.text || 'Event'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
      </div>

      {/* Content area with dynamic hover effect */}
      <div
        className="relative p-6 flex-1 flex flex-col space-y-3"
        style={{ 
          backgroundColor: event.contentAreaColor || '#81C99C',
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* Hover overlay */}
        <div 
          className="absolute inset-0 bg-current opacity-0 transition-opacity duration-300 hover:opacity-20"
          aria-hidden="true"
        />
        
        {/* Content wrapper */}
        <div className="relative">
          <h3 className="text-xl font-semibold truncate" style={{ color: event.title?.color || '#606161' }}>
            {event.title?.text || 'Untitled Event'}
          </h3>
          
          <p 
            className="text-sm line-clamp-3" 
            style={{ color: event.description?.color || '#606161' }}
          >
            {event.description?.text || 'No description available'}
          </p>

          <div className="flex items-center text-sm font-medium mt-auto" style={{ color: event.date?.color || '#FBB859' }}>
            <FaRegCalendarAlt className="flex-shrink-0 mr-2" />
            <span className="truncate">{event.date?.text || 'Date TBA'}</span>
          </div>
        </div>
      </div>

      {/* Semantic link overlay */}
      {event.url && (
        <a
          href={event.url}
          className="absolute inset-0 opacity-0"
          aria-label={`Visit ${event.title?.text} website`}
          target="_blank"
          rel="noopener noreferrer"
        />
      )}
    </div>
  );
});

export default EventCard;