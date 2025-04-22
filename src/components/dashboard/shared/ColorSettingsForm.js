// frontend/src/components/dashboard/shared/ColorSettingsForm.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SettingsInput from './SettingsInput';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const ColorSettingsForm = ({ 
  initialValues, 
  onSave, 
  fields, 
  isSaving = false  // Default parameter here
}) => {
  const [localValues, setLocalValues] = useState(initialValues);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    setHasChanges(JSON.stringify(localValues) !== JSON.stringify(initialValues));
  }, [localValues, initialValues]);

  const handleChange = (fieldName, value) => {
    setLocalValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleReset = () => setLocalValues(initialValues);
  const handleSubmit = () => onSave(localValues);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#606161]">
          Section Settings
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h2>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 ${
              hasChanges && !isSaving
                ? 'text-[#606161] hover:text-[#FBB859] bg-white hover:bg-[#FBB859]/10'
                : 'text-[#606161]/50 bg-gray-100 cursor-not-allowed'
            }`}
          >
            <FiRefreshCw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasChanges || isSaving}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 ${
              hasChanges && !isSaving
                ? 'bg-[#FBB859] text-white hover:bg-[#E0A04D]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <FaSpinner className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ label, name, type, config }) => (
          <div key={name} className="space-y-3">
            <label className="block text-sm font-medium text-[#606161]">
              {label}
            </label>
            <SettingsInput
              type={type}
              value={localValues[name]}
              onChange={(value) => handleChange(name, value)}
              config={config}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

ColorSettingsForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      config: PropTypes.object
    })
  ).isRequired,
  isSaving: PropTypes.bool
};

export default React.memo(ColorSettingsForm);