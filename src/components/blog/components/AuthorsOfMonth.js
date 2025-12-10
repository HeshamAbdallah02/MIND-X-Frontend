// frontend/src/components/blog/components/AuthorsOfMonth.js
import React from 'react';
import { motion } from 'framer-motion';

const AuthorsOfMonth = ({ authorsOfMonth }) => {
    if (authorsOfMonth.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Authors of the Month</h2>
                    <div className="w-24 h-1 bg-[#FBB859] mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Celebrating our top contributors this month</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {authorsOfMonth.map((author, index) => (
                        <motion.div
                            key={author._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#FBB859] transition-all hover:shadow-lg group"
                        >
                            {/* Rank Badge */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                {index === 0 && (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                                        <span className="text-2xl">🥇</span>
                                    </div>
                                )}
                                {index === 1 && (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                                        <span className="text-2xl">🥈</span>
                                    </div>
                                )}
                                {index === 2 && (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                        <span className="text-2xl">🥉</span>
                                    </div>
                                )}
                            </div>

                            {/* Author Avatar */}
                            <div className="flex justify-center mb-4">
                                {author.avatar?.url ? (
                                    <img
                                        src={author.avatar.url}
                                        alt={author.name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Author Info */}
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{author.name}</h3>
                                <p className="text-sm text-[#FBB859] font-medium mb-3">{author.role}</p>
                                {author.bio && (
                                    <p className="text-sm text-gray-600 line-clamp-2">{author.bio}</p>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex justify-center gap-6 pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-[#FBB859] mb-1">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="font-bold text-lg">{author.totalViews?.toLocaleString() || 0}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Total Views</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-[#FBB859] mb-1">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="font-bold text-lg">{author.totalArticles}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Articles</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default AuthorsOfMonth;
