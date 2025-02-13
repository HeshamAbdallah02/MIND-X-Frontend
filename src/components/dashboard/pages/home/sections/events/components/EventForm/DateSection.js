// frontend/src/components/dashboard/pages/home/sections/events/components/EventForm/DateSection.js
import React, {useEffect, useState} from 'react';
import ColorPicker from '../../../../../../shared/ColorPicker';
import { toast } from 'react-hot-toast';

const DateSection = ({ formData, setFormData }) => {
    const [internalDate, setInternalDate] = useState('');

    // Convert display date to ISO format
    useEffect(() => {
    try {
        const dateObj = new Date(formData.date.text);
        if (!isNaN(dateObj)) {
        setInternalDate(dateObj.toISOString().split('T')[0]);
        }
    } catch {
        setInternalDate('');
    }
    }, [formData.date.text]);

    const handleDateChange = (e) => {
    const isoDate = e.target.value;
    try {
        const formatted = new Date(isoDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
        });
        
        setFormData(prev => ({
        ...prev,
        date: { ...prev.date, text: formatted }
        }));
        setInternalDate(isoDate);
    } catch (error) {
        console.error('Date parsing error:', error);
        toast.error('Invalid date format');
    }
    };

    return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#606161]">Event Date</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Display Text
            </label>
            <input
            type="date"
            value={internalDate}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#81C99C]"
            required
            />
            <p className="mt-2 text-sm text-gray-500">
            Selected: {formData.date.text || 'No date selected'}
            </p>
        </div>
        <ColorPicker
            color={formData.date.color}
            onChange={(color) => setFormData(prev => ({
            ...prev,
            date: { ...prev.date, color }
            }))}
            label="Date Color"
        />
        </div>
    </div>
    );
};

export default DateSection;