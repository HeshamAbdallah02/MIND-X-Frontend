// frontend/src/components/dashboard/shared/SettingsInput.js
import React from 'react';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker';

const SettingsInput = ({ type, value, onChange, config }) => {
  const inputClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C]";

  return (
    <div className="space-y-2">
      {type === 'color' ? (
        <ColorPicker color={value} onChange={onChange} />
      ) : type === 'range' ? (
        <div className="space-y-4">
          <input
            type="range"
            className="w-full"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
          />
          <div className="text-sm text-[#606161] text-center">
            {config.format ? config.format(value) : value}
          </div>
        </div>
      ) : (
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

SettingsInput.propTypes = {
  type: PropTypes.oneOf(['color', 'range', 'text', 'number']).isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  config: PropTypes.object
};

export default React.memo(SettingsInput);
