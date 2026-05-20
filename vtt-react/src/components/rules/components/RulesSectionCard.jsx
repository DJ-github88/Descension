import React from 'react';

const SECTION_ICONS = {
  mechanic: 'fas fa-cogs',
  combat: 'fas fa-shield-alt',
  narrative: 'fas fa-book-open',
  danger: 'fas fa-exclamation-triangle',
  nature: 'fas fa-leaf',
  arcane: 'fas fa-hat-wizard',
  undead: 'fas fa-skull',
  trade: 'fas fa-coins',
  social: 'fas fa-users'
};

const RulesSectionCard = ({ title, icon, theme, short, children }) => {
  const themeClass = theme ? `theme-${theme}` : 'theme-mechanic';
  const displayIcon = icon || SECTION_ICONS[theme] || 'fas fa-scroll';
  // Suppress 2-column CSS when the content is short
  const contentClass = short ? 'rules-section-card-content no-columns' : 'rules-section-card-content';

  return (
    <div className={`rules-section-card ${themeClass}`}>
      {title && (
        <div className="rules-section-card-title">
          <i className={displayIcon} />
          {title}
        </div>
      )}
      <div className={contentClass}>
        {children}
      </div>
    </div>
  );
};

export default RulesSectionCard;
