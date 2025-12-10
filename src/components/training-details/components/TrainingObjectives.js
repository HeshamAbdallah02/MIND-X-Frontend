// frontend/src/components/training-details/components/TrainingObjectives.js
import React from 'react';
import { FiCheck } from 'react-icons/fi';

const TrainingObjectives = ({ objectives }) => {
    if (!objectives || objectives.length === 0) return null;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
            <ul className="space-y-3">
                {objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <FiCheck className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{objective}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TrainingObjectives;
