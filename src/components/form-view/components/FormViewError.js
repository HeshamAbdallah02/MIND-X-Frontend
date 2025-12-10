// frontend/src/components/form-view/components/FormViewError.js
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const FormViewError = ({ error, onGoHome }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
                <p className="text-gray-600 mb-6">
                    {error?.response?.data?.error || 'This form does not exist or is no longer available.'}
                </p>
                <button
                    onClick={onGoHome}
                    className="px-6 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
};

export default FormViewError;
