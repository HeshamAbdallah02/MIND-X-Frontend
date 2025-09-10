// frontend/src/components/shared/ImagePositionEditor.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiZoomIn, FiZoomOut, FiRotateCcw, FiMove } from 'react-icons/fi';

const ImagePositionEditor = ({ 
  imageUrl, 
  onPositionChange, 
  initialPosition = { x: 50, y: 50, scale: 1 },
  aspectRatio = 16/9, // Default to 16:9 for season cards
  className = ''
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Update parent component when position changes
  useEffect(() => {
    onPositionChange(position);
  }, [position, onPositionChange]);

  const handleMouseDown = useCallback((e) => {
    if (!imageRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - dragStart.x) / container.width) * 100;
    const newY = ((e.clientY - dragStart.y) / container.height) * 100;

    setPosition(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  const handleZoom = (delta) => {
    setPosition(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta))
    }));
  };

  const handleReset = () => {
    setPosition({ x: 50, y: 50, scale: 1 });
  };

  const imageStyle = {
    transform: `translate(-50%, -50%) scale(${position.scale})`,
    left: `${position.x}%`,
    top: `${position.y}%`,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-white border-b">
        <span className="text-sm font-medium text-gray-700">
          Position & Scale Image
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 min-w-[3rem] text-center">
            {Math.round(position.scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(0.1)}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Reset Position"
          >
            <FiRotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Editor */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden bg-gray-200"
        style={{ aspectRatio }}
      >
        {imageUrl && (
          <>
            {/* Background image (dimmed) */}
            <img
              src={imageUrl}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            
            {/* Draggable image */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Positionable"
              className="absolute max-w-none select-none"
              style={imageStyle}
              onMouseDown={handleMouseDown}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Viewport overlay */}
            <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
              <div className="absolute inset-0 border border-white opacity-50" />
            </div>

            {/* Center guides */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500 opacity-50 pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-500 opacity-50 pointer-events-none" />

            {/* Drag instruction */}
            {!isDragging && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <FiMove className="w-3 h-3" />
                Drag to reposition
              </div>
            )}
          </>
        )}
      </div>

      {/* Position Info */}
      <div className="p-2 bg-gray-50 text-xs text-gray-600 border-t">
        Position: X: {Math.round(position.x)}%, Y: {Math.round(position.y)}% | 
        Scale: {Math.round(position.scale * 100)}%
      </div>
    </div>
  );
};

export default ImagePositionEditor;
