// frontend/src/components/trainings/hooks/useTrainingsPage.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useTrainingsPage = () => {
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    // Fetch hero section
    const { data: hero } = useQuery({
        queryKey: ['training-hero-public'],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/training-hero/public`);
                return data;
            } catch (error) {
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        retry: false
    });

    // Fetch trainings
    const { data: trainings = [], isLoading } = useQuery({
        queryKey: ['trainings-public'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/api/trainings/public`);
            return data;
        }
    });

    // Fetch CTA
    const { data: cta } = useQuery({
        queryKey: ['training-cta-public'],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/training-cta/public`);
                return data;
            } catch (error) {
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        retry: false
    });

    // Filter trainings
    const filteredTrainings = trainings.filter(training => {
        if (filter === 'upcoming') return training.status === 'upcoming' || training.status === 'ongoing';
        if (filter === 'past') return training.status === 'completed';
        return true;
    });

    const scrollToTrainings = () => {
        document.getElementById('trainings-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return {
        hero,
        cta,
        trainings: filteredTrainings,
        isLoading,
        filter,
        setFilter,
        scrollToTrainings
    };
};
