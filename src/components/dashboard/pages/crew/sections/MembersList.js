// frontend/src/components/dashboard/pages/crew/sections/MembersList.js
import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiUser, FiPlus, FiEye, FiEyeOff, FiLink, FiUsers } from 'react-icons/fi';
import { API_BASE_URL } from '../../../../../config/api';

const MembersList = ({ onEdit, onCreateNew }) => {
    const [filterSection, setFilterSection] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deleting, setDeleting] = useState(null);
    const [togglingStatus, setTogglingStatus] = useState(null);
    const queryClient = useQueryClient();

    // Fetch all members
    const { data: members = [], isLoading, error } = useQuery({
        queryKey: ['dashboard-members'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/members/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });

    // Fetch constants (positions/sections)
    const { data: constants = { positions: [], sections: [] } } = useQuery({
        queryKey: ['member-constants'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/api/members/constants`);
            return response.data;
        }
    });

    // Delete member
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this member? This will also delete their avatar.')) return;

        if (deleting === id) return;

        setDeleting(id);

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/members/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await queryClient.invalidateQueries(['dashboard-members']);
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Failed to delete member');
        } finally {
            setDeleting(null);
        }
    };

    // Toggle status
    const handleToggleStatus = async (id) => {
        if (togglingStatus === id) return;

        setTogglingStatus(id);

        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_BASE_URL}/api/members/admin/${id}/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await queryClient.invalidateQueries(['dashboard-members']);
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status');
        } finally {
            setTogglingStatus(null);
        }
    };

    // Copy profile link
    const handleCopyLink = (slug) => {
        const url = `${window.location.origin}/crew/${slug}`;
        navigator.clipboard.writeText(url);
        alert('Profile link copied to clipboard!');
    };

    // Filter members
    const filteredMembers = members.filter(member => {
        if (filterSection !== 'all' && member.section !== filterSection) return false;
        if (filterStatus !== 'all' && member.status !== filterStatus) return false;
        return true;
    });

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'alumni': return 'bg-blue-100 text-blue-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get position badge color
    const getPositionColor = (position) => {
        if (position.includes('High Board')) return 'bg-purple-100 text-purple-800';
        if (position.includes('Leader')) return 'bg-yellow-100 text-yellow-800';
        if (position.includes('Head')) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-700';
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
                <p className="mt-4 text-gray-600">Loading members...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">Failed to load members. Please try again.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Create Button */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Crew Members</h2>
                    <p className="text-gray-600 mt-1">Manage your team members and their profiles</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
                >
                    <FiPlus size={20} />
                    <span>Add New Member</span>
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-4 flex-wrap">
                {/* Section Filter */}
                <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FBB859]"
                >
                    <option value="all">All Sections</option>
                    {constants.sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                    ))}
                </select>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FBB859]"
                >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="alumni">Alumni</option>
                    <option value="inactive">Inactive</option>
                </select>

                {/* Count Display */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600">
                    <FiUsers size={16} />
                    <span>{filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Members Grid */}
            {filteredMembers.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No members found</h3>
                    <p className="text-gray-600 mb-6">
                        {members.length === 0
                            ? 'Get started by adding your first team member'
                            : 'No members match your current filters'
                        }
                    </p>
                    {members.length === 0 && (
                        <button
                            onClick={onCreateNew}
                            className="px-6 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors"
                        >
                            Add First Member
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMembers.map((member) => (
                        <div
                            key={member._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                        >
                            {/* Card Content with centered avatar */}
                            <div className="p-6 text-center">
                                {/* Circular Avatar */}
                                <div className="relative inline-block mb-4">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#FBB859]/20 to-[#e9a748]/20 border-4 border-white shadow-lg mx-auto">
                                        {member.avatar?.url ? (
                                            <img
                                                src={member.avatar.url}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <FiUser size={32} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Status Badge */}
                                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(member.status)}`}>
                                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>

                                {/* Position Badge */}
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getPositionColor(member.position)}`}>
                                    {member.fullPosition || member.position}
                                </span>

                                {/* Section */}
                                {member.section && (
                                    <p className="text-sm text-gray-500 mb-2">
                                        {member.section}
                                    </p>
                                )}

                                {/* Blog count */}
                                {member.blogs?.length > 0 && (
                                    <p className="text-xs text-gray-400">
                                        {member.blogs.length} blog{member.blogs.length !== 1 ? 's' : ''} written
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-2 flex-wrap p-4 pt-0">
                                <button
                                    onClick={() => onEdit(member)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors text-sm"
                                >
                                    <FiEdit2 size={14} />
                                    <span>Edit</span>
                                </button>

                                <button
                                    onClick={() => handleCopyLink(member.slug)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                >
                                    <FiLink size={14} />
                                    <span>Link</span>
                                </button>

                                <button
                                    onClick={() => handleToggleStatus(member._id)}
                                    disabled={togglingStatus === member._id}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${togglingStatus === member._id
                                        ? 'bg-gray-100 text-gray-500 cursor-wait'
                                        : member.status === 'active'
                                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {togglingStatus === member._id ? (
                                        <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                    ) : member.status === 'active' ? (
                                        <FiEye size={14} />
                                    ) : (
                                        <FiEyeOff size={14} />
                                    )}
                                </button>

                                <button
                                    onClick={() => handleDelete(member._id)}
                                    disabled={deleting === member._id}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${deleting === member._id
                                        ? 'bg-gray-100 text-gray-500 cursor-wait'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        }`}
                                >
                                    {deleting === member._id ? (
                                        <div className="w-3 h-3 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                                    ) : (
                                        <FiTrash2 size={14} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MembersList;

