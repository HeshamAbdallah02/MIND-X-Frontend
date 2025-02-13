//frontend/src/components/dashboard/shared/ColorPicker.js
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded border shadow"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 px-2 py-1 border rounded"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <HexColorPicker
            color={color}
            onChange={onChange}
            className="relative z-20"
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;