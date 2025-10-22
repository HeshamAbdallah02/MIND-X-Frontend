// frontend/src/components/dashboard/pages/forms/sections/FormBuilder.js
import React, { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { FiSave, FiX, FiPlus, FiTrash2, FiSettings } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const QUESTION_TYPES = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'file', label: 'File Upload' }
];

const FormBuilder = ({ form, onCancel, onSaved }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('questions'); // questions, settings
  
  const [formData, setFormData] = useState({
    title: form?.title || '',
    description: form?.description || '',
    questions: form?.questions || [],
    settings: {
      isPublished: form?.settings?.isPublished || false,
      allowMultipleSubmissions: form?.settings?.allowMultipleSubmissions || false,
      requireLogin: form?.settings?.requireLogin || false,
      showProgressBar: form?.settings?.showProgressBar || true,
      submitButtonText: form?.settings?.submitButtonText || 'Submit',
      confirmationMessage: form?.settings?.confirmationMessage || 'Thank you! Your response has been submitted.',
      deadline: form?.settings?.deadline || null,
      maxSubmissions: form?.settings?.maxSubmissions || null,
      collectEmail: form?.settings?.collectEmail !== undefined ? form?.settings?.collectEmail : true
    },
    theme: {
      primaryColor: form?.theme?.primaryColor || '#FBB859',
      backgroundColor: form?.theme?.backgroundColor || '#FFFFFF'
    }
  });

  // Add new question
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          type: 'text',
          label: 'Untitled Question',
          description: '',
          placeholder: '',
          required: false,
          options: [],
          validation: {},
          order: prev.questions.length
        }
      ]
    }));
  };

  // Update question
  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  // Delete question
  const deleteQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  // Move question up/down
  const moveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.questions.length) return;

    const newQuestions = [...formData.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    
    setFormData(prev => ({
      ...prev,
      questions: newQuestions.map((q, i) => ({ ...q, order: i }))
    }));
  };

  // Add option to question (for select, radio, checkbox)
  const addOption = (questionIndex) => {
    updateQuestion(questionIndex, 'options', [
      ...(formData.questions[questionIndex].options || []),
      `Option ${(formData.questions[questionIndex].options?.length || 0) + 1}`
    ]);
  };

  // Update option
  const updateOption = (questionIndex, optionIndex, value) => {
    const newOptions = [...formData.questions[questionIndex].options];
    newOptions[optionIndex] = value;
    updateQuestion(questionIndex, 'options', newOptions);
  };

  // Delete option
  const deleteOption = (questionIndex, optionIndex) => {
    updateQuestion(
      questionIndex,
      'options',
      formData.questions[questionIndex].options.filter((_, i) => i !== optionIndex)
    );
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a form title');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (form?._id) {
        // Update existing form
        await axios.put(
          `${API_BASE_URL}/api/forms/admin/${form._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new form
        await axios.post(
          `${API_BASE_URL}/api/forms/admin`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await queryClient.invalidateQueries(['dashboard-forms']);
      onSaved();
    } catch (error) {
      console.error('Error saving form:', error);
      alert(error.response?.data?.message || 'Failed to save form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {form ? 'Edit Form' : 'Create New Form'}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiX size={18} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-[#FBB859] hover:bg-[#FBB859]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSave size={18} />
              {loading ? 'Saving...' : form ? 'Update Form' : 'Create Form'}
            </button>
          </div>
        </div>

        {/* Form Title & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="e.g., Event Registration Form"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              rows="3"
              placeholder="Add a description for your form..."
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'questions'
              ? 'bg-[#FBB859] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Questions ({formData.questions.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-[#FBB859] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <FiSettings size={16} />
          Settings
        </button>
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Questions List */}
          {formData.questions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                {/* Move buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveQuestion(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveQuestion(index, 'down')}
                    disabled={index === formData.questions.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>

                {/* Question Content */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Label *
                      </label>
                      <input
                        type="text"
                        value={question.label}
                        onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        placeholder="Enter your question"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      >
                        {QUESTION_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      value={question.description}
                      onChange={(e) => updateQuestion(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                      placeholder="Add helpful text for this question"
                    />
                  </div>

                  {/* Options for select, radio, checkbox */}
                  {['select', 'radio', 'checkbox'].includes(question.type) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {(question.options || []).map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, optIndex, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            <button
                              onClick={() => deleteOption(index, optIndex)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(index)}
                          className="text-sm text-[#FBB859] hover:text-[#FBB859]/80 flex items-center gap-1"
                        >
                          <FiPlus size={16} />
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Placeholder for text inputs */}
                  {['text', 'email', 'number', 'tel', 'url', 'textarea'].includes(question.type) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={question.placeholder}
                        onChange={(e) => updateQuestion(index, 'placeholder', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                        placeholder="Placeholder text..."
                      />
                    </div>
                  )}

                  {/* Required checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={question.required}
                      onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                      className="w-4 h-4 text-[#FBB859] rounded focus:ring-[#FBB859]"
                    />
                    <label htmlFor={`required-${index}`} className="text-sm text-gray-700">
                      Required question
                    </label>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteQuestion(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete question"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Question Button */}
          <button
            onClick={addQuestion}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#FBB859] hover:text-[#FBB859] transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FiPlus size={20} />
            Add Question
          </button>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h3>
            
            <div className="space-y-4">
              {/* Collect Email */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="collectEmail"
                  checked={formData.settings.collectEmail}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, collectEmail: e.target.checked }
                  }))}
                  className="w-4 h-4 text-[#FBB859] rounded focus:ring-[#FBB859]"
                />
                <label htmlFor="collectEmail" className="text-sm text-gray-700">
                  Collect respondent email address
                </label>
              </div>

              {/* Allow Multiple Submissions */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowMultiple"
                  checked={formData.settings.allowMultipleSubmissions}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allowMultipleSubmissions: e.target.checked }
                  }))}
                  className="w-4 h-4 text-[#FBB859] rounded focus:ring-[#FBB859]"
                />
                <label htmlFor="allowMultiple" className="text-sm text-gray-700">
                  Allow multiple submissions per user
                </label>
              </div>

              {/* Show Progress Bar */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showProgress"
                  checked={formData.settings.showProgressBar}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, showProgressBar: e.target.checked }
                  }))}
                  className="w-4 h-4 text-[#FBB859] rounded focus:ring-[#FBB859]"
                />
                <label htmlFor="showProgress" className="text-sm text-gray-700">
                  Show progress bar
                </label>
              </div>

              {/* Submit Button Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submit Button Text
                </label>
                <input
                  type="text"
                  value={formData.settings.submitButtonText}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, submitButtonText: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Submit"
                />
              </div>

              {/* Confirmation Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation Message
                </label>
                <textarea
                  value={formData.settings.confirmationMessage}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, confirmationMessage: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  rows="3"
                  placeholder="Message shown after form submission"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Deadline (optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.settings.deadline ? new Date(formData.settings.deadline).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, deadline: e.target.value ? new Date(e.target.value) : null }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                />
              </div>

              {/* Max Submissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Submissions (optional)
                </label>
                <input
                  type="number"
                  value={formData.settings.maxSubmissions || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, maxSubmissions: e.target.value ? parseInt(e.target.value) : null }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={formData.theme.primaryColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value }
                    }))}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.theme.primaryColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value }
                    }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-6 -mx-6 flex justify-end gap-2 shadow-lg">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-2 bg-[#FBB859] hover:bg-[#FBB859]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FiSave size={18} />
          {loading ? 'Saving...' : form ? 'Update Form' : 'Create Form'}
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;
