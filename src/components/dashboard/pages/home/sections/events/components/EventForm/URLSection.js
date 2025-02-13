// frontend/src/components/dashboard/pages/home/sections/events/components/EventForm/URLSection.js
import React from 'react';

const URLSection = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-[#606161]">Event Link</h3>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Destination URL
      </label>
      <input
        type="url"
        value={formData.url}
        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#81C99C]"
        pattern="https?://.+"
        placeholder="https://example.com/event"
      />
    </div>
  </div>
);

export default URLSection;