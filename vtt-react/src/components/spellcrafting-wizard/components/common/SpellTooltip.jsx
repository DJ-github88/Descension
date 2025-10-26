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
  smartPositioning = false // New prop to enable smart positioning for action bar
}) => {
  if (!spell || !position) return null;

  // Tooltip dimensions
  const tooltipWidth = 580;
  const tooltipHeight = 500;
  const maxTooltipHeight = Math.min(500, window.innerHeight - 40); // Max 500px or available height
  const padding = 20;

  let x = position.x;
  let y = position.y;

  // Apply smart positioning only when requested (for action bar)
  if (smartPositioning) {
    // Anchor the tooltip to the action slot: horizontally centered, immediately above
    // We'll place the portal at the slot's center-top and use CSS transform to move
    // the tooltip above the slot regardless of its actual height.

    const scaledTooltipWidth = tooltipWidth * 0.75;

    // Clamp anchor X within viewport padding, accounting for horizontal centering
    const minCenterX = padding + (scaledTooltipWidth / 2);
    const maxCenterX = window.innerWidth - padding - (scaledTooltipWidth / 2);
    x = Math.min(Math.max(position.x, minCenterX), maxCenterX);

    // Use the slot's top edge as the anchor Y
    y = position.y; // exact top of the slot; transform will place tooltip above
  }

  console.log('SpellTooltip position:', {
    x,
    y,
    originalPosition: position,
    smartPositioning,
    maxTooltipHeight
  }); // Debug log

  // Create tooltip content
  const tooltipContent = (
    <div
      className="spell-tooltip-overlay spell-tooltip-always-on-top"
      style={{
        position: 'fixed',
        left: x,
        ...(smartPositioning ? { bottom: window.innerHeight - y + 8, top: 'auto' } : { top: y }),
        zIndex: 2147483647, // Maximum z-index value to ensure tooltips always appear above everything
        pointerEvents: 'auto',
        // Anchor above the slot when smartPositioning is enabled (no height-dependent translate)
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
  }).isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  smartPositioning: PropTypes.bool
};

export default SpellTooltip;
