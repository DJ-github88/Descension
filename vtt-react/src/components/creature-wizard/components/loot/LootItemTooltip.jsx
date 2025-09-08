import React from 'react';
import PropTypes from 'prop-types';
import './LootItemTooltip.css';
import { RARITY_COLORS, getQualityColor } from '../../../../constants/itemConstants';

// Helper function to get color based on damage type
const getDamageTypeColor = (damageType) => {
  const damageColors = {
    fire: '#FF4500',
    frost: '#00BFFF',
    arcane: '#DA70D6',
    nature: '#32CD32',
    shadow: '#9370DB',
    holy: '#FFD700',
    physical: '#CD853F',
    poison: '#008000',
    lightning: '#00FFFF',
    necrotic: '#800080',
    radiant: '#FFFF00',
    acid: '#00FF00',
    psychic: '#FF00FF',
    thunder: '#1E90FF',
    force: '#87CEFA',
    bludgeoning: '#A0522D',
    piercing: '#708090',
    slashing: '#B22222'
  };

  return damageColors[damageType?.toLowerCase()] || '#FFFFFF';
};

// Helper function to get icon based on item type
const getItemIcon = (type, subtype) => {
  // Default icons for different item types
  const typeIcons = {
    weapon: 'inv_sword_04',
    armor: 'inv_chest_cloth_01',
    accessory: 'inv_jewelry_ring_01',
    consumable: 'inv_potion_51',
    miscellaneous: 'inv_misc_questionmark',
    material: 'inv_fabric_wool_01',
    quest: 'inv_misc_note_01',
    container: 'inv_box_01'
  };

  // Subtype specific icons
  const subtypeIcons = {
    SWORD: 'inv_sword_04',
    AXE: 'inv_axe_01',
    MACE: 'inv_mace_01',
    DAGGER: 'inv_weapon_shortblade_01',
    STAFF: 'inv_staff_01',
    POLEARM: 'inv_spear_01',
    BOW: 'inv_weapon_bow_01',
    CROSSBOW: 'inv_weapon_crossbow_01',
    WAND: 'inv_wand_01',
    CLOTH: 'inv_chest_cloth_01',
    LEATHER: 'inv_chest_leather_01',
    MAIL: 'inv_chest_mail_01',
    PLATE: 'inv_chest_plate01',
    SHIELD: 'inv_shield_01',
    RING: 'inv_jewelry_ring_01',
    NECKLACE: 'inv_jewelry_necklace_01',
    TRINKET: 'inv_trinket_01',
    CLOAK: 'inv_misc_cape_01',
    BELT: 'inv_belt_01',
    POTION: 'inv_potion_51',
    SCROLL: 'inv_scroll_01',
    FOOD: 'inv_misc_food_01',
    ELIXIR: 'inv_potion_27',
    BANDAGE: 'inv_misc_bandage_01',
    QUEST: 'inv_misc_note_01',
    REAGENT: 'inv_misc_dust_01',
    CRAFTING: 'inv_misc_gem_01',
    TRADE_GOODS: 'inv_fabric_wool_01',
    KEY: 'inv_misc_key_01',
    JUNK: 'inv_misc_bone_01'
  };

  return subtypeIcons[subtype] || typeIcons[type] || 'inv_misc_questionmark';
};

// Helper to get numeric value from stat object
const getStatValue = (stat) => {
  if (!stat) return 0;
  if (typeof stat === 'number') return stat;
  return typeof stat.value === 'number' ? stat.value : 0;
};

// Helper to check if a stat is percentage
const isPercentage = (stat) => {
  if (!stat) return false;
  return stat.isPercentage === true;
};

// Default values based on item quality/rarity
const getDefaultValue = (quality) => {
  switch(quality?.toLowerCase()) {
    case 'legendary': return { gold: 500, silver: 0, copper: 0 };
    case 'epic': return { gold: 100, silver: 0, copper: 0 };
    case 'rare': return { gold: 25, silver: 0, copper: 0 };
    case 'uncommon': return { gold: 5, silver: 0, copper: 0 };
    case 'common': return { gold: 0, silver: 50, copper: 0 };
    case 'poor': return { gold: 0, silver: 5, copper: 0 };
    default: return { gold: 0, silver: 0, copper: 0 };
  }
};

