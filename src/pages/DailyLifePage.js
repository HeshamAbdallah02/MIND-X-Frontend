import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { API_BASE_URL } from '../config/api';
import HonorBoard from '../components/daily-life/HonorBoard';
import PostsFeed from '../components/daily-life/PostsFeed';
import CultureHighlights from '../components/daily-life/CultureHighlights';
import DayTimeline from '../components/daily-life/DayTimeline';
import Footer from '../components/layout/Footer';

export default function DailyLifePage() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/daily-life/public/settings`);
                setSettings(data);
            } catch (err) {
                console.error('Failed to load daily life settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]">
                <div className="w-10 h-10 border-3 border-white/20 border-t-[#FBB859] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Daily Life — MIND-X</title>
                <meta name="description" content="Discover the daily life at MIND-X — our team culture, behind-the-scenes moments, and the people who make it happen." />
            </Helmet>

            <div className="w-full overflow-x-hidden">
                <HonorBoard data={settings} />
                <PostsFeed />
                <CultureHighlights highlights={settings?.highlights || []} />
                <DayTimeline timeline={settings?.timeline || []} />
                <Footer />
            </div>
        </>
    );
}
