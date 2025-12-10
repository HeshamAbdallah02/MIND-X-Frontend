// frontend/src/components/blog-detail/hooks/useBlogDetail.js
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const useBlogDetail = () => {
    const { slug } = useParams();

    // Fetch blog post
    const {
        data: blog,
        isLoading,
        error
    } = useQuery({
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

    // Compute SEO metadata
    const seo = {
        metaDescription: blog?.excerpt || blog?.content?.replace(/<[^>]+>/g, '').slice(0, 160) || 'Explore insights from MIND-X.',
        canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/blog/${blog?.slug}` : '',
        shareImage: blog?.coverImage?.url,
        shareUrl: typeof window !== 'undefined' ? `${window.location.origin}/blog/${blog?.slug}` : ''
    };

    return {
        blog,
        relatedPosts,
        isLoading,
        error,
        seo
    };
};

export default useBlogDetail;
