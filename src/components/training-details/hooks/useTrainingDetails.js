// frontend/src/components/training-details/hooks/useTrainingDetails.js
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const useTrainingDetails = () => {
    const { slug } = useParams();

    const { data: training, isLoading, error } = useQuery({
        queryKey: ['training', slug],
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/api/trainings/public/${slug}`);
            return data;
        }
    });

    // Computed values
    const registrationLink = training?.registration?.formLink
        ? `/forms/${training.registration.formLink}`
        : training?.registration?.externalLink || null;

    const isRegistrationOpen = training?.registration?.isOpen &&
        training?.status !== 'completed' &&
        training?.status !== 'cancelled' &&
        (training?.registration?.spots?.available > 0 || !training?.registration?.spots?.total);

    return {
        training,
        isLoading,
        error,
        registrationLink,
        isRegistrationOpen
    };
};

export default useTrainingDetails;
