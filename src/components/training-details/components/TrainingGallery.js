// frontend/src/components/training-details/components/TrainingGallery.js
import React from 'react';

const TrainingGallery = ({ galleryImages }) => {
    if (!galleryImages || galleryImages.length === 0) return null;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {galleryImages.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                        <img
                            src={image.url}
                            alt={image.caption || `Gallery ${index + 1}`}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {image.caption && (
                            <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrainingGallery;
