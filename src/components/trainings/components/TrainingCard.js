// frontend/src/components/trainings/components/TrainingCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiArrowRight } from 'react-icons/fi';

const TrainingCard = ({ training, index }) => {
    return (
        <motion.div
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${training.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
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
};

export default TrainingCard;
