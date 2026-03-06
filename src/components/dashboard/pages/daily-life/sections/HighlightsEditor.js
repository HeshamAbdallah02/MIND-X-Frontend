import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function HighlightsEditor({ settings, onSave }) {
    const [highlights, setHighlights] = useState(settings?.highlights || []);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ icon: '', title: '', description: '' });

    useEffect(() => {
        if (settings?.highlights) setHighlights(settings.highlights);
    }, [settings]);

    const handleAdd = () => {
        if (!form.icon || !form.title) {
            toast.error('Icon and title required');
            return;
        }
        setHighlights(prev => [...prev, { ...form, displayOrder: prev.length }]);
        setForm({ icon: '', title: '', description: '' });
    };

    const handleRemove = (index) => {
        setHighlights(prev => prev.filter((_, i) => i !== index));
    };

    const moveUp = (index) => {
        if (index === 0) return;
        setHighlights(prev => {
            const arr = [...prev];
            [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
            return arr.map((h, i) => ({ ...h, displayOrder: i }));
        });
    };

    const moveDown = (index) => {
        if (index === highlights.length - 1) return;
        setHighlights(prev => {
            const arr = [...prev];
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            return arr.map((h, i) => ({ ...h, displayOrder: i }));
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({ highlights });
            toast.success('Highlights saved!');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">✨ Culture Highlights</h3>
                    <p className="text-sm text-gray-500 mt-1">Value cards displayed on the page</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="px-4 py-2 bg-[#81C99C] text-white rounded-lg text-sm font-medium hover:bg-[#6db888] transition disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Add Form */}
            <div className="bg-white rounded-xl border p-5 space-y-4">
                <h4 className="font-medium text-gray-800 text-sm">Add Highlight</h4>
                <div className="grid grid-cols-[80px,1fr] gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                            placeholder="🚀" className="w-full border rounded-lg px-3 py-2 text-sm text-center text-2xl" maxLength={4} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="e.g. Innovation First" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Brief description..." rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <button onClick={handleAdd}
                    className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2a2a4e] transition">
                    + Add Highlight
                </button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {highlights.map((h, i) => (
                    <div key={i} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                        <span className="text-2xl w-10 text-center">{h.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm">{h.title}</p>
                            <p className="text-gray-400 text-xs truncate">{h.description}</p>
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
