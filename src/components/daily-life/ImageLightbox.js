import React, { useEffect, useCallback } from 'react';

export default function ImageLightbox({ images, startIndex = 0, onClose }) {
    const [idx, setIdx] = React.useState(startIndex);
    const total = images?.length || 0;

    const goPrev = useCallback(() => setIdx(p => (p - 1 + total) % total), [total]);
    const goNext = useCallback(() => setIdx(p => (p + 1) % total), [total]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose, goPrev, goNext]);

    if (!images?.length) return null;

    return (
        <div className="fixed inset-0 bg-black/92 z-[9999] flex items-center justify-center animate-[fadeIn_0.2s_ease]"
            onClick={onClose}>
            <button onClick={onClose} className="absolute top-5 right-6 text-white text-3xl opacity-70 hover:opacity-100 transition-opacity z-10 bg-transparent border-none cursor-pointer">×</button>

            <img
                src={images[idx]?.url}
                alt={images[idx]?.alt || ''}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
            />

            {total > 1 && (
                <>
                    <button onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="absolute top-1/2 left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-lg hover:bg-white/20 transition cursor-pointer">‹</button>
                    <button onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute top-1/2 right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-lg hover:bg-white/20 transition cursor-pointer">›</button>
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                        {idx + 1} / {total}
                    </span>
                </>
            )}
        </div>
    );
}
