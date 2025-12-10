// frontend/src/components/form-view/hooks/useFormView.js
import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

export const useFormView = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [submissionError, setSubmissionError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Fetch form data
    const { data: form, isLoading, error } = useQuery({
        queryKey: ['form', slug],
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/api/forms/${slug}`);
            return data;
        },
    });

    // Submit form mutation
    const submitMutation = useMutation({
        mutationFn: async (submissionData) => {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/forms/${slug}/submit`,
                submissionData
            );
            return data;
        },
        onSuccess: () => {
            setSubmitted(true);
            setSubmissionError('');
        },
        onError: (err) => {
            setSubmissionError(
                err.response?.data?.error || 'Failed to submit form. Please try again.'
            );
        },
    });

    const handleInputChange = (questionId, value) => {
        setFormData((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleCheckboxChange = (questionId, option, checked) => {
        setFormData((prev) => {
            const currentValues = prev[questionId] || [];
            if (checked) {
                return { ...prev, [questionId]: [...currentValues, option] };
            } else {
                return {
                    ...prev,
                    [questionId]: currentValues.filter((v) => v !== option),
                };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmissionError('');

        // Validate required fields
        const missingFields = form.questions
            .filter((q) => q.required)
            .filter((q) => {
                const value = formData[q._id];
                return !value || (Array.isArray(value) && value.length === 0);
            });

        if (missingFields.length > 0) {
            setSubmissionError(
                `Please fill in all required fields: ${missingFields.map((f) => f.label).join(', ')}`
            );
            return;
        }

        // Build answers array
        const answers = form.questions.map((question) => ({
            questionId: question._id,
            question: question.label,
            questionType: question.type,
            answer: formData[question._id] || '',
        }));

        const submissionData = {
            submitter: {
                email: form.settings?.collectEmail ? formData.email : undefined,
            },
            answers,
        };

        submitMutation.mutate(submissionData);
    };

    const goToHomepage = () => navigate('/');

    return {
        form,
        isLoading,
        error,
        formData,
        submitted,
        submissionError,
        isSubmitting: submitMutation.isPending,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        goToHomepage,
    };
};
