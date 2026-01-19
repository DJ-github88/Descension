import React from 'react';
import ReactDOM from 'react-dom';
import useItemStore from '../../store/itemStore';
import useSettingsStore from '../../store/settingsStore';
import { SKILL_LEVELS, PROFESSIONS } from '../../store/craftingStore';
import '../../styles/item-tooltip.css';

// External Recipe Preview Component that renders outside the recipe wizard window
const ExternalRecipePreview = ({ recipeData, windowPosition, windowSize, isOpen }) => {
  const { items: itemLibrary } = useItemStore();
  const windowScale = useSettingsStore(state => state.windowScale);

  // Only show when the wizard is open and we have some recipe data
  if (!isOpen || !recipeData || Object.keys(recipeData).length === 0) {
    return null;
  }

  // Calculate position with fallback values and live updates - REACTIVE
  const wizardWidth = (windowSize?.width || 800) * windowScale;
  const wizardX = windowPosition?.x || ((window.innerWidth - 800) / 2);
  const wizardY = windowPosition?.y || ((window.innerHeight - 600) / 2);

  const position = {
    left: wizardX + wizardWidth + 15, // Small gap from recipe wizard
    top: wizardY + 60, // Aligned with content area
    position: 'fixed',
    zIndex: 99999,
    width: '350px',
    maxHeight: 'none',
    overflow: 'visible'
  };

  // Helper functions
  const getQualityColor = (quality) => {
    const colors = {
      common: '#ffffff',
      uncommon: '#1eff00',
      rare: '#0070dd',
      epic: '#a335ee',
      legendary: '#ff8000',
      artifact: '#e6cc80'
    };
    return colors[quality?.toLowerCase()] || colors.common;
  };

  const formatCurrency = (value) => {
    if (!value) return '0c';

    const { platinum = 0, gold = 0, silver = 0, copper = 0 } = value;
    const parts = [];

    if (platinum > 0) parts.push(`${platinum}p`);
    if (gold > 0) parts.push(`${gold}g`);
    if (silver > 0) parts.push(`${silver}s`);
    if (copper > 0) parts.push(`${copper}c`);

    return parts.join(' ') || '0c';
  };

  const getStatValue = (stat) => {
    if (typeof stat === 'object' && stat !== null) {
      return stat.value || stat.amount || 0;
    }
    return stat || 0;
  };

  // Damage type colors matching ItemTooltip
  const damageTypeColors = {
    acid: '#32CD32',
    bludgeoning: '#8B4513',
    cold: '#87CEEB',
    fire: '#FF4500',
    force: '#ff66ff',
    lightning: '#FFD700',
    necrotic: '#4B0082',
    piercing: '#C0C0C0',
    poison: '#008000',
    psychic: '#FF69B4',
    radiant: '#FFFACD',
    slashing: '#A52A2A',
    thunder: '#0066ff'
  };

  const getCraftingTimeText = (milliseconds) => {
    const seconds = milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      const remainingHours = hours % 24;
      if (remainingHours > 0) {
        return `${days}d ${remainingHours}h`;
      }
      return `${days}d`;
    }

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      if (remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${hours}h`;
    }

    if (minutes > 0) {
      const remainingSeconds = Math.floor(seconds % 60);
      if (remainingSeconds > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${minutes}m`;
    }

    return `${Math.floor(seconds)} sec`;
  };

  // Get data for the tooltip
  const resultItem = itemLibrary.find(item => item.id === recipeData.resultItemId);
  const skillLevel = Object.values(SKILL_LEVELS).find(s => s.level === (recipeData.requiredLevel || 0));

  // Get recipe quality for styling
  const recipeQuality = recipeData.quality || 'common';
  const recipeQualityLower = recipeQuality.toLowerCase();

  return ReactDOM.createPortal(
    <div style={{
      ...position,
      transform: `scale(${windowScale})`,
      transformOrigin: 'top left'
    }}>
      <div className="item-tooltip" data-quality={recipeQualityLower}>
        {/* Recipe Name - Always prefixed with "Recipe: " */}
        <div className="item-name" style={{
          color: getQualityColor(recipeQuality),
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '6px'
        }}>
          Recipe: {recipeData.name || 'Unnamed Recipe'}
        </div>

        {/* Profession Requirements */}
        <div style={{ color: '#ff6b6b', fontSize: '11px', marginBottom: '6px' }}>
          Requires {recipeData.profession ?
            PROFESSIONS[recipeData.profession]?.name || recipeData.profession.charAt(0).toUpperCase() + recipeData.profession.slice(1) :
            'Alchemy'} ({skillLevel?.name || 'Untrained'})
        </div>

        {/* Category */}
        <div style={{ color: '#ffffff', fontSize: '11px', marginBottom: '6px' }}>
          Recipe {recipeData.quality ? recipeData.quality.charAt(0).toUpperCase() + recipeData.quality.slice(1) : 'Uncommon'}
        </div>

        {/* Thematic Line 1 - only show if result item is selected */}
        {resultItem && (
          <div style={{ color: '#00ff00', fontSize: '11px', marginBottom: '3px', fontStyle: 'italic' }}>
            Use: Teaches you how to make{' '}
            <span style={{ color: getQualityColor(resultItem.quality), fontWeight: 'bold' }}>
              {resultItem.name}
            </span>.
          </div>
        )}

        {/* Sell Price */}
        <div style={{ color: '#ffffff', fontSize: '11px', marginBottom: '6px' }}>
          Sell Price: {formatCurrency({ silver: Math.floor((recipeData.requiredLevel || 0) * 2.5) + 50 })}
        </div>

        {/* Thematic Line 2 */}
        {resultItem && (
          <div style={{ color: '#ffd100', fontSize: '10px', marginBottom: '6px', fontStyle: 'italic' }}>
            ────────────────────────────
          </div>
        )}

        {/* Result Item Section - only show if item is selected */}
        {resultItem && (
          <>
            {/* Result Item Name */}
            <div style={{
              color: getQualityColor(resultItem.quality),
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              {recipeData.resultQuantity > 1 ? `${recipeData.resultQuantity}x ` : ''}{resultItem.name}
            </div>

            {/* Item Type/Slot - Match ItemTooltip format exactly */}
            {resultItem.type === 'weapon' ? (
              <div style={{
                color: '#ffffff',
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span>
                  {resultItem.weaponSlot === 'TWO_HANDED' ? 'Two-Handed' :
                    resultItem.weaponSlot === 'RANGED' ? 'Ranged' :
                      resultItem.weaponSlot === 'ONE_HANDED' && resultItem.hand === 'OFF_HAND' ? 'Off Hand' :
                        resultItem.weaponSlot === 'ONE_HANDED' && resultItem.hand === 'ONE_HAND' ? 'One Hand' :
                          resultItem.weaponSlot === 'ONE_HANDED' && resultItem.hand === 'MAIN_HAND' ? 'Main Hand' :
                            'Main Hand'}
                </span>
                <span>
                  {resultItem.subtype ? resultItem.subtype.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  ).join(' ') : ''}
                </span>
              </div>
            ) : resultItem?.type === 'armor' ? (
              <div style={{
                color: '#ffffff',
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span>
                  {resultItem.slots?.[0] === 'off_hand' ? 'Off Hand' :
                    resultItem.slots?.[0]?.split('_').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')}
                </span>
                <span>
                  {resultItem.slots?.[0] === 'off_hand' ?
                    (resultItem.offHandType?.charAt(0).toUpperCase() + resultItem.offHandType?.slice(1).toLowerCase()) :
                    (resultItem.subtype?.charAt(0).toUpperCase() + resultItem.subtype?.slice(1).toLowerCase())}
                </span>
              </div>
            ) : resultItem?.type === 'consumable' ? (
              <div style={{
                color: '#ffffff',
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span>Consumable</span>
                <span>
                  {resultItem.subtype?.charAt(0).toUpperCase() + resultItem.subtype?.slice(1).toLowerCase() || 'Potion'}
                </span>
              </div>
            ) : resultItem?.type ? (
              <div style={{ color: '#ffffff', fontSize: '12px', marginBottom: '4px' }}>
                {resultItem.type.charAt(0).toUpperCase() + resultItem.type.slice(1)}
                {resultItem.subtype && ` • ${resultItem.subtype.charAt(0).toUpperCase() + resultItem.subtype.slice(1).toLowerCase()}`}
              </div>
            ) : null}

            {/* Weapon Damage - Match ItemTooltip format exactly */}
            {resultItem?.type === 'weapon' && resultItem.weaponStats && (
              <div style={{ marginBottom: '8px' }}>
                {resultItem.weaponStats.baseDamage && (
                  <div style={{ color: '#ffffff', fontSize: '12px' }}>
                    {resultItem.weaponStats.baseDamage.display?.base ||
                      `${resultItem.weaponStats.baseDamage.diceCount}d${resultItem.weaponStats.baseDamage.diceType}`.replace('dd', 'd')}
                    {resultItem.weaponStats.baseDamage.damageType && (
                      <span style={{
                        color: damageTypeColors[resultItem.weaponStats.baseDamage.damageType.toLowerCase()] || '#ffffff'
                      }}>
                        {' '}{resultItem.weaponStats.baseDamage.damageType.toLowerCase()} damage
                      </span>
                    )}
                    {resultItem.weaponStats.baseDamage.bonusDamage > 0 && (
                      <>
                        <span> +{resultItem.weaponStats.baseDamage.bonusDamage}</span>
                        <span style={{
                          color: damageTypeColors[resultItem.weaponStats.baseDamage.bonusDamageType?.toLowerCase()] || '#ffffff'
                        }}>
                          {' '}{resultItem.weaponStats.baseDamage.bonusDamageType?.toLowerCase() || 'force'} damage
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Base Stats */}
            {resultItem?.baseStats && Object.keys(resultItem.baseStats).length > 0 && (
              <div style={{ marginBottom: '4px' }}>
                {Object.entries(resultItem.baseStats).map(([stat, value]) => {
                  const statValue = getStatValue(value);
                  if (statValue === 0) return null;
                  return (
                    <div key={stat} style={{ color: '#ffffff', fontSize: '12px' }}>
                      {statValue > 0 ? '+' : ''}{statValue} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Consumable Effects */}
            {resultItem?.type === 'consumable' && (
              <>
                {getStatValue(resultItem?.combatStats?.healthRestore) > 0 && (
                  <div style={{ color: '#00ff00', fontSize: '12px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 'bold' }}>Use:</span> Restores {getStatValue(resultItem.combatStats.healthRestore)} Health
                  </div>
                )}
                {getStatValue(resultItem?.combatStats?.manaRestore) > 0 && (
                  <div style={{ color: '#00ff00', fontSize: '12px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 'bold' }}>Use:</span> Restores {getStatValue(resultItem.combatStats.manaRestore)} Mana
                  </div>
                )}
              </>
            )}

            {/* Result Item Description - Match ItemTooltip format with quotes and italic */}
            {resultItem?.description && (
              <div style={{
                color: '#1eff00',
                fontSize: '12px',
                marginBottom: '4px',
                fontStyle: 'italic'
              }}>
                "{resultItem.description}"
              </div>
            )}

            {/* Max Stack */}
            {resultItem?.maxStackSize && resultItem.maxStackSize > 1 && (
              <div style={{ color: '#ffffff', fontSize: '12px', marginBottom: '4px' }}>
                Max Stack: {resultItem.maxStackSize}
              </div>
            )}

            {/* Sell Price */}
            {resultItem && (
              <div style={{ color: '#ffffff', fontSize: '12px', marginBottom: '8px' }}>
                Sell Price: {formatCurrency(resultItem.value || { silver: 50 })}
              </div>
            )}

            {/* Thematic Line 3 */}
            {resultItem && (
              <div style={{ color: '#ffd100', fontSize: '12px', marginBottom: '8px', fontStyle: 'italic' }}>
                ────────────────────────────
              </div>
            )}
          </>
        )}

        {/* Required Materials - Compact inline format */}
        <div style={{
          color: '#ffd100',
          fontWeight: 'bold',
          fontSize: '11px',
          marginBottom: '4px',
          textAlign: 'left'
        }}>
          Required Materials:
        </div>
        <div style={{
          marginLeft: '4px',
          fontSize: '11px',
          lineHeight: '1.4',
          marginBottom: '6px'
        }}>
          {(recipeData.materials || []).map((material, index) => {
            const materialItem = itemLibrary.find(i => i.id === material.itemId);
            return (
              <div key={index} style={{ marginBottom: '2px' }}>
                <span style={{
                  color: getQualityColor(materialItem?.quality),
                  fontWeight: 'normal'
                }}>
                  {material.quantity}x {materialItem?.name || 'Unknown Material'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Thematic Line 4 */}
        <div style={{ color: '#ffd100', fontSize: '10px', marginTop: '6px', marginBottom: '4px', fontStyle: 'italic' }}>
          ────────────────────────────
        </div>

        {/* Crafting Time and Experience - Compact inline */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '4px',
          fontSize: '11px'
        }}>
          {recipeData.craftingTime && recipeData.craftingTime > 0 && (
            <div style={{ color: '#00ff00' }}>
              <span style={{ fontWeight: 'bold' }}>Time:</span> {getCraftingTimeText(recipeData.craftingTime)}
            </div>
          )}
          {recipeData.experienceGained && recipeData.experienceGained > 0 && (
            <div style={{ color: '#00ff00' }}>
              <span style={{ fontWeight: 'bold' }}>XP:</span> {recipeData.experienceGained}
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{
          color: '#ffd100',
          fontSize: '11px',
          fontStyle: 'italic',
          marginTop: '4px',
          lineHeight: '1.3'
        }}>
          {recipeData.description || (resultItem ? `A scroll containing the formula for brewing ${resultItem.name}. Right-click to learn.` : 'A recipe scroll. Right-click to learn.')}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ExternalRecipePreview;
