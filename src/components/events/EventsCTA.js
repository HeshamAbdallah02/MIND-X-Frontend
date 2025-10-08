// frontend/src/components/events/EventsCTA.js
// Dedicated CTA section for Events page - Host Event Collaboration
import React from 'react';
import { motion } from 'framer-motion';

const EventsCTA = () => {
  return (
    <section className="w-full py-16 px-4 bg-gradient-to-br from-[#FBB859] to-[#f9a63d]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Host an Event with Us?
          </h3>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for collaboration opportunities. 
            If you have an idea for an event or workshop, let's make it happen together!
          </p>
          <a
            href="mailto:events@mindx.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FBB859] rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Us
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsCTA;
