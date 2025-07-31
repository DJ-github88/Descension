import { useState, useCallback } from 'react';

/**
 * Custom hook for managing unified tooltips
 * Provides a simple interface for showing/hiding tooltips with mouse tracking
 */
export const useUnifiedTooltip = () => {
  const [tooltipState, setTooltipState] = useState({
    isVisible: false,
    content: null,
    title: null,
    icon: null,
    position: { x: 0, y: 0 },
    variant: 'default'
  });

  // Show tooltip
  const showTooltip = useCallback((content, options = {}) => {
    const { title, icon, variant = 'default', event } = options;
    
    let position = { x: 0, y: 0 };
    if (event) {
      position = { x: event.clientX, y: event.clientY };
    }

    setTooltipState({
      isVisible: true,
      content,
      title,
      icon,
      position,
      variant
    });
  }, []);

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    setTooltipState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Update tooltip position (for mouse move events)
  const updateTooltipPosition = useCallback((event) => {
    setTooltipState(prev => ({
      ...prev,
      position: { x: event.clientX, y: event.clientY }
    }));
  }, []);

  // Convenience handlers for common use cases
  const handleMouseEnter = useCallback((content, options = {}) => {
    return (event) => {
      showTooltip(content, { ...options, event });
    };
  }, [showTooltip]);

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const handleMouseMove = useCallback((event) => {
    if (tooltipState.isVisible) {
      updateTooltipPosition(event);
    }
  }, [tooltipState.isVisible, updateTooltipPosition]);

  return {
    tooltipState,
    showTooltip,
    hideTooltip,
    updateTooltipPosition,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove
  };
};

/**
 * Convenience function to create tooltip props for elements
 * Usage: <div {...createTooltipProps('Tooltip content', { title: 'Title' })} />
 */
export const createTooltipProps = (content, options = {}) => {
  const { title, icon, variant = 'default' } = options;
  
  return {
    onMouseEnter: (event) => {
      // This will be handled by the component using the hook
      event.currentTarget.dispatchEvent(new CustomEvent('showTooltip', {
        detail: { content, title, icon, variant, event }
      }));
    },
    onMouseLeave: (event) => {
      event.currentTarget.dispatchEvent(new CustomEvent('hideTooltip'));
    },
    onMouseMove: (event) => {
      event.currentTarget.dispatchEvent(new CustomEvent('updateTooltip', {
        detail: { event }
      }));
    }
  };
};

export default useUnifiedTooltip;
