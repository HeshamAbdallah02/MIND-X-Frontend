// frontend/src/components/blog/components/BlogSearch.js
import React from 'react';
import { motion } from 'framer-motion';

const BlogSearch = ({ searchQuery, onSearchChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8"
        >
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-6 py-4 pl-14 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FBB859] text-lg"
            />
            <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </motion.div>
    );
};

export default BlogSearch;
