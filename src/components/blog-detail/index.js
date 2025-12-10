// frontend/src/components/blog-detail/index.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import useBlogDetail from './hooks/useBlogDetail';
import BlogDetailLoading from './components/BlogDetailLoading';
import BlogDetailError from './components/BlogDetailError';
import BlogDetailHero from './components/BlogDetailHero';
import BlogDetailContent from './components/BlogDetailContent';
import BlogDetailAuthor from './components/BlogDetailAuthor';
import BlogDetailShare from './components/BlogDetailShare';
import BlogDetailRelated from './components/BlogDetailRelated';

const BlogDetailPage = () => {
    const { blog, relatedPosts, isLoading, error, seo } = useBlogDetail();

    if (isLoading) return <BlogDetailLoading />;
    if (error || !blog) return <BlogDetailError />;

    return (
        <>
            <Helmet>
                <title>{blog.title} | MIND-X Blog</title>
                <meta name="description" content={seo.metaDescription} />
                {blog.author?.name && <meta name="author" content={blog.author.name} />}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={seo.metaDescription} />
                {seo.canonicalUrl && <meta property="og:url" content={seo.canonicalUrl} />}
                {seo.shareImage && <meta property="og:image" content={seo.shareImage} />}
                <meta property="og:site_name" content="MIND-X" />
                {blog.author?.name && <meta property="article:author" content={blog.author.name} />}
                {blog.publishedAt && <meta property="article:published_time" content={blog.publishedAt} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={blog.title} />
                <meta name="twitter:description" content={seo.metaDescription} />
                {seo.shareImage && <meta name="twitter:image" content={seo.shareImage} />}
            </Helmet>

            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
                <div
                    className="h-full bg-[#FBB859] transition-all duration-100"
                    style={{ width: 'var(--reading-progress, 0%)' }}
                />
            </div>

            <article className="min-h-screen bg-gray-50">
                <BlogDetailHero blog={blog} />
                <BlogDetailContent blog={blog} />
                <BlogDetailAuthor author={blog.author} />
                <BlogDetailShare blog={blog} shareUrl={seo.shareUrl} />
                <BlogDetailRelated relatedPosts={relatedPosts} />
            </article>
        </>
    );
};

export default BlogDetailPage;
