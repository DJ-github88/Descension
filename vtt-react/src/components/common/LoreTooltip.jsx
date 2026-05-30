import React, { useEffect, useRef, useState } from 'react';
import TooltipPortal from '../tooltips/TooltipPortal';
import '../../styles/LoreTooltip.css';

const entryIcons = {
  noble_house: 'fas fa-flag',
  region: 'fas fa-map-marked-alt',
  historical_figure: 'fas fa-user-shield',
  race: 'fas fa-users',
  class: 'fas fa-hat-wizard',
  resource: 'fas fa-fire-alt',
  event: 'fas fa-hourglass-half',
  creature: 'fas fa-spider',
  cultural_practice: 'fas fa-scroll'
};

const regionColors = {
  'frostwood-reach': '#3d6e90', // Mist/water blue
  'nordhalla': '#5c829e',       // Ice blue
  'sundale': '#b23c1e',         // Volcano volcanic red
  'iceheart-sea': '#1a3a6e',    // Deep ocean blue
  'cragjaw-peaks': '#3a1a5e',   // Alpine/underdark violet
  'sundrift-vale': '#9a6e10',   // Steppe gold
  'bryngloom-forest': '#2b5e1a'  // Swamp green
};

const LoreTooltip = ({ entry, position, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const tooltipRef = useRef(null);

  // Keyboard Escape handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click anywhere (except expand button) to close
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest('.lore-action-btn')) {
        return;
      }
      onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [onClose]);

  if (!entry) return null;

  const iconClass = entryIcons[entry.type] || 'fas fa-book';
  const borderAccent = regionColors[entry.region] || '#b89c72';
  const displayType = entry.type.replace('_', ' ');

  return (
    <TooltipPortal>
      {/* Semi-transparent dark blur backdrop overlay */}
      <div 
        className="lore-tooltip-overlay" 
        onClick={onClose}
      />
      <div
        ref={tooltipRef}
        className="lore-tooltip-wrapper center-modal"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2147483647
        }}
      >
        <div 
          className="lore-parchment"
          style={{ borderColor: borderAccent }}
        >
          {/* Header */}
          <div className="lore-tooltip-header">
            <div className="lore-type-icon">
              <i className={iconClass} style={{ color: borderAccent }} />
            </div>
            <div className="lore-title-section">
              <div className="lore-title">{entry.term}</div>
              <div className="lore-subtitle" style={{ color: borderAccent }}>{displayType}</div>
            </div>
          </div>

          {/* Body */}
          <div className="lore-tooltip-body">
            <div className="lore-summary">
              {entry.summary}
            </div>

            {entry.fullEntry && (
              <>
                <div className="lore-divider" />
                <div className={`lore-full-entry ${isExpanded ? 'expanded' : ''}`}>
                  {entry.fullEntry}
                </div>
                <button 
                  className={`lore-action-btn ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ color: borderAccent }}
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                  <i className="fas fa-chevron-down" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipPortal>
  );
};

export default LoreTooltip;
