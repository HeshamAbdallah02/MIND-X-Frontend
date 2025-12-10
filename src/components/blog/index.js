// frontend/src/components/blog/index.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BlogHero from './components/BlogHero';
import BlogSearch from './components/BlogSearch';
import BlogCategoryFilter from './components/BlogCategoryFilter';
import BlogGrid from './components/BlogGrid';
import BlogPagination from './components/BlogPagination';
import PopularSidebar from './components/PopularSidebar';
import AuthorsOfMonth from './components/AuthorsOfMonth';
import Footer from '../layout/Footer';
import useBlogPage from './hooks/useBlogPage';

const BlogPage = () => {
    const {
        heroPost,
        blogs,
        pagination,
        categories,
        popularBlogs,
        authorsOfMonth,
        isLoading,
        selectedCategory,
        searchQuery,
        page,
        setSelectedCategory,
        setSearchQuery,
        setPage
    } = useBlogPage();

    return (
        <>
            <Helmet>
                <title>Blog | MIND-X</title>
                <meta name="description" content="Read the latest articles, insights, and stories from the MIND-X team about technology, innovation, leadership, and more." />
            </Helmet>

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section - Featured Post */}
                <BlogHero heroPost={heroPost} />

                {/* Main Content - Two Column Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Main Content Area */}
                        <div className="lg:col-span-8">
                            <BlogSearch
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                            />

                            <BlogCategoryFilter
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                totalCount={pagination.total}
                            />

                            <BlogGrid
                                blogs={blogs}
                                isLoading={isLoading}
                                selectedCategory={selectedCategory}
                                searchQuery={searchQuery}
                                page={page}
                            />

                            <BlogPagination
                                pagination={pagination}
                                page={page}
                                onPageChange={setPage}
                            />
                        </div>

                        {/* Right Column: Popular This Week Sidebar */}
                        <PopularSidebar popularBlogs={popularBlogs} />
                    </div>
                </div>

                {/* Authors of the Month Section */}
                <AuthorsOfMonth authorsOfMonth={authorsOfMonth} />

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

export default BlogPage;
