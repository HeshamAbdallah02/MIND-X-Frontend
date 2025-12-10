// frontend/src/components/dashboard/pages/forms/sections/FormResponses.js
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  FiArrowLeft, FiTrash2, FiDownload, FiUsers, FiCalendar,
  FiSearch, FiChevronLeft, FiChevronRight, FiBarChart2,
  FiList, FiCheck, FiX, FiMail, FiClock
} from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [activeTab, setActiveTab] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch form details
  const { data: form, refetch: refetchForm } = useQuery({
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

  const submissions = useMemo(() => submissionsData?.submissions || [], [submissionsData]);

  // Filter submissions based on search
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    const query = searchQuery.toLowerCase();
    return submissions.filter(sub => {
      const emailMatch = sub.submitter?.email?.toLowerCase().includes(query);
      const answerMatch = sub.answers.some(a =>
        String(a.answer).toLowerCase().includes(query)
      );
      return emailMatch || answerMatch;
    });
  }, [submissions, searchQuery]);

  // Toggle accepting responses
  const toggleAcceptingMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/forms/admin/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      refetchForm();
      queryClient.invalidateQueries(['dashboard-forms']);
    },
  });

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
      if (currentResponseIndex >= filteredSubmissions.length - 1) {
        setCurrentResponseIndex(Math.max(0, currentResponseIndex - 1));
      }
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      setDeletingId(submissionId);
      deleteMutation.mutate(submissionId);
    }
  };

  const exportToCSV = () => {
    if (!form || submissions.length === 0) return;

    const headers = ['Submitted At', 'Email'];
    form.questions.forEach((q) => headers.push(q.label));

    const rows = submissions.map((submission) => {
      const row = [
        new Date(submission.submittedAt).toLocaleString(),
        submission.submitter?.email || 'N/A',
      ];
      form.questions.forEach((question) => {
        const answer = submission.answers.find((a) => a.questionId === question._id);
        const value = answer?.answer || '';
        const cellValue = Array.isArray(value) ? value.join(', ') : value;
        row.push(cellValue);
      });
      return row;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Download with UTF-8 BOM for proper Arabic/Unicode support in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title.replace(/\s+/g, '_')}_responses.csv`;
    link.click();
  };

  // Calculate question statistics for summary view
  const getQuestionStats = (question) => {
    const answers = submissions
      .map(sub => sub.answers.find(a => a.questionId === question._id)?.answer)
      .filter(Boolean);

    if (['radio', 'select', 'checkbox'].includes(question.type)) {
      const counts = {};
      answers.forEach(answer => {
        const values = Array.isArray(answer) ? answer : [answer];
        values.forEach(val => {
          counts[val] = (counts[val] || 0) + 1;
        });
      });
      return { type: 'chart', data: counts, total: answers.length };
    }

    return { type: 'list', data: answers, total: answers.length };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
      </div>
    );
  }

  const currentResponse = filteredSubmissions[currentResponseIndex];

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Back button and title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{form?.title}</h1>
                <p className="text-sm text-gray-500">{submissions.length} responses</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Accepting responses toggle */}
              <button
                onClick={() => toggleAcceptingMutation.mutate()}
                disabled={toggleAcceptingMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${form?.settings?.isPublished
                  ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
              >
                {form?.settings?.isPublished ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Form Open
                  </>
                ) : (
                  <>
                    <FiX className="w-4 h-4" />
                    Form Closed
                  </>
                )}
              </button>

              {/* Export button */}
              <button
                onClick={exportToCSV}
                disabled={submissions.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#FBB859] text-white rounded-lg font-medium text-sm hover:bg-[#e9a748] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDownload className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 -mb-[1px]">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'summary'
                ? 'text-[#FBB859] border-[#FBB859]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
            >
              <FiBarChart2 className="w-4 h-4" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'individual'
                ? 'text-[#FBB859] border-[#FBB859]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
            >
              <FiList className="w-4 h-4" />
              Individual
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {submissions.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUsers className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Share your form to start collecting responses. Once people submit, you'll see their answers here.
            </p>
          </div>
        ) : activeTab === 'summary' ? (
          /* Summary View */
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Responses</p>
                    <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Latest Response</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(submissions[0]?.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <FiBarChart2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{form?.questions?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question-by-question breakdown */}
            {form?.questions?.map((question, index) => {
              const stats = getQuestionStats(question);

              return (
                <div key={question._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">{question.label}</h3>
                    <p className="text-sm text-gray-500">{stats.total} responses</p>
                  </div>

                  <div className="p-5">
                    {stats.type === 'chart' ? (
                      /* Bar chart for multiple choice */
                      <div className="space-y-3">
                        {Object.entries(stats.data)
                          .sort((a, b) => b[1] - a[1])
                          .map(([option, count]) => {
                            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                            return (
                              <div key={option}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-700">{option}</span>
                                  <span className="text-sm text-gray-500">{count} ({percentage.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#FBB859] to-[#F5A623] rounded-full transition-all duration-500 flex items-center"
                                    style={{ width: `${Math.max(percentage, 2)}%` }}
                                  >
                                    {percentage > 15 && (
                                      <span className="text-xs font-medium text-white ml-3">{percentage.toFixed(0)}%</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      /* Text responses list */
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {stats.data.slice(0, 10).map((answer, i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                            {answer}
                          </div>
                        ))}
                        {stats.data.length > 10 && (
                          <p className="text-sm text-gray-500 text-center py-2">
                            +{stats.data.length - 10} more responses
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Individual Responses View */
          <div>
            {/* Search and navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-80">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search responses..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentResponseIndex(0);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB859]/50 focus:border-[#FBB859]"
                />
              </div>

              {/* Response navigator */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentResponseIndex(Math.max(0, currentResponseIndex - 1))}
                  disabled={currentResponseIndex === 0}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[80px] text-center">
                  {filteredSubmissions.length > 0 ? (
                    <>{currentResponseIndex + 1} of {filteredSubmissions.length}</>
                  ) : (
                    'No results'
                  )}
                </span>
                <button
                  onClick={() => setCurrentResponseIndex(Math.min(filteredSubmissions.length - 1, currentResponseIndex + 1))}
                  disabled={currentResponseIndex >= filteredSubmissions.length - 1}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Response Card */}
            {currentResponse ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Response header */}
                <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FBB859]/10 rounded-full flex items-center justify-center">
                      <FiMail className="w-5 h-5 text-[#FBB859]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {currentResponse.submitter?.email || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FiClock className="w-3.5 h-3.5" />
                        {new Date(currentResponse.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(currentResponse._id)}
                    disabled={deletingId === currentResponse._id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === currentResponse._id ? (
                      <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Response answers */}
                <div className="divide-y divide-gray-100">
                  {form?.questions?.map((question) => {
                    const answer = currentResponse.answers.find(
                      (a) => a.questionId === question._id
                    );
                    const value = answer?.answer || '';
                    const displayValue = Array.isArray(value) ? value.join(', ') : String(value);

                    return (
                      <div key={question._id} className="p-5">
                        <p className="text-sm font-medium text-gray-500 mb-2">{question.label}</p>
                        <p className="text-gray-900">{displayValue || <span className="text-gray-400 italic">No answer</span>}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No responses match your search</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
