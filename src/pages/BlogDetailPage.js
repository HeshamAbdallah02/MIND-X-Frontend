import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

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

const BlogDetailPage = () => {
  const { slug } = useParams();

  // Fetch blog post
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/public/${slug}`);
      return data;
    }
  });

  // Fetch related posts
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related-blogs', slug],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/public/${slug}/related`);
      return data;
    },
    enabled: !!blog
  });

  // Reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const articleElement = document.getElementById('article-content');
      if (!articleElement) return;

      const { top, height } = articleElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, Math.min(1, (windowHeight - top) / height));
      
      document.documentElement.style.setProperty('--reading-progress', `${scrolled * 100}%`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FBB859] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
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
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | MIND-X Blog</title>
        <meta name="description" content={blog.excerpt || blog.content.substring(0, 160)} />
        {blog.author?.name && <meta name="author" content={blog.author.name} />}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.coverImage?.url && <meta property="og:image" content={blog.coverImage.url} />}
      </Helmet>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-[#FBB859] transition-all duration-100"
          style={{ width: 'var(--reading-progress, 0%)' }}
        />
      </div>

      <article className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-white"
          dir="rtl"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link to="/blog" className="hover:text-[#FBB859]">Blog</Link>
              <span>‹</span>
              <span className="text-gray-900">{blog.title}</span>
            </nav>

            {/* Category Badge */}
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${categoryColors[blog.category] || categoryColors['Other']}`}>
              {blog.category}
            </span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {blog.title}
            </motion.h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-8"
              >
                {blog.excerpt}
              </motion.p>
            )}

            {/* Author & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200"
            >
              {/* Author */}
              <div className="flex items-center gap-4">
                {blog.author?.avatar?.url && (
                  <img
                    src={blog.author.avatar.url}
                    alt={blog.author.name}
                    className="w-14 h-14 rounded-full"
                  />
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-900">{blog.author?.name}</p>
                  <p className="text-sm text-gray-600">{blog.author?.role}</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                {blog.readTime && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {blog.readTime} min read
                    </span>
                  </>
                )}
                {blog.views > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {blog.views.toLocaleString()} views
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Cover Image */}
          {blog.coverImage?.url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
            >
              <img
                src={blog.coverImage.url}
                alt={blog.coverImage.alt || blog.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          )}
        </motion.section>

        {/* Article Content */}
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

          {/* Author Bio */}
          {blog.author?.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 p-8 bg-white rounded-xl shadow-md"
            >
              <div className="flex items-start gap-6">
                {blog.author.avatar?.url && (
                  <img
                    src={blog.author.avatar.url}
                    alt={blog.author.name}
                    className="w-24 h-24 rounded-full flex-shrink-0"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-2">About the author</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{blog.author.name}</h3>
                  <p className="text-[#FBB859] font-medium mb-3">{blog.author.role}</p>
                  <p className="text-gray-600 leading-relaxed">{blog.author.bio}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-gray-200"
            dir="ltr"
          >
            <p className="text-lg font-semibold text-gray-900 mb-4 text-left">Share this article</p>
            <div className="flex gap-4 justify-start">
              {/* Twitter/X */}
              <button
                onClick={() => {
                  const text = `I'm happy to share this article with you:\n\n${blog.title}`;
                  const url = window.location.href;
                  // Twitter allows text + URL
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                    '_blank',
                    'width=600,height=400'
                  );
                }}
                className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Share on X (Twitter)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                onClick={async () => {
                  const url = window.location.href;
                  const text = `I'm happy to share this article with you: ${blog.title}`;
                  
                  // Try Web Share API first (mobile)
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: blog.title, text, url });
                      return;
                    } catch (err) {}
                  }
                  
                  // Fallback: Copy to clipboard and open LinkedIn
                  await navigator.clipboard.writeText(`${text}\n\n${url}`);
                  alert('Message copied to clipboard! Paste it in your LinkedIn post.');
                  window.open(
                    `https://www.linkedin.com/feed/`,
                    '_blank'
                  );
                }}
                className="p-3 bg-[#0A66C2] text-white rounded-full hover:bg-[#004182] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                onClick={async () => {
                  const url = window.location.href;
                  const text = `I'm happy to share this article with you: ${blog.title}`;
                  
                  // Try Web Share API first (mobile)
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: blog.title, text, url });
                      return;
                    } catch (err) {}
                  }
                  
                  // Fallback: Copy to clipboard and open Facebook
                  await navigator.clipboard.writeText(`${text}\n\n${url}`);
                  alert('Message copied to clipboard! Paste it in your Facebook post.');
                  window.open(
                    `https://www.facebook.com/`,
                    '_blank'
                  );
                }}
                className="p-3 bg-[#1877F2] text-white rounded-full hover:bg-[#0d65d9] transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => {
                  const text = `I'm happy to share this article with you:\n\n*${blog.title}*\n\n${window.location.href}`;
                  // WhatsApp supports text parameter
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(text)}`,
                    '_blank'
                  );
                }}
                className="p-3 bg-[#25D366] text-white rounded-full hover:bg-[#1da851] transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>

              {/* Telegram */}
              <button
                onClick={() => {
                  const text = `I'm happy to share this article with you:\n\n${blog.title}`;
                  const url = window.location.href;
                  // Telegram supports text and url parameters
                  window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    '_blank'
                  );
                }}
                className="p-3 bg-[#0088cc] text-white rounded-full hover:bg-[#006ba1] transition-colors"
                aria-label="Share on Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </section>

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
      </article>
    </>
  );
};

export default BlogDetailPage;
