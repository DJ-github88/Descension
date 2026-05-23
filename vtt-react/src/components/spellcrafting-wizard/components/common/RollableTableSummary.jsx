import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaDiceD20, FaClone, FaCoins, FaBullseye } from 'react-icons/fa';
// Pathfinder styles imported via main.css

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingIndex, setRollingIndex] = useState(null);
  const [rolledIndex, setRolledIndex] = useState(null);

  useEffect(() => {
    // Reset state when rollableTableData changes
    setCurrentPage(1);
    setIsRolling(false);
    setRollingIndex(null);
    setRolledIndex(null);
  }, [rollableTableData]);

  if (!rollableTableData || !rollableTableData.enabled) {
    return null;
  }

  const {
    name = 'Random Effects',
    tableName = '', // Support spelling variation
    description = '',
    resolutionType = 'DICE',
    resolutionConfig = {},
    diceFormula = '',
    entries = []
  } = rollableTableData;

  const displayTableName = name || tableName || 'Random Effects';
  const entryCount = entries.length;
  const entryText = entryCount === 1 ? 'entry' : 'entries';
  
  // Pagination parameters
  const entriesPerPage = 4;
  const totalPages = Math.ceil(entryCount / entriesPerPage);

  // Helper function to format effect text with better structure and highlighting
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

  // Helper function to extract text from effect/description
  const getEffectText = (entry) => {
    if (entry.effect && typeof entry.effect === 'string' && entry.effect.length > 20) {
      const name = entry.name || entry.customName || '';
      return { name, effect: entry.effect, needsFormatting: true };
    }
    
    if (entry.description && typeof entry.description === 'string' && entry.description.length > 20) {
      const name = entry.name || entry.customName || '';
      return { name, effect: entry.description, needsFormatting: true };
    }

    if (entry.name || entry.effectType) {
      let text = entry.name || entry.customName || '';

      if (entry.effectType && entry.effectConfig) {
        const config = entry.effectConfig;
        switch (entry.effectType) {
          case 'damage':
            text += ` (${config.damageFormula || '2d6'} ${config.damageType || 'force'})`;
            break;
          case 'healing':
            text += ` (${config.healingFormula || '2d8'} healing)`;
            break;
          case 'summoning':
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

      if (entry.description && entry.description !== text) {
        text += entry.description ? `: ${entry.description}` : '';
      }

      if (entry.effect && entry.effect !== text && !text.includes(entry.effect)) {
        text += entry.effect ? `: ${entry.effect}` : '';
      }

      return { effect: text, needsFormatting: false };
    }

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
    switch (resolutionType) {
      case 'DICE':
        return diceFormula || rollableTableData.diceFormula || resolutionConfig.diceType || (entryCount ? `d${entryCount}` : 'd100');
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

  // Interactive Roll Function
  const handleRoll = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (isRolling || entryCount === 0) return;
    
    setIsExpanded(true);
    setIsRolling(true);
    setRolledIndex(null);
    
    // Determine roll die value or count
    const formula = diceFormula || rollableTableData.diceFormula || resolutionConfig.diceType || '1d' + entryCount;
    const match = formula.match(/d(\d+)/i);
    const dieSize = match ? parseInt(match[1], 10) : entryCount;
    
    // Roll a value between 1 and dieSize
    const rollValue = Math.floor(Math.random() * dieSize) + 1;
    
    // Match rollValue to entries range
    let winningIndex = -1;
    for (let i = 0; i < entryCount; i++) {
      const entry = entries[i];
      if (entry.roll !== undefined && Number(entry.roll) === rollValue) {
        winningIndex = i;
        break;
      }
      if (entry.range) {
        const min = entry.range.min !== undefined ? Number(entry.range.min) : Number(entry.range);
        const max = entry.range.max !== undefined ? Number(entry.range.max) : Number(entry.range);
        if (rollValue >= min && rollValue <= max) {
          winningIndex = i;
          break;
        }
      }
    }
    
    // Fallback: select index
    if (winningIndex === -1) {
      winningIndex = Math.floor(Math.random() * entryCount);
    }
    
    // Animate cycling effects
    let counter = 0;
    const duration = 800; // ms
    const intervalTime = 60; // ms
    const totalSteps = duration / intervalTime;
    
    const animationInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * entryCount);
      setRollingIndex(randomIndex);
      
      // Auto flip page to follow rolling visuals
      const rollingPage = Math.floor(randomIndex / entriesPerPage) + 1;
      setCurrentPage(rollingPage);
      
      counter++;
      if (counter >= totalSteps) {
        clearInterval(animationInterval);
        setRollingIndex(null);
        setRolledIndex(winningIndex);
        setIsRolling(false);
        
        // Ensure we end on the exact page of the rolled item
        const finalPage = Math.floor(winningIndex / entriesPerPage) + 1;
        setCurrentPage(finalPage);
      }
    }, intervalTime);
  };

  const formatRange = (entry, index) => {
    switch (resolutionType) {
      case 'DICE':
        if (entry?.roll !== undefined) return String(entry.roll);
        if (entry?.range) {
          if (typeof entry.range === 'object' && entry.range !== null && entry.range.min !== undefined && entry.range.max !== undefined) {
            return entry.range.min === entry.range.max ? `${entry.range.min}` : `${entry.range.min}-${entry.range.max}`;
          }
          return String(entry.range);
        }
        return `${index + 1}`;
      case 'CARDS':
        return entry.cardPattern || entry.range || `Card ${index + 1}`;
      case 'COINS':
        return entry.coinPattern || entry.range || `Coin ${index + 1}`;
      default:
        return `${index + 1}`;
    }
  };

  // Pagination bounds
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, entryCount);
  const visibleEntries = entries.slice(startIndex, endIndex);

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rollable-table-summary compact ${className}`}>
        <div className="rollable-table-summary-content">
          <span className="rollable-table-icon">{getResolutionIcon()}</span>
          <span className="rollable-table-name">{displayTableName}</span>
          <span className="rollable-table-method">({formatResolutionMethod()})</span>
          <span className="rollable-table-count">{entryCount} {entryText}</span>
          
          {entryCount > 0 && (
            <button
              className={`rollable-table-roll-btn ${isRolling ? 'rolling' : ''}`}
              onClick={handleRoll}
              disabled={isRolling}
              title="Roll on this table directly"
            >
              <FaDiceD20 className="roll-btn-icon" />
              {isRolling ? 'Rolling...' : 'Roll'}
            </button>
          )}

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
              {visibleEntries.map((entry, idx) => {
                const absoluteIndex = startIndex + idx;
                const isRollingHighlight = rollingIndex === absoluteIndex;
                const isRolledHighlight = rolledIndex === absoluteIndex;
                const effectData = getEffectText(entry);
                
                return (
                  <div
                    key={absoluteIndex}
                    className={`rollable-table-entry-preview ${isRollingHighlight ? 'is-rolling-highlight' : ''} ${isRolledHighlight ? 'is-rolled-highlight' : ''}`}
                  >
                    <span className="entry-range">
                      {formatRange(entry, absoluteIndex)}
                    </span>
                    <div className="entry-effect-container">
                      {effectData.name && (
                        <span className="entry-effect-name">
                          {effectData.name}
                          {isRolledHighlight && <span className="rolled-badge">Rolled!</span>}
                        </span>
                      )}
                      {!effectData.name && isRolledHighlight && (
                        <div style={{ marginBottom: '4px' }}>
                          <span className="rolled-badge" style={{ marginLeft: 0 }}>Rolled!</span>
                        </div>
                      )}
                      {effectData.needsFormatting ? (
                        <div className="entry-effect-text">
                          {formatEffectText(effectData.effect).map((sentence, sIdx) => (
                            <div key={sIdx} className="entry-effect-sentence" dangerouslySetInnerHTML={{ __html: sentence + (sIdx < formatEffectText(effectData.effect).length - 1 ? '.' : '') }} />
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="rollable-table-pagination">
                <button
                  className="page-btn prev-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1 || isRolling}
                  title="Previous Page"
                >
                  ◀
                </button>
                <span className="page-info">
                  {currentPage} of {totalPages}
                </span>
                <button
                  className="page-btn next-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages || isRolling}
                  title="Next Page"
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <span className={`rollable-table-summary inline ${className}`}>
        <span className="rollable-table-icon">{getResolutionIcon()}</span>
        <span className="rollable-table-inline-text">
          {displayTableName} ({formatResolutionMethod()})
        </span>
      </span>
    );
  }

  // Detailed variant
  return (
    <div className={`rollable-table-summary detailed ${className}`}>
      <div className="rollable-table-summary-header">
        <div className="rollable-table-title">
          <span className="rollable-table-icon">{getResolutionIcon()}</span>
          <span className="rollable-table-name">{displayTableName}</span>
        </div>
        
        <div className="rollable-table-meta-roll-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {entryCount > 0 && (
            <button
              className={`rollable-table-roll-btn ${isRolling ? 'rolling' : ''}`}
              onClick={handleRoll}
              disabled={isRolling}
              title="Roll on this table directly"
            >
              <FaDiceD20 className="roll-btn-icon" />
              {isRolling ? 'Rolling...' : 'Roll'}
            </button>
          )}
          <div className="rollable-table-meta">
            <span className="rollable-table-method">{formatResolutionMethod()}</span>
            <span className="rollable-table-count">{entryCount} {entryText}</span>
          </div>
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
            {visibleEntries.map((entry, idx) => {
              const absoluteIndex = startIndex + idx;
              const isRollingHighlight = rollingIndex === absoluteIndex;
              const isRolledHighlight = rolledIndex === absoluteIndex;
              const effectData = getEffectText(entry);

              return (
                <div
                  key={absoluteIndex}
                  className={`rollable-table-entry-preview ${isRollingHighlight ? 'is-rolling-highlight' : ''} ${isRolledHighlight ? 'is-rolled-highlight' : ''}`}
                >
                  <span className="entry-range">
                    {formatRange(entry, absoluteIndex)}
                  </span>
                  <div className="entry-effect-container">
                    {effectData.name && (
                      <span className="entry-effect-name">
                        {effectData.name}
                        {isRolledHighlight && <span className="rolled-badge">Rolled!</span>}
                      </span>
                    )}
                    {!effectData.name && isRolledHighlight && (
                      <div style={{ marginBottom: '4px' }}>
                        <span className="rolled-badge" style={{ marginLeft: 0 }}>Rolled!</span>
                      </div>
                    )}
                    {effectData.needsFormatting ? (
                      <div className="entry-effect-text">
                        {formatEffectText(effectData.effect).map((sentence, sIdx) => (
                          <div key={sIdx} className="entry-effect-sentence" dangerouslySetInnerHTML={{ __html: sentence + (sIdx < formatEffectText(effectData.effect).length - 1 ? '.' : '') }} />
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="rollable-table-pagination">
              <button
                className="page-btn prev-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                }}
                disabled={currentPage === 1 || isRolling}
                title="Previous Page"
              >
                ◀
              </button>
              <span className="page-info">
                {currentPage} of {totalPages}
              </span>
              <button
                className="page-btn next-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
                disabled={currentPage === totalPages || isRolling}
                title="Next Page"
              >
                ▶
              </button>
            </div>
          )}
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
