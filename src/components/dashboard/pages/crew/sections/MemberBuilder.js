// frontend/src/components/dashboard/pages/crew/sections/MemberBuilder.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiCamera, FiUser, FiX, FiLink } from 'react-icons/fi';
import { API_BASE_URL } from '../../../../../config/api';
import AvatarCropper from '../../../../shared/AvatarCropper';

const MemberBuilder = ({ member, onCancel, onSaved }) => {
    const queryClient = useQueryClient();
    const isEditing = !!member;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        position: '',
        section: '',
        mentorSection: '',
        blogs: []
    });

    // Avatar state
    const [avatarBlob, setAvatarBlob] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [originalAvatarUrl, setOriginalAvatarUrl] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch constants
    const { data: constants = { positions: [], sections: [] } } = useQuery({
        queryKey: ['member-constants'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/api/members/constants`);
            return response.data;
        }
    });

    // Fetch available blogs (using admin endpoint with auth)
    const { data: availableBlogs = [] } = useQuery({
        queryKey: ['available-blogs-admin'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/blogs/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });

    // Populate form when editing
    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || '',
                bio: member.bio || '',
                position: member.position || '',
                section: member.section || '',
                mentorSection: member.mentorSection || '',
                blogs: member.blogs?.map(b => b._id || b) || []
            });
            if (member.avatar?.url) {
                setAvatarPreview(member.avatar.url);
                setOriginalAvatarUrl(member.avatar.url);
            }
        }
    }, [member]);

    // Check if position requires section
    const positionsRequiringSection = ['Head of Section', 'Vice Head of Section', 'Member'];
    const requiresSection = positionsRequiringSection.includes(formData.position);
    const requiresMentorSection = formData.position === 'High Board Member';

    // Handle cropped avatar
    const handleAvatarCrop = (dataUrl, blob) => {
        setAvatarPreview(dataUrl);
        setAvatarBlob(blob);
        setShowCropper(false);
        setErrors(prev => ({ ...prev, avatar: null }));
    };

    // Remove avatar
    const handleRemoveAvatar = () => {
        setAvatarBlob(null);
        setAvatarPreview(null);
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.position) {
            newErrors.position = 'Position is required';
        }

        if (requiresSection && !formData.section) {
            newErrors.section = 'Section is required for this position';
        }

        if (requiresMentorSection && !formData.mentorSection) {
            newErrors.mentorSection = 'Mentor section is required for High Board Member';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Prepare data
            const dataToSend = {
                name: formData.name.trim(),
                bio: formData.bio.trim(),
                position: formData.position,
                section: requiresSection ? formData.section : undefined,
                mentorSection: requiresMentorSection ? formData.mentorSection : undefined,
                blogs: formData.blogs
            };

            let savedMember;

            if (isEditing) {
                // Update member
                const response = await axios.put(
                    `${API_BASE_URL}/api/members/admin/${member._id}`,
                    dataToSend,
                    config
                );
                savedMember = response.data;
            } else {
                // Create member
                const response = await axios.post(
                    `${API_BASE_URL}/api/members/admin`,
                    dataToSend,
                    config
                );
                savedMember = response.data;
            }

            // Upload avatar if we have a new cropped blob
            if (avatarBlob && savedMember._id) {
                setUploadingAvatar(true);
                const formDataAvatar = new FormData();
                formDataAvatar.append('avatar', avatarBlob, 'avatar.jpg');

                await axios.post(
                    `${API_BASE_URL}/api/members/admin/${savedMember._id}/avatar`,
                    formDataAvatar,
                    {
                        ...config,
                        headers: {
                            ...config.headers,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            await queryClient.invalidateQueries(['dashboard-members']);
            onSaved();
        } catch (error) {
            console.error('Error saving member:', error);
            const message = error.response?.data?.message || 'Failed to save member';
            setErrors(prev => ({ ...prev, submit: message }));
        } finally {
            setSaving(false);
            setUploadingAvatar(false);
        }
    };

    // Toggle blog selection
    const handleBlogToggle = (blogId) => {
        setFormData(prev => ({
            ...prev,
            blogs: prev.blogs.includes(blogId)
                ? prev.blogs.filter(id => id !== blogId)
                : [...prev.blogs, blogId]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Member' : 'Add New Member'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {isEditing ? 'Update member profile information' : 'Create a new team member profile'}
                    </p>
                </div>
            </div>

            {/* Error Banner */}
            {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>

                    <div className="flex items-center gap-6">
                        {/* Circular Avatar Preview */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FiUser size={48} />
                                    </div>
                                )}
                            </div>

                            {/* Remove button */}
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                                    title="Remove photo"
                                >
                                    <FiX size={14} />
                                </button>
                            )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCropper(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e9a748] transition-colors font-medium"
                                >
                                    <FiCamera size={16} />
                                    <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                {avatarPreview
                                    ? 'Click to upload a new photo or re-crop the current one'
                                    : 'Click to upload and crop a circular profile photo'}
                            </p>
                            {errors.avatar && (
                                <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Basic Info Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB859] ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter member name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB859]"
                                placeholder="Brief bio or description"
                                maxLength={1000}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {formData.bio.length}/1000 characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Position Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Position & Section</h3>

                    <div className="space-y-4">
                        {/* Position */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    position: e.target.value,
                                    section: '',
                                    mentorSection: ''
                                }))}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB859] ${errors.position ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select position</option>
                                {constants.positions.map(position => (
                                    <option key={position} value={position}>{position}</option>
                                ))}
                            </select>
                            {errors.position && (
                                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                            )}
                        </div>

                        {/* Section (for positions that require it) */}
                        {requiresSection && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.section}
                                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB859] ${errors.section ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select section</option>
                                    {constants.sections.map(section => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                                </select>
                                {errors.section && (
                                    <p className="mt-1 text-sm text-red-600">{errors.section}</p>
                                )}
                            </div>
                        )}

                        {/* Mentor Section (for High Board Member) */}
                        {requiresMentorSection && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mentor Section <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.mentorSection}
                                    onChange={(e) => setFormData(prev => ({ ...prev, mentorSection: e.target.value }))}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB859] ${errors.mentorSection ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select section to mentor</option>
                                    {constants.sections.map(section => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                                </select>
                                {errors.mentorSection && (
                                    <p className="mt-1 text-sm text-red-600">{errors.mentorSection}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Blogs Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Blogs Written</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Select blogs written by this member to display on their profile.
                    </p>

                    {availableBlogs.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No blogs available. Create blogs first to link them to members.
                        </p>
                    ) : (
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                            {availableBlogs.map(blog => (
                                <label
                                    key={blog._id}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.blogs.includes(blog._id)}
                                        onChange={() => handleBlogToggle(blog._id)}
                                        className="w-4 h-4 text-[#FBB859] border-gray-300 rounded focus:ring-[#FBB859]"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{blog.title}</p>
                                        {blog.category && (
                                            <p className="text-sm text-gray-500">{blog.category}</p>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile Link (only for editing) */}
                {isEditing && member.slug && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-700">
                            <FiLink size={16} />
                            <span className="font-medium">Public Profile Link:</span>
                        </div>
                        <a
                            href={`/crew/${member.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-blue-600 hover:underline break-all"
                        >
                            {window.location.origin}/crew/{member.slug}
                        </a>
                    </div>
                )}

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-2 bg-[#FBB859] text-white rounded-lg transition-colors ${saving ? 'opacity-70 cursor-wait' : 'hover:bg-[#e9a748]'
                            }`}
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{uploadingAvatar ? 'Uploading...' : 'Saving...'}</span>
                            </>
                        ) : (
                            <>
                                <FiSave size={16} />
                                <span>{isEditing ? 'Update Member' : 'Create Member'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Avatar Cropper Modal */}
            {showCropper && (
                <AvatarCropper
                    onCrop={handleAvatarCrop}
                    onCancel={() => setShowCropper(false)}
                    initialImage={originalAvatarUrl}
                    width={280}
                    height={280}
                    borderRadius={140}
                    outputSize={512}
                />
            )}
        </div>
    );
};

export default MemberBuilder;
