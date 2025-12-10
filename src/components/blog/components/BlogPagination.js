// frontend/src/components/blog/components/BlogPagination.js
import React from 'react';
import { motion } from 'framer-motion';

const BlogPagination = ({ pagination, page, onPageChange }) => {
    if (!pagination.pages || pagination.pages <= 1) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2"
        >
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${page === pageNum
                                    ? 'bg-[#FBB859] text-white'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                return null;
            })}

            <button
                onClick={() => onPageChange(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </motion.div>
    );
};

export default BlogPagination;
