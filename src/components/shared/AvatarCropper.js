// frontend/src/components/shared/AvatarCropper.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiUpload, FiZoomIn, FiZoomOut, FiRotateCcw, FiCheck, FiX } from 'react-icons/fi';

const AvatarCropper = ({ 
  onImageCrop, 
  onCancel,
  initialImage = null,
  aspectRatio = 1, // 1:1 for square avatars
  outputSize = 200 // Final output size in pixels
}) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Center image when loaded
  const centerImage = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const canvasSize = 300; // Fixed canvas size
    const imgAspect = img.width / img.height;
    
    // Calculate initial zoom to fit image
    let initialZoom;
    if (imgAspect > 1) {
      // Landscape: fit to height
      initialZoom = canvasSize / img.height;
    } else {
      // Portrait: fit to width
      initialZoom = canvasSize / img.width;
    }
    
    setZoom(Math.max(initialZoom, 0.5));
    setCrop({ x: 0, y: 0 });
  }, []);

  // Load initial image if provided
  useEffect(() => {
    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        centerImage(img);
      };
      img.src = initialImage;
    }
  }, [initialImage, centerImage]);

  // Handle file selection
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        centerImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [centerImage]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    const canvasSize = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Calculate image dimensions with zoom
    const scaledWidth = image.width * zoom;
    const scaledHeight = image.height * zoom;
    
    // Calculate position
    const x = (canvasSize - scaledWidth) / 2 + crop.x;
    const y = (canvasSize - scaledHeight) / 2 + crop.y;
    
    // Draw image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    
    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    
    // Calculate crop area (centered square)
    const cropSize = Math.min(canvasSize * 0.8, 240);
    const cropX = (canvasSize - cropSize) / 2;
    const cropY = (canvasSize - cropSize) / 2;
    
    // Draw overlay (everything except crop area)
    ctx.fillRect(0, 0, canvasSize, cropY); // Top
    ctx.fillRect(0, cropY, cropX, cropSize); // Left
    ctx.fillRect(cropX + cropSize, cropY, canvasSize - cropX - cropSize, cropSize); // Right
    ctx.fillRect(0, cropY + cropSize, canvasSize, canvasSize - cropY - cropSize); // Bottom
    
    // Draw crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropSize, cropSize);
    
    // Draw corner indicators
    const cornerSize = 10;
    ctx.fillStyle = '#ffffff';
    // Top-left
    ctx.fillRect(cropX - 1, cropY - 1, cornerSize, 3);
    ctx.fillRect(cropX - 1, cropY - 1, 3, cornerSize);
    // Top-right
    ctx.fillRect(cropX + cropSize - cornerSize + 1, cropY - 1, cornerSize, 3);
    ctx.fillRect(cropX + cropSize - 2, cropY - 1, 3, cornerSize);
    // Bottom-left
    ctx.fillRect(cropX - 1, cropY + cropSize - 2, cornerSize, 3);
    ctx.fillRect(cropX - 1, cropY + cropSize - cornerSize + 1, 3, cornerSize);
    // Bottom-right
    ctx.fillRect(cropX + cropSize - cornerSize + 1, cropY + cropSize - 2, cornerSize, 3);
    ctx.fillRect(cropX + cropSize - 2, cropY + cropSize - cornerSize + 1, 3, cornerSize);
    
  }, [image, crop, zoom]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (!image) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - crop.x,
      y: e.clientY - crop.y
    });
    e.preventDefault();
  }, [image, crop]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !image) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Constrain movement to keep image visible
    const canvasSize = 300;
    const scaledWidth = image.width * zoom;
    const scaledHeight = image.height * zoom;
    
    const minX = -(scaledWidth - canvasSize / 2);
    const maxX = canvasSize / 2;
    const minY = -(scaledHeight - canvasSize / 2);
    const maxY = canvasSize / 2;
    
    setCrop({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    });
  }, [isDragging, image, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleReset = useCallback(() => {
    if (image) {
      centerImage(image);
    }
  }, [image, centerImage]);

  // Crop and save
  const handleCrop = useCallback(() => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set output canvas size
    canvas.width = outputSize;
    canvas.height = outputSize;
    
    const canvasSize = 300;
    const cropSize = Math.min(canvasSize * 0.8, 240);
    const cropX = (canvasSize - cropSize) / 2;
    const cropY = (canvasSize - cropSize) / 2;
    
    // Calculate source coordinates on the original canvas
    const scaledWidth = image.width * zoom;
    const scaledHeight = image.height * zoom;
    const imageX = (canvasSize - scaledWidth) / 2 + crop.x;
    const imageY = (canvasSize - scaledHeight) / 2 + crop.y;
    
    // Calculate which part of the image to crop
    const sourceX = (cropX - imageX) / zoom;
    const sourceY = (cropY - imageY) / zoom;
    const sourceWidth = cropSize / zoom;
    const sourceHeight = cropSize / zoom;
    
    // Draw cropped image
    ctx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputSize, outputSize
    );
    
    // Convert to blob and call callback
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a new file with the cropped image
        const croppedFile = new File([blob], imageFile?.name || 'avatar.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        onImageCrop(croppedFile, canvas.toDataURL('image/jpeg', 0.9));
      }
    }, 'image/jpeg', 0.9);
  }, [image, crop, zoom, outputSize, imageFile, onImageCrop]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Crop Avatar</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* File Upload */}
        {!image && (
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            >
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload image</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </button>
          </div>
        )}

        {/* Canvas */}
        {image && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="cursor-move select-none"
                  onMouseDown={handleMouseDown}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <FiZoomOut className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Zoom:</span>
                <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              
              <button
                onClick={handleZoomIn}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom In"
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleReset}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Reset"
              >
                <FiRotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Instructions */}
            <p className="text-sm text-gray-600 text-center mb-6">
              Drag to reposition • Use zoom controls to scale
            </p>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="flex-1 px-4 py-2 bg-[#81C99C] text-white rounded-lg hover:bg-[#6db885] transition-colors flex items-center justify-center"
              >
                <FiCheck className="w-4 h-4 mr-2" />
                Crop Avatar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarCropper;
