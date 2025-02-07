//frontend/src/components/dashboard/pages/home/sections/hero/components/HeroForm/ButtonSection.js
import React from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';

const ButtonSection = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Button (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={formData.button.text}
          onChange={(e) => setFormData({
            ...formData,
            button: { ...formData.button, text: e.target.value }
          })}
          placeholder="Button Text"
          className="w-full px-3 py-2 border rounded-md"
        />
        <select
          value={formData.button.action.type}
          onChange={(e) => setFormData({
            ...formData,
            button: {
              ...formData.button,
              action: { ...formData.button.action, type: e.target.value }
            }
          })}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="url">URL</option>
          <option value="scroll">Scroll</option>
        </select>
        <input
          type="text"
          value={formData.button.action.target}
          onChange={(e) => setFormData({
            ...formData,
            button: {
              ...formData.button,
              action: { ...formData.button.action, target: e.target.value }
            }
          })}
          placeholder={formData.button.action.type === 'url' ? 'URL' : 'Element ID'}
          className="w-full px-3 py-2 border rounded-md"
          required={!!formData.button.text}
        />
        <ColorPicker
          color={formData.button.backgroundColor}
          onChange={(color) => setFormData({
            ...formData,
            button: { ...formData.button, backgroundColor: color }
          })}
          label="Button Color"
        />
        <ColorPicker
          color={formData.button.textColor}
          onChange={(color) => setFormData({
            ...formData,
            button: { ...formData.button, textColor: color }
          })}
          label="Text Color"
        />
      </div>
    </div>
  );
};

export default ButtonSection;