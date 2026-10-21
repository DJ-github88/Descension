import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { getCustomIconUrl } from '../../../../utils/assetManager';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Single spell component pill (V, S, M, C) with smart boundary clamping
 * so popovers never get cut off by card edges or parent containers.
 */
const SpellComponentPill = ({
  compKey,
  label,
  name,
  icon,
  fullText,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const pillRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverPos, setPopoverPos] = useState({ left: 'auto', right: '-6px', transform: 'none' });
  const [arrowStyle, setArrowStyle] = useState({});

  useIsomorphicLayoutEffect(() => {
    if (!isOpen || !pillRef.current || !popoverRef.current) return;

    const updatePosition = () => {
      const pillEl = pillRef.current;
      const popoverEl = popoverRef.current;
      if (!pillEl || !popoverEl) return;

      const cardEl = popoverEl.closest('.pf-spell-card') ||
                     popoverEl.closest('.wow-spell-card') ||
                     popoverEl.closest('.spell-card-header') ||
                     document.body;

      const pillRect = pillEl.getBoundingClientRect();
      const popoverRect = popoverEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const wrapperRect = pillEl.parentElement ? pillEl.parentElement.getBoundingClientRect() : pillRect;

      const pillCenter = pillRect.left + pillRect.width / 2;
      const popoverWidth = popoverRect.width || 240;

      // Determine boundaries within card and viewport (with comfortable padding)
      const minLeft = Math.max(cardRect.left + 8, 8);
      const maxRight = Math.min(cardRect.right - 8, (window.innerWidth || 1200) - 8);

      // Default preference: centered under pill
      let targetLeft = pillCenter - popoverWidth / 2;

      // Clamp right edge so it never overflows card or window
      if (targetLeft + popoverWidth > maxRight) {
        targetLeft = maxRight - popoverWidth;
      }
      // Clamp left edge so it never overflows left edge
      if (targetLeft < minLeft) {
        targetLeft = minLeft;
      }

      // Convert to coordinate relative to wrapper
      const relativeLeft = targetLeft - wrapperRect.left;
      // Arrow points to pillCenter relative to popover
      const arrowLeft = Math.max(12, Math.min(popoverWidth - 12, pillCenter - targetLeft));

      setPopoverPos({
        left: `${relativeLeft}px`,
        right: 'auto',
        transform: 'none',
        opacity: 1,
      });
      setArrowStyle({
        left: `${arrowLeft}px`,
        right: 'auto',
        transform: 'translateX(-50%)',
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen]);

  const cleanText = fullText ? fullText.replace(/^["'“](.*)["'”]$/, '$1').trim() : '';

  return (
    <div
      className={`spell-component-pill-wrapper ${isOpen ? 'active' : ''}`}
      style={{ position: 'relative', zIndex: isOpen ? 100 : undefined }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span
        ref={pillRef}
        className={`spell-component-pill spell-component-pill--${compKey} ${isOpen ? 'active' : ''}`}
        role="button"
        tabIndex={0}
      >
        {label}
      </span>

      {isOpen && fullText && (
        <div
          ref={popoverRef}
          className={`pf-component-popover pf-component-popover--${compKey}`}
          style={{ zIndex: 10000, ...popoverPos }}
        >
          <div className="pf-component-popover-arrow" style={arrowStyle} />
          <div className="pf-component-popover-header">
            <i className={`fas ${icon}`}></i>
            <span>{name}</span>
          </div>
          <div className="pf-component-popover-body">
            “{cleanText}”
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [activeComponentTooltip, setActiveComponentTooltip] = useState(null);

  React.useEffect(() => {
    if (!activeComponentTooltip) return;
    const handleOutsideClick = () => {
      setActiveComponentTooltip(null);
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('touchend', handleOutsideClick);
    };
  }, [activeComponentTooltip]);

  const renderPriorityRangeBadge = () => {
    if (!spell?.priorityRange) return null;
    const { min, max, resolution = 'DICE', cardCount = 1, coinCount = 1, cardPattern = 'any', coinPattern = 'any' } = spell.priorityRange;
    let label = '';
    if (resolution === 'DICE') {
      label = `Roll ${min}-${max}`;
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
      label = `Draw ${cardCount}x${patternText ? ` ${patternText}` : ''}`;
    } else if (resolution === 'COINS') {
      const patternText = coinPattern === 'any' ? '' :
        coinPattern === 'heads' ? 'H' :
        coinPattern === 'tails' ? 'T' :
        coinPattern === 'all_heads' ? 'All H' :
        coinPattern === 'all_tails' ? 'All T' :
        coinPattern === 'majority_heads' ? 'Maj H' :
        coinPattern === 'majority_tails' ? 'Maj T' :
        coinPattern;
      label = `Flip ${coinCount}x${patternText ? ` ${patternText}` : ''}`;
    } else {
      label = `Roll ${min}-${max}`;
    }

    return (
      <div className="pf-priority-range-tag-above-header pf-priority-badge" title="Tactics Priority Roll">
        <span>{label}</span>
      </div>
    );
  };

  const renderTriggerConditionBadge = () => {
    if (spell?.reactionTrigger) {
      return (
        <div className="pf-trigger-condition-tag-above-header pf-trigger-badge" title={spell.reactionTrigger}>
          <span>⚡ {spell.reactionTrigger}</span>
        </div>
      );
    }
    if (spell?.spellType === 'REACTION' && spell?.trigger) {
      return (
        <div className="pf-trigger-condition-tag-above-header pf-trigger-badge" title={spell.trigger}>
          <span>⚡ {spell.trigger}</span>
        </div>
      );
    }
    if (typeof spell?.triggerCondition === 'string') {
      return (
        <div className="pf-trigger-condition-tag-above-header pf-trigger-badge" title={spell.triggerCondition}>
          <span>{spell.triggerCondition}</span>
        </div>
      );
    }
    if (spell?.spellType === 'PASSIVE' && spell?.trigger) {
      return (
        <div className="pf-trigger-condition-tag-above-header pf-trigger-badge" title={spell.trigger}>
          <span>⚡ {spell.trigger}</span>
        </div>
      );
    }
    if (!spell?.triggerCondition) return null;
    const { type, operator, value, statusEffect, resourceType, threshold, abilityName } = spell.triggerCondition;

    let triggerContent = null;
    if (type === 'hp_percentage' || type === 'hp_percentage_target') {
      if (operator === 'below') {
        const hpText = value <= 25 ? 'Low HP' : value <= 50 ? `Under ${value}%` : `HP < ${value}%`;
        triggerContent = hpText;
      } else if (operator === 'above') {
        triggerContent = `HP > ${value}%`;
      } else {
        triggerContent = `HP = ${value}%`;
      }
    } else if (type === 'enemy_count') {
      triggerContent = operator === 'at_least' ? `${value}+ Enemies` : operator === 'at_most' ? `≤${value} Enemies` : `${value} Enemies`;
    } else if (type === 'ally_count') {
      triggerContent = operator === 'at_least' ? `${value}+ Allies` : operator === 'at_most' ? `≤${value} Allies` : `${value} Allies`;
    } else if (type === 'round_number') {
      triggerContent = operator === 'at_least' ? `Round ${value}+` : operator === 'at_most' ? `Round ≤${value}` : `Round ${value}`;
    } else if (type === 'turn_number') {
      triggerContent = operator === 'at_least' ? `Turn ${value}+` : operator === 'at_most' ? `Turn ≤${value}` : `Turn ${value}`;
    } else if (type === 'distance') {
      triggerContent = operator === 'at_most' ? `Within ${value}ft` : operator === 'at_least' ? `Beyond ${value}ft` : `${value}ft away`;
    } else if (type === 'status_effect_self' || type === 'status_effect_enemy') {
      triggerContent = statusEffect ? statusEffect.substring(0, 10) : 'Has Status';
    } else if (type === 'resource_level') {
      const resource = resourceType ? resourceType.charAt(0).toUpperCase() + resourceType.slice(1) : 'Resource';
      triggerContent = operator === 'below' ? `Low ${resource}` : operator === 'above' ? `High ${resource}` : `${resource} = ${value}%`;
    } else if (type === 'action_points') {
      triggerContent = operator === 'at_least' ? `${value}+ AP` : operator === 'at_most' ? `≤${value} AP` : `${value} AP`;
    } else if (type === 'enemies_low_hp') {
      const thresholdValue = threshold || 25;
      const enemyText = value === 1 ? 'enemy' : 'enemies';
      triggerContent = `If ${operator === 'at_least' ? `${value}+` : operator === 'at_most' ? `≤${value}` : `${value}`} ${enemyText} ≤${thresholdValue}% HP`;
    } else if (type === 'surrounded') {
      triggerContent = 'Surrounded';
    } else if (type === 'first_turn') {
      triggerContent = 'First Turn';
    } else if (type === 'cooldown_ready') {
      triggerContent = 'Ready';
    } else if (type === 'phase') {
      triggerContent = value ? value.replace('phase', '').replace('Phase', '').trim() || 'Phase' : 'Phase';
    } else if (type === 'damage_taken') {
      triggerContent = operator === 'at_least' ? `Took ${value}+` : operator === 'at_most' ? `Took ≤${value}` : `Took ${value}`;
    } else if (type === 'ability_used') {
      const abilName = abilityName ? abilityName.substring(0, 10) : 'Ability';
      triggerContent = `After ${abilName}`;
    }

    if (!triggerContent) return null;
    return (
      <div className="pf-trigger-condition-tag-above-header pf-trigger-badge">
        <span>{triggerContent}</span>
      </div>
    );
  };
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
              style={{ backgroundColor: category.color || '#8b7355' }}
            />
          ))}
        </div>
      )}

      {/* Card Header */}
      <div
        className={`pf-spell-card-header wow-spell-card-header ${activeComponentTooltip ? 'has-active-tooltip' : ''}`}
        style={{ position: 'relative', zIndex: activeComponentTooltip ? 100 : 20 }}
      >
        {/* Header Main Row - Icon, Name, Resource Cost, Damage Types */}
        <div
          className={`unified-spell-header-main ${activeComponentTooltip ? 'has-active-tooltip' : ''}`}
          style={{ position: 'relative', zIndex: activeComponentTooltip ? 50 : 15 }}
        >
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
            {/* Row 1: Title + Damage Type badges */}
            <div className="spell-header-top">
              <h3 className="pf-spell-name">{spell?.name || 'Unnamed Spell'}</h3>
              {(() => {
                const damageTypes = getDamageTypes();
                const shouldShow = (variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && damageTypes.length > 0;
                return shouldShow && (
                  <div className="pf-damage-types-header">
                    {damageTypes.map((damageType, index) => {
                      const formattedType = damageType.charAt(0).toUpperCase() + damageType.slice(1);
                      return (
                        <div key={index} className={`pf-damage-type-badge ${damageType.toLowerCase()}`} title={`${formattedType} damage`}>
                          <span className="pf-damage-type-text">{formattedType}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Row 2: Resource costs + compact component icons */}
            {(variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (
              <div className="unified-spell-submeta-row">
                {(formatResourceCosts() || spell?.musicalCombo || spell?.specialMechanics?.musicalCombo) && (
                  <div className="unified-spell-resource-costs">
                    {formatResourceCosts()}
                  </div>
                )}

                {/* Compact icon-only component pills (V / S / M / C) — full text shown via popover */}
                {(() => {
                  const compMap = {
                    verbal: {
                      label: 'V',
                      name: 'Verbal Component',
                      key: 'verbalText',
                      icon: 'fa-comment',
                      defaultText: 'Requires spoken incantations or words of power.'
                    },
                    somatic: {
                      label: 'S',
                      name: 'Somatic Component',
                      key: 'somaticText',
                      icon: 'fa-hand-sparkles',
                      defaultText: 'Requires forceful, precise gestures and body movements.'
                    },
                    material: {
                      label: 'M',
                      name: 'Material Component',
                      key: 'materialComponents',
                      icon: 'fa-flask',
                      defaultText: 'Requires physical reagents or an arcane focus.'
                    },
                    concentration: {
                      label: 'C',
                      name: 'Concentration',
                      key: 'concentrationText',
                      icon: 'fa-brain',
                      defaultText: 'Requires active mental focus. Taking damage or casting another concentration spell may break it.'
                    }
                  };

                  let componentsList = [];
                  if (Array.isArray(spell?.resourceCost?.components)) {
                    componentsList = [...spell.resourceCost.components];
                  } else if (Array.isArray(spell?.components)) {
                    componentsList = [...spell.components];
                  }

                  if (spell?.resourceCost?.verbalText && !componentsList.includes('verbal')) {
                    componentsList.push('verbal');
                  }
                  if (spell?.resourceCost?.somaticText && !componentsList.includes('somatic')) {
                    componentsList.push('somatic');
                  }
                  if ((spell?.resourceCost?.materialComponents || spell?.materialComponents) && !componentsList.includes('material')) {
                    componentsList.push('material');
                  }
                  const hasConcentration = componentsList.includes('concentration') ||
                    spell?.requiresConcentration ||
                    spell?.durationConfig?.requiresConcentration ||
                    spell?.resourceCost?.concentration ||
                    spell?.durationType === 'concentration';

                  if (hasConcentration && !componentsList.includes('concentration')) {
                    componentsList.push('concentration');
                  }

                  const pills = componentsList
                    .filter(c => compMap[c])
                    .map((c, i) => {
                      const { label, name, key, icon, defaultText } = compMap[c];
                      const fullText = (spell?.resourceCost && spell.resourceCost[key]) ||
                        spell?.[key] ||
                        (c === 'material' ? (spell?.resourceCost?.materialComponents || spell?.materialComponents) : null) ||
                        defaultText;
                      const isOpen = activeComponentTooltip === c;

                      return (
                        <SpellComponentPill
                          key={i}
                          compKey={c}
                          label={label}
                          name={name}
                          icon={icon}
                          fullText={fullText}
                          isOpen={isOpen}
                          onMouseEnter={() => {
                            if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
                              setActiveComponentTooltip(c);
                            }
                          }}
                          onMouseLeave={() => {
                            if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
                              setActiveComponentTooltip(null);
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveComponentTooltip(prev => prev === c ? null : c);
                          }}
                        />
                      );
                    });

                  return pills.length > 0 ? (
                    <div className="spell-component-pills">{pills}</div>
                  ) : null;
                })()}

                {/* Fallback for variants without details row */}
                {!(variant === 'library' || variant === 'wizard' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (
                  <>
                    {renderTriggerConditionBadge()}
                    {renderPriorityRangeBadge()}
                  </>
                )}
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
                <div className="pf-action-type-badge pf-trigger-role-badge">
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

              {/* Trigger Condition Badge */}
              {renderTriggerConditionBadge()}

              {/* Priority Range Badge */}
              {renderPriorityRangeBadge()}
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
