import React from 'react';

export default function CultureHighlights({ highlights = [] }) {
    if (!highlights.length) return null;

    return (
        <section className="py-20 px-5 bg-gray-50">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-12">
                What Drives Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
                {highlights
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((h, i) => (
                        <div key={h._id || i}
                            className="bg-white rounded-2xl p-8 text-center border border-gray-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
                            <span className="text-4xl mb-4 block">{h.icon}</span>
                            <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{h.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{h.description}</p>
                        </div>
                    ))}
            </div>
        </section>
    );
}
