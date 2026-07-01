import React from 'react';
import { getCustomIconUrl } from '../../../../utils/assetManager';

const SpellCardHeader = ({
  spell,
  variant,
  library,
  className,
  categories,
  getSpellIcon,
  formatCastTime,
  formatRange,
  formatTargetingType,
  formatPropagation,
  formatTypeSpecificBullets,
  formatResourceCosts,
  formatSpellComponents,
  getDamageTypes,
}) => {
  return (
    <>
      {/* Card Gloss Effect */}
      <div className="spell-card-gloss"></div>

      {/* Category Indicators (for library/collection variants) */}
      {(variant === 'library' || variant === 'collection') && categories && categories.length > 0 && (
        <div className="spell-card-categories">
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={index}
              className="spell-card-category-indicator"
              style={{ backgroundColor: category.color || '#3b82f6' }}
            />
          ))}
        </div>
      )}

      {/* Card Header */}
      <div className="pf-spell-card-header wow-spell-card-header">
        {/* Priority Range Tag - Top Right of Header (for creature abilities) */}
        {spell?.priorityRange && (
          <div className="pf-priority-range-tag-above-header">
            {(() => {
              const { min, max, resolution = 'DICE', cardCount = 1, coinCount = 1, cardPattern = 'any', coinPattern = 'any' } = spell.priorityRange;
              if (resolution === 'DICE') {
                return <span>Roll {min}-{max}</span>;
              } else if (resolution === 'CARDS') {
                const patternText = cardPattern === 'any' ? '' :
                  cardPattern === 'hearts' ? '♥' :
                  cardPattern === 'diamonds' ? '♦' :
                  cardPattern === 'clubs' ? '♣' :
                  cardPattern === 'spades' ? '♠' :
                  cardPattern === 'red' ? 'Red' :
                  cardPattern === 'black' ? 'Black' :
                  cardPattern === 'face' ? 'Face' :
                  cardPattern === 'ace' ? 'Ace' :
                  cardPattern === 'ace_of_hearts' ? 'A♥' :
                  cardPattern === 'ace_of_diamonds' ? 'A♦' :
                  cardPattern === 'ace_of_clubs' ? 'A♣' :
                  cardPattern === 'ace_of_spades' ? 'A♠' :
                  cardPattern;
                return <span>Draw {cardCount}x{patternText ? ` ${patternText}` : ''}</span>;
              } else if (resolution === 'COINS') {
                const patternText = coinPattern === 'any' ? '' :
                  coinPattern === 'heads' ? 'H' :
                  coinPattern === 'tails' ? 'T' :
                  coinPattern === 'all_heads' ? 'All H' :
                  coinPattern === 'all_tails' ? 'All T' :
                  coinPattern === 'majority_heads' ? 'Maj H' :
                  coinPattern === 'majority_tails' ? 'Maj T' :
                  coinPattern;
                return <span>Flip {coinCount}x{patternText ? ` ${patternText}` : ''}</span>;
              }
              return <span>Roll {min}-{max}</span>;
            })()}
          </div>
        )}
        {/* Trigger Condition Tag - Top Right of Header, to the left of priority tag (for creature abilities) */}
        {spell?.triggerCondition && (
          <div className="pf-trigger-condition-tag-above-header">
            {(() => {
              const { type, operator, value, statusEffect, resourceType, threshold, abilityName } = spell.triggerCondition;
              
              if (type === 'hp_percentage' || type === 'hp_percentage_target') {
                if (operator === 'below') {
                  const hpText = value <= 25 ? 'Low HP' : value <= 50 ? `Under ${value}%` : `HP < ${value}%`;
                  return <span>{hpText}</span>;
                } else if (operator === 'above') {
                  return <span>HP > {value}%</span>;
                } else {
                  return <span>HP = {value}%</span>;
                }
              } else if (type === 'enemy_count') {
                if (operator === 'at_least') {
                  return <span>{value}+ Enemies</span>;
                } else if (operator === 'at_most') {
                  return <span>≤{value} Enemies</span>;
                } else {
                  return <span>{value} Enemies</span>;
                }
              } else if (type === 'ally_count') {
                if (operator === 'at_least') {
                  return <span>{value}+ Allies</span>;
                } else if (operator === 'at_most') {
                  return <span>≤{value} Allies</span>;
                } else {
                  return <span>{value} Allies</span>;
                }
              } else if (type === 'round_number') {
                if (operator === 'at_least') {
                  return <span>Round {value}+</span>;
                } else if (operator === 'at_most') {
                  return <span>Round ≤{value}</span>;
                } else {
                  return <span>Round {value}</span>;
                }
              } else if (type === 'turn_number') {
                if (operator === 'at_least') {
                  return <span>Turn {value}+</span>;
                } else if (operator === 'at_most') {
                  return <span>Turn ≤{value}</span>;
                } else {
                  return <span>Turn {value}</span>;
                }
              } else if (type === 'distance') {
                if (operator === 'at_most') {
                  return <span>Within {value}ft</span>;
                } else if (operator === 'at_least') {
                  return <span>Beyond {value}ft</span>;
                } else {
                  return <span>{value}ft away</span>;
                }
              } else if (type === 'status_effect_self' || type === 'status_effect_enemy') {
                const effectName = statusEffect ? statusEffect.substring(0, 10) : 'Has Status';
                return <span>{effectName}</span>;
              } else if (type === 'resource_level') {
                const resource = resourceType ? resourceType.charAt(0).toUpperCase() + resourceType.slice(1) : 'Resource';
                if (operator === 'below') {
                  return <span>Low {resource}</span>;
                } else if (operator === 'above') {
                  return <span>High {resource}</span>;
                } else {
                  return <span>{resource} = {value}%</span>;
                }
              } else if (type === 'action_points') {
                if (operator === 'at_least') {
                  return <span>{value}+ AP</span>;
                } else if (operator === 'at_most') {
                  return <span>≤{value} AP</span>;
                } else {
                  return <span>{value} AP</span>;
                }
              } else if (type === 'enemies_low_hp') {
                const thresholdValue = threshold || 25;
                const enemyText = value === 1 ? 'enemy' : 'enemies';
                if (operator === 'at_least') {
                  return <span>If {value}+ {enemyText} ≤{thresholdValue}% HP</span>;
                } else if (operator === 'at_most') {
                  return <span>If ≤{value} {enemyText} ≤{thresholdValue}% HP</span>;
                } else {
                  return <span>If {value} {enemyText} ≤{thresholdValue}% HP</span>;
                }
              } else if (type === 'surrounded') {
                return <span>Surrounded</span>;
              } else if (type === 'first_turn') {
                return <span>First Turn</span>;
              } else if (type === 'cooldown_ready') {
                return <span>Ready</span>;
              } else if (type === 'phase') {
                const phaseText = value ? value.replace('phase', '').replace('Phase', '').trim() || 'Phase' : 'Phase';
                return <span>{phaseText}</span>;
              } else if (type === 'damage_taken') {
                if (operator === 'at_least') {
                  return <span>Took {value}+</span>;
                } else if (operator === 'at_most') {
                  return <span>Took ≤{value}</span>;
                } else {
                  return <span>Took {value}</span>;
                }
              } else if (type === 'ability_used') {
                const abilName = abilityName ? abilityName.substring(0, 10) : 'Ability';
                return <span>After {abilName}</span>;
              }
              return null;
            })()}
          </div>
        )}
        {/* Header Main Row - Icon, Name, Resource Cost, Damage Types */}
        <div className="unified-spell-header-main">
          <div className="pf-spell-icon-container">
            <img
              src={getSpellIcon()}
              alt={spell?.name || 'Spell'}
              className="pf-spell-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
              }}
            />

            {/* Spell Type Badge (for spellbook variant only) */}
            {variant === 'spellbook' && (
              <div className="spell-type-badge">
                {spell?.spellType || 'ACTION'}
              </div>
            )}
          </div>

          <div className="unified-spell-info">
            <h3 className="pf-spell-name">{spell?.name || 'Unnamed Spell'}</h3>

            {/* Resource costs below title for wizard, library, collection, spellbook, and rules variants */}
            {(variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (formatResourceCosts() || spell?.musicalCombo || spell?.specialMechanics?.musicalCombo) && (
              <div className="unified-spell-wizard-meta">
                <div className="unified-spell-resource-costs">
                  {formatResourceCosts()}
                </div>
              </div>
            )}

            {/* Meta information varies by variant */}
            <div className="unified-spell-meta">
              {variant === 'spellbook' && (
                <>
                  <span className="spell-cast-time">{formatCastTime()}</span>
                </>
              )}

            </div>
          </div>

          {/* Right side container for Resource Cost and Damage Types */}
          <div className="unified-spell-header-right">
            {/* Combined damage types and spell components box for wizard variant */}
            {(() => {
              const damageTypes = getDamageTypes();
              const spellComponents = formatSpellComponents();
              // Determine if there are any component entries configured on the spell
              const hasComponentData = Array.isArray(spell?.resourceCost?.components) && spell.resourceCost.components.length > 0;
              // Only render when we actually have damage types or configured components to show
              const shouldShow = (variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (damageTypes.length > 0 || hasComponentData);

              return shouldShow && (
                <div className="pf-damage-spell-box">
                  {/* Damage Types - Top row */}
                  {damageTypes.length > 0 && (
                  <div className="pf-damage-types-header">
                    {damageTypes.map((damageType, index) => {
                      // Format damage type name: capitalize first letter
                      const formattedType = damageType.charAt(0).toUpperCase() + damageType.slice(1);
                      return (
                        <div key={index} className={`pf-damage-type-badge ${damageType.toLowerCase()}`} title={`${formattedType} damage`}>
                          <span className="pf-damage-type-text">{formattedType}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Spell Components - Bottom row, starting beneath leftmost damage type */}
                {spellComponents && (
                  <div className="unified-spell-components-header">
                    {spellComponents}
                  </div>
                )}
              </div>
              );
            })()}

            {/* Damage Types and Resource Costs for library/collection variants */}
            {/* NOTE: Damage types are already shown in the combined box above, so we don't duplicate them here */}
            {(variant === 'library' || variant === 'collection') && false && (
              <div className="pf-library-header-right">
                {/* Damage Types - REMOVED: Already shown in combined box above to prevent duplication */}
                {/* Resource Costs intentionally not duplicated here; shown under title */}
              </div>
            )}
          </div>
        </div>

        {/* Header Details Row - Action Type, Range, Targeting */}
        {(variant === 'library' || variant === 'wizard' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (
          <div className="unified-spell-header-details">
            {/* Main badges row - action type, range, targeting */}
            <div className="unified-spell-badges-row">
              {/* Action Type Badge - simplified without bullets */}
              <div className={`pf-action-type-badge ${(spell?.spellType || 'action').toLowerCase()}`}>
                <div className="pf-action-type-content">
                  <span className="pf-action-type-name">{spell?.spellType || 'Action'}</span>
                </div>
              </div>

              {/* Range Badge */}
              <div className="pf-range-badge">
                <span>{formatRange()}</span>
              </div>

              {/* Targeting Type Badge */}
              {formatTargetingType() && (
                <div className="pf-targeting-badge">
                  <span>{formatTargetingType()}</span>
                </div>
              )}

              {/* Cadence Name Badge - for Minstrel resolver spells - styled like action type */}
              {((spell?.musicalCombo?.type === 'resolver' && spell?.musicalCombo?.cadenceName) ||
                (spell?.specialMechanics?.musicalCombo?.type === 'resolver' && spell?.specialMechanics?.musicalCombo?.cadenceName)) && (
                <div className="pf-action-type-badge cadence">
                  <div className="pf-action-type-content">
                    <span className="pf-action-type-name">
                      {(spell?.musicalCombo?.cadenceName || spell?.specialMechanics?.musicalCombo?.cadenceName)?.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              {/* Trigger Role Badge - only show for non-conditional (auto-cast) */}
              {spell?.triggerConfig?.triggerRole?.mode && spell.triggerConfig.triggerRole.mode !== 'CONDITIONAL' && (
                <div className="pf-action-type-badge" style={{
                  background: 'rgba(147,112,219,0.15)', color: '#9370DB'
                }}>
                  <div className="pf-action-type-content">
                    <span className="pf-action-type-name">
                      {spell.triggerConfig.triggerRole.mode === 'AUTO' ? 'Auto-Cast' : spell.triggerConfig.triggerRole.mode}
                    </span>
                  </div>
                </div>
              )}

              {/* Propagation Badge */}
              {formatPropagation() && (
                <div
                  className="pf-propagation-badge"
                  style={{
                    fontSize: formatPropagation().length > 30 ? '9px' :
                             formatPropagation().length > 25 ? '10px' :
                             formatPropagation().length > 20 ? '11px' :
                             '12px'
                  }}
                >
                  <div className="pf-propagation-icon"></div>
                  <span>{formatPropagation()}</span>
                </div>
              )}
            </div>

            {/* Bullet points row - appears below the badges */}
            {formatTypeSpecificBullets().length > 0 && (
              <div className="unified-spell-bullets-row">
                {formatTypeSpecificBullets().map((bullet, index) => (
                  <span key={index} className="unified-spell-bullet">• {bullet}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SpellCardHeader;
