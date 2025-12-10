// frontend/src/components/form-view/components/FormViewSuccess.js
import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const FormViewSuccess = ({ form, onGoHome }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                    {form.settings?.confirmationMessage || 'Your response has been submitted successfully.'}
                </p>
                {!form.settings?.allowMultipleSubmissions && (
                    <p className="text-sm text-gray-500 mb-6">
                        You cannot submit another response to this form.
                    </p>
                )}
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

export default FormViewSuccess;
