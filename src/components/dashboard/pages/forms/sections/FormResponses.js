// frontend/src/components/dashboard/pages/forms/sections/FormResponses.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FiArrowLeft, FiTrash2, FiDownload, FiUsers, FiCalendar } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  // Fetch form details
  const { data: form } = useQuery({
    queryKey: ['form', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE_URL}/api/forms/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Fetch submissions
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['formSubmissions', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE_URL}/api/forms/admin/${id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const submissions = submissionsData?.submissions || [];

  // Delete submission mutation
  const deleteMutation = useMutation({
    mutationFn: async (submissionId) => {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/api/forms/admin/${id}/submissions/${submissionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['formSubmissions', id]);
      queryClient.invalidateQueries(['form', id]);
      setDeletingId(null);
    },
    onError: () => {
      setDeletingId(null);
      alert('Failed to delete submission');
    },
  });

  const handleDelete = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      setDeletingId(submissionId);
      deleteMutation.mutate(submissionId);
    }
  };

  const exportToCSV = () => {
    if (!form || submissions.length === 0) return;

    // Create CSV header
    const headers = ['Submitted At', 'Email'];
    form.questions.forEach((q) => headers.push(q.label));

    // Create CSV rows
    const rows = submissions.map((submission) => {
      const row = [
        new Date(submission.submittedAt).toLocaleString(),
        submission.submitter?.email || 'N/A',
      ];

      // Add answers for each question
      form.questions.forEach((question) => {
        const answer = submission.answers.find((a) => a.questionId === question._id);
        const value = answer?.answer || '';
        // Handle arrays (checkbox answers)
        const cellValue = Array.isArray(value) ? value.join(', ') : value;
        row.push(cellValue);
      });

      return row;
    });

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title.replace(/\s+/g, '_')}_responses.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Forms</span>
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form?.title}</h1>
            <p className="text-gray-600 mt-1">Form Responses</p>
          </div>

          <button
            onClick={exportToCSV}
            disabled={submissions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Latest Response</p>
              <p className="text-sm font-semibold text-gray-900">
                {submissions.length > 0
                  ? new Date(submissions[0].submittedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-gray-900">{form?.questions?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Responses Yet</h3>
          <p className="text-gray-600">
            This form hasn't received any submissions yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  {form?.settings?.collectEmail && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  )}
                  {form?.questions?.map((question) => (
                    <th
                      key={question._id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {question.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                    {form?.settings?.collectEmail && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {submission.submitter?.email || 'N/A'}
                      </td>
                    )}
                    {form?.questions?.map((question) => {
                      const answer = submission.answers.find(
                        (a) => a.questionId === question._id
                      );
                      const value = answer?.answer || '';
                      const displayValue = Array.isArray(value)
                        ? value.join(', ')
                        : String(value);

                      return (
                        <td
                          key={question._id}
                          className="px-6 py-4 text-sm text-gray-600"
                          style={{ maxWidth: '200px' }}
                        >
                          <div className="truncate" title={displayValue}>
                            {displayValue || '—'}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(submission._id)}
                        disabled={deletingId === submission._id}
                        className="text-red-600 hover:text-red-900 transition disabled:opacity-50"
                      >
                        {deletingId === submission._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <FiTrash2 className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
