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

  // Helper function to format effect text with better structure and highlighting (shared for both variants)
  const formatEffectText = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    let formatted = text;
    
    // Extract and highlight damage formulas (e.g., "4d6 force damage")
    formatted = formatted.replace(/(\d+d\d+)\s+(\w+)\s+damage/gi, '<span class="damage-highlight">$1 $2 damage</span>');
    
    // Extract and highlight save DCs (e.g., "Dexterity save DC 15")
    formatted = formatted.replace(/(\w+)\s+save\s+DC\s+(\d+)/gi, '<span class="save-highlight">$1 save DC $2</span>');
    
    // Extract and highlight healing amounts (e.g., "healed for 3d8")
    formatted = formatted.replace(/(healed?|healing)\s+for\s+(\d+d\d+)/gi, '<span class="healing-highlight">$1 for $2</span>');
    
    // Highlight armor references
    formatted = formatted.replace(/(\+?\d+)\s+armor/gi, '<span class="armor-highlight">$1 armor</span>');
    
    
    // Highlight status effects and conditions
    formatted = formatted.replace(/(ignited|frozen|paralyzed|cursed|resistance)/gi, '<span class="status-highlight">$1</span>');
    
    // Highlight durations and rounds
    formatted = formatted.replace(/(\d+)\s+(rounds?|minutes?|hours?)/gi, '<span class="duration-highlight">$1 $2</span>');
    
    // Highlight area sizes
    formatted = formatted.replace(/(\d+ft)\s+(radius|area)/gi, '<span class="area-highlight">$1 $2</span>');
    
    // Split on periods for better line breaks, but keep related clauses together
    const sentences = formatted.split(/\.\s+/).filter(s => s.trim());
    
    return sentences;
  };

  // Helper function to extract text from effect/description (shared for both variants)
  const getEffectText = (entry) => {
    // Priority: Show detailed effect description, then name as fallback
    // If we have a detailed effect description, show that (it contains all the mechanics)
    if (entry.effect && typeof entry.effect === 'string' && entry.effect.length > 20) {
      // Detailed effect description - format it better
      const name = entry.name || entry.customName || '';
      return { name, effect: entry.effect, needsFormatting: true };
    }
    
    // If we have description field with details, use that
    if (entry.description && typeof entry.description === 'string' && entry.description.length > 20) {
      const name = entry.name || entry.customName || '';
      return { name, effect: entry.description, needsFormatting: true };
    }

    // New format: entry.name, entry.description, entry.effectType, entry.effectConfig
    if (entry.name || entry.effectType) {
      let text = entry.name || entry.customName || '';

      // Add effect details based on effectType
      if (entry.effectType && entry.effectConfig) {
        const config = entry.effectConfig;
        switch (entry.effectType) {
          case 'damage':
            text += ` (${config.damageFormula || '2d6'} ${config.damageType || 'fire'})`;
            break;
          case 'healing':
            text += ` (${config.healingFormula || '2d8'} healing)`;
            break;
          case 'summoning':
            // Enhanced summoning display with creature details
            if (config.creatures && config.creatures.length > 0) {
              const creatureNames = config.creatures.map(c => c.name).join(', ');
              const quantity = config.quantity || 1;
              const duration = config.duration || 3;
              const controlType = config.controlType || 'full';
              const controlMap = {
                'full': 'Full Control',
                'limited': 'Limited',
                'autonomous': 'Auto',
                'friendly': 'Friendly'
              };
              text += ` (${quantity}x ${creatureNames} - ${duration}r, ${controlMap[controlType]})`;
            } else {
              text += ` (${config.quantity || 1}x ${config.creatureType || 'creature'})`;
            }
            break;
          case 'buff':
            text += ` (${config.buffType || 'buff'} for ${config.buffDuration || config.duration || 3} rounds)`;
            break;
        }
      }

      // Add description if available and not already included
      if (entry.description && entry.description !== text) {
        text += entry.description ? `: ${entry.description}` : '';
      }

      // Add effect if available and not already included
      if (entry.effect && entry.effect !== text && !text.includes(entry.effect)) {
        text += entry.effect ? `: ${entry.effect}` : '';
      }

      return { effect: text, needsFormatting: false };
    }

    // Legacy format: entry.effect or entry.description
    const effect = entry.effect || entry.description;
    if (typeof effect === 'string') {
      return { effect, needsFormatting: false };
    } else if (typeof effect === 'object' && effect !== null) {
      return { effect: effect.description || effect.spellEffect || effect.visualEffect || 'Effect', needsFormatting: false };
    }
    return { effect: 'Effect', needsFormatting: false };
  };

  // Format resolution method display
  const formatResolutionMethod = () => {
    console.log('formatResolutionMethod - resolutionType:', resolutionType);
    console.log('formatResolutionMethod - resolutionConfig:', resolutionConfig);

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
        console.log('formatResolutionMethod - COINS result:', `${coinCount} ${coinLabel} coins`);
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
                      // Check for roll field first (single roll value)
                      if (entry?.roll !== undefined) return String(entry.roll);
                      // Then check for range object
                      if (entry?.range) {
                        if (typeof entry.range === 'object' && entry.range !== null && entry.range.min !== undefined && entry.range.max !== undefined) {
                          return entry.range.min === entry.range.max ? `${entry.range.min}` : `${entry.range.min}-${entry.range.max}`;
                        }
                        return String(entry.range);
                      }
                      // Fallback to index + 1
                      return `${index + 1}`;
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


                const effectData = getEffectText(entry);
                
                return (
                  <div key={index} className="rollable-table-entry-preview">
                    <span className="entry-range">{formatRange(entry, resolutionType)}</span>
                    <div className="entry-effect-container">
                      {effectData.name && (
                        <span className="entry-effect-name">{effectData.name}</span>
                      )}
                      {effectData.needsFormatting ? (
                        <div className="entry-effect-text">
                          {formatEffectText(effectData.effect).map((sentence, idx) => (
                            <div key={idx} className="entry-effect-sentence" dangerouslySetInnerHTML={{ __html: sentence + (idx < formatEffectText(effectData.effect).length - 1 ? '.' : '') }} />
                          ))}
                        </div>
                      ) : (
                        <span className="entry-effect">{effectData.effect}</span>
                      )}
                      {entry.spellReference && (
                        <span className="entry-spell-ref">→ {entry.spellReference}</span>
                      )}
                    </div>
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
                    // Check for roll field first (single roll value)
                    if (entry?.roll !== undefined) return String(entry.roll);
                    // Then check for range object
                    if (entry?.range) {
                      if (typeof entry.range === 'object' && entry.range !== null && entry.range.min !== undefined && entry.range.max !== undefined) {
                        return entry.range.min === entry.range.max ? `${entry.range.min}` : `${entry.range.min}-${entry.range.max}`;
                      }
                      return String(entry.range);
                    }
                    // Fallback to index + 1
                    return `${index + 1}`;
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

              const effectData = getEffectText(entry);

              return (
                <div key={index} className="rollable-table-entry-preview">
                  <span className="entry-range">{formatRange(entry, resolutionType)}</span>
                  <div className="entry-effect-container">
                    {effectData.name && (
                      <span className="entry-effect-name">{effectData.name}</span>
                    )}
                    {effectData.needsFormatting ? (
                      <div className="entry-effect-text">
                        {formatEffectText(effectData.effect).map((sentence, idx) => (
                          <div key={idx} className="entry-effect-sentence" dangerouslySetInnerHTML={{ __html: sentence + (idx < formatEffectText(effectData.effect).length - 1 ? '.' : '') }} />
                        ))}
                      </div>
                    ) : (
                      <span className="entry-effect">{effectData.effect}</span>
                    )}
                    {entry.spellReference && (
                      <span className="entry-spell-ref">→ {entry.spellReference}</span>
                    )}
                  </div>
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
