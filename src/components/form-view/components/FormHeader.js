// frontend/src/components/form-view/components/FormHeader.js
import React from 'react';
import { FiClock } from 'react-icons/fi';

const FormHeader = ({ form }) => {
    const primaryColor = form.theme?.primaryColor || '#FBB859';

    return (
        <div
            className="bg-white rounded-t-xl p-8 shadow-lg"
            style={{ borderTop: `6px solid ${primaryColor}` }}
        >
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{form.title}</h1>
            {form.description && (
                <p className="text-gray-600 whitespace-pre-wrap">{form.description}</p>
            )}

            {/* Deadline Warning */}
            {form.settings?.deadline && (
                <div className="mt-4 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                    <FiClock className="w-4 h-4" />
                    <span>
                        Deadline: {new Date(form.settings.deadline).toLocaleString()}
                    </span>
                </div>
            )}

            {/* Required Fields Note */}
            <p className="mt-4 text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
            </p>
        </div>
    );
};

export default FormHeader;
