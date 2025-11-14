// frontend/src/pages/TrainingsPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Footer from '../components/home/Footer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TrainingsPage = () => {
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  // Fetch hero section
  const { data: hero } = useQuery({
    queryKey: ['training-hero-public'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/training-hero/public`);
        return data;
      } catch (error) {
        // Return null if hero doesn't exist yet
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false
  });

  // Fetch trainings
  const { data: trainings = [], isLoading } = useQuery({
    queryKey: ['trainings-public'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/trainings/public`);
      console.log('Trainings data:', data);
      return data;
    }
  });

  // Fetch CTA
  const { data: cta } = useQuery({
    queryKey: ['training-cta-public'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/training-cta/public`);
        return data;
      } catch (error) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false
  });

  // Filter trainings
  const filteredTrainings = trainings.filter(training => {
    if (filter === 'upcoming') return training.status === 'upcoming' || training.status === 'ongoing';
    if (filter === 'past') return training.status === 'completed';
    return true;
  });

  const scrollToTrainings = () => {
    document.getElementById('trainings-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>MIND-X: Training Programs</title>
        <meta name="description" content="Discover our specialized training programs designed to enhance your personal and professional growth" />
      </Helmet>

      {/* Hero Section */}
      {(hero?.isActive && hero?.backgroundImage?.url) ? (
        <div
          className="relative bg-cover bg-center h-screen"
          style={{
            backgroundImage: `url(${hero.backgroundImage.url})`
          }}
        >
          {/* Overlay */}
          {hero.overlay?.enabled && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: hero.overlay.color || '#000000',
                opacity: hero.overlay.opacity || 0.5
              }}
            />
          )}

          {/* Content */}
          <div
            className={`relative h-full flex flex-col ${
              hero.layout?.verticalAlign === 'top' ? 'justify-start pt-32' :
              hero.layout?.verticalAlign === 'bottom' ? 'justify-end pb-32' :
              'justify-center'
            } ${
              hero.layout?.textAlign === 'left' ? 'items-start text-left' :
              hero.layout?.textAlign === 'right' ? 'items-end text-right' :
              'items-center text-center'
            } px-6`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1
                className="text-5xl md:text-6xl font-bold mb-6"
                style={{ color: hero.heading?.color || '#FFFFFF' }}
              >
                {hero.heading?.text || 'Expand Your Skills'}
              </h1>
              
              {hero.subheading?.text && (
                <p
                  className="text-xl md:text-2xl mb-8 max-w-3xl"
                  style={{ color: hero.subheading?.color || '#FFFFFF' }}
                >
                  {hero.subheading.text}
                </p>
              )}

              {hero.cta?.enabled && (
                <button
                  onClick={scrollToTrainings}
                  className="mt-8 text-white hover:opacity-80 transition-opacity flex items-center gap-2 mx-auto"
                >
                  <span className="text-lg">{hero.cta.text || 'View Trainings'}</span>
                  <FiChevronDown size={24} className="animate-bounce" />
                </button>
              )}
            </motion.div>
          </div>
        </div>
      ) : (
        /* Default Hero Section */
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 h-screen">
          <div className="absolute inset-0 bg-black opacity-40" />
          
          <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Expand Your Skills
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-3xl text-white">
                Discover our specialized training programs designed to enhance your personal and professional growth
              </p>

              <button
                onClick={scrollToTrainings}
                className="mt-8 text-white hover:opacity-80 transition-opacity flex items-center gap-2 mx-auto"
              >
                <span className="text-lg">View Trainings</span>
                <FiChevronDown size={24} className="animate-bounce" />
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Trainings Section */}
      <div id="trainings-section" className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Training Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our comprehensive training programs designed for all skill levels
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[#FBB859] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Trainings
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'upcoming'
                  ? 'bg-[#FBB859] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'past'
                  ? 'bg-[#FBB859] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Past Trainings
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
              <p className="mt-4 text-gray-600">Loading trainings...</p>
            </div>
          )}

          {/* Trainings Grid */}
          {!isLoading && filteredTrainings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                {filter === 'all' 
                  ? 'No trainings available at the moment' 
                  : `No ${filter} trainings found`
                }
              </p>
            </div>
          )}

          {!isLoading && filteredTrainings.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrainings.map((training, index) => {
                console.log('Training:', training.title, 'Slug:', training.slug);
                return (
                <motion.div
                  key={training._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/trainings/${training.slug}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 bg-gray-200">
                      {training.coverImage?.url ? (
                        <img
                          src={training.coverImage.url}
                          alt={training.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiCalendar size={48} />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          training.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          training.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          training.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {training.title}
                      </h3>
                      
                      {training.shortDescription && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {training.shortDescription}
                        </p>
                      )}

                      {/* Training Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCalendar className="text-[#FBB859] flex-shrink-0" />
                          <span>{training.displayDate}</span>
                        </div>
                        
                        {training.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiClock className="text-[#FBB859] flex-shrink-0" />
                            <span>{training.duration}</span>
                          </div>
                        )}
                        
                        {training.location?.venue && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMapPin className="text-[#FBB859] flex-shrink-0" />
                            <span className="truncate">
                              {training.location.isOnline ? 'Online' : training.location.venue}
                            </span>
                          </div>
                        )}

                        {training.registration?.spots?.total && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiUsers className="text-[#FBB859] flex-shrink-0" />
                            <span>
                              {training.registration.spots.available > 0
                                ? `${training.registration.spots.available} spots available`
                                : 'Fully booked'
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Level Badge */}
                      {training.level && (
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {training.level}
                          </span>
                        </div>
                      )}

                      {/* Pricing */}
                      {!training.pricing?.isFree && (
                        <div className="mb-4 text-sm text-gray-700">
                          {training.pricing?.earlyBird?.amount && new Date(training.pricing.earlyBird.deadline) > new Date() ? (
                            <div>
                              <span className="font-bold text-[#FBB859]">
                                {training.pricing.currency} {training.pricing.earlyBird.amount}
                              </span>
                              <span className="ml-2 text-gray-500 line-through">
                                {training.pricing.currency} {training.pricing.regular}
                              </span>
                              <span className="ml-2 text-xs text-green-600">(Early Bird)</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-bold text-[#FBB859]">
                                {training.pricing.currency} {training.pricing.regular}
                              </span>
                              {training.pricing?.student > 0 && (
                                <span className="ml-2 text-sm text-gray-600">
                                  ({training.pricing.currency} {training.pricing.student} for students)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {training.pricing?.isFree && (
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            FREE
                          </span>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-[#FBB859] font-medium">Learn More</span>
                        <FiArrowRight className="text-[#FBB859]" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section - Volunteer as Trainer */}
      {cta?.isActive && (
        <div 
          className="py-16 px-4"
          style={{ backgroundColor: cta.backgroundColor || '#FBB859' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: cta.textColor || '#FFFFFF' }}
              >
                {cta.title}
              </h2>
              <p 
                className="text-lg md:text-xl mb-8 opacity-90"
                style={{ color: cta.textColor || '#FFFFFF' }}
              >
                {cta.description}
              </p>
              <a
                href={cta.formLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {cta.buttonText}
                <FiArrowRight className="ml-2" />
              </a>
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
};

export default TrainingsPage;
