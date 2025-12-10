// frontend/src/components/training-details/components/TrainingTopics.js
import React from 'react';
import { FiCheck } from 'react-icons/fi';

const TrainingTopics = ({ topics }) => {
    if (!topics || topics.length === 0) return null;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Topics Covered</h2>
            <ul className="grid md:grid-cols-2 gap-3">
                {topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <FiCheck className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{topic}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TrainingTopics;
