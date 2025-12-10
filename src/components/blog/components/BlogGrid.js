// frontend/src/components/blog/components/BlogGrid.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';

const BlogGrid = ({ blogs, isLoading, selectedCategory, searchQuery, page }) => {
    // Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FBB859] rounded-full animate-spin" />
            </div>
        );
    }

    // No Results
    if (blogs.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
            >
                <svg
                    className="w-24 h-24 text-gray-300 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl text-gray-500">No articles found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </motion.div>
        );
    }

    // Blog Grid
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${selectedCategory}-${searchQuery}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            >
                {blogs.map((blog, index) => (
                    <BlogCard key={blog._id} blog={blog} index={index} />
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default BlogGrid;
