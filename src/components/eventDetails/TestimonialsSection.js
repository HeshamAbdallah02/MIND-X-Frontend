// frontend/src/components/eventDetails/TestimonialsSection.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser } from 'react-icons/fi';

const TestimonialsSection = ({ testimonials, headline }) => {
  const defaultHeadline = headline || 'What Attendees Say';

  // Handle empty testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-black mb-4">{defaultHeadline}</h2>
            <p className="text-[#606161] text-lg">Testimonials coming soon...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${
              star <= rating ? 'text-[#FBB859] fill-[#FBB859]' : 'text-gray-300'
            }`}
            size={18}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-4">{defaultHeadline}</h2>
          <p className="text-[#606161] text-lg max-w-3xl mx-auto">
            Hear from attendees who experienced this event
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="mb-4">
                {renderStars(testimonial.rating || 5)}
              </div>

              {/* Comment */}
              <p className="text-[#606161] leading-relaxed mb-6 line-clamp-4">
                "{testimonial.comment}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#FBB859]/20 flex items-center justify-center">
                    <FiUser className="text-[#FBB859]" size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-black">{testimonial.name}</h4>
                  {testimonial.role && (
                    <p className="text-sm text-[#606161]">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Summary */}
        {testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-[#FBB859]/10 to-[#81C99C]/10 rounded-lg p-8 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-4xl font-bold text-[#FBB859] mb-2">
                  {testimonials.length}
                </p>
                <p className="text-[#606161]">Reviews</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#FBB859] mb-2">
                  {(
                    testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) /
                    testimonials.length
                  ).toFixed(1)}
                </p>
                <p className="text-[#606161]">Average Rating</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#FBB859] mb-2">
                  {Math.round(
                    (testimonials.filter((t) => (t.rating || 5) >= 4).length /
                      testimonials.length) *
                      100
                  )}%
                </p>
                <p className="text-[#606161]">Satisfaction Rate</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;
