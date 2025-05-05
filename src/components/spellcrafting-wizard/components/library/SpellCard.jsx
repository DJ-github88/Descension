import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaCopy, FaEye } from 'react-icons/fa';
import { useSpellLibraryDispatch, libraryActionCreators, useSpellLibrary } from '../../context/SpellLibraryContext';
import '../../../spellcrafting-wizard/styles/SpellCard.css';
import '../../styles/SpellCardExtras.css';

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

// Helper function to format chord functions
const formatChordFunction = (chordFunction) => {
  if (!chordFunction) return 'Tonic';

  // Capitalize first letter
  return chordFunction.charAt(0).toUpperCase() + chordFunction.slice(1);
};

// Helper function to get chord function color
const getChordFunctionColor = (chordFunction) => {
  const chordColors = {
    tonic: '#FF5555',
    supertonic: '#FF9955',
    mediant: '#FFFF55',
    subdominant: '#55FF55',
    dominant: '#55FFFF',
    submediant: '#5555FF',
    leadingtone: '#FF55FF',
    octave: '#FFFFFF'
  };

  return chordColors[chordFunction] || '#FFFFFF';
};

// Helper function to format toxic types
const formatToxicType = (toxicType) => {
  if (!toxicType) return 'Disease';

  // Capitalize first letter
  return toxicType.charAt(0).toUpperCase() + toxicType.slice(1);
};

// Helper function to format effect types
const formatEffectType = (effectType) => {
  if (!effectType) return 'Damage';

  // Special cases
  if (effectType === 'hot') return 'Healing Over Time';
  if (effectType === 'shield') return 'Absorption Shield';

  // Capitalize first letter
  return effectType.charAt(0).toUpperCase() + effectType.slice(1);
};

// Helper function to format healing types
const formatHealingType = (healingType) => {
  if (!healingType) return 'Direct';

  switch (healingType) {
    case 'direct': return 'Direct Healing';
    case 'hot': return 'Healing Over Time';
    case 'shield': return 'Absorption Shield';
    default: return healingType.charAt(0).toUpperCase() + healingType.slice(1);
  }
};

