// frontend/src/components/form-view/components/QuestionRenderer.js
import React from 'react';

const QuestionRenderer = ({
    question,
    index,
    totalQuestions,
    formData,
    primaryColor,
    showProgressBar,
    onInputChange,
    onCheckboxChange
}) => {
    const renderInput = () => {
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
                        onChange={(e) => onInputChange(question._id, e.target.value)}
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
                        onChange={(e) => onInputChange(question._id, e.target.value)}
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
                        onChange={(e) => onInputChange(question._id, e.target.value)}
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
                                    onChange={(e) => onInputChange(question._id, e.target.value)}
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
                                            onCheckboxChange(question._id, option, e.target.checked)
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
                        onChange={(e) => onInputChange(question._id, e.target.value)}
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
                        onChange={(e) => onInputChange(question._id, e.target.value)}
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
                        onChange={(e) => onInputChange(question._id, e.target.value)}
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
                        onChange={(e) => onInputChange(question._id, e.target.files[0]?.name)}
                        required={question.required}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-gray-100"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-8 border-b border-gray-200">
            {/* Progress Indicator */}
            {showProgressBar && (
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

            {renderInput()}
        </div>
    );
};

export default QuestionRenderer;
