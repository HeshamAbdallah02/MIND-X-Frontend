// frontend/src/components/training-details/components/sidebar/RegistrationCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegistrationCard = ({ training, registrationLink, isRegistrationOpen }) => {
    if (!training.registration) return null;

    return (
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
    );
};

export default RegistrationCard;
