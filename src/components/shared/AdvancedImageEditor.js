// frontend/src/components/shared/AdvancedImageEditor.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FiUpload, FiZoomIn, FiZoomOut, FiRotateCcw, FiMove, 
  FiX, FiImage 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdvancedImageEditor = ({ 
  onImageSave,
  onImageRemove,
  initialImageUrl = null,
  initialPosition = { x: 50, y: 50, zoom: 100 },
  aspectRatio = 16/9,
  className = '',
  maxFileSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, imageX: 0, imageY: 0 });
  const [isUploading, setIsUploading] = useState(false);
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Load image when URL changes
  useEffect(() => {
    if (imageUrl && !image) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, image]);

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error(`File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`);
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageUrl(e.target.result);
        setPosition({ x: 50, y: 50, zoom: 100 }); // Reset position for new image
        setIsUploading(false);
        
        // Call callback with file for upload
        if (onImageSave) {
          onImageSave(file, { x: 50, y: 50, zoom: 100 });
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [maxFileSize, onImageSave]);

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle file input change
  const handleInputChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
  }, [handleFileSelect]);

  // Calculate image dimensions and position
  const getImageStyle = useCallback(() => {
    if (!image || !canvasRef.current) return {};

    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calculate zoom factor (1% to 100% maps to showing full image to 100x zoom)
    const zoomFactor = position.zoom / 100;
    const minZoom = 0.1; // Minimum zoom to see full image
    const maxZoom = 3;   // Maximum zoom
    const actualZoom = minZoom + (maxZoom - minZoom) * zoomFactor;
    
    // Calculate image size to fit canvas while maintaining aspect ratio
    const imageAspect = image.width / image.height;
    const canvasAspect = canvasRect.width / canvasRect.height;
    
    let displayWidth, displayHeight;
    if (imageAspect > canvasAspect) {
      displayWidth = canvasRect.width * actualZoom;
      displayHeight = (canvasRect.width / imageAspect) * actualZoom;
    } else {
      displayHeight = canvasRect.height * actualZoom;
      displayWidth = (canvasRect.height * imageAspect) * actualZoom;
    }
    
    // Calculate position
    const x = (position.x / 100) * canvasRect.width;
    const y = (position.y / 100) * canvasRect.height;
    
    return {
      width: displayWidth,
      height: displayHeight,
      left: x - displayWidth / 2,
      top: y - displayHeight / 2,
      cursor: isDragging ? 'grabbing' : 'grab'
    };
  }, [image, position, isDragging]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e) => {
    if (!image) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      imageX: position.x,
      imageY: position.y
    });
    
    e.preventDefault();
  }, [image, position]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = dragStart.imageX + (deltaX / rect.width) * 100;
    const newY = dragStart.imageY + (deltaY / rect.height) * 100;
    
    const newPosition = {
      ...position,
      x: Math.max(-50, Math.min(150, newX)),
      y: Math.max(-50, Math.min(150, newY))
    };
    
    setPosition(newPosition);
    
    // Call callback with new position
    if (onImageSave && image) {
      onImageSave(null, newPosition);
    }
  }, [isDragging, dragStart, position, onImageSave, image]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove event listeners for dragging
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

  // Handle zoom change
  const handleZoomChange = useCallback((newZoom) => {
    const clampedZoom = Math.max(1, Math.min(100, newZoom));
    const newPosition = { ...position, zoom: clampedZoom };
    setPosition(newPosition);
    
    if (onImageSave && image) {
      onImageSave(null, newPosition);
    }
  }, [position, onImageSave, image]);

  // Handle reset
  const handleReset = useCallback(() => {
    const resetPosition = { x: 50, y: 50, zoom: 50 };
    setPosition(resetPosition);
    
    if (onImageSave && image) {
      onImageSave(null, resetPosition);
    }
  }, [onImageSave, image]);

  // Handle remove image
  const handleRemove = useCallback(() => {
    setImage(null);
    setImageUrl(null);
    setPosition({ x: 50, y: 50, zoom: 50 });
    if (onImageRemove) {
      onImageRemove();
    }
  }, [onImageRemove]);

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Controls Bar */}
      {image && (
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              <FiMove className="w-4 h-4 inline mr-1" />
              Position & Zoom
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <button
              type="button"
              onClick={() => handleZoomChange(position.zoom - 5)}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Zoom Out"
            >
              <FiZoomOut className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 px-2">
              <input
                type="range"
                min="1"
                max="100"
                value={position.zoom}
                onChange={(e) => handleZoomChange(parseInt(e.target.value))}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-600 min-w-[3rem] text-center">
                {position.zoom}%
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => handleZoomChange(position.zoom + 5)}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Zoom In"
            >
              <FiZoomIn className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Reset Position"
            >
              <FiRotateCcw className="w-4 h-4" />
            </button>
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
              title="Remove Image"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="relative bg-gray-100"
        style={{ aspectRatio }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div
          ref={canvasRef}
          className="absolute inset-0 overflow-hidden"
          onMouseDown={handleMouseDown}
        >
          {image ? (
            <>
              {/* Image */}
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Editable"
                className="absolute select-none pointer-events-none"
                style={getImageStyle()}
                draggable={false}
              />
              
              {/* Viewport Frame */}
              <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
                <div className="absolute inset-0 border border-white opacity-50" />
              </div>
              
              {/* Center Guidelines */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-400 opacity-30 pointer-events-none" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-400 opacity-30 pointer-events-none" />
              
              {/* Instructions */}
              {!isDragging && (
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded flex items-center gap-2">
                  <FiMove className="w-3 h-3" />
                  Drag to reposition • Use slider to zoom
                </div>
              )}
            </>
          ) : (
            /* Upload Area */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FiImage className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiUpload className="w-4 h-4" />
                        Upload Image
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        or drag & drop here
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, WEBP up to {Math.round(maxFileSize / (1024 * 1024))}MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Position Info */}
      {image && (
        <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 border-t">
          Position: X: {Math.round(position.x)}%, Y: {Math.round(position.y)}% | 
          Zoom: {position.zoom}% | 
          <span className="text-blue-600 ml-2">Drag image to reposition</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default AdvancedImageEditor;
