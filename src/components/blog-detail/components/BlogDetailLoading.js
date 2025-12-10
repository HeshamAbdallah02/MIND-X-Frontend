// frontend/src/components/blog-detail/components/BlogDetailLoading.js
import React from 'react';

const BlogDetailLoading = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FBB859] rounded-full animate-spin" />
        </div>
    );
};

export default BlogDetailLoading;
