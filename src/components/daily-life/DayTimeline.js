import React from 'react';

export default function DayTimeline({ timeline = [] }) {
    if (!timeline.length) return null;

    const sorted = [...timeline].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return (
        <section className="py-20 px-5 max-w-[800px] mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-12">
                A Day at MIND-X
            </h2>

            <div className="relative pl-10">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#81C99C] to-[#FBB859] rounded-full" />

                {sorted.map((item, i) => (
                    <div key={item._id || i} className="relative mb-9 last:mb-0">
                        {/* Dot */}
                        <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-[#81C99C] border-[3px] border-white shadow-[0_0_0_2px_#81C99C]" />

                        <p className="text-xs font-bold text-[#81C99C] tracking-wider mb-1">{item.time}</p>
                        <h3 className="text-base font-bold text-[#1a1a2e] mb-1">{item.title}</h3>
                        {item.description && (
                            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                        )}
                        {item.image?.url && (
                            <img
                                src={item.image.url}
                                alt={item.title}
                                className="w-full max-w-[400px] rounded-xl mt-3 object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
