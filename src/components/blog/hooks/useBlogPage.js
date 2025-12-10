// frontend/src/components/blog/hooks/useBlogPage.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const useBlogPage = () => {
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

    // Handlers
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(1);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setPage(1);
    };

    return {
        // Data
        heroPost,
        blogs,
        pagination,
        categories,
        popularBlogs,
        authorsOfMonth,
        isLoading,
        // State
        selectedCategory,
        searchQuery,
        page,
        // Handlers
        setSelectedCategory: handleCategoryChange,
        setSearchQuery: handleSearchChange,
        setPage
    };
};

export default useBlogPage;
