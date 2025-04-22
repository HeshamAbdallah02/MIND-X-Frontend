// frontend/src/services/animationService.js
export const createMarqueeAnimation = (element, pixelsPerSecond) => {
    if (!element || !element.children.length || pixelsPerSecond <= 0) return null;
  
    try {
      const items = Array.from(element.children);
      const firstItem = items[0];
      const style = getComputedStyle(firstItem);
      
      // Calculate item dimensions with margins
      const itemWidth = firstItem.offsetWidth + 
                       parseFloat(style.marginRight) + 
                       parseFloat(style.marginLeft);
      const containerWidth = element.offsetWidth;
      
      // Calculate total content width (original + clones)
      const totalItems = items.length;
      const totalWidth = totalItems * itemWidth;
      
      // Calculate duration for perfect loop timing
      const durationMs = (totalWidth / Math.max(pixelsPerSecond, 50)) * 1000;

      return element.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translateX(-${totalWidth}px)` }
        ],
        {
          duration: durationMs,
          iterations: Infinity,
          easing: 'linear'
        }
      );
    } catch (error) {
      console.error('Animation error:', error);
      return null;
    }
};

// Keep other utility functions
export const calculateDynamicSpeed = (baseSpeed, itemsCount) => {
    const MIN_ITEMS = 3;
    const MAX_ITEMS = 25;
    const clampedCount = Math.min(Math.max(itemsCount, MIN_ITEMS), MAX_ITEMS);
    return baseSpeed * Math.sqrt(clampedCount / MIN_ITEMS);
};
  
export const normalizeSpeed = (speed) => {
    return Math.min(Math.max(speed, 50), 3000);
};