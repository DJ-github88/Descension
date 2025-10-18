import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaDiceD20, FaClone, FaCoins, FaBullseye } from 'react-icons/fa';
import './RollableTableSummary.css';

/**
 * Compact Rollable Table Summary Component
 * Displays rollable table information on spell cards in a space-efficient way
 */
const RollableTableSummary = ({
  rollableTableData,
  variant = 'compact', // 'compact', 'detailed', 'inline'
  showExpandButton = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!rollableTableData || !rollableTableData.enabled) {
    return null;
  }

  const {
    name = 'Random Effects',
    description = '',
    resolutionType = 'DICE',
    resolutionConfig = {},
    entries = []
  } = rollableTableData;

  // Debug logging
  console.log('RollableTableSummary - rollableTableData:', rollableTableData);
  console.log('RollableTableSummary - entries:', entries);
  if (entries.length > 0) {
    console.log('RollableTableSummary - first entry:', entries[0]);
  }

  // Format resolution method display
  const formatResolutionMethod = () => {
    switch (resolutionType) {
      case 'DICE':
        return resolutionConfig.diceType || 'd100';
      case 'CARDS':
        const cardCount = resolutionConfig.cardCount || 3;
        const deckType = resolutionConfig.deckType || 'standard';
        const deckLabel = deckType === 'tarot' ? 'Tarot' : 'Standard';
        return `${cardCount} ${deckLabel} cards`;
      case 'COINS':
        const coinCount = resolutionConfig.coinCount || 5;
        const coinType = resolutionConfig.coinType || 'standard';
        const coinLabel = coinType === 'weighted' ? 'Weighted' : 'Standard';
        return `${coinCount} ${coinLabel} coins`;
      default:
        return 'Random';
    }
  };

  // Get resolution icon
  const getResolutionIcon = () => {
    switch (resolutionType) {
      case 'DICE':
        return <FaDiceD20 />;
      case 'CARDS':
        return <FaClone />;
      case 'COINS':
        return <FaCoins />;
      default:
        return <FaBullseye />;
    }
  };

  // Format entry count
  const entryCount = entries.length;
  const entryText = entryCount === 1 ? 'entry' : 'entries';

  // Compact variant - single line with essential info
  if (variant === 'compact') {
    return (
      <div className={`rollable-table-summary compact ${className}`}>
        <div className="rollable-table-summary-content">
          <span className="rollable-table-icon">{getResolutionIcon()}</span>
          <span className="rollable-table-name">{name}</span>
          <span className="rollable-table-method">({formatResolutionMethod()})</span>
          <span className="rollable-table-count">{entryCount} {entryText}</span>
          {showExpandButton && entryCount > 0 && (
            <button
              className="rollable-table-expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }
              }}
              title={isExpanded ? 'Hide table entries' : 'Show table entries'}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} rollable table entries`}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
        </div>
        
        {isExpanded && entryCount > 0 && (
          <div className="rollable-table-entries-preview">
            <div className="rollable-table-entries-list">
              {entries.slice(0, 8).map((entry, index) => {
                // Format the range properly based on resolution type
                const formatRange = (entry, resolutionType) => {
                  switch (resolutionType) {
                    case 'DICE':
                      if (!entry || !entry.range) return `${index + 1}`;
                      if (typeof entry.range === 'object' && entry.range !== null && entry.range.min !== undefined && entry.range.max !== undefined) {
                        return entry.range.min === entry.range.max ? `${entry.range.min}` : `${entry.range.min}-${entry.range.max}`;
                      }
                      return String(entry.range);
                    case 'CARDS':
                      // For CARDS, use cardPattern first, then range (which stores card pattern), then fallback
                      return entry.cardPattern || entry.range || `Card ${index + 1}`;
                    case 'COINS':
                      // For COINS, use coinPattern first, then range (which stores coin pattern), then fallback
                      return entry.coinPattern || entry.range || `Coin ${index + 1}`;
                    default:
                      return `${index + 1}`;
                  }
                };

                // Helper function to extract text from effect/description
                const getEffectText = (entry) => {
                  const effect = entry.effect || entry.description;
                  if (typeof effect === 'string') {
                    return effect;
                  } else if (typeof effect === 'object' && effect !== null) {
                    return effect.description || effect.spellEffect || effect.visualEffect || 'Effect';
                  }
                  return 'Effect';
                };

                return (
                  <div key={index} className="rollable-table-entry-preview">
                    <span className="entry-range">{formatRange(entry, resolutionType)}</span>
                    <span className="entry-effect">{getEffectText(entry)}</span>
                    {entry.spellReference && (
                      <span className="entry-spell-ref">→ {entry.spellReference}</span>
                    )}
                  </div>
                );
              })}
              {entryCount > 8 && (
                <div className="rollable-table-entry-preview more-entries">
                  <span className="entry-range">...</span>
                  <span className="entry-effect">+{entryCount - 8} more entries</span>
                  {entryCount > 15 && (
                    <button
                      className="view-full-table-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // This could trigger a modal or navigate to a detailed view
                        console.log('View full table:', name);
                      }}
                      title="View complete rollable table"
                    >
                      View Full Table
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Inline variant - very minimal for tight spaces
  if (variant === 'inline') {
    return (
      <span className={`rollable-table-summary inline ${className}`}>
        <span className="rollable-table-icon">{getResolutionIcon()}</span>
        <span className="rollable-table-inline-text">
          {name} ({formatResolutionMethod()})
        </span>
      </span>
    );
  }

  // Detailed variant - more information displayed
  return (
    <div className={`rollable-table-summary detailed ${className}`}>
      <div className="rollable-table-summary-header">
        <div className="rollable-table-title">
          <span className="rollable-table-icon">{getResolutionIcon()}</span>
          <span className="rollable-table-name">{name}</span>
        </div>
        <div className="rollable-table-meta">
          <span className="rollable-table-method">{formatResolutionMethod()}</span>
          <span className="rollable-table-count">{entryCount} {entryText}</span>
        </div>
      </div>
      
      {description && (
        <div className="rollable-table-description">
          {description}
        </div>
      )}

      {showExpandButton && entryCount > 0 && (
        <button
          className="rollable-table-expand-btn detailed"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Hide Entries' : 'Show Entries'}
        </button>
      )}

      {isExpanded && entryCount > 0 && (
        <div className="rollable-table-entries-preview detailed">
          <div className="rollable-table-entries-list">
            {entries.map((entry, index) => {
              // Format the range properly based on resolution type
              const formatRange = (entry, resolutionType) => {
                switch (resolutionType) {
                  case 'DICE':
                    if (!entry || !entry.range) return `${index + 1}`;
                    if (typeof entry.range === 'object' && entry.range !== null && entry.range.min !== undefined && entry.range.max !== undefined) {
                      return entry.range.min === entry.range.max ? `${entry.range.min}` : `${entry.range.min}-${entry.range.max}`;
                    }
                    return String(entry.range);
                  case 'CARDS':
                    // For CARDS, use cardPattern first, then range (which stores card pattern), then fallback
                    return entry.cardPattern || entry.range || `Card ${index + 1}`;
                  case 'COINS':
                    // For COINS, use coinPattern first, then range (which stores coin pattern), then fallback
                    return entry.coinPattern || entry.range || `Coin ${index + 1}`;
                  default:
                    return `${index + 1}`;
                }
              };

              // Helper function to extract text from effect/description
              const getEffectText = (entry) => {
                const effect = entry.effect || entry.description;
                if (typeof effect === 'string') {
                  return effect;
                } else if (typeof effect === 'object' && effect !== null) {
                  return effect.description || effect.spellEffect || effect.visualEffect || 'Effect';
                }
                return 'Effect';
              };

              return (
                <div key={index} className="rollable-table-entry-preview">
                  <span className="entry-range">{formatRange(entry, resolutionType)}</span>
                  <span className="entry-effect">{getEffectText(entry)}</span>
                  {entry.spellReference && (
                    <span className="entry-spell-ref">→ {entry.spellReference}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

RollableTableSummary.propTypes = {
  rollableTableData: PropTypes.object,
  variant: PropTypes.oneOf(['compact', 'detailed', 'inline']),
  showExpandButton: PropTypes.bool,
  className: PropTypes.string
};

export default RollableTableSummary;