const SpellCard = ({
  spell,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  categories,
  onContextMenu
}) => {
  const dispatch = useSpellLibraryDispatch();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const library = useSpellLibrary();

  // Get spell icon based on spell properties
  const getSpellIcon = () => {
    // Check spell effects
    if (spell.effectTypes && spell.effectTypes.length > 0) {
      const primaryEffect = spell.effectTypes[0];

      switch(primaryEffect) {
        case 'damage': return 'fa-fire';
        case 'healing': return 'fa-heart';
        case 'buff': return 'fa-arrow-up';
        case 'debuff': return 'fa-arrow-down';
        case 'utility': return 'fa-magic';
        case 'control': return 'fa-hand-paper';
        case 'summoning': return 'fa-skull';
        case 'transformation': return 'fa-exchange-alt';
        default: return 'fa-star';
      }
    }

    // Fallback to spell type
    switch(spell.spellType) {
      case 'ACTION': return 'fa-bolt';
      case 'CHANNELED': return 'fa-stream';
      case 'PASSIVE': return 'fa-shield-alt';
      case 'REACTION': return 'fa-bolt';
      default: return 'fa-magic';
    }
  };

  // Get category colors
  const getCategoryColors = () => {
    if (!spell.categoryIds || !categories) return [];

    return spell.categoryIds.map(catId => {
      const category = categories.find(c => c.id === catId);
      return category ? category.color : '#808080';
    });
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

  // Handle category toggle
  const handleCategoryToggle = (e, categoryId) => {
    e.stopPropagation();

    const currentCategories = [...(spell.categoryIds || [])];
    const categoryIndex = currentCategories.indexOf(categoryId);

    if (categoryIndex === -1) {
      currentCategories.push(categoryId);
    } else {
      // Don't remove if it's the last category (keep at least one)
      if (currentCategories.length > 1) {
        currentCategories.splice(categoryIndex, 1);
      }
    }

    dispatch(libraryActionCreators.categorizeSpell(spell.id, currentCategories));
  };

  const categoryColors = getCategoryColors();

  return (
    <div
      className={`spell-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      onContextMenu={onContextMenu}
      tabIndex="0"
      role="button"
      aria-selected={isSelected}
    >
      {/* Category color indicators */}
      <div className="spell-card-categories">
        {categoryColors.map((color, index) => (
          <div
            key={index}
            className="spell-card-category-indicator"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Spell icon and level */}
      <div className="spell-card-icon">
        <i className={`fas ${getSpellIcon()}`}></i>
        <div className="spell-card-level">{spell.level || 1}</div>
      </div>

      {/* Spell info */}
      <div className="spell-card-info">
        <h3 className="spell-card-name">{spell.name}</h3>
        <div className="spell-card-type">
          {spell.spellType || "ACTION"}
          {/* No school classification */}
        </div>
      </div>

      {/* Effect type, spell type, and components */}
      <div className="spell-card-tags">
        {spell.effectType && (
          <div className={`spell-card-effect-tag ${spell.effectType}`}>
            {spell.effectType}
          </div>
        )}
        {spell.spellType && (
          <div className={`spell-card-spell-type-tag ${spell.spellType.toLowerCase()}`}>
            {spell.spellType}
          </div>
        )}
        {/* Spell Components */}
        {spell.resourceCost?.components && spell.resourceCost.components.length > 0 && (
          <div className="spell-card-components">
            {spell.resourceCost.components.includes('verbal') && (
              <span className="component-tag" title={spell.resourceCost.verbalText ? spell.resourceCost.verbalText : "Verbal Component"}>V</span>
            )}
            {spell.resourceCost.components.includes('somatic') && (
              <span className="component-tag" title={spell.resourceCost.somaticText ? spell.resourceCost.somaticText : "Somatic Component"}>S</span>
            )}
            {spell.resourceCost.components.includes('material') && (
              <span className="component-tag" title="Material Component">M</span>
            )}
          </div>
        )}
      </div>

      {/* Damage/Healing Value */}
      {(spell.effectType === 'damage' || spell.effectType === 'healing') && (
        <div className={`spell-card-damage-value ${spell.effectType === 'healing' ? 'healing' : 'damage'}`}>
          <span className="damage-label">{spell.effectType === 'damage' ? 'Damage:' : 'Healing:'}</span>
          <span className="damage-amount">
            {spell.resolution === 'DICE' && (
              <span>
                {spell.effectType === 'damage' && spell.primaryDamage?.dice ?
                  `${spell.primaryDamage.dice}${spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : ''}` :
                 spell.effectType === 'healing' && spell.healing?.dice ?
                  `${spell.healing.dice}${spell.healing.flat > 0 ? ` + ${spell.healing.flat}` : ''}` :
                  'Dice-based'}
              </span>
            )}
            {spell.resolution === 'CARDS' && spell.cardConfig?.formula && (
              <span className="formula">{spell.cardConfig.formula}</span>
            )}
            {spell.resolution === 'COINS' && spell.coinConfig?.formula && (
              <span className="formula">{spell.coinConfig.formula}</span>
            )}
            {!((spell.resolution === 'DICE' && spell.primaryDamage?.dice) ||
               (spell.resolution === 'CARDS' && spell.cardConfig?.formula) ||
               (spell.resolution === 'COINS' && spell.coinConfig?.formula)) && (
              <span className="formula">
                {spell.resolution === 'CARDS' ? 'Card-based' :
                 spell.resolution === 'COINS' ? 'Coin-based' :
                 spell.resolution === 'DICE' ? 'Dice-based' : 'Variable'}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Damage Types */}
      {spell.damageTypes && spell.damageTypes.length > 0 && (
        <div className="spell-card-damage-types">
          {spell.damageTypes.map((damageType, index) => (
            <div key={index} className={`spell-card-damage-type ${damageType}`}>
              {damageType.charAt(0).toUpperCase() + damageType.slice(1)}
            </div>
          ))}
        </div>
      )}

      {/* Resolution Method with Details */}
      {(spell.resolution || (spell.tags && (spell.tags.includes('card-based') || spell.tags.includes('coin-based') || spell.tags.includes('dice-based')))) && (
        <div className="spell-card-resolution">
          <div className={`spell-card-resolution-tag ${spell.resolution ? spell.resolution.toLowerCase() :
            spell.tags?.includes('card-based') ? 'cards' :
            spell.tags?.includes('coin-based') ? 'coins' :
            spell.tags?.includes('dice-based') ? 'dice' : 'dice'}`}>
            {(spell.resolution === 'DICE' || (!spell.resolution && spell.tags?.includes('dice-based'))) && (
              <>
                <span className="dice-icon">🎲</span>
                <span>Dice</span>
                {spell.diceConfig?.formula ? (
                  <span className="resolution-formula">{spell.diceConfig.formula}</span>
                ) : spell.primaryDamage?.dice ? (
                  <span className="resolution-formula">{spell.primaryDamage.dice}</span>
                ) : (
                  <span className="resolution-formula">Roll dice</span>
                )}
              </>
            )}
            {(spell.resolution === 'CARDS' || (!spell.resolution && spell.tags?.includes('card-based'))) && (
              <>
                <span className="cards-icon">🃏</span>
                <span>Cards</span>
                {spell.cardConfig?.drawCount ? (
                  <span className="resolution-formula">Draw {spell.cardConfig.drawCount}</span>
                ) : (
                  <span className="resolution-formula">Draw cards</span>
                )}
              </>
            )}
            {(spell.resolution === 'COINS' || (!spell.resolution && spell.tags?.includes('coin-based'))) && (
              <>
                <span className="coins-icon">🪙</span>
                <span>Coins</span>
                {spell.coinConfig?.flipCount ? (
                  <span className="resolution-formula">Flip {spell.coinConfig.flipCount}</span>
                ) : (
                  <span className="resolution-formula">Flip coins</span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Rollable Table */}
      {spell.rollableTable && spell.rollableTable.enabled && (
        <div className="spell-card-rollable-table">
          <div className="spell-card-rollable-table-tag">
            <span className="table-icon">
              {spell.rollableTable.resolutionType === 'DICE' && '🎲'}
              {spell.rollableTable.resolutionType === 'CARDS' && '🃏'}
              {spell.rollableTable.resolutionType === 'COINS' && '🪙'}
            </span>
            <span>Rollable Table</span>
            <span className="table-detail">
              {spell.rollableTable.name || 'Random Effects'}
              {spell.rollableTable.entries?.length > 0 && ` (${spell.rollableTable.entries.length} entries)`}
            </span>
          </div>

          {/* Rollable Table Entries */}
          {spell.rollableTable.entries && spell.rollableTable.entries.length > 0 && (
            <div className="spell-card-rollable-table-entries">
              <table className="mini-rollable-table">
                <thead>
                  <tr>
                    <th>{spell.rollableTable.resolutionType === 'DICE' ? 'Roll' :
                         spell.rollableTable.resolutionType === 'CARDS' ? 'Cards' : 'Coins'}</th>
                    <th>Spell</th>
                  </tr>
                </thead>
                <tbody>
                  {spell.rollableTable.entries.map((entry) => {
                    const referencedSpell = entry.spellReference ?
                      library.spells.find(s => s.id === entry.spellReference) : null;

                    return (
                      <tr key={entry.id}>
                        <td>
                          {spell.rollableTable.resolutionType === 'DICE' &&
                            (entry.range?.min === entry.range?.max ? entry.range?.min : `${entry.range?.min || 1}-${entry.range?.max || 1}`)}
                          {spell.rollableTable.resolutionType === 'CARDS' && entry.cardPattern}
                          {spell.rollableTable.resolutionType === 'COINS' && (
                            entry.coinPattern && entry.coinPattern.startsWith('SEQUENCE_') ?
                            entry.coinPattern.replace('SEQUENCE_', '').split('').join(' ') :
                            entry.coinPattern
                          )}
                        </td>
                        <td>
                          {entry.customName || (referencedSpell ? referencedSpell.name : entry.effect.description)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Critical Hit Mechanics */}
      {(spell.criticalConfig && spell.criticalConfig.enabled) || (spell.tags && (spell.tags.includes('card-based') || spell.tags.includes('coin-based') || spell.tags.includes('dice-based'))) && (
        <div className="spell-card-critical">
          <div className="spell-card-critical-tag">
            <span className="bullseye-icon">🎯</span>
            <span>{spell.criticalConfig?.critOnlyEffect ? 'EFFECT-ONLY CRITICAL' : 'CRITICAL'}</span>
            {/* Check if using rollable table */}
            {spell.criticalConfig?.useRollableTable ? (
              <span className="crit-detail">
                {spell.criticalConfig.critOnlyEffect ? 'Effect-Only: ' : 'On Critical: '}
                {spell.criticalConfig.critType === 'dice'
                  ? 'Roll on '
                  : spell.criticalConfig.critType === 'cards'
                    ? 'Draw on '
                    : spell.criticalConfig.critType === 'coins'
                      ? 'Flip on '
                      : 'Roll on '}
                {spell.rollableTable?.name || 'Table'}
              </span>
            ) : spell.criticalConfig?.critOnlyEffect ? (
              <span className="crit-detail">
                Effect-Only Critical
              </span>
            ) : (
              <>
                {(spell.criticalConfig?.critType === 'dice' || (!spell.criticalConfig && spell.tags?.includes('dice-based'))) && !spell.criticalConfig?.useRollableTable && (
                  <span className="crit-detail">
                    {spell.criticalConfig?.critMultiplier ? `×${spell.criticalConfig.critMultiplier}` : 'x2'}
                    {spell.criticalConfig?.explodingDice ? ' Exploding' : ''}
                  </span>
                )}
                {(spell.criticalConfig?.critType === 'cards' || (!spell.criticalConfig && spell.tags?.includes('card-based'))) && !spell.criticalConfig?.useRollableTable && (
                  <span className="crit-detail">
                    {spell.criticalConfig?.cardCritRule === 'face_cards' ? 'Face Cards' : 'Face Cards'}
                    {spell.criticalConfig?.extraCardDraw ? ` +${spell.criticalConfig.extraCardDraw}` : ' +2'}
                  </span>
                )}
                {(spell.criticalConfig?.critType === 'coins' || (!spell.criticalConfig && spell.tags?.includes('coin-based'))) && !spell.criticalConfig?.useRollableTable && (
                  <span className="crit-detail">
                    {spell.criticalConfig?.coinCritRule === 'all_heads' ? 'All Heads' : 'All Heads'}
                    {spell.criticalConfig?.extraCoinFlips ? ` +${spell.criticalConfig.extraCoinFlips}` : ' +3'}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Mechanics Section */}
      {spell.mechanicsConfig && spell.mechanicsConfig.enabled && (
        <div className="spell-card-mechanics">
          <div className="spell-card-mechanics-header">
            <span className="mechanics-icon">
              {spell.mechanicsConfig.system === 'CHORD_SYSTEM' && '🎵'}
              {spell.mechanicsConfig.system === 'TOXIC_SYSTEM' && '☣️'}
              {spell.mechanicsConfig.system === 'COMBO_POINTS' && '⚔️'}
              {spell.mechanicsConfig.system === 'PROC_SYSTEM' && '✨'}
              {spell.mechanicsConfig.system === 'STATE_REQUIREMENTS' && '📊'}
              {spell.mechanicsConfig.system === 'FORM_SYSTEM' && '🐻'}
            </span>
            <span className="mechanics-title">
              {spell.mechanicsConfig.system === 'CHORD_SYSTEM' && 'Chord System'}
              {spell.mechanicsConfig.system === 'TOXIC_SYSTEM' && 'Toxic System'}
              {spell.mechanicsConfig.system === 'COMBO_POINTS' && 'Combo Points'}
              {spell.mechanicsConfig.system === 'PROC_SYSTEM' && 'Proc System'}
              {spell.mechanicsConfig.system === 'STATE_REQUIREMENTS' && 'State Requirements'}
              {spell.mechanicsConfig.system === 'FORM_SYSTEM' && 'Form System'}
            </span>
          </div>

          {/* Chord System */}
          {spell.mechanicsConfig.system === 'CHORD_SYSTEM' && (
            <div className="mechanics-details">
              {spell.mechanicsConfig.type === 'note' && (
                <div className="chord-note">
                  <span className="chord-function" style={{ color: getChordFunctionColor(spell.mechanicsConfig.chordOptions?.chordFunction) }}>
                    {formatChordFunction(spell.mechanicsConfig.chordOptions?.chordFunction)}
                  </span>
                  <span className="chord-description">Note</span>
                </div>
              )}
              {spell.mechanicsConfig.type === 'chord' && (
                <div className="chord-recipe">
                  <div className="recipe-label">Required Recipe:</div>
                  <div className="recipe-sequence">
                    {spell.mechanicsConfig.chordOptions?.recipeDisplay?.map((chordFunction, index) => (
                      <div key={index} className="recipe-item" style={{ borderColor: chordFunction.color }}>
                        <span style={{ color: chordFunction.color }}>{chordFunction.name}</span>
                      </div>
                    ))}
                  </div>
                  {spell.mechanicsConfig.chordOptions?.graduatedEffects && Object.keys(spell.mechanicsConfig.chordOptions.graduatedEffects).length > 0 && (
                    <div className="graduated-effects">
                      <div className="graduated-label">Partial Consumption Effects:</div>
                      {Object.entries(spell.mechanicsConfig.chordOptions.graduatedEffects)
                        .sort(([countA], [countB]) => parseInt(countA) - parseInt(countB))
                        .map(([count, effect], index) => {
                          // Determine the effect type and display appropriate information
                          const effectType = effect.effectType || 'damage';
                          const effectIcon =
                            effectType === 'damage' ? '🔥' :
                            effectType === 'healing' ? '💚' :
                            effectType === 'hot' ? '💜' :
                            effectType === 'shield' ? '🛡️' :
                            effectType === 'buff' ? '⬆️' :
                            effectType === 'debuff' ? '⬇️' :
                            effectType === 'control' ? '🔒' :
                            effectType === 'summoning' ? '👥' : '✨';

                          return (
                            <div key={index} className="graduated-effect">
                              <span className="count">{count} {parseInt(count) === 1 ? 'Chord' : 'Chords'}:</span>
                              <span className="effect-formula">
                                <span className="effect-type">{effectIcon} {formatEffectType(effectType)}</span>
                                {/* Only show healing formulas for selected healing types */}
                                {effectType === 'healing' && effect.healingType && (
                                  <span className="healing-type">{formatHealingType(effect.healingType)}</span>
                                )}
                                {effect.formula && (
                                  <span className="formula-text">{effect.formula}</span>
                                )}
                                {effect.description && (
                                  <span className="effect-description">{effect.description}</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
              {spell.mechanicsConfig.type === 'wildcard' && (
                <div className="chord-wildcard">
                  <span className="wildcard-icon">🃏</span>
                  <span className="wildcard-description">Wildcard Note (substitutes for any chord function)</span>
                </div>
              )}
              {spell.mechanicsConfig.type === 'extender' && (
                <div className="chord-extender">
                  <span className="extender-icon">⏱️</span>
                  <span className="extender-description">
                    Extends improvisation window by {spell.mechanicsConfig.chordOptions?.extendDuration || 1} rounds
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Toxic System */}
          {spell.mechanicsConfig.system === 'TOXIC_SYSTEM' && (
            <div className="mechanics-details">
              {spell.mechanicsConfig.type === 'toxic_applier' && (
                <div className="toxic-applier">
                  <div className="toxic-types">
                    <span className="toxic-label">Applies:</span>
                    {Object.entries(spell.mechanicsConfig.toxicOptions?.selectedToxicTypes || {}).map(([toxicType, count], index) => (
                      <div key={index} className="toxic-type">
                        <span className="toxic-icon">
                          {toxicType === 'disease' && '🦠'}
                          {toxicType === 'poison' && '☠️'}
                          {toxicType === 'curse' && '👻'}
                          {toxicType === 'venom' && '🕷️'}
                        </span>
                        <span className="toxic-name">{formatToxicType(toxicType)}</span>
                        {count > 1 && <span className="toxic-count">×{count}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="toxic-duration">
                    Duration: {spell.mechanicsConfig.toxicOptions?.duration || 3} {spell.mechanicsConfig.toxicOptions?.durationType || 'rounds'}
                  </div>
                </div>
              )}
              {spell.mechanicsConfig.type === 'toxic_consumer' && (
                <div className="toxic-consumer">
                  <div className="consumption-rule">
                    <span className="consumption-label">Consumes:</span>
                    {spell.mechanicsConfig.toxicOptions?.consumptionRule === 'all' ? (
                      <span className="consumption-all">All toxics</span>
                    ) : (
                      <div className="toxic-types">
                        {Object.entries(spell.mechanicsConfig.toxicOptions?.selectedToxicTypes || {}).map(([toxicType, count], index) => (
                          <div key={index} className="toxic-type">
                            <span className="toxic-icon">
                              {toxicType === 'disease' && '🦠'}
                              {toxicType === 'poison' && '☠️'}
                              {toxicType === 'curse' && '👻'}
                              {toxicType === 'venom' && '🕷️'}
                            </span>
                            <span className="toxic-name">{formatToxicType(toxicType)}</span>
                            {count > 1 && <span className="toxic-count">×{count}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {spell.mechanicsConfig.toxicOptions?.toxicEffects && Object.keys(spell.mechanicsConfig.toxicOptions.toxicEffects).length > 0 && (
                    <div className="toxic-effects">
                      <div className="effects-label">Consumption Effects:</div>
                      {Object.entries(spell.mechanicsConfig.toxicOptions.toxicEffects).map(([toxicType, effect], index) => {
                        // Determine the effect type and display appropriate information
                        const effectType = effect.effectType || 'damage';
                        const effectIcon =
                          effectType === 'damage' ? '🔥' :
                          effectType === 'healing' ? '💚' :
                          effectType === 'hot' ? '💜' :
                          effectType === 'shield' ? '🛡️' :
                          effectType === 'buff' ? '⬆️' :
                          effectType === 'debuff' ? '⬇️' :
                          effectType === 'control' ? '🔒' :
                          effectType === 'summoning' ? '👥' : '✨';

                        return (
                          <div key={index} className="toxic-effect">
                            <span className="toxic-icon">
                              {toxicType === 'disease' && '🦠'}
                              {toxicType === 'poison' && '☠️'}
                              {toxicType === 'curse' && '👻'}
                              {toxicType === 'venom' && '🕷️'}
                            </span>
                            <span className="toxic-name">{formatToxicType(toxicType)}:</span>
                            <span className="effect-formula">
                              <span className="effect-type">{effectIcon} {formatEffectType(effectType)}</span>
                              {effect.formula && (
                                <span className="formula-text">{effect.formula}</span>
                              )}
                              {effect.description && (
                                <span className="effect-description">{effect.description}</span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Graduated Effects for Toxic System */}
                  {spell.mechanicsConfig.toxicOptions?.graduatedEffects && Object.keys(spell.mechanicsConfig.toxicOptions.graduatedEffects).length > 0 && (
                    <div className="graduated-effects">
                      <div className="graduated-label">Partial Consumption Effects:</div>
                      {Object.entries(spell.mechanicsConfig.toxicOptions.graduatedEffects)
                        .sort(([countA], [countB]) => parseInt(countA) - parseInt(countB))
                        .map(([count, effect], index) => {
                          // Determine the effect type and display appropriate information
                          const effectType = effect.effectType || 'damage';
                          const effectIcon =
                            effectType === 'damage' ? '🔥' :
                            effectType === 'healing' ? '💚' :
                            effectType === 'hot' ? '💜' :
                            effectType === 'shield' ? '🛡️' :
                            effectType === 'buff' ? '⬆️' :
                            effectType === 'debuff' ? '⬇️' :
                            effectType === 'control' ? '🔒' :
                            effectType === 'summoning' ? '👥' : '✨';

                          return (
                            <div key={index} className="graduated-effect">
                              <span className="count">{count} {parseInt(count) === 1 ? 'Toxic' : 'Toxics'}:</span>
                              <span className="effect-formula">
                                <span className="effect-type">{effectIcon} {formatEffectType(effectType)}</span>
                                {effect.formula && (
                                  <span className="formula-text">{effect.formula}</span>
                                )}
                                {effect.description && (
                                  <span className="effect-description">{effect.description}</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* State Requirements */}
          {spell.mechanicsConfig.system === 'STATE_REQUIREMENTS' && (
            <div className="mechanics-details">
              <div className="state-requirement">
                <span className="requirement-label">Requires:</span>
                <span className="requirement-value">
                  {spell.mechanicsConfig.type === 'health_threshold' && (
                    <>
                      Health {spell.mechanicsConfig.thresholdOperator || '<'}
                      {spell.mechanicsConfig.thresholdValue || 50}{spell.mechanicsConfig.isPercentage ? '%' : ''}
                    </>
                  )}
                  {spell.mechanicsConfig.type === 'mana_threshold' && (
                    <>
                      Mana {spell.mechanicsConfig.thresholdOperator || '>'}
                      {spell.mechanicsConfig.thresholdValue || 30}{spell.mechanicsConfig.isPercentage ? '%' : ''}
                    </>
                  )}
                  {spell.mechanicsConfig.type === 'resource_threshold' && (
                    <>
                      {spell.mechanicsConfig.resourceType || 'Resource'} {spell.mechanicsConfig.thresholdOperator || '>'}
                      {spell.mechanicsConfig.thresholdValue || 50}{spell.mechanicsConfig.isPercentage ? '%' : ''}
                    </>
                  )}
                </span>
              </div>
              {spell.mechanicsConfig.originalFormula && spell.mechanicsConfig.updatedFormula && (
                <div className="formula-update">
                  <div className="original-formula">
                    <span className="formula-label">Base:</span>
                    <span className="formula-value">{spell.mechanicsConfig.originalFormula}</span>
                  </div>
                  <div className="updated-formula">
                    <span className="formula-label">When Active:</span>
                    <span className="formula-value">{spell.mechanicsConfig.updatedFormula}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stat Bonuses */}
      {spell.buffConfig && spell.buffConfig.statBonuses && spell.buffConfig.statBonuses.length > 0 && (
        <div className="spell-card-stat-bonuses">
          <div className="spell-card-stat-header">Bonuses:</div>
          {spell.buffConfig.statBonuses.map((bonus, index) => (
            <div key={index} className="spell-card-stat-bonus">
              <span className="stat-name">{formatStatName(bonus.stat)}</span>
              <span className="stat-value">
                {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="spell-card-actions">
        <button
          className="spell-card-action-btn category-btn"
          aria-label="Manage categories"
          onClick={(e) => {
            e.stopPropagation();
            setShowCategoryMenu(!showCategoryMenu);
          }}
        >
          <i className="fas fa-tags"></i>
        </button>

        <button
          className="spell-card-action-btn edit-btn"
          aria-label="Edit spell"
          onClick={(e) => {
            e.stopPropagation();
            // Navigate to spell editor with this spell
            console.log('Edit spell', spell.id);
          }}
        >
          <i className="fas fa-edit"></i>
        </button>

        <button
          className="spell-card-action-btn duplicate-btn"
          aria-label="Duplicate spell"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <i className="fas fa-copy"></i>
        </button>

        <button
          className="spell-card-action-btn delete-btn"
          aria-label="Delete spell"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>

      {/* Category dropdown menu */}
      {showCategoryMenu && (
        <div
          className="spell-card-category-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="category-menu-header">
            <h4>Categories</h4>
            <button
              className="close-menu-btn"
              onClick={() => setShowCategoryMenu(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="category-menu-options">
            {categories.map(category => (
              <label key={category.id} className="category-menu-option">
                <input
                  type="checkbox"
                  checked={spell.categoryIds?.includes(category.id) || false}
                  onChange={(e) => handleCategoryToggle(e, category.id)}
                />
                <span className="category-color" style={{ backgroundColor: category.color }}></span>
                <span className="category-name">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Last modified date in tooltip */}
      <div className="spell-card-last-modified" title={`Last modified: ${new Date(spell.lastModified).toLocaleString()}`}>
        {spell.lastModified && (
          <i className="fas fa-clock"></i>
        )}
      </div>
    </div>
  );
};

SpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  categories: PropTypes.array,
  onContextMenu: PropTypes.func
};

export default SpellCard;