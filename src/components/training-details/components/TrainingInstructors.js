// frontend/src/components/training-details/components/TrainingInstructors.js
import React from 'react';

const TrainingInstructors = ({ instructors }) => {
    if (!instructors || instructors.length === 0) return null;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Your Instructors</h2>
            <div className="space-y-6">
                {instructors.map((instructor, index) => (
                    <div key={index} className="flex gap-6 p-6 bg-gray-50 rounded-lg">
                        {instructor.avatar?.url && (
                            <img
                                src={instructor.avatar.url}
                                alt={instructor.name}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                            {instructor.title && (
                                <p className="text-[#FBB859] mb-2">{instructor.title}</p>
                            )}
                            {instructor.bio && (
                                <p className="text-gray-600 mb-3">{instructor.bio}</p>
                            )}
                            {(instructor.linkedin || instructor.website) && (
                                <div className="flex gap-4">
                                    {instructor.linkedin && (
                                        <a
                                            href={instructor.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FBB859] hover:underline text-sm"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                    {instructor.website && (
                                        <a
                                            href={instructor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FBB859] hover:underline text-sm"
                                        >
                                            Website
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrainingInstructors;