// Helper to format item value
const formatItemValue = (value) => {
  // If no value provided, return a default based on quality
  if (!value) {
    return '0c';
  }

  if (typeof value === 'object') {
    const parts = [];
    if (value.platinum > 0) parts.push(
      <span key="platinum">
        <span style={{ color: '#ffffff' }}>{value.platinum}</span>
        <span style={{ color: '#e5e4e2' }}>p</span>
      </span>
    );
    if (value.gold > 0) parts.push(
      <span key="gold">
        <span style={{ color: '#ffffff' }}>{value.gold}</span>
        <span style={{ color: '#ffd700' }}>g</span>
      </span>
    );
    if (value.silver > 0) parts.push(
      <span key="silver">
        <span style={{ color: '#ffffff' }}>{value.silver}</span>
        <span style={{ color: '#c0c0c0' }}>s</span>
      </span>
    );
    if (value.copper > 0) parts.push(
      <span key="copper">
        <span style={{ color: '#ffffff' }}>{value.copper}</span>
        <span style={{ color: '#cd7f32' }}>c</span>
      </span>
    );
    return parts.length > 0 ? (
      <span>{parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? ' ' : ''}
        </span>
      ))}</span>
    ) : (
      <span>
        <span style={{ color: '#ffffff' }}>0</span>
        <span style={{ color: '#cd7f32' }}>c</span>
      </span>
    );
  }

  if (typeof value === 'string') {
    return value || '0c';
  }

  if (typeof value === 'number') {
    if (value >= 10000) {
      return `${Math.floor(value / 10000)}g ${Math.floor((value % 10000) / 100)}s ${value % 100}c`;
    } else if (value >= 100) {
      return `${Math.floor(value / 100)}s ${value % 100}c`;
    } else if (value > 0) {
      return `${value}c`;
    } else {
      return '0c'; // Default value if zero or negative
    }
  }

  return '0c';
};

