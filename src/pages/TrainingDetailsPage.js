// frontend/src/pages/TrainingDetailsPage.js
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiCheck, FiAward, FiPackage, FiMail, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Footer from '../components/home/Footer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TrainingDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: training, isLoading, error } = useQuery({
    queryKey: ['training', slug],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/trainings/public/${slug}`);
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
          <p className="mt-4 text-gray-600">Loading training details...</p>
        </div>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Not Found</h2>
          <p className="text-gray-600 mb-6">The training you're looking for doesn't exist or has been removed.</p>
          <Link to="/trainings" className="text-[#FBB859] hover:underline">
            View All Trainings
          </Link>
        </div>
      </div>
    );
  }

  const registrationLink = training.registration?.formLink 
    ? `/forms/${training.registration.formLink}`
    : training.registration?.externalLink || null;

  const isRegistrationOpen = training.registration?.isOpen && 
    training.status !== 'completed' && 
    training.status !== 'cancelled' &&
    (training.registration?.spots?.available > 0 || !training.registration?.spots?.total);

  return (
    <>
      <Helmet>
        <title>MIND-X: {training.title}</title>
        <meta name="description" content={training.shortDescription || training.description} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        {training.coverImage?.url && (
          <>
            <img
              src={training.coverImage.url}
              alt={training.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
          </>
        )}
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <button
            onClick={() => navigate('/trainings')}
            className="text-white hover:text-[#FBB859] transition-colors mb-6 flex items-center gap-2"
          >
            <FiArrowLeft /> Back to Trainings
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                training.status === 'upcoming' ? 'bg-blue-500 text-white' :
                training.status === 'ongoing' ? 'bg-green-500 text-white' :
                training.status === 'completed' ? 'bg-gray-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
              </span>
              {training.level && (
                <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-sm font-medium">
                  {training.level}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {training.title}
            </h1>
            
            {training.shortDescription && (
              <p className="text-xl text-gray-200 max-w-3xl">
                {training.shortDescription}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Training</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {training.description}
              </p>
            </section>

            {/* Topics Covered */}
            {training.topics && training.topics.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Topics Covered</h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {training.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FiCheck className="text-[#FBB859] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Learning Objectives */}
            {training.objectives && training.objectives.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                <ul className="space-y-3">
                  {training.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <FiCheck className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Prerequisites */}
            {training.prerequisites && training.prerequisites.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {training.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-[#FBB859]">•</span>
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Target Audience */}
            {training.targetAudience && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Should Attend</h2>
                <p className="text-gray-700 leading-relaxed">
                  {training.targetAudience}
                </p>
              </section>
            )}

            {/* Instructors */}
            {training.instructors && training.instructors.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Your Instructors</h2>
                <div className="space-y-6">
                  {training.instructors.map((instructor, index) => (
                    <div key={index} className="flex gap-6 p-6 bg-gray-50 rounded-lg">
                      {instructor.avatar?.url && (
                        <img
                          src={instructor.avatar.url}
                          alt={instructor.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                        {instructor.title && (
                          <p className="text-[#FBB859] mb-2">{instructor.title}</p>
                        )}
                        {instructor.bio && (
                          <p className="text-gray-600 mb-3">{instructor.bio}</p>
                        )}
                        {(instructor.linkedin || instructor.website) && (
                          <div className="flex gap-4">
                            {instructor.linkedin && (
                              <a
                                href={instructor.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FBB859] hover:underline text-sm"
                              >
                                LinkedIn
                              </a>
                            )}
                            {instructor.website && (
                              <a
                                href={instructor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FBB859] hover:underline text-sm"
                              >
                                Website
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {training.galleryImages && training.galleryImages.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {training.galleryImages.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.caption || `Gallery ${index + 1}`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {image.caption && (
                        <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Registration Card */}
              {training.registration && (
                <motion.div 
                  className="bg-gradient-to-br from-[#FBB859] to-[#e9a748] rounded-xl shadow-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#606161' }}>
                    Register Now
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    Secure your spot in this training program
                  </p>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    {!training.pricing?.isFree ? (
                      <div>
                        {training.pricing?.earlyBird?.amount && new Date(training.pricing.earlyBird.deadline) > new Date() ? (
                          <div>
                            <div className="inline-block px-6 py-2 rounded-full text-2xl font-bold text-white mb-2" style={{ backgroundColor: '#81C99C' }}>
                              {training.pricing.currency} {training.pricing.earlyBird.amount}
                            </div>
                            <div className="text-base text-white/60 line-through mb-2">
                              {training.pricing.currency} {training.pricing.regular}
                            </div>
                            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium mb-3">
                              Early Bird - Ends {new Date(training.pricing.earlyBird.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        ) : (
                          <div className="inline-block px-6 py-2 rounded-full text-2xl font-bold text-white mb-3" style={{ backgroundColor: '#81C99C' }}>
                            {training.pricing.currency} {training.pricing.regular}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-3">
                        <div className="inline-block px-5 py-2 rounded-full text-xl font-bold text-white mb-2" style={{ backgroundColor: '#81C99C' }}>
                          FREE
                        </div>
                        <p className="text-white/80 text-sm">Open to everyone</p>
                      </div>
                    )}
                  </div>

                  {/* Registration Button */}
                  {isRegistrationOpen && registrationLink ? (
                    training.registration?.formLink ? (
                      <Link
                        to={registrationLink}
                        className="block w-full text-center px-8 py-3 bg-white text-[#FBB859] font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
                      >
                        Register Now
                      </Link>
                    ) : (
                      <a
                        href={registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-8 py-3 bg-white text-[#FBB859] font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
                      >
                        Register Now
                      </a>
                    )
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center px-8 py-3 bg-white/30 text-white font-bold rounded-lg cursor-not-allowed mb-3"
                    >
                      {training.status === 'completed' ? 'Training Completed' : 'Registration Closed'}
                    </button>
                  )}

                  {/* Deadline & Contact */}
                  {training.registration?.deadline && new Date(training.registration.deadline) > new Date() && (
                    <p className="text-white/90 text-xs text-center mb-2">
                      Registration closes {new Date(training.registration.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  {training.contactInfo?.email && isRegistrationOpen && (
                    <p className="text-white/80 text-xs text-center">
                      Questions?{' '}
                      <a 
                        href={`mailto:${training.contactInfo.email}`}
                        className="text-white font-semibold hover:underline"
                      >
                        Contact us
                      </a>
                    </p>
                  )}
                </motion.div>
              )}

              {/* Training Details Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Training Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCalendar className="text-[#FBB859] mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Date</div>
                      <div className="text-gray-600">{training.displayDate}</div>
                    </div>
                  </div>

                  {training.duration && (
                    <div className="flex items-start gap-3">
                      <FiClock className="text-[#FBB859] mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Duration</div>
                        <div className="text-gray-600">{training.duration}</div>
                      </div>
                    </div>
                  )}

                  {training.schedule && (
                    <div className="flex items-start gap-3">
                      <FiClock className="text-[#FBB859] mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Schedule</div>
                        <div className="text-gray-600">{training.schedule}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-[#FBB859] mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-gray-600">
                        {training.location?.isOnline ? (
                          'Online Training'
                        ) : (
                          <>
                            {training.location?.venue && <div>{training.location.venue}</div>}
                            {training.location?.address && <div>{training.location.address}</div>}
                            {training.location?.city && <div>{training.location.city}</div>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {training.registration?.spots?.total && (
                    <div className="flex items-start gap-3">
                      <FiUsers className="text-[#FBB859] mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Available Spots</div>
                        <div className="text-gray-600">
                          {training.registration.spots.available} of {training.registration.spots.total} remaining
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate & Materials */}
              {(training.certificate?.isProvided || training.materials?.isProvided) && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Includes</h3>
                  <div className="space-y-3">
                    {training.certificate?.isProvided && (
                      <div className="flex items-start gap-3">
                        <FiAward className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {training.certificate.type || 'Certificate'}
                          </div>
                          {training.certificate.requirements && (
                            <div className="text-sm text-gray-600">{training.certificate.requirements}</div>
                          )}
                        </div>
                      </div>
                    )}
                    {training.materials?.isProvided && (
                      <div className="flex items-start gap-3">
                        <FiPackage className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">Training Materials</div>
                          {training.materials.description && (
                            <div className="text-sm text-gray-600">{training.materials.description}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {(training.contactInfo?.email || training.contactInfo?.phone || training.contactInfo?.whatsapp) && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
                  <div className="space-y-3">
                    {training.contactInfo.email && (
                      <a
                        href={`mailto:${training.contactInfo.email}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#FBB859] transition-colors"
                      >
                        <FiMail className="flex-shrink-0" />
                        <span>{training.contactInfo.email}</span>
                      </a>
                    )}
                    {training.contactInfo.phone && (
                      <a
                        href={`tel:${training.contactInfo.phone}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#FBB859] transition-colors"
                      >
                        <FiPhone className="flex-shrink-0" />
                        <span>{training.contactInfo.phone}</span>
                      </a>
                    )}
                    {training.contactInfo.whatsapp && (
                      <a
                        href={`https://wa.me/${training.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-[#FBB859] transition-colors"
                      >
                        <FiPhone className="flex-shrink-0" />
                        <span>WhatsApp: {training.contactInfo.whatsapp}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default TrainingDetailsPage;
