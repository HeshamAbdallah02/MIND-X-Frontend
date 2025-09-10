// frontend/src/components/shared/AvatarCropper.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FiUpload, FiZoomIn, FiZoomOut, FiRotateCcw, FiRotateCw, 
  FiCheck, FiX, FiGrid, FiMove 
} from 'react-icons/fi';

const ProfessionalAvatarCropper = ({ 
  onCrop, 
  onCancel,
  initialImage = null,
  aspectRatio = 1, // 1:1 for square avatars
  outputSize = 512 // High-quality output
}) => {
  // State management
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropSize] = useState(240);
  const [showGrid, setShowGrid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Constants
  const CANVAS_SIZE = 400;
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.1;

  // Utility functions
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  
  const getImageDimensions = (img) => {
    return { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
  };

  // Draw corner handles for resizing
  const drawCornerHandles = useCallback((ctx, cropX, cropY) => {
    const handleSize = 8;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    
    const positions = [
      [cropX - handleSize/2, cropY - handleSize/2], // Top-left
      [cropX + cropSize - handleSize/2, cropY - handleSize/2], // Top-right
      [cropX - handleSize/2, cropY + cropSize - handleSize/2], // Bottom-left
      [cropX + cropSize - handleSize/2, cropY + cropSize - handleSize/2] // Bottom-right
    ];
    
    positions.forEach(([x, y]) => {
      ctx.fillRect(x, y, handleSize, handleSize);
      ctx.strokeRect(x, y, handleSize, handleSize);
    });
  }, [cropSize]);

  // Draw professional crop overlay
  const drawCropOverlay = useCallback((ctx) => {
    // Calculate crop area (centered)
    const cropX = (CANVAS_SIZE - cropSize) / 2;
    const cropY = (CANVAS_SIZE - cropSize) / 2;
    
    // Draw dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, CANVAS_SIZE, cropY); // Top
    ctx.fillRect(0, cropY, cropX, cropSize); // Left
    ctx.fillRect(cropX + cropSize, cropY, CANVAS_SIZE - cropX - cropSize, cropSize); // Right
    ctx.fillRect(0, cropY + cropSize, CANVAS_SIZE, CANVAS_SIZE - cropY - cropSize); // Bottom
    
    // Draw crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    // Circular crop for avatars
    ctx.beginPath();
    ctx.arc(cropX + cropSize/2, cropY + cropSize/2, cropSize/2, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // Rule of thirds
      for (let i = 1; i < 3; i++) {
        const lineX = cropX + (cropSize * i) / 3;
        const lineY = cropY + (cropSize * i) / 3;
        
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(lineX, cropY);
        ctx.lineTo(lineX, cropY + cropSize);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(cropX, lineY);
        ctx.lineTo(cropX + cropSize, lineY);
        ctx.stroke();
      }
    }
    
    // Draw corner handles
    drawCornerHandles(ctx, cropX, cropY);
  }, [cropSize, showGrid, drawCornerHandles]);

  // Real-time preview generation
  const updatePreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    const mainCanvas = canvasRef.current;
    if (!previewCanvas || !mainCanvas || !image) return;

    const previewCtx = previewCanvas.getContext('2d');
    const previewSize = 80;
    
    // Set preview canvas size
    previewCanvas.width = previewSize;
    previewCanvas.height = previewSize;
    
    // Calculate crop area
    const cropX = (CANVAS_SIZE - cropSize) / 2;
    const cropY = (CANVAS_SIZE - cropSize) / 2;
    
    // Get image data from crop area
    const imageData = mainCanvas.getContext('2d').getImageData(cropX, cropY, cropSize, cropSize);
    
    // Create temporary canvas for cropped image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropSize;
    tempCanvas.height = cropSize;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    
    // Draw to preview (scaled down)
    previewCtx.clearRect(0, 0, previewSize, previewSize);
    
    // Circular clip for avatar preview
    previewCtx.save();
    previewCtx.beginPath();
    previewCtx.arc(previewSize/2, previewSize/2, previewSize/2, 0, 2 * Math.PI);
    previewCtx.clip();
    
    previewCtx.drawImage(tempCanvas, 0, 0, previewSize, previewSize);
    previewCtx.restore();
  }, [image, cropSize]);

  // Advanced canvas rendering
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Save context for transformations
    ctx.save();
    
    // Calculate dimensions with zoom and rotation
    const { width: imgWidth, height: imgHeight } = getImageDimensions(image);
    const scaledWidth = imgWidth * zoom;
    const scaledHeight = imgHeight * zoom;
    
    // Apply rotation around center
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Calculate position
    const x = (CANVAS_SIZE - scaledWidth) / 2 + crop.x;
    const y = (CANVAS_SIZE - scaledHeight) / 2 + crop.y;
    
    // Draw image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    
    // Restore context
    ctx.restore();
    
    // Draw crop overlay
    drawCropOverlay(ctx);
    
    // Update preview
    updatePreview();
  }, [image, crop, zoom, rotation, drawCropOverlay, updatePreview]);

  // Smart centering
  const centerImage = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const { width: imgWidth, height: imgHeight } = getImageDimensions(img);
    const imgAspect = imgWidth / imgHeight;
    
    // Calculate optimal initial zoom
    let initialZoom;
    if (imgAspect > 1) {
      initialZoom = Math.max(CANVAS_SIZE / imgHeight, cropSize / imgHeight);
    } else {
      initialZoom = Math.max(CANVAS_SIZE / imgWidth, cropSize / imgWidth);
    }
    
    initialZoom = clamp(initialZoom, MIN_ZOOM, MAX_ZOOM);
    
    setZoom(initialZoom);
    setCrop({ x: 0, y: 0 });
    setRotation(0);
  }, [cropSize]);

  // Enhanced file validation
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 25 * 1024 * 1024; // 25MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a JPEG, PNG, or WebP image file');
    }
    
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 25MB');
    }
    
    return true;
  };

  // Progressive image loading
  const loadImageProgressively = useCallback((file) => {
    setIsProcessing(true);
    
    try {
      validateFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = getImageDimensions(img);
          
          if (width < 200 || height < 200) {
            alert('Image resolution is too low. Minimum 200x200 pixels required.');
            setIsProcessing(false);
            return;
          }
          
          setImage(img);
          centerImage(img);
          setIsProcessing(false);
        };
        img.onerror = () => {
          alert('Failed to load image. Please try another file.');
          setIsProcessing(false);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert(error.message);
      setIsProcessing(false);
    }
  }, [centerImage]);

  // Handle file selection
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageProgressively(file);
    }
  }, [loadImageProgressively]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (!image) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x: x - crop.x, y: y - crop.y });
    e.preventDefault();
  }, [image, crop]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !image) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newX = x - dragStart.x;
    const newY = y - dragStart.y;
    
    // Constrain movement
    const { width: imgWidth, height: imgHeight } = getImageDimensions(image);
    const scaledWidth = imgWidth * zoom;
    const scaledHeight = imgHeight * zoom;
    
    const minX = -(scaledWidth - CANVAS_SIZE / 2);
    const maxX = CANVAS_SIZE / 2;
    const minY = -(scaledHeight - CANVAS_SIZE / 2);
    const maxY = CANVAS_SIZE / 2;
    
    setCrop({
      x: clamp(newX, minX, maxX),
      y: clamp(newY, minY, maxY)
    });
  }, [isDragging, image, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners
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

  // Render canvas when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Load initial image
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

  // Control handlers
  const handleZoomIn = () => setZoom(prev => clamp(prev + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
  const handleZoomOut = () => setZoom(prev => clamp(prev - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
  const handleRotateLeft = () => setRotation(prev => prev - 90);
  const handleRotateRight = () => setRotation(prev => prev + 90);
  const handleReset = () => image && centerImage(image);

  // Crop and save with high quality
  const handleCrop = useCallback(() => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set high-quality output
    canvas.width = outputSize;
    canvas.height = outputSize;
    
    // Calculate crop area
    const cropX = (CANVAS_SIZE - cropSize) / 2;
    const cropY = (CANVAS_SIZE - cropSize) / 2;
    
    // Apply transformations
    const { width: imgWidth, height: imgHeight } = getImageDimensions(image);
    const scaledWidth = imgWidth * zoom;
    const scaledHeight = imgHeight * zoom;
    
    // Calculate source coordinates
    const imageX = (CANVAS_SIZE - scaledWidth) / 2 + crop.x;
    const imageY = (CANVAS_SIZE - scaledHeight) / 2 + crop.y;
    
    const sourceX = Math.max(0, (cropX - imageX) / zoom);
    const sourceY = Math.max(0, (cropY - imageY) / zoom);
    const sourceWidth = Math.min(imgWidth - sourceX, cropSize / zoom);
    const sourceHeight = Math.min(imgHeight - sourceY, cropSize / zoom);
    
    // Apply rotation if needed
    if (rotation !== 0) {
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-outputSize / 2, -outputSize / 2);
    }
    
    // Draw cropped image with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputSize, outputSize
    );
    
    // Convert to blob with optimization
    canvas.toBlob((blob) => {
      if (blob && onCrop) {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        onCrop(dataUrl, blob);
      }
    }, 'image/jpeg', 0.92);
  }, [image, crop, zoom, rotation, cropSize, outputSize, onCrop]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Professional Avatar Cropper</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* File Upload */}
          {!image && (
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors disabled:opacity-50"
              >
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-700 mb-2">
                  {isProcessing ? 'Processing...' : 'Upload Your Image'}
                </div>
                <p className="text-gray-500">
                  Supports JPEG, PNG, WebP up to 25MB<br />
                  Minimum resolution: 200x200px
                </p>
              </button>
            </div>
          )}

          {/* Canvas and Controls */}
          {image && (
            <div className="space-y-6">
              {/* Main Canvas */}
              <div className="flex justify-center">
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className="cursor-move select-none"
                    onMouseDown={handleMouseDown}
                    style={{ width: '400px', height: '400px' }}
                  />
                  
                  {/* Preview */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="text-xs text-gray-600 mb-2">Preview</div>
                    <canvas
                      ref={previewCanvasRef}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Controls */}
              <div className="grid grid-cols-2 gap-6">
                {/* Zoom Controls */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Zoom & Position</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Zoom Out"
                    >
                      <FiZoomOut className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1">
                      <input
                        type="range"
                        min={MIN_ZOOM}
                        max={MAX_ZOOM}
                        step={ZOOM_STEP}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {Math.round(zoom * 100)}%
                      </div>
                    </div>
                    
                    <button
                      onClick={handleZoomIn}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Zoom In"
                    >
                      <FiZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rotation Controls */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Rotation</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleRotateLeft}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Rotate Left"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {rotation}°
                      </div>
                    </div>
                    
                    <button
                      onClick={handleRotateRight}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Rotate Right"
                    >
                      <FiRotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Tools */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      showGrid 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Toggle Grid"
                  >
                    <FiGrid className="w-4 h-4" />
                    <span className="text-sm">Grid</span>
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Reset Position"
                  >
                    <FiMove className="w-4 h-4" />
                    <span className="text-sm">Reset</span>
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  Drag to reposition • Use controls for precise adjustments
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCrop}
                  className="flex-1 px-6 py-3 bg-[#81C99C] text-white rounded-lg hover:bg-[#6db885] transition-colors flex items-center justify-center font-medium"
                >
                  <FiCheck className="w-5 h-5 mr-2" />
                  Crop Avatar ({outputSize}px)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the component
const AvatarCropper = (props) => <ProfessionalAvatarCropper {...props} />;

export default AvatarCropper;
