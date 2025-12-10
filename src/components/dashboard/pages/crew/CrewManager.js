// frontend/src/components/dashboard/pages/crew/CrewManager.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MembersList from './sections/MembersList';
import MemberBuilder from './sections/MemberBuilder';

const CrewManager = () => {
    const [activeTab, setActiveTab] = useState('members'); // 'members'
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const handleCreateNew = () => {
        setEditingMember(null);
        setShowForm(true);
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setEditingMember(null);
        setShowForm(false);
    };

    const handleMemberSaved = () => {
        setEditingMember(null);
        setShowForm(false);
    };

    return (
        <>
            <Helmet>
                <title>MIND-X: Dashboard - Crew Management</title>
            </Helmet>

            <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
                {/* Tab Navigation */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="px-6">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => {
                                    setActiveTab('members');
                                    setShowForm(false);
                                }}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'members'
                                        ? 'border-[#FBB859] text-[#FBB859]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Members Management
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'members' && !showForm && (
                        <MembersList onEdit={handleEdit} onCreateNew={handleCreateNew} />
                    )}

                    {activeTab === 'members' && showForm && (
                        <MemberBuilder
                            member={editingMember}
                            onCancel={handleCancelEdit}
                            onSaved={handleMemberSaved}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default CrewManager;
