import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UnifiedSpellCard from '../../../../components/spellcrafting-wizard/components/common/UnifiedSpellCard';
import '../../../../components/spellcrafting-wizard/styles/pathfinder/main.css';

/**
 * SimplifiedSpellCard component
 * Now uses UnifiedSpellCard with compact variant for consistency
 * Shows basic information with hover tooltip using the same unified component
 */
const SimplifiedSpellCard = ({ spell }) => {
  // State to track if the tooltip is visible
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  // Handle mouse events for tooltip
  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10, // Position to the right of the card
      y: rect.top
    });
    setShowTooltip(true);
  };

  const handleMouseMove = (e) => {
    if (showTooltip) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 10,
        y: rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Create a portal container for tooltips if it doesn't exist
  useEffect(() => {
    if (!document.getElementById('tooltip-root')) {
      const tooltipRoot = document.createElement('div');
      tooltipRoot.id = 'tooltip-root';
      document.body.appendChild(tooltipRoot);
    }
  }, []);

  // Render tooltip through portal using UnifiedSpellCard
  const renderTooltip = () => {
    if (!showTooltip) return null;

    const tooltipRoot = document.getElementById('tooltip-root');
    if (!tooltipRoot) return null;

    return ReactDOM.createPortal(
      <div
        className="spell-tooltip"
        style={{
          top: tooltipPosition.y,
          left: tooltipPosition.x,
          position: 'fixed',
          zIndex: 2147483647, // Maximum z-index value to ensure tooltips always appear above windows
          maxWidth: '420px',
          maxHeight: '500px',
          overflow: 'auto'
        }}
        onWheel={(e) => {
          // Stop propagation to prevent background scrolling when scrolling tooltip
          e.stopPropagation();
        }}
        onMouseEnter={() => {
          // Keep tooltip visible when hovering over it
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          // Hide tooltip when leaving it
          setShowTooltip(false);
        }}
      >
        <UnifiedSpellCard
          spell={spell}
          variant="wizard"
          showActions={false}
          showDescription={true}
          showStats={true}
          showTags={true}
        />
      </div>,
      tooltipRoot
    );
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ height: '100%' }}
      >
        <UnifiedSpellCard
          spell={spell}
          variant="compact"
          showActions={false}
          showDescription={false}
          showStats={false}
          showTags={false}
          className="simplified-spell-card-unified"
        />
      </div>

      {/* Render tooltip through portal */}
      {renderTooltip()}
    </>
  );
};

SimplifiedSpellCard.propTypes = {
  spell: PropTypes.object.isRequired
};

export default SimplifiedSpellCard;
