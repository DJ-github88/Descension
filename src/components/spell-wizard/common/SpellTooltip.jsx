import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import '../styles/spell-tooltip.css';

const SpellTooltip = memo(({ title, description, icon, position }) => {
  if (!position) return null;

  return createPortal(
    <div 
      className="spell-tooltip"
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x
      }}
    >
      <div className="tooltip-header">
        {icon && <img src={icon} alt="" className="tooltip-icon" />}
        <span className="tooltip-title">{title}</span>
      </div>
      {description && (
        <div className="tooltip-description">{description}</div>
      )}
    </div>,
    document.body
  );
});

SpellTooltip.displayName = 'SpellTooltip';

export default SpellTooltip;
