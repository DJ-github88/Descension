import { useState, useCallback, useEffect, useRef } from 'react';

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

  // Hover tooltips eat too much space on phones/tablets, and mobile browsers
  // fire synthetic mouseenter on tap so they pop open on every touch. Suppress
  // them entirely on mobile-width viewports — desktop (wide) keeps hover.
  // Keyed off viewport width (not (hover: hover)) so it's reliable across the
  // many mobile browsers that misreport hover capability.
  const supportsHoverRef = useRef(null);
  if (supportsHoverRef.current === null) {
    supportsHoverRef.current = typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 769px)').matches;
  }
  const supportsHover = supportsHoverRef.current;

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

  // Update tooltip content while keeping it visible
  const updateTooltipContent = useCallback((content, options = {}) => {
    const { title, icon, variant = 'default' } = options;

    setTooltipState(prev => ({
      ...prev,
      content,
      title,
      icon,
      variant
    }));
  }, []);

  // Convenience handlers for common use cases
  const handleMouseEnter = useCallback((content, options = {}) => {
    return (event) => {
      // On mobile-width viewports, suppress hover tooltips entirely — there
      // isn't room and they fire on every tap. Desktop keeps hover-to-show.
      if (!supportsHover) return;
      showTooltip(content, { ...options, event });
    };
  }, [showTooltip, supportsHover]);

  const handleMouseLeave = useCallback(() => {
    // Only relevant on desktop; on mobile we never show on hover anyway.
    if (!supportsHover) return;
    hideTooltip();
  }, [hideTooltip, supportsHover]);

  const handleMouseMove = useCallback((event) => {
    if (tooltipState.isVisible) {
      updateTooltipPosition(event);
    }
  }, [tooltipState.isVisible, updateTooltipPosition]);

  // Automatically dismiss on touch/click outside on mobile/tablet
  useEffect(() => {
    if (!tooltipState.isVisible) return;

    const handleGlobalDismiss = () => {
      hideTooltip();
    };

    // Small delay before registering so the initial trigger event doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener('click', handleGlobalDismiss);
      document.addEventListener('touchstart', handleGlobalDismiss);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGlobalDismiss);
      document.removeEventListener('touchstart', handleGlobalDismiss);
    };
  }, [tooltipState.isVisible, hideTooltip]);

  return {
    tooltipState,
    showTooltip,
    hideTooltip,
    updateTooltipPosition,
    updateTooltipContent,
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
