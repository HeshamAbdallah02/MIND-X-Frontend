// frontend/src/components/blog/components/BlogCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryColors } from './constants';

const BlogCard = ({ blog, index }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
            dir="rtl"
        >
            <Link to={`/blog/${blog.slug}`}>
                {/* Cover Image */}
                {blog.coverImage?.url && (
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={blog.coverImage.url}
                            alt={blog.coverImage.alt || blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[blog.category] || categoryColors['Other']}`}>
                                {blog.category}
                            </span>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 text-right">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FBB859] transition-colors">
                        {blog.title}
                    </h2>

                    {blog.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Author & Meta */}
                    <div className="flex items-center pt-4 border-t border-gray-100">
                        {blog.author?.avatar?.url && (
                            <img
                                src={blog.author.avatar.url}
                                alt={blog.author.name}
                                className="w-10 h-10 rounded-full ml-3"
                            />
                        )}

                        <div className="flex-1 text-right">
                            <p className="text-sm font-semibold text-gray-900">{blog.author?.name}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(blog.publishedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        {blog.readTime && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mr-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{blog.readTime} دقيقة</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.article>
    );
};

export default BlogCard;
