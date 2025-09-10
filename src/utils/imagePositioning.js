// frontend/src/utils/imagePositioning.js

/**
 * Converts image position data from the AdvancedImageEditor format
 * to CSS styles for proper display in season cards and other components
 */
export const getPositionedImageStyle = (imagePosition, containerAspectRatio = 16/9) => {
  try {
    const position = typeof imagePosition === 'string' 
      ? JSON.parse(imagePosition) 
      : imagePosition;

    if (!position) {
      return {
        objectFit: 'cover',
        objectPosition: 'center center'
      };
    }

    // Extract position data with fallbacks
    const { x = 50, y = 50, zoom = 100 } = position;

    // Convert zoom percentage to scale factor
    const scale = zoom / 100;

    // Convert position percentages to object-position values
    // The editor uses 0-100% positioning, CSS object-position uses the same
    const objectPositionX = `${x}%`;
    const objectPositionY = `${y}%`;

    // For zoomed images, we need to handle the scaling
    if (scale !== 1) {
      return {
        objectFit: 'none', // Don't let CSS resize the image
        objectPosition: `${objectPositionX} ${objectPositionY}`,
        transform: `scale(${scale})`,
        transformOrigin: `${objectPositionX} ${objectPositionY}`,
        width: '100%',
        height: '100%'
      };
    } else {
      return {
        objectFit: 'cover',
        objectPosition: `${objectPositionX} ${objectPositionY}`,
        width: '100%',
        height: '100%'
      };
    }
  } catch (error) {
    console.warn('Invalid image position data:', error);
    return {
      objectFit: 'cover',
      objectPosition: 'center center'
    };
  }
};

/**
 * Converts image position data for background-image positioning
 * Useful for div backgrounds instead of img tags
 */
export const getPositionedBackgroundStyle = (imageUrl, imagePosition) => {
  try {
    const position = typeof imagePosition === 'string' 
      ? JSON.parse(imagePosition) 
      : imagePosition;

    if (!position || !imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      };
    }

    const { x = 50, y = 50, zoom = 100 } = position;
    
    // Convert zoom to background-size percentage
    const backgroundSize = `${zoom}%`;
    
    // Convert position to background-position
    const backgroundPosition = `${x}% ${y}%`;

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: backgroundSize,
      backgroundPosition: backgroundPosition,
      backgroundRepeat: 'no-repeat'
    };
  } catch (error) {
    console.warn('Invalid image position data:', error);
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    };
  }
};

/**
 * Creates a preview style that matches the AdvancedImageEditor's canvas rendering
 * This should be used in admin panels for consistent preview
 */
export const getEditorPreviewStyle = (imagePosition, containerWidth = 400, containerHeight = 225) => {
  try {
    const position = typeof imagePosition === 'string' 
      ? JSON.parse(imagePosition) 
      : imagePosition;

    if (!position) {
      return {
        objectFit: 'cover',
        objectPosition: 'center center'
      };
    }

    const { x = 50, y = 50, zoom = 100 } = position;
    
    // This matches the AdvancedImageEditor's canvas positioning logic
    const scale = zoom / 100;
    
    return {
      objectFit: 'none',
      objectPosition: `${x}% ${y}%`,
      transform: `scale(${scale})`,
      transformOrigin: `${x}% ${y}%`,
      width: '100%',
      height: '100%'
    };
  } catch (error) {
    console.warn('Invalid image position data:', error);
    return {
      objectFit: 'cover',
      objectPosition: 'center center'
    };
  }
};
