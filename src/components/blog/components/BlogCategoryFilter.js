// frontend/src/components/blog/components/BlogCategoryFilter.js
import React from 'react';
import { motion } from 'framer-motion';

const BlogCategoryFilter = ({
    categories,
    selectedCategory,
    onCategoryChange,
    totalCount
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-12"
        >
            <button
                onClick={() => onCategoryChange('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === 'all'
                        ? 'bg-[#FBB859] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
            >
                All Articles
                {selectedCategory === 'all' && totalCount > 0 && (
                    <span className="ml-2 text-sm">({totalCount})</span>
                )}
            </button>

            {categories.map((cat) => (
                <button
                    key={cat._id}
                    onClick={() => onCategoryChange(cat._id)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat._id
                            ? 'bg-[#FBB859] text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {cat._id}
                    <span className="ml-2 text-sm">({cat.count})</span>
                </button>
            ))}
        </motion.div>
    );
};

export default BlogCategoryFilter;
