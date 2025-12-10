// frontend/src/components/training-details/components/TrainingAudience.js
import React from 'react';

const TrainingAudience = ({ targetAudience }) => {
    if (!targetAudience) return null;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Should Attend</h2>
            <p className="text-gray-700 leading-relaxed">
                {targetAudience}
            </p>
        </section>
    );
};

export default TrainingAudience;
