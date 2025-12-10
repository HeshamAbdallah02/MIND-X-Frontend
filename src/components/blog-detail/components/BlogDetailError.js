// frontend/src/components/blog-detail/components/BlogDetailError.js
import React from 'react';
import { Link } from 'react-router-dom';

const BlogDetailError = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                <Link to="/blog" className="text-[#FBB859] hover:underline">
                    ← Back to Blog
                </Link>
            </div>
        </div>
    );
};

export default BlogDetailError;
