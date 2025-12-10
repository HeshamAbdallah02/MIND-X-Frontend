// frontend/src/components/trainings/components/TrainingsList.js
import React from 'react';
import TrainingCard from './TrainingCard';

const TrainingsList = ({ trainings, isLoading, filter }) => {
    // Loading State
    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
                <p className="mt-4 text-gray-600">Loading trainings...</p>
            </div>
        );
    }

    // Empty State
    if (trainings.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-xl text-gray-600">
                    {filter === 'all'
                        ? 'No trainings available at the moment'
                        : `No ${filter} trainings found`
                    }
                </p>
            </div>
        );
    }

    // Trainings Grid
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainings.map((training, index) => (
                <TrainingCard key={training._id} training={training} index={index} />
            ))}
        </div>
    );
};

export default TrainingsList;
