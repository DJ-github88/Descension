import React from 'react';
import PropTypes from 'prop-types';

// Helper function to format stat names
const formatStatName = (statName) => {
  if (!statName) return '';

  // Replace underscores with spaces
  const withSpaces = statName.replace(/_/g, ' ');

  // Capitalize each word
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CollectionSpellCard = ({
  spell,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  categories,
  onContextMenu
}) => {
  // Format damage or healing values
  const formatDamageOrHealing = () => {
    // Special handling for card-based spells
    if (spell.resolution === 'CARDS' && spell.cardConfig) {
      return spell.cardConfig.formula || `CARD_VALUE + FACE_CARD_COUNT * 5`;
    }

    // Special handling for coin-based spells
    if (spell.resolution === 'COINS' && spell.coinConfig) {
      return spell.coinConfig.formula || `HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)`;
    }

    // Standard dice-based spells
    if (spell.effectType === 'damage' && spell.primaryDamage) {
      return `${spell.primaryDamage.dice || '6d6'}${spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : ''}`;
    }

    if (spell.effectType === 'healing' && spell.healing) {
      return `${spell.healing.dice || '6d6'}${spell.healing.flat > 0 ? ` + ${spell.healing.flat}` : ''}`;
    }

    // Check for resolution type even if effectType is not damage/healing
    if (spell.resolution === 'DICE' && (spell.diceConfig || spell.primaryDamage)) {
      const dice = spell.diceConfig?.formula || spell.primaryDamage?.dice || '6d6';
      const flat = spell.primaryDamage?.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';
      return `${dice}${flat}`;
    }

    // Default fallback
    return spell.primaryDamage?.dice || '6d6';
  };

  // Format casting time
  const formatCastingTime = () => {
    if (!spell.castTime) return 'Instant';
    return spell.castTime;
  };

  // Format range
  const formatRange = () => {
    if (!spell.range) return '30 ft';
    return spell.range;
  };

  // Get border color based on rarity or type
  const getBorderColor = () => {
    // First check for rarity
    if (spell.rarity) {
      switch (spell.rarity.toLowerCase()) {
        case 'common': return '#9d9d9d';
        case 'uncommon': return '#1eff00';
        case 'rare': return '#0070dd';
        case 'epic': return '#a335ee';
        case 'legendary': return '#ff8000';
        default: return '#3a5a8c';
      }
    }

    // Then check for damage type
    if (spell.damageTypes && spell.damageTypes.length > 0) {
      const primaryType = spell.damageTypes[0].toLowerCase();
      switch (primaryType) {
        case 'fire': return '#FF4D4D';
        case 'cold': case 'frost': return '#4D9EFF';
        case 'arcane': case 'force': return '#CC99FF';
        case 'acid': case 'poison': case 'nature': return '#4DFF4D';
        case 'necrotic': case 'shadow': return '#FF4DFF';
        case 'radiant': case 'holy': return '#FFCC00';
        case 'lightning': case 'thunder': return '#FF9933';
        case 'slashing': case 'piercing': case 'bludgeoning': return '#CCCCCC';
        default: return '#3a5a8c';
      }
    }

    // Default color
    return '#3a5a8c';
  };

  // Get rarity class
  const getRarityClass = () => {
    if (!spell.rarity) return 'common';
    return spell.rarity.toLowerCase();
  };

  // Get spell school color class
  const getSpellSchoolColor = () => {
    // Try to determine color from damage types
    if (spell.damageTypes && spell.damageTypes.length > 0) {
      const primaryDamageType = spell.damageTypes[0].toLowerCase();
      switch (primaryDamageType) {
        case 'fire': return 'spell-fire';
        case 'cold': case 'frost': return 'spell-frost';
        case 'arcane': case 'force': return 'spell-arcane';
        case 'acid': case 'poison': case 'nature': return 'spell-nature';
        case 'necrotic': case 'shadow': return 'spell-shadow';
        case 'radiant': case 'holy': return 'spell-holy';
        case 'lightning': case 'thunder': return 'spell-lightning';
        case 'slashing': case 'piercing': case 'bludgeoning': return 'spell-physical';
        default: return '';
      }
    }
    return '';
  };

  // Handle keyboard interactions
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect();
      e.preventDefault();
    } else if (e.key === 'Delete' && isSelected) {
      onDelete();
      e.preventDefault();
    } else if (e.key === 'c' && e.ctrlKey && isSelected) {
      onDuplicate();
      e.preventDefault();
    }
  };

  return (
    <div
      className={`wow-spell-card ${getRarityClass()} ${getSpellSchoolColor()}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      onContextMenu={onContextMenu}
      tabIndex="0"
      role="button"
      aria-selected={isSelected}
      style={{
        position: 'relative',
        backgroundColor: '#0a0a0a',
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '6px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        color: '#fff',
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5), 0 0 10px ${getBorderColor()}40`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer'
      }}
    >
      {/* Card gloss effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Card header with icon and name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
          borderBottom: '1px solid #1e3a8a'
        }}>
          {/* Spell icon */}
          <div style={{ position: 'relative', marginRight: '12px' }}>
            <div style={{
              border: '2px solid #4a4a4a',
              borderRadius: '6px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
              width: '48px',
              height: '48px',
              overflow: 'hidden'
            }}>
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon || 'inv_misc_questionmark'}.jpg`}
                alt={spell.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '3px',
              padding: '1px 3px',
              fontSize: '9px',
              color: '#94a3b8',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              {spell.spellType || 'ACTION'}
            </div>
          </div>

          {/* Spell name and meta */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: '#ffd100',
              fontFamily: '"Cinzel", serif',
              fontSize: '16px',
              fontWeight: 'bold',
              margin: '0 0 2px 0',
              textShadow: '1px 1px 2px #000',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {spell.name.toUpperCase()}
            </h3>
            <div style={{ display: 'flex', fontSize: '11px', color: '#aaa' }}>
              <span style={{ marginRight: '10px' }}>{formatCastingTime()}</span>
              <span>{formatRange()}</span>
            </div>
          </div>
        </div>

        {/* Card body with description */}
        <div style={{ padding: '10px', backgroundColor: '#0f172a', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            color: '#ccc',
            fontSize: '12px',
            marginBottom: '10px',
            lineHeight: 1.4,
            borderBottom: '1px solid #334155',
            paddingBottom: '8px'
          }}>
            {spell.description || 'No description available.'}
          </div>

          {/* Damage or healing section */}
          {(spell.effectType === 'damage' || spell.effectType === 'healing') && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                  {spell.effectType === 'damage' ? 'DAMAGE:' : 'HEALING:'}
                </span>
                <span style={{
                  color: spell.effectType === 'damage' ? '#ef4444' : '#22c55e',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}>
                  {formatDamageOrHealing()}
                </span>
              </div>
              {spell.damageTypes && spell.damageTypes.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', flexWrap: 'wrap' }}>
                  {spell.damageTypes.map((type, index) => (
                    <span key={index} style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      color: type.toLowerCase() === 'fire' ? '#ff7e00' :
                        type.toLowerCase() === 'cold' ? '#00c8ff' :
                          type.toLowerCase() === 'lightning' ? '#ffcc00' :
                            type.toLowerCase() === 'acid' ? '#00ff00' :
                              type.toLowerCase() === 'force' ? '#cc99ff' :
                                type.toLowerCase() === 'necrotic' ? '#cc00cc' :
                                  type.toLowerCase() === 'radiant' ? '#ffff00' :
                                    type.toLowerCase() === 'thunder' ? '#ff9933' :
                                      type.toLowerCase() === 'poison' ? '#00cc00' :
                                        type.toLowerCase() === 'psychic' ? '#ff00ff' :
                                          '#ffffff'
                    }}>
                      {type.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resolution method */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                RESOLUTION:
              </span>
              <span style={{ color: '#e2e8f0', fontSize: '12px', fontFamily: 'monospace' }}>
                {spell.resolution === 'DICE' && (
                  <span>
                    <i className="fas fa-dice-d20" style={{ marginRight: '4px', color: '#eab308' }}></i>
                    {spell.diceConfig?.formula || spell.primaryDamage?.dice || spell.healing?.dice || '6d6'}
                    {!spell.diceConfig?.formula && spell.primaryDamage?.flat > 0 && ` + ${spell.primaryDamage.flat}`}
                    {!spell.diceConfig?.formula && spell.healing?.flat > 0 && ` + ${spell.healing.flat}`}
                  </span>
                )}
                {spell.resolution === 'CARDS' && (
                  <span>
                    <i className="fas fa-th" style={{ marginRight: '4px', color: '#22c55e' }}></i>
                    {spell.cardConfig?.formula ? (
                      <span title={spell.cardConfig.formula}>
                        {spell.cardConfig.formula}
                      </span>
                    ) : (
                      <span>
                        Draw {spell.cardConfig?.drawCount || '3'} - CARD_VALUE + FACE_CARD_COUNT * 5
                      </span>
                    )}
                  </span>
                )}
                {spell.resolution === 'COINS' && (
                  <span>
                    <i className="fas fa-coins" style={{ marginRight: '4px', color: '#eab308' }}></i>
                    {spell.coinConfig?.formula ? (
                      <span title={spell.coinConfig.formula}>
                        {spell.coinConfig.formula}
                      </span>
                    ) : (
                      <span>
                        Flip {spell.coinConfig?.flipCount || '5'} - HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)
                      </span>
                    )}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Critical hit mechanics */}
          {spell.criticalConfig && spell.criticalConfig.enabled && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                  {spell.criticalConfig.critOnlyEffect ? 'EFFECT-ONLY CRITICAL:' : 'CRITICAL:'}
                </span>
                <span style={{ color: '#ef4444', fontSize: '12px' }}>
                  {spell.criticalConfig.useRollableTable ? (
                    <span>
                      {spell.criticalConfig.critType === 'dice' ? 'On Critical - Roll on ' :
                       spell.criticalConfig.critType === 'cards' ? 'On Critical - Draw on ' :
                       spell.criticalConfig.critType === 'coins' ? 'On Critical - Flip on ' :
                       'On Critical - Roll on '}
                      {spell.rollableTable?.name || 'Table'}
                    </span>
                  ) : (
                    <>
                      {spell.criticalConfig.critType === 'dice' && !spell.criticalConfig.useRollableTable && (
                        <span>
                          ×{spell.criticalConfig.critMultiplier || 2}
                          {spell.criticalConfig.explodingDice && ' Exploding'}
                        </span>
                      )}
                      {spell.criticalConfig.critType === 'cards' && !spell.criticalConfig.useRollableTable && (
                        <span>
                          Face Cards +{spell.criticalConfig.extraCardDraw || 2}
                        </span>
                      )}
                      {spell.criticalConfig.critType === 'coins' && !spell.criticalConfig.useRollableTable && (
                        <span>
                          All Heads +{spell.criticalConfig.extraCoinFlips || 3}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Effects */}
          {spell.effects && spell.effects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                  EFFECTS:
                </span>
                <span style={{ color: '#e2e8f0', fontSize: '12px' }}>
                  {spell.effects.join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* Stat bonuses */}
          {spell.buffConfig && spell.buffConfig.statBonuses && spell.buffConfig.statBonuses.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                BONUSES:
              </div>
              {spell.buffConfig.statBonuses.map((bonus, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#e2e8f0' }}>
                  <span>{formatStatName(bonus.stat)}</span>
                  <span style={{ color: bonus.value > 0 ? '#22c55e' : '#ef4444' }}>
                    {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card footer with tags */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          borderTop: '1px solid #333',
          minHeight: '20px'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center', flex: 1 }}>
            {/* Effect type tag */}
            {spell.effectType && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: spell.effectType === 'damage' ? '#ef4444' :
                  spell.effectType === 'healing' ? '#22c55e' :
                    spell.effectType === 'buff' ? '#3b82f6' :
                      spell.effectType === 'debuff' ? '#a855f7' :
                        spell.effectType === 'utility' ? '#2dd4bf' :
                          '#ffffff'
              }}>
                {spell.effectType.toUpperCase()}
              </span>
            )}

            {/* Resolution type tag */}
            {spell.resolution && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: spell.resolution === 'DICE' ? '#eab308' :
                  spell.resolution === 'CARDS' ? '#22c55e' :
                    spell.resolution === 'COINS' ? '#3b82f6' :
                      '#ffffff'
              }}>
                {spell.resolution}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '3px',
                backgroundColor: 'rgba(30, 58, 138, 0.3)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              title="Duplicate spell"
            >
              <i className="fas fa-copy"></i>
            </button>
            <button
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '3px',
                backgroundColor: 'rgba(220, 38, 38, 0.3)',
                border: '1px solid rgba(248, 113, 113, 0.4)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Remove from collection"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CollectionSpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  categories: PropTypes.array,
  onContextMenu: PropTypes.func
};

CollectionSpellCard.defaultProps = {
  isSelected: false,
  categories: [],
  onContextMenu: () => {}
};

export default CollectionSpellCard;
