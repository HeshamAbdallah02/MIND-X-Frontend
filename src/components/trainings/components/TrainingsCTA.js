// frontend/src/components/trainings/components/TrainingsCTA.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const TrainingsCTA = ({ cta }) => {
    if (!cta?.isActive) return null;

    return (
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
    );
};

export default TrainingsCTA;
