// frontend/src/components/blog-detail/components/BlogDetailRelated.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryColors } from './constants';

const BlogDetailRelated = ({ relatedPosts }) => {
    return (
        <>
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12">Related Articles</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((post) => (
                                <motion.article
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
                                >
                                    <Link to={`/blog/${post.slug}`}>
                                        {post.coverImage?.url && (
                                            <img
                                                src={post.coverImage.url}
                                                alt={post.coverImage.alt || post.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[post.category] || categoryColors['Other']}`}>
                                                {post.category}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[#FBB859] transition-colors">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                                            )}
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                {post.readTime && <span>{post.readTime} min read</span>}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Back to Blog */}
            <section className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#FBB859] text-white font-semibold rounded-lg hover:bg-[#e9a748] transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Back to All Articles
                    </Link>
                </div>
            </section>
        </>
    );
};

export default BlogDetailRelated;
