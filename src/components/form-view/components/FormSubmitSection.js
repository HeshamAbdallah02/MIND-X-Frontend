// frontend/src/components/form-view/components/FormSubmitSection.js
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const FormSubmitSection = ({
    isSubmitting,
    submissionError,
    submitButtonText,
    primaryColor
}) => {
    return (
        <div className="p-8 rounded-b-xl">
            {submissionError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{submissionError}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                    </>
                ) : (
                    <span>{submitButtonText || 'Submit'}</span>
                )}
            </button>
        </div>
    );
};

export default FormSubmitSection;
