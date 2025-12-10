// frontend/src/components/form-view/components/EmailCollection.js
import React from 'react';

const EmailCollection = ({ email, primaryColor, onInputChange }) => {
    return (
        <div className="p-8 border-b border-gray-200">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
            </label>
            <input
                type="email"
                id="email"
                value={email || ''}
                onChange={(e) => onInputChange('email', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{ '--tw-ring-color': primaryColor }}
                placeholder="your.email@example.com"
            />
        </div>
    );
};

export default EmailCollection;