const LootItemTooltip = ({ item, dropChance }) => {
  if (!item) return null;

  // Get the quality color for border and text
  const qualityLower = (item.quality || item.rarity || 'common').toLowerCase();
  const qualityColor = getQualityColor(qualityLower);
  const borderColor = RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;

  // Get the appropriate icon
  const iconId = item.iconId || getItemIcon(item.type, item.subtype);

  // Get armor class value
  const armorClassValue = getStatValue(item.armorClass) || getStatValue(item.combatStats?.armorClass) || 0;

  // Get base stats
  const baseStats = Object.entries(item.baseStats || item.stats || {})
    .filter(([_, data]) => getStatValue(data) !== 0)
    .map(([stat, data]) => ({
      name: stat.charAt(0).toUpperCase() + stat.slice(1),
      value: getStatValue(data),
      isPercentage: isPercentage(data)
    }));

  // Get resistances
  const resistances = [];
  if (item.immunities) {
    item.immunities.forEach(type => {
      resistances.push({
        type: type.toLowerCase(),
        text: `Immune to ${type}`,
        value: 0,
        resistanceType: 'immune',
        formatted: `Immune to ${type.toLowerCase()} damage and effects.`
      });
    });
  }
  if (item.combatStats?.resistances) {
    Object.entries(item.combatStats.resistances)
      .filter(([_, data]) => data && (data.resistant || data.immune || data.value > 0))
      .forEach(([type, data]) => {
        const resistValue = data.value || 4;

        if (data.immune) {
          resistances.push({
            type: type.toLowerCase(),
            text: `Immune to ${type}`,
            value: 0,
            resistanceType: 'immune',
            formatted: `Immune to ${type.toLowerCase()} damage and effects.`
          });
        } else if (data.resistant) {
          resistances.push({
            type: type.toLowerCase(),
            text: `Resistant to ${type}`,
            value: resistValue,
            resistanceType: 'resistant',
            formatted: `Resistant to ${type.toLowerCase()} damage and effects.`
          });
        } else if (resistValue > 0) {
          resistances.push({
            type: type.toLowerCase(),
            text: `+${resistValue} ${type} Resistance`,
            value: resistValue,
            resistanceType: 'value',
            formatted: `Decreases ${type.toLowerCase()} damage taken by ${resistValue}%.`
          });
        }
      });
  }
  if (item.resistances) {
    Object.entries(item.resistances).forEach(([type, value]) => {
      resistances.push({
        type: type.toLowerCase(),
        text: `+${value}% ${type} Resistance`,
        value: value,
        resistanceType: 'value',
        formatted: `Decreases ${type.toLowerCase()} damage taken by ${value}%.`
      });
    });
  }

  // Check if item has any effects
  const hasEffects = resistances.length > 0 || (item.onEquip && Object.keys(item.onEquip).length > 0);

  return (
    <div
      className="loot-item-tooltip"
      data-quality={qualityLower}
      style={{
        borderColor: borderColor,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4), 0 0 16px ${borderColor}80`
      }}
    >
      {/* Item Header with Icon and Name */}
      <div className="loot-item-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        {/* Item Icon */}
        <div className="loot-item-icon-container" style={{ marginRight: '10px' }}>
          <img
            src={`https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`}
            alt={item.name}
            className="loot-item-icon"
            style={{ width: '40px', height: '40px', border: `1px solid ${borderColor}` }}
            onError={(e) => {
              e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            }}
          />
        </div>

        {/* Item Name and Type */}
        <div style={{ flex: 1 }}>
          <div
            className={`loot-item-name quality-${qualityLower}`}
            style={{
              fontSize: item.name && item.name.length > 20 ? '18px' : '22px',
              color: qualityColor,
              textShadow: `0 0 5px ${qualityColor}80`
            }}
          >
            {item.name || 'Unknown Item'}
          </div>

          {/* Item Type and Subtype */}
          <div className="loot-item-type">
            {item.type === 'weapon' ? (
              <div style={{
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  {item.weaponSlot === 'TWO_HANDED' ? 'Two-Handed' :
                   item.weaponSlot === 'RANGED' ? 'Ranged' :
                   item.weaponSlot === 'ONE_HANDED' && item.hand === 'OFF_HAND' ? 'Off Hand' :
                   item.weaponSlot === 'ONE_HANDED' && item.hand === 'ONE_HAND' ? 'One Hand' :
                   item.weaponSlot === 'ONE_HANDED' && item.hand === 'MAIN_HAND' ? 'Main Hand' :
                   'Main Hand'}
                </span>
                <span>
                  {item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase() || 'Weapon'}
                </span>
              </div>
            ) : item.type === 'armor' ? (
              <div style={{
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  {item.slots?.[0] === 'off_hand' ? 'Off Hand' :
                   item.slots?.[0]?.split('_').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  ).join(' ') || 'Armor'}
                </span>
                <span>
                  {item.slots?.[0] === 'off_hand' ?
                      (item.offHandType?.charAt(0).toUpperCase() + item.offHandType?.slice(1).toLowerCase()) :
                      (item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase() || 'Armor')}
                </span>
              </div>
            ) : (
              <span>
                {item.type && item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                {item.subtype && ` • ${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1).toLowerCase()}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Weapon Damage */}
      {item.type === 'weapon' && (
        <div style={{ marginBottom: '8px' }}>
          {/* Handle different weapon damage formats */}
          {item.weaponStats?.baseDamage ? (
            <div style={{ color: '#ffffff' }}>
              {item.weaponStats.baseDamage.display?.base ||
                `${item.weaponStats.baseDamage.diceCount || 1}d${item.weaponStats.baseDamage.diceType || 6}`.replace('dd', 'd')}
              {item.weaponStats.baseDamage.bonusDamage > 0 && (
                <span> +{item.weaponStats.baseDamage.bonusDamage}</span>
              )}
              {item.weaponStats.baseDamage.damageType && (
                <span style={{
                  color: getDamageTypeColor(item.weaponStats.baseDamage.damageType.toLowerCase())
                }}> {item.weaponStats.baseDamage.damageType.toLowerCase()} damage</span>
              )}
              {item.weaponStats.baseDamage.bonusDamageType && item.weaponStats.baseDamage.bonusDamageType !== item.weaponStats.baseDamage.damageType && (
                <span style={{
                  color: getDamageTypeColor(item.weaponStats.baseDamage.bonusDamageType?.toLowerCase())
                }}> +{item.weaponStats.baseDamage.bonusDamage || 1} {item.weaponStats.baseDamage.bonusDamageType?.toLowerCase() || 'physical'} damage</span>
              )}
            </div>
          ) : item.damage ? (
            <div style={{ color: '#ffffff' }}>
              {typeof item.damage === 'string' ? item.damage :
               typeof item.damage === 'object' ?
                `${item.damage.diceCount || 1}d${item.damage.diceType || 6}${item.damage.bonus > 0 ? ` +${item.damage.bonus}` : ''}` :
                '1d6'}
              {item.damageType && (
                <span style={{
                  color: getDamageTypeColor(item.damageType.toLowerCase())
                }}> {item.damageType.toLowerCase()} damage</span>
              )}
            </div>
          ) : (
            <div style={{ color: '#ffffff' }}>
              1d6 <span style={{ color: getDamageTypeColor('physical') }}>physical damage</span>
            </div>
          )}

          {/* Display range for weapons */}
          {(item.combatStats?.range || item.range) && (
            <div style={{ color: '#ffffff', marginTop: '4px' }}>
              Range: {item.combatStats?.range?.display ||
                     item.combatStats?.range?.value ? `${item.combatStats.range.value} ft` :
                     item.range ? `${item.range} ft` : '5 ft'}
            </div>
          )}
        </div>
      )}

      {/* Armor */}
      {armorClassValue > 0 && item.type === 'armor' && (
        <div style={{ color: '#ffffff', marginBottom: '8px' }}>
          Armor {armorClassValue}
        </div>
      )}

      {/* Consumable Effects */}
      {item.type === 'consumable' && (
        <div style={{ marginBottom: '8px' }}>
          {/* Immediate Use Effects */}
          {(item.combatStats?.healthRestore || item.healthRestore) && (
            <div style={{ color: '#1eff00', marginBottom: '4px' }}>
              <span style={{ color: '#ffd100' }}>On Immediate Use:</span><br />
              Restore {item.combatStats?.healthRestore?.value || item.combatStats?.healthRestore || item.healthRestore || 0} Health
            </div>
          )}

          {(item.combatStats?.manaRestore || item.manaRestore) && (
            <div style={{ color: '#0070dd', marginBottom: '4px' }}>
              <span style={{ color: '#ffd100' }}>On Immediate Use:</span><br />
              Restore {item.combatStats?.manaRestore?.value || item.combatStats?.manaRestore || item.manaRestore || 0} Mana
            </div>
          )}

          {/* Duration Effects */}
          {(item.utilityStats?.duration || item.duration) && (
            <div style={{ color: '#ffd100', marginBottom: '4px' }}>
              For the duration of {item.utilityStats?.duration?.value || item.duration || 0} {
                (item.utilityStats?.duration?.type === 'ROUNDS' || item.durationType === 'ROUNDS') ? 'rounds' :
                (item.utilityStats?.duration?.type === 'MINUTES' || item.durationType === 'MINUTES') ? 'minutes' :
                'turns'
              } you gain the following:
            </div>
          )}

          {/* Temporary Stat Boosts */}
          {item.baseStats && Object.keys(item.baseStats).length > 0 && (item.utilityStats?.duration || item.duration) && (
            <div style={{ marginLeft: '12px' }}>
              {Object.entries(item.baseStats).map(([statName, statValue]) => {
                const value = getStatValue(statValue);
                return (
                  <div key={statName} style={{ color: '#1eff00' }}>
                    Increases your {statName} by {value}.
                  </div>
                );
              })}
            </div>
          )}

          {/* Other Combat Stat Boosts */}
          {item.combatStats && (
            <div style={{ marginLeft: '12px' }}>
              {item.combatStats.initiative && (
                <div style={{ color: '#1eff00' }}>
                  Increases your Initiative by {getStatValue(item.combatStats.initiative)}.
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Item Stats (if any) */}
      {baseStats.length > 0 && (
        <div className="loot-item-stats">
          {baseStats.map(({ name, value, isPercentage }) => (
            <div key={name} style={{ color: '#ffffff' }}>
              {isPercentage
                ? `+${value}% ${name}`
                : `${value >= 0 ? '+' : ''}${value} ${name}`}
            </div>
          ))}
        </div>
      )}

      {/* On Equip section - show if there are any effects including resistances */}
      {hasEffects && (
        <div style={{
          color: '#ffd100',
          borderBottom: '1px solid #ffffff40',
          margin: '8px 0',
          paddingBottom: '2px'
        }}>
          On Equip:
        </div>
      )}

      {/* Item On Equip Effects */}
      {item.onEquip && Object.keys(item.onEquip).length > 0 && (
        <div className="loot-item-on-equip">
          {Object.entries(item.onEquip).map(([effect, value], index) => (
            <div key={index} className="loot-item-effect">
              {`${value > 0 ? '+' : ''}${value} ${effect.charAt(0).toUpperCase() + effect.slice(1)}`}
            </div>
          ))}
        </div>
      )}

      {/* Item Resistances */}
      {resistances.length > 0 && (
        <div className="loot-item-resistances">
          {resistances.map((resistance, index) => (
            <div key={index} style={{ color: '#1eff00' }}>
              {resistance.resistanceType === 'immune' ? (
                <>
                  Immune to <span style={{
                    color: getDamageTypeColor(resistance.type),
                    textShadow: `0 0 3px ${getDamageTypeColor(resistance.type)}40`
                  }}>{resistance.type}</span> damage and effects.
                </>
              ) : resistance.resistanceType === 'resistant' ? (
                <>
                  Resistant to <span style={{
                    color: getDamageTypeColor(resistance.type),
                    textShadow: `0 0 3px ${getDamageTypeColor(resistance.type)}40`
                  }}>{resistance.type}</span> damage and effects.
                </>
              ) : (
                <>
                  Decreases <span style={{
                    color: getDamageTypeColor(resistance.type),
                    textShadow: `0 0 3px ${getDamageTypeColor(resistance.type)}40`
                  }}>{resistance.type}</span> damage taken by {resistance.value || 4}%.
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Miscellaneous Item Properties */}
      {item.type === 'miscellaneous' && (
        <div style={{ marginTop: '8px', marginBottom: '8px' }}>
          {item.subtype && (
            <div style={{ color: '#ffffff' }}>
              <span style={{ color: '#ffd100' }}>Type:</span>
              {item.subtype.replace('_', ' ').toLowerCase()}
            </div>
          )}
          {item.junkType && (
            <div style={{ color: '#ffffff' }}>
              <span style={{ color: '#ffd100' }}>Category:</span>
              {item.junkType}
            </div>
          )}
          {item.condition && (
            <div style={{ color: '#ffffff' }}>
              <span style={{ color: '#ffd100' }}>Condition:</span>
              {item.condition}
            </div>
          )}
          {item.origin && (
            <div style={{ color: '#ffffff' }}>
              <span style={{ color: '#ffd100' }}>Origin:</span>
              {item.origin}
            </div>
          )}
          {item.material && (
            <div style={{ color: '#ffffff' }}>
              <span style={{ color: '#ffd100' }}>Material:</span>
              {item.material}
            </div>
          )}
          {item.preservation && (
            <div style={{ color: '#ffffff' }}>
              <span style={{ color: '#ffd100' }}>Preservation:</span>
              {item.preservation}
            </div>
          )}
        </div>
      )}

      {/* Item Description */}
      {item.description && (
        <div className="loot-item-description">
          "{item.description}"
        </div>
      )}

      {/* Drop Chance */}
      {dropChance !== undefined && (
        <div className="loot-item-drop-chance">
          Drop Chance: <span>{dropChance}%</span>
        </div>
      )}

      {/* Item Value */}
      <div className="loot-item-value">
        Value: {item.type === 'material' && !item.value
          ? 'No value'
          : (item.value
              ? formatItemValue(item.value)
              : formatItemValue(getDefaultValue(item.quality || item.rarity)))}
      </div>
    </div>
  );
};

LootItemTooltip.propTypes = {
  item: PropTypes.object.isRequired,
  dropChance: PropTypes.number
};

export default LootItemTooltip;
