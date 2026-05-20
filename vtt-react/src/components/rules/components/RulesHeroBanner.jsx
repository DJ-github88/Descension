import React from 'react';

const THEME_COLORS = {
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

const RulesHeroBanner = ({ title, subtitle, badge, badgeIcon, theme, quickTiles }) => {
  const themeColor = THEME_COLORS[theme] || THEME_COLORS.narrative;

  return (
    <div className="rules-hero-banner" style={{ '--hero-theme-color': themeColor }}>
      <div className="rules-hero-badge">
        {badgeIcon && <i className={badgeIcon} />}
        {badge || theme || 'RULES'}
      </div>
      <h2 className="rules-hero-title">{title}</h2>
      {subtitle && <p className="rules-hero-subtitle">{subtitle}</p>}
    </div>
  );
};

export default RulesHeroBanner;
