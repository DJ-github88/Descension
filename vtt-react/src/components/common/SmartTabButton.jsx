import React, { useState, useEffect, useRef } from 'react';

/**
 * Intelligently generates a shortened version of a title
 * @param {string} title - The full title
 * @returns {string} - Shortened version
 */
const getShortTitle = (title) => {
  // Handle titles with "&" or "and" - take the shorter part
  if (title.includes(' & ')) {
    const parts = title.split(' & ');
    // Return the shorter part, or the second part if equal length
    return parts[0].length <= parts[1].length ? parts[0] : parts[1];
  }
  if (title.includes(' and ')) {
    const parts = title.split(' and ');
    return parts[0].length <= parts[1].length ? parts[0] : parts[1];
  }
  
  // Handle quest-related titles
  // "Active Quests" -> "Active", "Completed Quests" -> "Completed", etc.
  if (title.endsWith(' Quests')) {
    return title.replace(' Quests', '');
  }
  if (title.endsWith(' Quest')) {
    return title.replace(' Quest', '');
  }
  
  // Handle "Loot Table" -> "Loot"
  if (title === 'Loot Table') {
    return 'Loot';
  }
  
  // For other titles, try to shorten intelligently
  // Remove common suffixes or prefixes
  if (title.endsWith(' Table')) {
    return title.replace(' Table', '');
  }
  
  // Default: return as is (will be handled by overflow detection)
  return title;
};

/**
 * SmartTabButton - A tab button that automatically shortens text when it doesn't fit
 * and displays a tooltip with the full title on hover.
 * 
 * @param {string} title - The full title text to display
 * @param {boolean} active - Whether this tab is currently active
 * @param {function} onClick - Click handler function
 * @param {string} shortTitle - Optional custom short title (if not provided, will be auto-generated)
 */
const SmartTabButton = ({ title, active, onClick, shortTitle }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [displayText, setDisplayText] = useState(title);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  
  // Generate short title if not provided
  const generatedShortTitle = shortTitle || getShortTitle(title);

  // Check if text is overflowing and update display text
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const containerElement = containerRef.current;
        const computedStyle = window.getComputedStyle(containerElement);
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
        const availableWidth = containerElement.clientWidth - paddingLeft - paddingRight;
        
        // Measure the full title width
        const tempSpan = document.createElement('span');
        tempSpan.style.position = 'absolute';
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.fontSize = computedStyle.fontSize;
        tempSpan.style.fontFamily = computedStyle.fontFamily;
        tempSpan.style.fontWeight = computedStyle.fontWeight;
        tempSpan.style.textTransform = computedStyle.textTransform;
        tempSpan.style.letterSpacing = computedStyle.letterSpacing;
        tempSpan.textContent = title;
        document.body.appendChild(tempSpan);
        
        const fullTitleWidth = tempSpan.offsetWidth;
        
        // Check if full title fits
        if (fullTitleWidth <= availableWidth) {
          setDisplayText(title);
          setIsOverflowing(false);
          document.body.removeChild(tempSpan);
          return;
        }
        
        // Full title doesn't fit, check if short title fits
        if (generatedShortTitle !== title) {
          tempSpan.textContent = generatedShortTitle;
          const shortTitleWidth = tempSpan.offsetWidth;
          
          if (shortTitleWidth <= availableWidth) {
            setDisplayText(generatedShortTitle);
            setIsOverflowing(true);
          } else {
            // Even short title doesn't fit, use it anyway
            setDisplayText(generatedShortTitle);
            setIsOverflowing(true);
          }
        } else {
          // No short version available, use full title
          setDisplayText(title);
          setIsOverflowing(true);
        }
        
        document.body.removeChild(tempSpan);
      }
    };

    // Small delay to ensure DOM is ready
    let timeoutId = setTimeout(() => {
      checkOverflow();
    }, 100);
    
    let resizeTimeoutId = null;
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize checks
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      resizeTimeoutId = setTimeout(checkOverflow, 50);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Also listen to window resize
    const handleResize = () => {
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      resizeTimeoutId = setTimeout(checkOverflow, 50);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [title, generatedShortTitle]);

  return (
    <button
      ref={containerRef}
      className={`spellbook-tab-button ${active ? 'active' : ''} ${isOverflowing ? 'overflowing' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      title={isOverflowing ? title : undefined}
    >
      <span ref={textRef} className="tab-text">{displayText}</span>
      {showTooltip && isOverflowing && (
        <div className="tab-tooltip">{title}</div>
      )}
    </button>
  );
};

export default SmartTabButton;

