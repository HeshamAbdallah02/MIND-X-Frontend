// frontend/src/components/training-details/components/TrainingDetailsHero.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const TrainingDetailsHero = ({ training }) => {
    const navigate = useNavigate();

    return (
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
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${training.status === 'upcoming' ? 'bg-blue-500 text-white' :
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
    );
};

export default TrainingDetailsHero;
