// frontend/src/components/blog-detail/components/BlogDetailContent.js
import React from 'react';
import { motion } from 'framer-motion';

const BlogDetailContent = ({ blog }) => {
    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" dir="rtl">
            <motion.div
                id="article-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="prose prose-lg max-w-none"
                style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.75',
                    color: '#374151'
                }}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
                    className="whitespace-pre-wrap"
                />
            </motion.div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 pt-8 border-t border-gray-200"
                >
                    <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </section>
    );
};

export default BlogDetailContent;
