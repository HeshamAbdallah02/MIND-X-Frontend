// frontend/src/components/member-profile/hooks/useMemberProfile.js
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

export const useMemberProfile = () => {
    const { slug } = useParams();

    const {
        data: member,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['member-profile', slug],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/api/members/public/${slug}`);
            return response.data;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1
    });

    return {
        member,
        isLoading,
        error,
        refetch,
        slug
    };
};

export default useMemberProfile;
