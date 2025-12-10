// frontend/src/components/training-details/hooks/useTrainingDetails.js
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

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
