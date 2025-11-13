// frontend/src/components/dashboard/pages/trainings/TrainingsManager.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TrainingsList from './sections/TrainingsList';
import TrainingBuilder from './sections/TrainingBuilder';
import TrainingHeroManager from './sections/TrainingHeroManager';
import TrainingCTAManager from './sections/TrainingCTAManager';

const TrainingsManager = () => {
  const [activeTab, setActiveTab] = useState('trainings'); // 'trainings' | 'hero' | 'cta'
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  const handleCreateNew = () => {
    setEditingTraining(null);
    setShowForm(true);
  };

  const handleEdit = (training) => {
    setEditingTraining(training);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTraining(null);
    setShowForm(false);
  };

  const handleTrainingSaved = () => {
    setEditingTraining(null);
    setShowForm(false);
  };

  return (
    <>
      <Helmet>
        <title>MIND-X: Dashboard - Trainings Management</title>
      </Helmet>
      
      <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('trainings');
                  setShowForm(false);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'trainings'
                    ? 'border-[#FBB859] text-[#FBB859]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Trainings Management
              </button>
              <button
                onClick={() => {
                  setActiveTab('hero');
                  setShowForm(false);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'hero'
                    ? 'border-[#FBB859] text-[#FBB859]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hero Section
              </button>
              <button
                onClick={() => {
                  setActiveTab('cta');
                  setShowForm(false);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'cta'
                    ? 'border-[#FBB859] text-[#FBB859]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Volunteer CTA
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'trainings' && !showForm && (
            <TrainingsList onEdit={handleEdit} onCreateNew={handleCreateNew} />
          )}
          
          {activeTab === 'trainings' && showForm && (
            <TrainingBuilder 
              training={editingTraining} 
              onCancel={handleCancelEdit}
              onSaved={handleTrainingSaved}
            />
          )}
          
          {activeTab === 'hero' && (
            <TrainingHeroManager />
          )}

          {activeTab === 'cta' && (
            <TrainingCTAManager />
          )}
        </div>
      </div>
    </>
  );
};

export default TrainingsManager;
