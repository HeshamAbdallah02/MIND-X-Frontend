// frontend/src/components/training-details/components/TrainingAbout.js
import React from 'react';

const TrainingAbout = ({ description }) => {
    if (!description) return null;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Training</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {description}
            </p>
        </section>
    );
};

export default TrainingAbout;
