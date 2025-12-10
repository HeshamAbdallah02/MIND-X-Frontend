// frontend/src/components/blog/components/PopularSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryColors } from './constants';

const PopularSidebar = ({ popularBlogs }) => {
    return (
        <aside className="lg:col-span-4">
            <div className="sticky top-24">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Popular This Week</h3>
                        <div className="w-full h-px bg-gray-200"></div>
                    </div>

                    {popularBlogs.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No popular posts yet</p>
                    ) : (
                        <div className="space-y-6">
                            {popularBlogs.map((blog, index) => (
                                <motion.article
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                    dir="rtl"
                                >
                                    <Link to={`/blog/${blog.slug}`} className="block">
                                        {/* Cover Image */}
                                        {blog.coverImage?.url && (
                                            <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                                                <img
                                                    src={blog.coverImage.url}
                                                    alt={blog.coverImage.alt || blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[blog.category] || categoryColors['Other']}`}>
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FBB859] transition-colors text-right">
                                            {blog.title}
                                        </h4>

                                        {/* Author & Meta */}
                                        <div className="flex items-center gap-2 text-sm">
                                            {blog.author?.avatar?.url && (
                                                <img
                                                    src={blog.author.avatar.url}
                                                    alt={blog.author.name}
                                                    className="w-8 h-8 rounded-full ml-2"
                                                />
                                            )}

                                            <div className="text-right flex-1">
                                                <p className="text-gray-700 font-medium">{blog.author?.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                                                    <span>{blog.views?.toLocaleString() || 0} مشاهدة</span>
                                                    {blog.readTime && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{blog.readTime} دقيقة</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {index < popularBlogs.length - 1 && (
                                        <div className="border-b border-gray-100 mt-6" />
                                    )}
                                </motion.article>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </aside>
    );
};

export default PopularSidebar;
