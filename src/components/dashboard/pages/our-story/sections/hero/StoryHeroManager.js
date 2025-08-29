//frontend/src/components/dashboard/pages/our-story/sections/hero/StoryHeroManager.js
import React, { useState } from 'react';
import { useAdminStoryHero, useUpdateStoryHero, useAddStoryHeroImage, useRemoveStoryHeroImage } from '../../../../../../hooks/queries/useStoryHeroData';
import { useChangeTracker } from '../../../../context/ChangeTrackerContext';

const StoryHeroManager = () => {
  const { data: storyHero, isLoading, error } = useAdminStoryHero();
  const updateStoryHero = useUpdateStoryHero();
  const addImage = useAddStoryHeroImage();
  const removeImage = useRemoveStoryHeroImage();
  const { setHasChanges } = useChangeTracker();

  const [formData, setFormData] = useState({
    headline: '',
    hookLine: '',
    autoScrollSpeed: 5000,
    showIndicators: false,
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  // Update form data when storyHero data loads
  React.useEffect(() => {
    if (storyHero) {
      setFormData({
        headline: storyHero.headline || '',
        hookLine: storyHero.hookLine || '',
        autoScrollSpeed: storyHero.autoScrollSpeed || 5000,
        showIndicators: storyHero.showIndicators || false,
      });
    }
  }, [storyHero]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateStoryHero.mutateAsync(formData);
      // trackChange will be reset by the success handler
    } catch (error) {
      console.error('Failed to update story hero:', error);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;
    
    try {
      await addImage.mutateAsync({
        url: newImageUrl.trim(),
        alt: 'Story hero background'
      });
      setNewImageUrl('');
    } catch (error) {
      console.error('Failed to add image:', error);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await removeImage.mutateAsync(imageId);
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBB859]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load story hero data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#606161]">
          Our Story Hero Section
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h2>

        {/* Content Form */}
        <div className="space-y-6">
          {/* Headline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="Our Story"
            />
          </div>

          {/* Hook Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hook Line
            </label>
            <textarea
              value={formData.hookLine}
              onChange={(e) => handleInputChange('hookLine', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
              placeholder="From Day One to Today: Our Journey"
            />
          </div>

          {/* Auto Scroll Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto Scroll Speed (milliseconds)
            </label>
            <input
              type="number"
              min="1000"
              max="30000"
              step="1000"
              value={formData.autoScrollSpeed}
              onChange={(e) => handleInputChange('autoScrollSpeed', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Time between image transitions (1000 = 1 second)
            </p>
          </div>

          {/* Show Indicators */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showIndicators"
              checked={formData.showIndicators}
              onChange={(e) => handleInputChange('showIndicators', e.target.checked)}
              className="h-4 w-4 text-[#FBB859] focus:ring-[#FBB859] border-gray-300 rounded"
            />
            <label htmlFor="showIndicators" className="ml-2 block text-sm text-gray-700">
              Show image indicators
            </label>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={updateStoryHero.isPending}
              className="px-6 py-2 bg-[#FBB859] text-white rounded-lg hover:bg-[#e5a650] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateStoryHero.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Background Images Management */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-[#606161]">
          Background Images
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h3>

        {/* Add New Image */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Add New Background Image</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FBB859] focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex-shrink-0 self-end">
              <button
                onClick={handleAddImage}
                disabled={!newImageUrl.trim() || addImage.isPending}
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addImage.isPending ? 'Adding...' : 'Add Image'}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Background images will auto-scroll behind the constant text content above.
          </p>
        </div>

        {/* Current Images */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-700">Current Background Images</h4>
          {storyHero?.images?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {storyHero.images
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((image, index) => (
                  <div key={image._id} className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video w-full">
                      <img
                        src={image.url}
                        alt={`Background ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkMxOS40IDI2IDE5IDI1LjYgMTkgMjVWMTVDMTkgMTQuNCAxOS40IDE0IDIwIDE0QzIwLjYgMTQgMjEgMTQuNCAyMSAxNVYyNUMyMSAyNS42IDIwLjYgMjYgMjAgMjZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCAzMEMxOS40IDMwIDE5IDI5LjYgMTkgMjlDMTkgMjguNCAxOS40IDI4IDIwIDI4QzIwLjYgMjggMjEgMjguNCAyMSAyOUMyMSAyOS42IDIwLjYgMzAgMjAgMzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 mb-1">Background {index + 1}</p>
                          <p className="text-xs text-gray-500 truncate" title={image.url}>
                            {image.url}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveImage(image._id)}
                          disabled={removeImage.isPending}
                          className="ml-3 px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No background images added yet</p>
              <p className="text-sm mt-1">Add your first background image above to create an auto-scrolling hero section</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryHeroManager;
