// frontend/src/components/dashboard/pages/forms/FormsManager.js
import React, { useState } from 'react';
import FormsList from './sections/FormsList';
import FormBuilder from './sections/FormBuilder';

const FormsManager = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState(null);

  const handleCreateNew = () => {
    setEditingForm(null);
    setShowBuilder(true);
  };

  const handleEdit = (form) => {
    setEditingForm(form);
    setShowBuilder(true);
  };

  const handleCancelEdit = () => {
    setEditingForm(null);
    setShowBuilder(false);
  };

  const handleFormSaved = () => {
    setEditingForm(null);
    setShowBuilder(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
      {!showBuilder ? (
        <FormsList onEdit={handleEdit} onCreateNew={handleCreateNew} />
      ) : (
        <div className="p-6">
          <FormBuilder 
            form={editingForm} 
            onCancel={handleCancelEdit}
            onSaved={handleFormSaved}
          />
        </div>
      )}
    </div>
  );
};

export default FormsManager;
