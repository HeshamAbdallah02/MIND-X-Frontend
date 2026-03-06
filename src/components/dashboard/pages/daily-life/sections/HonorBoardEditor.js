import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../config/api';
import toast from 'react-hot-toast';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function HonorBoardEditor({ settings, onSave }) {
    const [honorBoard, setHonorBoard] = useState(settings?.honorBoard || []);
    const [members, setMembers] = useState([]); // crew members
    const [saving, setSaving] = useState(false);

    // Form state for adding new entry
    const [form, setForm] = useState({
        member: '', section: '', badge: '', reason: '',
        month: new Date().getMonth() + 1, year: new Date().getFullYear()
    });

    // Fetch crew members for the dropdown
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/members/public`);
                setMembers(Array.isArray(data) ? data : data.members || []);
            } catch (err) {
                console.error('Failed to fetch members:', err);
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        if (settings?.honorBoard) setHonorBoard(settings.honorBoard);
    }, [settings]);

    const handleAdd = () => {
        if (!form.member || !form.badge || !form.section) {
            toast.error('Please select a member, section, and badge');
            return;
        }
        setHonorBoard(prev => [...prev, { ...form }]);
        setForm(f => ({ ...f, member: '', section: '', badge: '', reason: '' }));
    };

    const handleRemove = (index) => {
        setHonorBoard(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({ honorBoard });
            toast.success('Honor Board saved!');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    // Get member name by id
    const getMemberName = (id) => {
        const m = members.find(m => m._id === id);
        return m ? m.name : 'Unknown';
    };

    // Group current entries by section for preview
    const groupedBySection = {};
    honorBoard.forEach(entry => {
        const sec = entry.section || 'Other';
        if (!groupedBySection[sec]) groupedBySection[sec] = [];
        groupedBySection[sec].push(entry);
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">🏆 Honor Board</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Select best members from each section — auto-hides in the last week of each month
                    </p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="px-4 py-2 bg-[#81C99C] text-white rounded-lg text-sm font-medium hover:bg-[#6db888] transition disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Add Form */}
            <div className="bg-white rounded-xl border p-5 space-y-4">
                <h4 className="font-medium text-gray-800 text-sm">Add Honor Entry</h4>

                <div className="grid grid-cols-2 gap-4">
                    {/* Member Select */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Crew Member</label>
                        <select value={form.member} onChange={e => setForm(f => ({ ...f, member: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2 text-sm">
                            <option value="">Select member...</option>
                            {members.map(m => (
                                <option key={m._id} value={m._id}>{m.name} — {m.position}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
                        <input type="text" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                            placeholder="e.g. Marketing" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>

                    {/* Badge */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Badge Title</label>
                        <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                            placeholder="e.g. Most Innovative" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>

                    {/* Month/Year */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                            <select value={form.month} onChange={e => setForm(f => ({ ...f, month: parseInt(e.target.value) }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm">
                                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                            <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Reason (optional)</label>
                    <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                        placeholder="Why this member stands out..." rows={2}
                        className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>

                <button onClick={handleAdd}
                    className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2a2a4e] transition">
                    + Add to Honor Board
                </button>
            </div>

            {/* Current Entries */}
            <div className="bg-white rounded-xl border p-5">
                <h4 className="font-medium text-gray-800 text-sm mb-4">
                    Current Honor Board ({honorBoard.length} members)
                </h4>

                {Object.keys(groupedBySection).length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No members added yet</p>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(groupedBySection).map(([section, entries]) => (
                            <div key={section}>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{section}</p>
                                <div className="space-y-2">
                                    {entries.map((entry, i) => {
                                        const globalIdx = honorBoard.indexOf(entry);
                                        return (
                                            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                                                <div className="flex-1">
                                                    <span className="font-medium text-gray-800 text-sm">
                                                        {typeof entry.member === 'object' ? entry.member.name : getMemberName(entry.member)}
                                                    </span>
                                                    <span className="mx-2 text-gray-300">·</span>
                                                    <span className="text-xs font-semibold text-[#FBB859]">{entry.badge}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {MONTHS[(entry.month || 1) - 1]} {entry.year}
                                                </span>
                                                <button onClick={() => handleRemove(globalIdx)}
                                                    className="text-red-400 hover:text-red-600 text-sm transition">✕</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
