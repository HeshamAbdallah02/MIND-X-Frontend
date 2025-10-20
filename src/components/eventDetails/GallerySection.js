// frontend/src/components/eventDetails/GallerySection.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiX, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';

const GallerySection = ({ galleryAlbums, headline }) => {
  const [activeAlbum, setActiveAlbum] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Items per group - fixed number to keep design constant
  const ITEMS_PER_GROUP = 15;

  // Handle empty gallery
  if (!galleryAlbums || galleryAlbums.length === 0) {
    return (
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FiImage className="text-[#FBB859]" size={32} />
              <h2 className="text-3xl font-bold text-black">Event Gallery</h2>
            </div>
            <p className="text-[#606161] text-lg">Gallery coming soon...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Sort albums by order
  const sortedAlbums = [...galleryAlbums].sort((a, b) => a.order - b.order);
  const currentAlbum = sortedAlbums[activeAlbum];
  const gallery = currentAlbum?.media || [];

  // Calculate total groups for current album
  const totalGroups = Math.ceil(gallery.length / ITEMS_PER_GROUP);

  // Get current group items (no placeholders - only show actual media)
  const startIndex = currentGroup * ITEMS_PER_GROUP;
  const endIndex = startIndex + ITEMS_PER_GROUP;
  const currentItems = gallery.slice(startIndex, endIndex);

  // Album change handler - reset to first group
  const handleAlbumChange = (index) => {
    setActiveAlbum(index);
    setCurrentGroup(0);
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(startIndex + index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  // Masonry grid pattern - varied sizes (max 3 columns for better visibility)
  const gridPattern = [
    'col-span-1 row-span-2',     // 1. Tall rectangle
    'col-span-2 row-span-1',     // 2. Wide horizontal
    'col-span-1 row-span-1',     // 3. Small square
    'col-span-1 row-span-1',     // 4. Small square
    'col-span-2 row-span-2',     // 5. Large square
    'col-span-1 row-span-1',     // 6. Small square
    'col-span-1 row-span-2',     // 7. Tall rectangle
    'col-span-2 row-span-1',     // 8. Wide horizontal
    'col-span-1 row-span-1',     // 9. Small square
    'col-span-2 row-span-1',     // 10. Wide horizontal
    'col-span-1 row-span-2',     // 11. Tall rectangle
    'col-span-1 row-span-1',     // 12. Small square
    'col-span-1 row-span-1',     // 13. Small square
    'col-span-2 row-span-2',     // 14. Large square
    'col-span-1 row-span-1'      // 15. Small square
  ];

  return (
    <>
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            {/* Section Title */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiImage className="text-[#FBB859]" size={32} />
              <h2 className="text-3xl font-bold text-black">Event Gallery</h2>
            </div>
            
            {/* Section Headline */}
            {headline && (
              <p className="text-[#606161] text-lg max-w-3xl mx-auto">
                {headline}
              </p>
            )}
          </motion.div>

          {/* Album Tabs */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max justify-center pb-2">
              {sortedAlbums.map((album, index) => (
                <button
                  key={index}
                  onClick={() => handleAlbumChange(index)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    activeAlbum === index
                      ? 'bg-[#FBB859] text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-[#606161] hover:bg-gray-200'
                  }`}
                >
                  {album.name}
                  <span className="ml-2 text-sm opacity-75">
                    ({album.media?.length || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Album Description */}
          {currentAlbum?.description && (
            <motion.p
              key={activeAlbum}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[#606161] mb-8 max-w-2xl mx-auto"
            >
              {currentAlbum.description}
            </motion.p>
          )}

          {/* Masonry Grid */}
          <div className="grid grid-cols-3 gap-4 auto-rows-[200px] mb-8">
            {currentItems.map((item, index) => (
              <motion.div
                key={startIndex + index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`${gridPattern[index % gridPattern.length]} relative overflow-hidden cursor-pointer`}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.url}
                  alt={item.alt || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                
                {/* Video Play Icon */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-white/90 flex items-center justify-center shadow-lg">
                      <FiPlay className="text-[#FBB859] ml-1" size={32} />
                    </div>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  {item.caption && (
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Group Navigation */}
          {totalGroups > 1 && (
            <div className="flex items-center justify-center gap-4">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentGroup((prev) => Math.max(0, prev - 1))}
                disabled={currentGroup === 0}
                className={`p-2 rounded-full transition-all ${
                  currentGroup === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FBB859] text-white hover:bg-[#FBB859]/90 hover:scale-110'
                }`}
              >
                <FiChevronLeft size={24} />
              </button>

              {/* Group Numbers */}
              <div className="flex items-center gap-2">
                {[...Array(totalGroups)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGroup(index)}
                    className={`w-10 h-10 rounded-full font-medium transition-all ${
                      currentGroup === index
                        ? 'bg-[#FBB859] text-white scale-110'
                        : 'bg-gray-200 text-[#606161] hover:bg-[#81C99C] hover:text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentGroup((prev) => Math.min(totalGroups - 1, prev + 1))}
                disabled={currentGroup === totalGroups - 1}
                className={`p-2 rounded-full transition-all ${
                  currentGroup === totalGroups - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FBB859] text-white hover:bg-[#FBB859]/90 hover:scale-110'
                }`}
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <FiX size={28} />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <FiChevronLeft size={32} />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[lightboxIndex]?.url}
                alt={gallery[lightboxIndex]?.alt}
                className="max-w-full max-h-[90vh] object-contain"
              />
              {gallery[lightboxIndex]?.caption && (
                <p className="text-white text-center mt-4 text-lg">
                  {gallery[lightboxIndex].caption}
                </p>
              )}
              <p className="text-white/60 text-center mt-2 text-sm">
                {lightboxIndex + 1} / {gallery.length}
              </p>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <FiChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GallerySection;
