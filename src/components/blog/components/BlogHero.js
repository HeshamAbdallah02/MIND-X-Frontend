// frontend/src/components/blog/components/BlogHero.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryColors } from './constants';

const BlogHero = ({ heroPost }) => {
    if (!heroPost) return null;

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[calc(100vh-4rem)] min-h-[600px] bg-gray-900 overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={heroPost.coverImage?.url}
                    alt={heroPost.coverImage?.alt || heroPost.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl w-full"
                    dir="rtl"
                >
                    <div className="text-right">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${categoryColors[heroPost.category] || categoryColors['Other']}`}>
                            {heroPost.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-right">
                        {heroPost.title}
                    </h1>

                    {heroPost.excerpt && (
                        <p className="text-xl text-gray-200 mb-6 line-clamp-2 text-right">
                            {heroPost.excerpt}
                        </p>
                    )}

                    <div className="flex items-center gap-6 mb-8 text-right">
                        {heroPost.author?.avatar?.url && (
                            <img
                                src={heroPost.author.avatar.url}
                                alt={heroPost.author.name}
                                className="w-12 h-12 rounded-full border-2 border-white/20"
                            />
                        )}

                        <div className="text-right">
                            <p className="text-white font-semibold">{heroPost.author?.name}</p>
                            <p className="text-gray-300 text-sm">{heroPost.author?.role}</p>
                        </div>

                        <div className="text-gray-300 text-sm">
                            <span>{new Date(heroPost.publishedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            {heroPost.readTime && <span className="mr-2">• {heroPost.readTime} دقيقة قراءة</span>}
                        </div>
                    </div>

                    <div className="text-right">
                        <Link
                            to={`/blog/${heroPost.slug}`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FBB859] text-white font-semibold rounded-lg hover:bg-[#e9a748] transition-all transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            اقرأ المقال
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default BlogHero;
