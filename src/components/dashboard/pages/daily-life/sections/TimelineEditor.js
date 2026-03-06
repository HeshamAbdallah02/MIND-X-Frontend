import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../config/api';
import toast from 'react-hot-toast';

export default function TimelineEditor({ settings, onSave }) {
    const [timeline, setTimeline] = useState(settings?.timeline || []);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ time: '', title: '', description: '' });

    useEffect(() => {
        if (settings?.timeline) setTimeline(settings.timeline);
    }, [settings]);

    const handleAdd = () => {
        if (!form.time || !form.title) {
            toast.error('Time and title are required');
            return;
        }
        setTimeline(prev => [...prev, { ...form, displayOrder: prev.length }]);
        setForm({ time: '', title: '', description: '' });
    };

    const handleRemove = (index) => {
        setTimeline(prev => prev.filter((_, i) => i !== index));
    };

    const moveUp = (index) => {
        if (index === 0) return;
        setTimeline(prev => {
            const arr = [...prev];
            [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
            return arr.map((h, i) => ({ ...h, displayOrder: i }));
        });
    };

    const moveDown = (index) => {
        if (index === timeline.length - 1) return;
        setTimeline(prev => {
            const arr = [...prev];
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            return arr.map((h, i) => ({ ...h, displayOrder: i }));
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({ timeline });
            toast.success('Timeline saved!');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleImageUpload = async (entryId, file) => {
        try {
            const token = localStorage.getItem('token');
            const fd = new FormData();
            fd.append('image', file);
            await axios.post(`${API_BASE_URL}/api/daily-life/admin/settings/timeline/${entryId}/image`, fd, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Image uploaded');
            // Parent refetch will update
        } catch {
            toast.error('Image upload failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">⏰ Day Timeline</h3>
                    <p className="text-sm text-gray-500 mt-1">A typical day at MIND-X</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="px-4 py-2 bg-[#81C99C] text-white rounded-lg text-sm font-medium hover:bg-[#6db888] transition disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Add Form */}
            <div className="bg-white rounded-xl border p-5 space-y-4">
                <h4 className="font-medium text-gray-800 text-sm">Add Timeline Entry</h4>
                <div className="grid grid-cols-[120px,1fr] gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                        <input type="text" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                            placeholder="9:00 AM" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="Morning Standup" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Quick sync with the team..." rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <button onClick={handleAdd}
                    className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2a2a4e] transition">
                    + Add Entry
                </button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {timeline.map((entry, i) => (
                    <div key={i} className="bg-white rounded-xl border p-4 flex items-start gap-4">
                        <div className="text-center shrink-0 w-16">
                            <p className="text-xs font-bold text-[#81C99C]">{entry.time}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm">{entry.title}</p>
                            {entry.description && <p className="text-gray-400 text-xs mt-0.5">{entry.description}</p>}
                            {entry.image?.url && (
                                <img src={entry.image.url} alt="" className="w-20 h-14 rounded-lg object-cover mt-2" />
                            )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <button onClick={() => moveUp(i)} className="px-2 py-1 text-gray-400 hover:text-gray-600 text-sm">↑</button>
                            <button onClick={() => moveDown(i)} className="px-2 py-1 text-gray-400 hover:text-gray-600 text-sm">↓</button>
                            <button onClick={() => handleRemove(i)} className="px-2 py-1 text-red-400 hover:text-red-600 text-sm">✕</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
