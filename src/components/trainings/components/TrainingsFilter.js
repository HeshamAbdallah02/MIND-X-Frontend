// frontend/src/components/trainings/components/TrainingsFilter.js
import React from 'react';

const TrainingsFilter = ({ filter, onFilterChange }) => {
    const filters = [
        { key: 'all', label: 'All Trainings' },
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'past', label: 'Past Trainings' }
    ];

    return (
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {filters.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onFilterChange(key)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === key
                            ? 'bg-[#FBB859] text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default TrainingsFilter;
