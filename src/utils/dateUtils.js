// frontend/src/utils/dateUtils.js

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
};

/**
 * Format date range
 * @param {string|Date} startDate 
 * @param {string|Date} endDate 
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '';
  if (!endDate) return formatDate(startDate);
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Same day
  if (start.toDateString() === end.toDateString()) {
    return formatDate(start);
  }
  
  // Same month and year
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${end.getDate()}, ${end.getFullYear()}`;
  }
  
  // Different months or years
  return `${formatDate(start, { month: 'short' })} - ${formatDate(end, { month: 'short' })}`;
};

/**
 * Get relative time (e.g., "in 5 days", "2 hours ago")
 * @param {string|Date} date 
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const target = new Date(date);
  const diffMs = target - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 365) {
    const years = Math.floor(diffDays / 365);
    return `in ${years} year${years > 1 ? 's' : ''}`;
  }
  
  if (diffDays > 30) {
    const months = Math.floor(diffDays / 30);
    return `in ${months} month${months > 1 ? 's' : ''}`;
  }
  
  if (diffDays > 0) {
    return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    return 'today';
  }
  
  // Past dates
  const absDays = Math.abs(diffDays);
  return `${absDays} day${absDays > 1 ? 's' : ''} ago`;
};

/**
 * Check if date is past
 * @param {string|Date} date 
 * @returns {boolean}
 */
export const isPast = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Check if date is upcoming (today or future)
 * @param {string|Date} date 
 * @returns {boolean}
 */
export const isUpcoming = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
};

/**
 * Calculate days until date
 * @param {string|Date} date 
 * @returns {number} Days until date (negative if past)
 */
export const daysUntil = (date) => {
  if (!date) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffMs = target - today;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
