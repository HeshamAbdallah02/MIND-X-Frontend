import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import PostCard from './PostCard';
import ImageLightbox from './ImageLightbox';

export default function PostsFeed() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);

    const fetchPosts = useCallback(async (pageNum = 1, category = null, append = false) => {
        try {
            setLoading(true);
            const params = { page: pageNum, limit: 12 };
            if (category) params.category = category;
            const { data } = await axios.get(`${API_BASE_URL}/api/daily-life/public/posts`, { params });
            setPosts(prev => append ? [...prev, ...data.posts] : data.posts);
            setCategories(data.categories || []);
            setHasMore(pageNum < data.pagination.pages);
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setPage(1);
        fetchPosts(1, activeCategory, false);
    }, [activeCategory, fetchPosts]);

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchPosts(next, activeCategory, true);
    };

    const handleLike = async (postId) => {
        try {
            await axios.patch(`${API_BASE_URL}/api/daily-life/public/posts/${postId}/like`);
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    const openLightbox = (images, startIndex) => setLightbox({ images, startIndex });

    return (
        <section className="py-16 px-5 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="text-center mb-9">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-4">Daily Captures</h2>
            </div>

            {/* Category Filters */}
            {categories.length > 0 && (
                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-5 py-2 rounded-3xl text-sm font-medium border transition-all ${!activeCategory
                                ? 'bg-[#81C99C] border-[#81C99C] text-white'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-[#81C99C] hover:text-[#81C99C]'
                            }`}
                    >All</button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-3xl text-sm font-medium border transition-all ${activeCategory === cat
                                    ? 'bg-[#81C99C] border-[#81C99C] text-white'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-[#81C99C] hover:text-[#81C99C]'
                                }`}
                        >{cat}</button>
                    ))}
                </div>
            )}

            {/* Grid */}
            {loading && posts.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-10 h-10 border-3 border-gray-200 border-t-[#81C99C] rounded-full animate-spin mx-auto" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-5xl mb-4">📸</p>
                    <p className="text-lg font-medium">No posts yet</p>
                    <p className="text-sm mt-1">Check back soon for daily life captures!</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} onLike={handleLike} onImageClick={openLightbox} />
                        ))}
                    </div>
                    {hasMore && (
                        <button onClick={loadMore} disabled={loading}
                            className="block mx-auto mt-10 px-8 py-3 bg-[#1a1a2e] text-white rounded-full text-sm font-semibold hover:bg-[#2a2a4e] transition disabled:opacity-50">
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    )}
                </>
            )}

            {/* Lightbox */}
            {lightbox && (
                <ImageLightbox
                    images={lightbox.images}
                    startIndex={lightbox.startIndex}
                    onClose={() => setLightbox(null)}
                />
            )}
        </section>
    );
}
