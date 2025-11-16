import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Footer from '../components/home/Footer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const categoryColors = {
  'Technology': 'bg-blue-100 text-blue-800',
  'Innovation': 'bg-purple-100 text-purple-800',
  'Leadership': 'bg-indigo-100 text-indigo-800',
  'Team Culture': 'bg-pink-100 text-pink-800',
  'Events': 'bg-[#FBB859] text-white',
  'Research': 'bg-teal-100 text-teal-800',
  'Success Stories': 'bg-green-100 text-green-800',
  'Tutorials': 'bg-orange-100 text-orange-800',
  'Announcements': 'bg-red-100 text-red-800',
  'Other': 'bg-gray-100 text-gray-800'
};

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  // Fetch featured blogs
  const { data: featuredBlogs = [] } = useQuery({
    queryKey: ['featured-blogs'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/public/featured/all`);
      return data;
    }
  });

  // Fetch popular blogs (most viewed this week)
  const { data: popularBlogs = [] } = useQuery({
    queryKey: ['popular-blogs-week'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/public/popular/week`);
      return data;
    }
  });

  // Fetch authors of the month
  const { data: authorsOfMonth = [] } = useQuery({
    queryKey: ['authors-of-month'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/public/authors/month`);
      return data;
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/public/categories/all`);
      return data;
    }
  });

  // Fetch blogs with filters
  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['blogs', selectedCategory, searchQuery, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit });
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/public?${params}`);
      return data;
    }
  });

  const blogs = blogsData?.blogs || [];
  const pagination = blogsData?.pagination || {};

  const heroPost = featuredBlogs[0];

  return (
    <>
      <Helmet>
        <title>Blog | MIND-X</title>
        <meta name="description" content="Read the latest articles, insights, and stories from the MIND-X team about technology, innovation, leadership, and more." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Featured Post */}
        {heroPost && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[calc(100vh-4rem)] min-h-[600px] bg-gray-900 overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={heroPost.coverImage?.url}
                alt={heroPost.coverImage?.alt || heroPost.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl w-full"
                dir="rtl"
              >
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${categoryColors[heroPost.category] || categoryColors['Other']}`}>
                    {heroPost.category}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-right">
                  {heroPost.title}
                </h1>
                
                {heroPost.excerpt && (
                  <p className="text-xl text-gray-200 mb-6 line-clamp-2 text-right">
                    {heroPost.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6 mb-8 text-right">
                  {/* Avatar - rightmost */}
                  {heroPost.author?.avatar?.url && (
                    <img
                      src={heroPost.author.avatar.url}
                      alt={heroPost.author.name}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                  )}
                  
                  {/* Author name and role - middle */}
                  <div className="text-right">
                    <p className="text-white font-semibold">{heroPost.author?.name}</p>
                    <p className="text-gray-300 text-sm">{heroPost.author?.role}</p>
                  </div>

                  {/* Date - leftmost */}
                  <div className="text-gray-300 text-sm">
                    <span>{new Date(heroPost.publishedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {heroPost.readTime && <span className="mr-2">• {heroPost.readTime} دقيقة قراءة</span>}
                  </div>
                </div>

                <div className="text-right">
                  <Link
                    to={`/blog/${heroPost.slug}`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#FBB859] text-white font-semibold rounded-lg hover:bg-[#e9a748] transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    اقرأ المقال
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Main Content Area */}
            <div className="lg:col-span-8">
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-8"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
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

              {/* Category Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-3 mb-12"
              >
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPage(1);
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-[#FBB859] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  All Articles
                  {selectedCategory === 'all' && blogs.length > 0 && (
                    <span className="ml-2 text-sm">({pagination.total})</span>
                  )}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat._id);
                      setPage(1);
                    }}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === cat._id
                        ? 'bg-[#FBB859] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {cat._id}
                    <span className="ml-2 text-sm">({cat.count})</span>
                  </button>
                ))}
              </motion.div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FBB859] rounded-full animate-spin" />
                </div>
              )}

              {/* No Results */}
              {!isLoading && blogs.length === 0 && (
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
              )}

              {/* Blog Grid */}
              {!isLoading && blogs.length > 0 && (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedCategory}-${searchQuery}-${page}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                    >
                  {blogs.map((blog, index) => (
                    <motion.article
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
                      dir="rtl"
                    >
                      <Link to={`/blog/${blog.slug}`}>
                          {/* Cover Image */}
                          {blog.coverImage?.url && (
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={blog.coverImage.url}
                                alt={blog.coverImage.alt || blog.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[blog.category] || categoryColors['Other']}`}>
                                  {blog.category}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-6 text-right">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FBB859] transition-colors">
                              {blog.title}
                            </h2>

                            {blog.excerpt && (
                              <p className="text-gray-600 mb-4 line-clamp-3">
                                {blog.excerpt}
                              </p>
                            )}

                            {/* Author & Meta */}
                            <div className="flex items-center pt-4 border-t border-gray-100">
                              {/* Avatar - rightmost */}
                              {blog.author?.avatar?.url && (
                                <img
                                  src={blog.author.avatar.url}
                                  alt={blog.author.name}
                                  className="w-10 h-10 rounded-full ml-3"
                                />
                              )}
                              
                              {/* Author info - middle */}
                              <div className="flex-1 text-right">
                                <p className="text-sm font-semibold text-gray-900">{blog.author?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(blog.publishedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>

                              {/* Read time - leftmost */}
                              {blog.readTime && (
                                <div className="flex items-center gap-1 text-sm text-gray-500 mr-3">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{blog.readTime} دقيقة</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-2"
                >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                            onClick={() => setPage(pageNum)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              page === pageNum
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
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </>
            )}
            </div>

            {/* Right Column: Popular This Week Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Popular This Week</h3>
                    <div className="w-full h-px bg-gray-200"></div>
                  </div>
                  
                  {popularBlogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No popular posts yet</p>
                  ) : (
                    <div className="space-y-6">
                      {popularBlogs.map((blog, index) => (
                        <motion.article
                          key={blog._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                          dir="rtl"
                        >
                          <Link to={`/blog/${blog.slug}`} className="block">
                            {/* Cover Image */}
                            {blog.coverImage?.url && (
                              <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                                <img
                                  src={blog.coverImage.url}
                                  alt={blog.coverImage.alt || blog.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 right-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[blog.category] || categoryColors['Other']}`}>
                                    {blog.category}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Content */}
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FBB859] transition-colors text-right">
                              {blog.title}
                            </h4>

                            {/* Author & Meta */}
                            <div className="flex items-center gap-2 text-sm">
                              {/* Avatar - rightmost */}
                              {blog.author?.avatar?.url && (
                                <img
                                  src={blog.author.avatar.url}
                                  alt={blog.author.name}
                                  className="w-8 h-8 rounded-full ml-2"
                                />
                              )}
                              
                              {/* Author info and meta - left of avatar */}
                              <div className="text-right flex-1">
                                <p className="text-gray-700 font-medium">{blog.author?.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                                  <span>{blog.views?.toLocaleString() || 0} مشاهدة</span>
                                  {blog.readTime && (
                                    <>
                                      <span>•</span>
                                      <span>{blog.readTime} دقيقة</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>

                          {index < popularBlogs.length - 1 && (
                            <div className="border-b border-gray-100 mt-6" />
                          )}
                        </motion.article>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </aside>
          </div>
        </div>

        {/* Authors of the Month Section - Full Width */}
        {authorsOfMonth.length > 0 && (
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
        )}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;
