import React, { useState, useEffect, useCallback } from 'react';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=M&background=1a1a2e&color=FBB859&size=80';



function getCountdown(revealDate) {
    if (!revealDate) return '';
    const diff = new Date(revealDate) - new Date();
    if (diff <= 0) return '';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} day${days === 1 ? '' : 's'}`;
}

export default function HonorBoard({ data }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Group by section
    const sections = [];
    const sectionMap = {};
    (data?.honorBoard || []).forEach(entry => {
        const sec = entry.section;
        if (!sectionMap[sec]) {
            sectionMap[sec] = [];
            sections.push(sec);
        }
        sectionMap[sec].push(entry);
    });

    const totalSlides = sections.length;

    // Auto-advance carousel
    useEffect(() => {
        if (isPaused || totalSlides <= 1) return;
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused, totalSlides]);

    const goTo = useCallback((idx) => setActiveSlide(idx), []);
    const goPrev = () => setActiveSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    const goNext = () => setActiveSlide(prev => (prev + 1) % totalSlides);

    // Coming soon state
    if (data?._honorBoardHidden) {
        const countdown = getCountdown(data._honorBoardRevealDate);
        return (
            <section className="bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] py-20 px-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,184,89,0.08)_0%,transparent_60%)] pointer-events-none" />
                <div className="relative">
                    <div className="text-5xl mb-4">🏆</div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                        New Stars Coming Soon
                    </h2>
                    <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
                        Our next Members of the Month are being selected. Stay tuned for the big reveal!
                    </p>
                    {countdown && (
                        <div className="inline-block bg-white/5 border border-[#FBB859]/20 rounded-2xl px-6 py-3">
                            <span className="text-[#FBB859] font-bold text-lg">{countdown}</span>
                            <span className="text-white/40 text-sm ml-2">until reveal</span>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // No data yet
    if (!data?.honorBoard?.length) return null;

    const currentSection = sections[activeSlide];
    const currentMembers = sectionMap[currentSection] || [];

    return (
        <section
            className="bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] py-14 md:py-20 px-5 relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,184,89,0.08)_0%,transparent_60%)] pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-10 relative">
                <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#FBB859] via-[#FFD89B] to-[#FBB859] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite] mb-2">
                    Stars of {new Date().toLocaleString('default', { month: 'long' })} ✨
                </h2>
                <p className="text-white/40 text-xs tracking-[3px] uppercase">Members of the Month</p>
            </div>

            {/* Carousel */}
            <div className="relative max-w-[900px] mx-auto min-h-[280px]">
                {/* Section Label */}
                <p className="text-center text-white/30 text-xs tracking-[3px] uppercase mb-5 transition-all">
                    {currentSection}
                </p>

                {/* Slide */}
                <div key={activeSlide} className="flex flex-col md:flex-row gap-5 justify-center items-center animate-[fadeSlideIn_0.5s_ease]">
                    {currentMembers.map((entry, i) => {
                        const member = entry.member || {};
                        const avatarUrl = member.avatar?.url || DEFAULT_AVATAR;
                        return (
                            <div
                                key={i}
                                className="relative flex-1 max-w-[380px] w-full bg-white/[0.04] border border-[#FBB859]/15 rounded-2xl p-8 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FBB859]/40 group"
                            >
                                {/* Glow */}
                                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#FBB859]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                <img
                                    src={avatarUrl}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-full object-cover border-[3px] border-[#FBB859]/40 mx-auto mb-4"
                                />
                                <h3 className="text-white text-lg font-bold mb-1">{member.name}</h3>
                                <span className="inline-block bg-gradient-to-r from-[#FBB859] to-[#F0A030] text-[#1a1a2e] text-xs font-bold px-4 py-1 rounded-full mb-2 tracking-wide">
                                    {entry.badge}
                                </span>
                                {entry.reason && (
                                    <p className="text-white/40 text-sm leading-relaxed mt-1">{entry.reason}</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Nav Arrows */}
                {totalSlides > 1 && (
                    <>
                        <button onClick={goPrev} className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-12 w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 text-white flex items-center justify-center hover:bg-white/15 transition z-10">‹</button>
                        <button onClick={goNext} className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-12 w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 text-white flex items-center justify-center hover:bg-white/15 transition z-10">›</button>
                    </>
                )}
            </div>

            {/* Dots */}
            {totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {sections.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-2 rounded-full transition-all ${i === activeSlide ? 'bg-[#FBB859] w-6' : 'bg-white/15 w-2'}`}
                        />
                    ))}
                </div>
            )}

            {/* Avatar Strip */}
            <div className="flex justify-center items-center gap-1.5 mt-7 flex-wrap max-w-[700px] mx-auto">
                {sections.map((sec, secIdx) => (
                    <React.Fragment key={sec}>
                        {secIdx > 0 && <div className="w-px h-9 bg-white/10 mx-1" />}
                        {sectionMap[sec].map((entry, memberIdx) => {
                            const m = entry.member || {};
                            const isActive = secIdx === activeSlide;
                            return (
                                <img
                                    key={memberIdx}
                                    src={m.avatar?.url || DEFAULT_AVATAR}
                                    alt={m.name}
                                    onClick={() => goTo(secIdx)}
                                    className={`w-9 h-9 rounded-full object-cover cursor-pointer transition-all ${isActive
                                        ? 'border-2 border-[#FBB859] opacity-100 scale-110'
                                        : 'border-2 border-transparent opacity-40 hover:opacity-70 hover:scale-105'
                                        }`}
                                />
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}
