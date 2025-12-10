// frontend/src/components/blog-detail/components/BlogDetailHero.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryColors } from './constants';

const BlogDetailHero = ({ blog }) => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-white"
            dir="rtl"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link to="/blog" className="hover:text-[#FBB859]">Blog</Link>
                    <span>‹</span>
                    <span className="text-gray-900">{blog.title}</span>
                </nav>

                {/* Category Badge */}
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${categoryColors[blog.category] || categoryColors['Other']}`}>
                    {blog.category}
                </span>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                >
                    {blog.title}
                </motion.h1>

                {/* Excerpt */}
                {blog.excerpt && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 mb-8"
                    >
                        {blog.excerpt}
                    </motion.p>
                )}

                {/* Author & Meta */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200"
                >
                    {/* Author */}
                    <div className="flex items-center gap-4">
                        {blog.author?.avatar?.url && (
                            <img
                                src={blog.author.avatar.url}
                                alt={blog.author.name}
                                className="w-14 h-14 rounded-full"
                            />
                        )}
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{blog.author?.name}</p>
                            <p className="text-sm text-gray-600">{blog.author?.role}</p>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        {blog.readTime && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {blog.readTime} min read
                                </span>
                            </>
                        )}
                        {blog.views > 0 && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {blog.views.toLocaleString()} views
                                </span>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Cover Image */}
            {blog.coverImage?.url && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
                >
                    <img
                        src={blog.coverImage.url}
                        alt={blog.coverImage.alt || blog.title}
                        className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                </motion.div>
            )}
        </motion.section>
    );
};

export default BlogDetailHero;
