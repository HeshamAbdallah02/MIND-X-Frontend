// frontend/src/components/blog-detail/components/BlogDetailAuthor.js
import React from 'react';
import { motion } from 'framer-motion';

const BlogDetailAuthor = ({ author }) => {
    if (!author?.bio) return null;

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-8 bg-white rounded-xl shadow-md"
            >
                <div className="flex items-start gap-6">
                    {author.avatar?.url && (
                        <img
                            src={author.avatar.url}
                            alt={author.name}
                            className="w-24 h-24 rounded-full flex-shrink-0"
                        />
                    )}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">About the author</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{author.name}</h3>
                        <p className="text-[#FBB859] font-medium mb-3">{author.role}</p>
                        <p className="text-gray-600 leading-relaxed">{author.bio}</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default BlogDetailAuthor;
