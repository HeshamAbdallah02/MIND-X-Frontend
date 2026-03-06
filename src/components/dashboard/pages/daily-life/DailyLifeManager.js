import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { API_BASE_URL } from '../../../../config/api';
import HonorBoardEditor from './sections/HonorBoardEditor';
import PostsEditor from './sections/PostsEditor';
import HighlightsEditor from './sections/HighlightsEditor';
import TimelineEditor from './sections/TimelineEditor';

const DailyLifeManager = () => {
    const [activeSection, setActiveSection] = useState('honor');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/daily-life/admin/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(data);
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const saveSettings = async (updates) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${API_BASE_URL}/api/daily-life/admin/settings`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(data);
            return data;
        } catch (err) {
            console.error('Failed to save:', err);
            throw err;
        }
    };

    const sections = [
        { id: 'honor', name: 'Honor Board', icon: '🏆' },
        { id: 'posts', name: 'Daily Posts', icon: '📸' },
        { id: 'highlights', name: 'Culture Highlights', icon: '✨' },
        { id: 'timeline', name: 'Day Timeline', icon: '⏰' },
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-[#81C99C] rounded-full animate-spin" />
                </div>
            );
        }

        switch (activeSection) {
            case 'honor':
                return <HonorBoardEditor settings={settings} onSave={saveSettings} />;
            case 'posts':
                return <PostsEditor />;
            case 'highlights':
                return <HighlightsEditor settings={settings} onSave={saveSettings} />;
            case 'timeline':
                return <TimelineEditor settings={settings} onSave={saveSettings} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Helmet>
                <title>MIND-X: Daily Life Management</title>
            </Helmet>
            <div className="h-full grid grid-cols-[280px,1fr]">
                {/* Sidebar */}
                <div className="bg-white border-r h-[calc(100vh-4rem)]">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Daily Life</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your daily life page</p>
                    </div>
                    <nav className="p-6 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === section.id
                                        ? 'bg-[#81C99C]/10 text-[#81C99C]'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-2">{section.icon}</span>
                                {section.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="p-6">
                        <div className="max-w-4xl mx-auto">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DailyLifeManager;
