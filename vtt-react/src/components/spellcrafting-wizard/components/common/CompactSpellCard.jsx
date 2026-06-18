import React, { useRef } from 'react';
import { getCustomIconUrl } from '../../../../utils/assetManager';

const SpellTooltip = React.lazy(() => import('./SpellTooltip'));

const CompactSpellCard = ({
  spell,
  isSelected,
  isDraggable,
  className,
  rollableTableData,
  onSelect,
  onClick,
  onContextMenu,
  props,
  getRarityClass,
  getSpellIcon,
  handleClick,
  handleKeyDown,
  handleDragStart,
  handleMouseEnter,
  handleMouseMove,
  handleMouseLeave,
  showTooltip,
  tooltipPosition,
  itemRef,
  hideTimeoutRef,
}) => {
  return (
    <>
      <div
        ref={itemRef}
        className={`compact-spell-item ${getRarityClass()} ${isSelected ? 'selected' : ''} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={onContextMenu}
        onDragStart={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        draggable={isDraggable}
        tabIndex={onClick || onSelect ? "0" : undefined}
        role={onClick || onSelect ? "button" : undefined}
        aria-selected={isSelected}
        data-spell-id={spell?.id}
        title="Drag to action bar to add spell"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          cursor: isDraggable ? 'grab' : 'pointer'
        }}
        {...props}
      >
      {/* Spell Icon */}
      <div className="compact-spell-icon">
        <img
          src={getSpellIcon()}
          alt={spell?.name || 'Spell'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
          }}
        />
      </div>

      {/* Spell Name Only */}
      <div className="compact-spell-name">
        {spell?.name || 'Unnamed Spell'}
      </div>
    </div>

    {/* Tooltip */}
    {showTooltip && (
      <React.Suspense fallback={null}>
      <SpellTooltip
        spell={spell}
        rollableTableData={rollableTableData}
        position={tooltipPosition}
        onMouseEnter={() => {
          // Keep tooltip visible when hovering over it
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
          }
        }}
        onMouseLeave={handleMouseLeave}
      />
      </React.Suspense>
    )}
  </>
  );
};

export default CompactSpellCard;
