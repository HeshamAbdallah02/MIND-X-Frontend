// frontend/src/pages/FormViewPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FormViewPage = () => {
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

  const renderQuestion = (question, index) => {
    const primaryColor = form.theme?.primaryColor || '#FBB859';

    switch (question.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'tel':
      case 'url':
        return (
          <input
            type={question.type}
            id={question._id}
            placeholder={question.placeholder}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': primaryColor }}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={question._id}
            placeholder={question.placeholder}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': primaryColor }}
          />
        );

      case 'select':
        return (
          <select
            id={question._id}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': primaryColor }}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={formData[question._id] === option}
                  onChange={(e) => handleInputChange(question._id, e.target.value)}
                  required={question.required}
                  className="w-4 h-4 text-[#FBB859] focus:ring-2 focus:ring-opacity-50"
                  style={{ accentColor: primaryColor }}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => {
              const isChecked = (formData[question._id] || []).includes(option);
              return (
                <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(question._id, option, e.target.checked)
                    }
                    className="w-4 h-4 text-[#FBB859] rounded focus:ring-2 focus:ring-opacity-50"
                    style={{ accentColor: primaryColor }}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            id={question._id}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': primaryColor }}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            id={question._id}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': primaryColor }}
          />
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            id={question._id}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': primaryColor }}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            id={question._id}
            onChange={(e) => handleInputChange(question._id, e.target.files[0]?.name)}
            required={question.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-gray-100"
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error.response?.data?.error || 'This form does not exist or is no longer available.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            {form.settings?.confirmationMessage || 'Your response has been submitted successfully.'}
          </p>
          {!form.settings?.allowMultipleSubmissions && (
            <p className="text-sm text-gray-500 mb-6">
              You cannot submit another response to this form.
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const primaryColor = form.theme?.primaryColor || '#FBB859';
  const totalQuestions = form.questions?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div
          className="bg-white rounded-t-xl p-8 shadow-lg"
          style={{ borderTop: `6px solid ${primaryColor}` }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600 whitespace-pre-wrap">{form.description}</p>
          )}

          {/* Deadline Warning */}
          {form.settings?.deadline && (
            <div className="mt-4 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              <FiClock className="w-4 h-4" />
              <span>
                Deadline: {new Date(form.settings.deadline).toLocaleString()}
              </span>
            </div>
          )}

          {/* Required Fields Note */}
          <p className="mt-4 text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg">
          {/* Email Collection */}
          {form.settings?.collectEmail && (
            <div className="p-8 border-b border-gray-200">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{ '--tw-ring-color': primaryColor }}
                placeholder="your.email@example.com"
              />
            </div>
          )}

          {/* Questions */}
          {form.questions?.map((question, index) => (
            <div key={question._id} className="p-8 border-b border-gray-200">
              {/* Progress Indicator */}
              {form.settings?.showProgressBar && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Question {index + 1} of {totalQuestions}</span>
                    <span>{Math.round(((index + 1) / totalQuestions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${((index + 1) / totalQuestions) * 100}%`,
                        backgroundColor: primaryColor,
                      }}
                    />
                  </div>
                </div>
              )}

              <label htmlFor={question._id} className="block text-base font-medium text-gray-900 mb-2">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {question.description && (
                <p className="text-sm text-gray-600 mb-3">{question.description}</p>
              )}

              {renderQuestion(question, index)}
            </div>
          ))}

          {/* Submit Button */}
          <div className="p-8 rounded-b-xl">
            {submissionError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submissionError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              {submitMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>{form.settings?.submitButtonText || 'Submit'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormViewPage;
