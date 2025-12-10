// frontend/src/components/form-view/index.js
import React from 'react';
import { useFormView } from './hooks/useFormView';
import FormViewLoading from './components/FormViewLoading';
import FormViewError from './components/FormViewError';
import FormViewSuccess from './components/FormViewSuccess';
import FormHeader from './components/FormHeader';
import EmailCollection from './components/EmailCollection';
import QuestionRenderer from './components/QuestionRenderer';
import FormSubmitSection from './components/FormSubmitSection';

const FormView = () => {
    const {
        form,
        isLoading,
        error,
        formData,
        submitted,
        submissionError,
        isSubmitting,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        goToHomepage,
    } = useFormView();

    // Loading state
    if (isLoading) {
        return <FormViewLoading />;
    }

    // Error state
    if (error) {
        return <FormViewError error={error} onGoHome={goToHomepage} />;
    }

    // Success state
    if (submitted) {
        return <FormViewSuccess form={form} onGoHome={goToHomepage} />;
    }

    const primaryColor = form.theme?.primaryColor || '#FBB859';
    const totalQuestions = form.questions?.length || 0;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <FormHeader form={form} />

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg">
                    {/* Email Collection */}
                    {form.settings?.collectEmail && (
                        <EmailCollection
                            email={formData.email}
                            primaryColor={primaryColor}
                            onInputChange={handleInputChange}
                        />
                    )}

                    {/* Questions */}
                    {form.questions?.map((question, index) => (
                        <QuestionRenderer
                            key={question._id}
                            question={question}
                            index={index}
                            totalQuestions={totalQuestions}
                            formData={formData}
                            primaryColor={primaryColor}
                            showProgressBar={form.settings?.showProgressBar}
                            onInputChange={handleInputChange}
                            onCheckboxChange={handleCheckboxChange}
                        />
                    ))}

                    {/* Submit Button */}
                    <FormSubmitSection
                        isSubmitting={isSubmitting}
                        submissionError={submissionError}
                        submitButtonText={form.settings?.submitButtonText}
                        primaryColor={primaryColor}
                    />
                </form>
            </div>
        </div>
    );
};

export default FormView;
