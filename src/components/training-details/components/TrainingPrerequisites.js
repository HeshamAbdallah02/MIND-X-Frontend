// frontend/src/components/training-details/components/TrainingPrerequisites.js
import React from 'react';

const TrainingPrerequisites = ({ prerequisites }) => {
    if (!prerequisites || prerequisites.length === 0) return null;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prerequisites</h2>
            <ul className="space-y-2">
                {prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-[#FBB859]">•</span>
                        <span>{prerequisite}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TrainingPrerequisites;
