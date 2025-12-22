import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UnifiedSpellCard from './UnifiedSpellCard';

const SpellTooltip = ({
  spell,
  rollableTableData,
  position,
  onMouseEnter,
  onMouseLeave,
  smartPositioning = false, // New prop to enable smart positioning for action bar
  fullscreenMode = false // New prop to enable fullscreen modal mode with cloudy background
}) => {
  if (!spell) return null;
  
  // Position is only required when not in fullscreen mode
  if (!fullscreenMode && !position) return null;

  // Fullscreen modal mode - shows cloudy background with centered spell card
  if (fullscreenMode) {
    const tooltipContent = (
      <div
        className="spellbook-popup-overlay"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, rgba(100, 100, 150, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999, // Lower than action bar to keep it visible
          cursor: 'default',
          margin: 0,
          padding: 0,
          pointerEvents: 'none' // Allow clicks to pass through to action bar
        }}
      >
        <div
          className="spellbook-popup-content"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            padding: '20px',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            cursor: 'default',
            pointerEvents: 'auto' // Re-enable pointer events for the spell card
          }}
        >
          <UnifiedSpellCard
            spell={spell}
            variant="wizard"
            rollableTableData={rollableTableData}
            showActions={false}
            showDescription={true}
            showStats={true}
            showTags={true}
          />
        </div>
      </div>
    );

    // Render directly to body for fullscreen mode
    return ReactDOM.createPortal(tooltipContent, document.body);
  }

  // Tooltip dimensions
  const tooltipWidth = 580;
  const tooltipHeight = 500;
  const maxTooltipHeight = Math.min(500, window.innerHeight - 40); // Max 500px or available height
  const padding = 20;

  let x = position.x;
  let y = position.y;

  // Apply smart positioning only when requested (for action bar)
  if (smartPositioning) {
    // For mouse-following tooltips: position above cursor, centered horizontally
    const scaledTooltipWidth = tooltipWidth * 0.75;

    // Clamp anchor X within viewport padding, accounting for horizontal centering
    const minCenterX = padding + (scaledTooltipWidth / 2);
    const maxCenterX = window.innerWidth - padding - (scaledTooltipWidth / 2);
    x = Math.min(Math.max(position.x, minCenterX), maxCenterX);

    // Position tooltip so its bottom edge is just above the cursor (5px gap)
    // We'll use bottom positioning instead of top to achieve this
    y = position.y;
  }

  // Create tooltip content
  const tooltipContent = (
    <div
      className="spell-tooltip-overlay spell-tooltip-always-on-top"
      style={{
        position: 'fixed',
        left: x,
        ...(smartPositioning ? { bottom: window.innerHeight - y + 5, top: 'auto' } : { top: y }),
        zIndex: 2147483647, // Maximum z-index value to ensure tooltips always appear above everything
        pointerEvents: 'auto',
        // Center horizontally when smartPositioning is enabled
        transform: smartPositioning ? 'translateX(-50%)' : undefined,
        // Set size for scaled spell card - scrolling handled by inner container
        width: smartPositioning ? (tooltipWidth * 0.75) : 'auto',
        height: 'auto',
        maxHeight: 'none', // No constraint here - handled by inner container
        maxWidth: 'none', // Remove width constraint
        overflow: 'visible', // Let inner container handle scrolling
        animation: 'none' // Avoid global keyframe conflicts that animate transform
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="spell-tooltip-container" style={{
        transform: 'scale(0.75)', // Scale the entire tooltip container to match spell card
        transformOrigin: 'top left',
        width: 'fit-content',
        height: 'auto',
        maxHeight: maxTooltipHeight / 0.75, // Adjust max height for scaling
        overflow: 'auto' // Enable scrolling on the scaled container
      }}>
        {/* Tooltip content */}
        <div className="spell-tooltip-content">
          <UnifiedSpellCard
            spell={spell}
            variant="wizard"
            rollableTableData={rollableTableData}
            showActions={false}
            showDescription={true}
            showStats={true}
            showTags={true}
          />
        </div>
      </div>
    </div>
  );

  // Create or get dedicated tooltip container at the highest level
  let tooltipContainer = document.getElementById('spell-tooltip-portal');
  if (!tooltipContainer) {
    tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'spell-tooltip-portal';
    tooltipContainer.style.position = 'fixed';
    tooltipContainer.style.top = '0';
    tooltipContainer.style.left = '0';
    tooltipContainer.style.width = '100%';
    tooltipContainer.style.height = '100%';
    tooltipContainer.style.pointerEvents = 'none';
    tooltipContainer.style.zIndex = '2147483647';
    tooltipContainer.style.isolation = 'isolate';
    document.body.appendChild(tooltipContainer);
  }

  // Render tooltip using portal to dedicated container
  return ReactDOM.createPortal(tooltipContent, tooltipContainer);
};

SpellTooltip.propTypes = {
  spell: PropTypes.object.isRequired,
  rollableTableData: PropTypes.object,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  smartPositioning: PropTypes.bool,
  fullscreenMode: PropTypes.bool
};

export default SpellTooltip;
