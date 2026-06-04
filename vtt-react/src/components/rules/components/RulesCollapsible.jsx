import React, { useState } from 'react';

const THEME_BG_MAP = {
  mechanic: 'rgba(212, 175, 55, 0.04)',
  combat: 'rgba(220, 20, 60, 0.04)',
  narrative: 'rgba(139, 69, 19, 0.04)',
  danger: 'rgba(192, 57, 43, 0.04)',
  nature: 'rgba(34, 139, 34, 0.04)',
  arcane: 'rgba(155, 89, 182, 0.04)',
  undead: 'rgba(125, 60, 152, 0.04)',
  trade: 'rgba(201, 162, 39, 0.04)',
  social: 'rgba(230, 126, 34, 0.04)'
};

const THEME_COLOR_MAP = {
  mechanic: '#d4af37',
  combat: '#dc143c',
  narrative: '#8b4513',
  danger: '#c0392b',
  nature: '#228b22',
  arcane: '#9b59b6',
  undead: '#7d3c98',
  trade: '#c9a227',
  social: '#e67e22'
};

const RulesCollapsible = ({ title, icon, theme, defaultOpen = false, contentLength = 9999, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const themeColor = THEME_COLOR_MAP[theme] || '#8b4513';
  const themeBg = THEME_BG_MAP[theme] || 'rgba(212, 175, 55, 0.04)';
  // Only use 2-column layout when there's enough content to fill both columns
  const bodyClass = contentLength >= 800 ? 'rules-collapsible-body' : 'rules-collapsible-body no-columns';

  const publicUrl = process.env.PUBLIC_URL || '';

  return (
    <div
      className="rules-collapsible"
      style={{ '--section-theme-color': themeColor, '--section-theme-bg': themeBg }}
    >
      <div className="rules-collapsible-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="rules-collapsible-tag">
          {icon && <i className={icon} style={{ marginRight: '6px' }} />}
          {title}
        </div>
        <button className="rpg-wax-seal-btn" aria-label={isOpen ? 'Collapse' : 'Expand'}>
          <img 
            src={`${publicUrl}/assets/images/watercolor_wax_seal.png`} 
            alt="Wax Seal" 
            className="rpg-wax-seal-img"
          />
        </button>
      </div>
      {isOpen && (
        <div className={bodyClass}>
          {children}
        </div>
      )}
    </div>
  );
};

export default RulesCollapsible;
