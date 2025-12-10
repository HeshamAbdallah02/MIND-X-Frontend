// frontend/src/components/training-details/components/sidebar/DetailsCard.js
import React from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';

const DetailsCard = ({ training }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Training Details</h3>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <FiCalendar className="text-[#FBB859] mt-1 flex-shrink-0" />
                    <div>
                        <div className="font-medium text-gray-900">Date</div>
                        <div className="text-gray-600">{training.displayDate}</div>
                    </div>
                </div>

                {training.duration && (
                    <div className="flex items-start gap-3">
                        <FiClock className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <div>
                            <div className="font-medium text-gray-900">Duration</div>
                            <div className="text-gray-600">{training.duration}</div>
                        </div>
                    </div>
                )}

                {training.schedule && (
                    <div className="flex items-start gap-3">
                        <FiClock className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <div>
                            <div className="font-medium text-gray-900">Schedule</div>
                            <div className="text-gray-600">{training.schedule}</div>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-3">
                    <FiMapPin className="text-[#FBB859] mt-1 flex-shrink-0" />
                    <div>
                        <div className="font-medium text-gray-900">Location</div>
                        <div className="text-gray-600">
                            {training.location?.isOnline ? (
                                'Online Training'
                            ) : (
                                <>
                                    {training.location?.venue && <div>{training.location.venue}</div>}
                                    {training.location?.address && <div>{training.location.address}</div>}
                                    {training.location?.city && <div>{training.location.city}</div>}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {training.registration?.spots?.total && (
                    <div className="flex items-start gap-3">
                        <FiUsers className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <div>
                            <div className="font-medium text-gray-900">Available Spots</div>
                            <div className="text-gray-600">
                                {training.registration.spots.available} of {training.registration.spots.total} remaining
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsCard;
