import React from 'react';
// Pathfinder styles imported via main.css

/**
 * IconSelectionCard - A reusable component for icon-based selections with hover effects
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - The icon to display
 * @param {string} props.title - The title text
 * @param {string} props.description - Optional description text
 * @param {boolean} props.selected - Whether this option is selected
 * @param {boolean} props.primary - Whether this is marked as primary (for elements)
 * @param {boolean} props.secondary - Whether this is marked as secondary (for elements)
 * @param {Function} props.onClick - Click handler
 */
const IconSelectionCard = ({
  icon,
  title,
  description,
  selected = false,
  primary = false,
  secondary = false,
  disabled = false,
  onClick
}) => {
  let statusLabel = null;

  if (primary) {
    statusLabel = 'PRIMARY';
  } else if (secondary) {
    statusLabel = 'SECONDARY';
  }

  return (
    <button
      type="button"
      className={`icon-selection-card ${selected ? 'selected' : ''} ${primary ? 'primary' : ''} ${secondary ? 'secondary' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={(e) => {
        console.log('IconSelectionCard clicked');
        if (onClick && !disabled) onClick(e);
      }}
      style={{
        width: '100%',
        textAlign: 'center',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
      disabled={disabled}
    >
      <div className="icon-container">
        {icon}
      </div>

      <div className="content">
        <h4>{title}</h4>
        {description && <p>{description}</p>}
      </div>

      {statusLabel && (
        <div className="status-badge">
          {statusLabel}
        </div>
      )}
    </button>
  );
};

export default IconSelectionCard;
