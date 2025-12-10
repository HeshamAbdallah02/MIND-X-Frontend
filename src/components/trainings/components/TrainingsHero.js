// frontend/src/components/trainings/components/TrainingsHero.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const TrainingsHero = ({ hero, onScrollToTrainings }) => {
    // Custom hero with background image
    if (hero?.isActive && hero?.backgroundImage?.url) {
        return (
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
                    className={`relative h-full flex flex-col ${hero.layout?.verticalAlign === 'top' ? 'justify-start pt-32' :
                            hero.layout?.verticalAlign === 'bottom' ? 'justify-end pb-32' :
                                'justify-center'
                        } ${hero.layout?.textAlign === 'left' ? 'items-start text-left' :
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
                                onClick={onScrollToTrainings}
                                className="mt-8 text-white hover:opacity-80 transition-opacity flex items-center gap-2 mx-auto"
                            >
                                <span className="text-lg">{hero.cta.text || 'View Trainings'}</span>
                                <FiChevronDown size={24} className="animate-bounce" />
                            </button>
                        )}
                    </motion.div>
                </div>
            </div>
        );
    }

    // Default hero section
    return (
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
                        onClick={onScrollToTrainings}
                        className="mt-8 text-white hover:opacity-80 transition-opacity flex items-center gap-2 mx-auto"
                    >
                        <span className="text-lg">View Trainings</span>
                        <FiChevronDown size={24} className="animate-bounce" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default TrainingsHero;
