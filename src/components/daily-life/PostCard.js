import React, { useState } from 'react';

export default function PostCard({ post, onLike, onImageClick }) {
    const [imgIdx, setImgIdx] = useState(0);
    const [liked, setLiked] = useState(false);
    const images = post.images || [];
    const hasMultiple = images.length > 1;

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
            onLike?.(post._id);
        }
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 30) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4">
                {post.author?.avatar?.url ? (
                    <img src={post.author.avatar.url} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#81C99C] to-[#FBB859] flex items-center justify-center text-white font-bold text-sm">
                        {post.author?.name?.[0] || 'M'}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1a1a2e] text-sm truncate">{post.author?.name}</p>
                    {post.author?.role && <p className="text-gray-400 text-xs truncate">{post.author.role}</p>}
                </div>
                <span className="text-[0.7rem] font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-xl shrink-0">
                    {post.category}
                </span>
            </div>

            {/* Image Carousel */}
            {images.length > 0 && (
                <div className="relative mt-3 aspect-[4/3] overflow-hidden cursor-pointer group" onClick={() => onImageClick?.(images, imgIdx)}>
                    <img
                        src={images[imgIdx]?.url}
                        alt={images[imgIdx]?.alt || ''}
                        className="w-full h-full object-cover"
                    />
                    {hasMultiple && (
                        <>
                            <span className="absolute top-3 right-3 bg-black/60 text-white text-[0.7rem] font-semibold px-2.5 py-1 rounded-xl backdrop-blur-sm">
                                {imgIdx + 1}/{images.length}
                            </span>
                            {/* Nav arrows */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIdx(p => (p - 1 + images.length) % images.length); }}
                                className="absolute top-1/2 left-2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center text-gray-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >‹</button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIdx(p => (p + 1) % images.length); }}
                                className="absolute top-1/2 right-2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center text-gray-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >›</button>
                            {/* Dots */}
                            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, i) => (
                                    <button key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                                        className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Body */}
            <div className="px-4 py-3.5">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                        {liked ? '❤️' : '🤍'} {(post.likes || 0) + (liked ? 1 : 0)}
                    </button>
                    <span className="ml-auto text-gray-400 text-xs">{timeAgo(post.createdAt)}</span>
                </div>
                {post.caption && (
                    <p className="text-gray-700 text-[0.88rem] leading-relaxed">
                        <strong className="text-[#1a1a2e] mr-1">{post.author?.name}</strong>
                        {post.caption}
                    </p>
                )}
            </div>
        </div>
    );
}
