// frontend/src/components/shared/AvatarCropper.js
import React, { useState, useRef, useCallback } from 'react';
import AvatarEditorLibrary from 'react-avatar-editor';
import { FiUpload, FiCheck, FiX, FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi';

const AvatarCropper = ({ 
  onCrop, 
  onCancel,
  initialImage = null,
  width = 300,
  height = 300,
  borderRadius = 150, // Half of width for circular crop
  outputSize = 512 
}) => {
  const [image, setImage] = useState(initialImage);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  
  const isEditing = Boolean(initialImage);
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // File validation
  const validateFile = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, WebP)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrors({ file: error });
        return;
      }

      setErrors({});
      setImage(file);
    }
  }, [validateFile]);

  // Handle crop and save
  const handleCrop = useCallback(() => {
    if (!editorRef.current || !image) return;

    setIsProcessing(true);
    setErrors({}); // Clear any previous errors

    try {
      // Get the canvas with the cropped image
      const canvas = editorRef.current.getImageScaledToCanvas();
      
      // Create high-resolution canvas for output
      const outputCanvas = document.createElement('canvas');
      const outputCtx = outputCanvas.getContext('2d');
      
      outputCanvas.width = outputSize;
      outputCanvas.height = outputSize;
      
      // Draw the cropped image at high resolution
      outputCtx.drawImage(canvas, 0, 0, outputSize, outputSize);
      
      // Convert to blob and data URL
      outputCanvas.toBlob((blob) => {
        if (blob && onCrop) {
          const dataUrl = outputCanvas.toDataURL('image/jpeg', 0.9);
          onCrop(dataUrl, blob);
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error cropping image:', error);
      
      // Handle CORS-related errors specifically
      if (error.name === 'SecurityError' || error.message.includes('tainted')) {
        setErrors({ crop: 'Unable to edit this image due to security restrictions. Please upload a new image.' });
      } else {
        setErrors({ crop: 'Failed to crop image. Please try again.' });
      }
      setIsProcessing(false);
    }
  }, [image, outputSize, onCrop]);

  // Handle zoom change
  const handleScaleChange = useCallback((e) => {
    setScale(parseFloat(e.target.value));
  }, []);

  // Handle rotation
  const handleRotate = useCallback(() => {
    setRotation(prev => prev + 90);
  }, []);

  // Handle zoom buttons
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Avatar' : 'Crop Avatar'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">{!image && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              >
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-lg font-medium text-gray-700 mb-1">
                  {isEditing ? 'Upload Different Image' : 'Upload Your Image'}
                </div>
                <p className="text-gray-500 text-sm">
                  Supports JPEG, PNG, WebP up to 5MB
                </p>
              </button>
              
              {errors.file && (
                <p className="mt-2 text-sm text-red-600">{errors.file}</p>
              )}
            </div>
          )}

          {/* Avatar Editor */}
          {image && (
            <>
              {/* Editor Canvas */}
              <div className="flex justify-center">
                <div className="relative">
                  <AvatarEditorLibrary
                    ref={editorRef}
                    image={image}
                    width={width}
                    height={height}
                    border={20}
                    borderRadius={borderRadius}
                    color={[0, 0, 0, 0.6]} // Overlay color
                    scale={scale}
                    rotate={rotation}
                    backgroundColor="#ffffff"
                    crossOrigin="anonymous"
                    disableBoundaryChecks={false}
                    className="border-2 border-gray-200 rounded-lg"
                  />
                  
                  {/* Change Image Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                    title="Change Image"
                  >
                    <FiUpload className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Zoom Controls */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zoom
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Zoom Out"
                    >
                      <FiZoomOut className="w-4 h-4" />
                    </button>
                    
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={handleScaleChange}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    
                    <button
                      onClick={handleZoomIn}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Zoom In"
                    >
                      <FiZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    {Math.round(scale * 100)}%
                  </div>
                </div>

                {/* Rotation Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rotation
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleRotate}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <FiRotateCw className="w-4 h-4" />
                      <span className="text-sm">Rotate 90°</span>
                    </button>
                    <span className="text-sm text-gray-600">{rotation}°</span>
                  </div>
                </div>
              </div>

              {/* Preview Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 text-center">
                  Drag to reposition • Use zoom to adjust size • Final size: {outputSize}×{outputSize}px
                </p>
              </div>

              {/* Error Display */}
              {errors.crop && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{errors.crop}</p>
                </div>
              )}
            </>
          )}
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="border-t bg-white p-6 flex-shrink-0">
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            
            {image && (
              <button
                onClick={handleCrop}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-[#81C99C] text-white rounded-lg hover:bg-[#6db885] disabled:opacity-50 transition-colors flex items-center justify-center font-semibold shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5 mr-2" />
                    Save Avatar
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropper;
