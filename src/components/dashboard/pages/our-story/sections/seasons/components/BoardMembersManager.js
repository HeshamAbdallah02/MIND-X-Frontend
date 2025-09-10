// frontend/src/components/dashboard/pages/our-story/sections/seasons/components/BoardMembersManager.js
import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiStar, FiUser } from 'react-icons/fi';
import { useSeasonBoardMembers, useSeasonsMutations } from '../../../../../../../hooks/useSeasonsQueries';
import LoadingSpinner from '../../../../../../shared/LoadingSpinner';
import ConfirmDialog from '../../../../../shared/ConfirmDialog';
import BoardMemberForm from './BoardMemberForm';

const BoardMembersManager = ({ seasonId }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);

  // Fetch board members
  const { data: members = [], isLoading, error } = useSeasonBoardMembers(seasonId);
  
  // Get mutations
  const {
    deleteBoardMemberMutation,
    updateBoardMemberMutation,
  } = useSeasonsMutations();

  const handleCreateMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDeleteMember = (member) => {
    setDeleteMember(member);
  };

  const confirmDelete = () => {
    if (deleteMember) {
      deleteBoardMemberMutation.mutate({
        seasonId,
        memberId: deleteMember._id
      });
      setDeleteMember(null);
    }
  };

  const handleToggleLeader = (member) => {
    updateBoardMemberMutation.mutate({
      seasonId,
      memberId: member._id,
      data: { isLeader: !member.isLeader }
    });
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
        <p className="text-red-800">Error loading board members: {error.message}</p>
      </div>
    );
  }

  const leaders = members.filter(member => member.isLeader);
  const teamMembers = members.filter(member => !member.isLeader);

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Board Members</h3>
            <p className="text-gray-600">Manage leadership team and members</p>
          </div>
          <button
            onClick={handleCreateMember}
            className="bg-[#81C99C] hover:bg-[#6db885] text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">{leaders.length}</div>
            <div className="text-sm text-yellow-800">Leaders</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{teamMembers.length}</div>
            <div className="text-sm text-blue-800">Team Members</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{members.length}</div>
            <div className="text-sm text-green-800">Total Members</div>
          </div>
        </div>

        {/* Members List */}
        {members.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No board members yet</h4>
            <p className="text-gray-600 mb-4">
              Start building your team by adding board members.
            </p>
            <button
              onClick={handleCreateMember}
              className="bg-[#81C99C] hover:bg-[#6db885] text-white px-4 py-2 rounded-lg inline-flex items-center font-medium transition-colors"
            >
              <FiPlus className="mr-2" />
              Add First Member
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Leaders Section */}
            {leaders.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <FiStar className="w-4 h-4 mr-2 text-yellow-500" />
                  Leadership Team
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leaders.map((member) => (
                    <MemberCard
                      key={member._id}
                      member={member}
                      onEdit={handleEditMember}
                      onDelete={handleDeleteMember}
                      onToggleLeader={handleToggleLeader}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Team Members Section */}
            {teamMembers.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <FiUser className="w-4 h-4 mr-2 text-blue-500" />
                  Team Members
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <MemberCard
                      key={member._id}
                      member={member}
                      onEdit={handleEditMember}
                      onDelete={handleDeleteMember}
                      onToggleLeader={handleToggleLeader}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Member Form Modal */}
      {showForm && (
        <BoardMemberForm
          seasonId={seasonId}
          member={editingMember}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteMember}
        onClose={() => setDeleteMember(null)}
        onConfirm={confirmDelete}
        title="Delete Board Member"
        message={
          deleteMember 
            ? `Are you sure you want to remove "${deleteMember.name}" from the board? This action cannot be undone.`
            : ''
        }
        confirmText="Remove Member"
        type="danger"
      />
    </>
  );
};

// Member Card Component
const MemberCard = ({ member, onEdit, onDelete, onToggleLeader }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Member Avatar */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-gray-400" />
            </div>
          )}
          {member.isLeader && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <FiStar className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-gray-900 truncate">{member.name}</h5>
          <p className="text-sm text-gray-600 truncate">{member.position}</p>
        </div>
      </div>

      {/* Member Bio (if available) */}
      {member.bio && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onToggleLeader(member)}
          className={`flex items-center text-xs px-2 py-1 rounded transition-colors ${
            member.isLeader
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FiStar className="w-3 h-3 mr-1" />
          {member.isLeader ? 'Leader' : 'Make Leader'}
        </button>

        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(member)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit member"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete member"
          >
            <FiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardMembersManager;
