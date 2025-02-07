// components/dashboard/shared/TextSizeSelector.js
import React, { useState, useEffect } from 'react';

const TextSizeSelector = ({ value, onChange, label }) => {
  // State to handle the numeric value
  const [pixelValue, setPixelValue] = useState(16);

  // Extract pixel value from Tailwind class on component mount and value changes
  useEffect(() => {
    const match = value.match(/text-\[(\d+)px\]/);
    if (match) {
      setPixelValue(parseInt(match[1]));
    }
  }, [value]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    // Allow empty string for typing purposes
    if (newValue === '') {
      setPixelValue('');
      return;
    }

    // Convert to number and validate
    const numValue = parseInt(newValue);
    if (isNaN(numValue)) return;

    // Update local state
    setPixelValue(numValue);

    // Only update parent if value is within bounds
    if (numValue >= 12 && numValue <= 200) {
      onChange(`text-[${numValue}px]`);
    }
  };

  // Handle blur to enforce min/max
  const handleBlur = () => {
    let finalValue = parseInt(pixelValue);
    
    // Handle empty or invalid values
    if (!finalValue || isNaN(finalValue)) {
      finalValue = 16;
    }
    
    // Enforce min/max bounds
    finalValue = Math.max(12, Math.min(200, finalValue));
    
    // Update both local state and parent
    setPixelValue(finalValue);
    onChange(`text-[${finalValue}px]`);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center">
        <input
          type="number"
          min="12"
          max="200"
          value={pixelValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-24 px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <span className="ml-2 text-gray-500">px</span>
      </div>
    </div>
  );
};

export default TextSizeSelector;