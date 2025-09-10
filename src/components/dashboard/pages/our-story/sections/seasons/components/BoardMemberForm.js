// frontend/src/components/dashboard/pages/our-story/sections/seasons/components/BoardMemberForm.js
import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiUser, FiStar, FiUpload, FiEdit } from 'react-icons/fi';
import { useSeasonsMutations } from '../../../../../../../hooks/useSeasonsQueries';
import AvatarCropper from '../../../../../../shared/AvatarCropper';

const BoardMemberForm = ({ seasonId, member, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    profileUrl: '',
    isLeader: false
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [croppedAvatarBlob, setCroppedAvatarBlob] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    createBoardMemberMutation,
    updateBoardMemberMutation,
    uploadBoardMemberImageMutation,
  } = useSeasonsMutations();

  // Populate form data when editing
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        position: member.position || '',
        profileUrl: member.profileUrl || '',
        isLeader: member.isLeader || false
      });
      setAvatarPreview(member.avatar?.url || member.avatar || '');
    } else {
      // Ensure form is reset for new members
      setFormData({
        name: '',
        position: '',
        profileUrl: '',
        isLeader: false
      });
      setAvatarPreview('');
    }
  }, [member]);

  const validateForm = () => {
    const newErrors = {};

    // Helper function to safely check string values
    const isValidString = (value) => {
      return value && typeof value === 'string' && value.trim().length > 0;
    };

    if (!isValidString(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!isValidString(formData.position)) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let savedMember;
      
      if (member) {
        // Updating existing member
        if (croppedAvatarBlob) {
          // Upload new avatar if file is selected
          await uploadBoardMemberImageMutation.mutateAsync({
            seasonId,
            memberId: member._id,
            imageFile: croppedAvatarBlob
          });
          // Avatar is automatically updated in the backend during upload
        }
        
        savedMember = await updateBoardMemberMutation.mutateAsync({
          seasonId,
          memberId: member._id,
          memberData: formData // Use formData without avatar modification
        });
      } else {
        // Creating new member
        // First create the member without avatar
        const memberDataWithoutAvatar = {
          ...formData,
          avatar: null // Will be set after upload
        };
        
        savedMember = await createBoardMemberMutation.mutateAsync({
          seasonId,
          memberData: memberDataWithoutAvatar
        });
        
        // Then upload avatar if file is selected
        if (croppedAvatarBlob && savedMember._id) {
          await uploadBoardMemberImageMutation.mutateAsync({
            seasonId,
            memberId: savedMember._id,
            imageFile: croppedAvatarBlob
          });
          // Avatar is automatically updated in the backend during upload
        }
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving board member:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save board member' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (value || '')
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarCrop = (croppedImageUrl, croppedBlob) => {
    // Store the cropped image data
    setCroppedAvatarBlob(croppedBlob);
    setAvatarPreview(croppedImageUrl);
    setShowCropper(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'Please select a valid image file (PNG, JPG, WebP)' }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
        return;
      }

      // Clear any previous errors
      setErrors(prev => ({ ...prev, file: '' }));

      // Read file and show cropper
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecropAvatar = async () => {
    if (!avatarPreview) return;
    
    try {
      // If it's already a data URL, use it directly
      if (avatarPreview.startsWith('data:')) {
        setUploadedImage(avatarPreview);
        setShowCropper(true);
        return;
      }
      
      // For external URLs (like Cloudinary), convert to data URL to avoid CORS issues
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setUploadedImage(dataUrl);
        setShowCropper(true);
      };
      
      img.onerror = () => {
        // Fallback: try to use the original URL
        setUploadedImage(avatarPreview);
        setShowCropper(true);
      };
      
      img.src = avatarPreview;
    } catch (error) {
      console.error('Error preparing image for recrop:', error);
      // Fallback: use original URL
      setUploadedImage(avatarPreview);
      setShowCropper(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {member ? `Edit Board Member: ${member.name}` : 'Add New Board Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                      <FiUser className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {formData.isLeader && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                      <FiStar className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {/* Upload Area */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer mb-4"
                    onClick={() => document.getElementById('avatar-file-input').click()}
                  >
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <FiUpload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload an image to crop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>

                  {/* Recrop Button for Existing Avatar */}
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRecropAvatar}
                      className="w-full px-3 py-2 text-sm font-medium text-[#81C99C] border border-[#81C99C] rounded-lg hover:bg-[#81C99C] hover:text-white transition-colors flex items-center justify-center mb-4"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      Edit Current Avatar
                    </button>
                  )}

                  {/* File Upload Error */}
                  {errors.file && (
                    <p className="text-sm text-red-600 mb-4">{errors.file}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Ahmed Mohamed"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., President, Vice President, Secretary"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent ${
                  errors.position ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* Profile URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile URL
              </label>
              <input
                type="url"
                name="profileUrl"
                value={formData.profileUrl}
                onChange={handleInputChange}
                placeholder="The volunteer's MIND-X profile"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81C99C] focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: Link to their LinkedIn, personal website, or professional profile
              </p>
            </div>

            {/* Leader Status */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isLeader"
                  checked={formData.isLeader}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <div className="flex items-center space-x-2">
                  <FiStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Leadership Position
                  </span>
                </div>
              </label>
              <p className="ml-7 text-xs text-gray-500">
                Leaders are displayed prominently and have special badges
              </p>
            </div>

            {/* Submit Errors */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#81C99C] hover:bg-[#6db885] text-white px-6 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {member ? 'Update Member' : 'Add Member'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Avatar Cropper Modal - Rendered outside main modal */}
      {showCropper && (
        <AvatarCropper
          onCrop={handleAvatarCrop}
          onCancel={() => setShowCropper(false)}
          initialImage={uploadedImage}
        />
      )}
    </div>
  );
};

export default BoardMemberForm;
