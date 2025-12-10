// frontend/src/components/training-details/components/sidebar/IncludesCard.js
import React from 'react';
import { FiAward, FiPackage } from 'react-icons/fi';

const IncludesCard = ({ certificate, materials }) => {
    if (!certificate?.isProvided && !materials?.isProvided) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Includes</h3>
            <div className="space-y-3">
                {certificate?.isProvided && (
                    <div className="flex items-start gap-3">
                        <FiAward className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <div>
                            <div className="font-medium text-gray-900">
                                {certificate.type || 'Certificate'}
                            </div>
                            {certificate.requirements && (
                                <div className="text-sm text-gray-600">{certificate.requirements}</div>
                            )}
                        </div>
                    </div>
                )}
                {materials?.isProvided && (
                    <div className="flex items-start gap-3">
                        <FiPackage className="text-[#FBB859] mt-1 flex-shrink-0" />
                        <div>
                            <div className="font-medium text-gray-900">Training Materials</div>
                            {materials.description && (
                                <div className="text-sm text-gray-600">{materials.description}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncludesCard;
