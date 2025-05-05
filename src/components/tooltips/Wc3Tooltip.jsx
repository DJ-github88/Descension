import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

// Create a global reference to track the tooltip container
let tooltipContainerRef = null;
let tooltipContainerUsers = 0;

const Wc3Tooltip = ({ content, position, isVisible, title, icon }) => {
  const [tooltipRoot, setTooltipRoot] = useState(null);

  // Create a dedicated tooltip container if it doesn't exist
  useEffect(() => {
    // Increment the user count when component mounts
    tooltipContainerUsers++;

    if (!tooltipContainerRef) {
      const tooltipContainer = document.createElement('div');
      tooltipContainer.id = 'wow-tooltip-container';
      tooltipContainer.style.position = 'fixed';
      tooltipContainer.style.top = '0';
      tooltipContainer.style.left = '0';
      tooltipContainer.style.width = '100%';
      tooltipContainer.style.height = '100%';
      tooltipContainer.style.pointerEvents = 'none';
      tooltipContainer.style.zIndex = '999999';
      tooltipContainer.style.overflow = 'visible';
      tooltipContainer.style.display = 'block';
      document.body.appendChild(tooltipContainer);
      tooltipContainerRef = tooltipContainer;
    }

    setTooltipRoot(tooltipContainerRef);

    return () => {
      // Decrement the user count when component unmounts
      tooltipContainerUsers--;

      // Clean up only if we're the last tooltip using it
      if (tooltipContainerUsers === 0 && tooltipContainerRef) {
        try {
          document.body.removeChild(tooltipContainerRef);
          tooltipContainerRef = null;
        } catch (error) {
          console.warn('Tooltip container already removed');
          tooltipContainerRef = null;
        }
      }
    };
  }, []);

  if (!isVisible || !position || !tooltipRoot) return null;

  // Helper function to get WoW icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    if (typeof iconName !== 'string') {
      // If it's an object with a url property, use that
      if (iconName && typeof iconName === 'object' && iconName.url) {
        return iconName.url;
      }
      // Otherwise return a default icon
      return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
    }
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Calculate position to keep tooltip within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipWidth = 300; // Approximate width of tooltip
  const tooltipHeight = 200; // Approximate height of tooltip

  // Default position
  let topPos = position.y + 20;
  let leftPos = position.x + 10;

  // Adjust if tooltip would go off right edge
  if (leftPos + tooltipWidth > viewportWidth) {
    leftPos = position.x - tooltipWidth - 10;
  }

  // Adjust if tooltip would go off bottom edge
  if (topPos + tooltipHeight > viewportHeight) {
    topPos = position.y - tooltipHeight - 10;
  }

  const tooltipContent = (
    <div
      className="wc3-tooltip wow-classic-tooltip"
      style={{
        position: 'absolute',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        zIndex: 999999,
        pointerEvents: 'none',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        overflow: 'visible'
      }}
    >
      {/* Tooltip Top Border with Classic WoW Style */}
      <div className="tooltip-top-border"></div>

      {/* Tooltip Header with Icon if provided */}
      {(title || icon) && (
        <div className="wc3-tooltip-header">
          {icon && (
            <div className="tooltip-icon-wrapper">
              <img src={typeof icon === 'string' && icon.includes('http') ? icon : getIconUrl(icon)} alt="" className="tooltip-icon" />
            </div>
          )}
          {title && <div className="wc3-tooltip-title">{title}</div>}
        </div>
      )}

      {/* Main Content */}
      <div className="wc3-tooltip-content">
        {content}
      </div>

      {/* Tooltip Bottom Border with Classic WoW Style */}
      <div className="tooltip-bottom-border"></div>
    </div>
  );


  // Render to our dedicated tooltip container
  return ReactDOM.createPortal(
    tooltipContent,
    tooltipRoot
  );
};

export default Wc3Tooltip;
