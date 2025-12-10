// frontend/src/components/form-view/components/FormViewLoading.js
import React from 'react';

const FormViewLoading = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
        </div>
    );
};

export default FormViewLoading;
