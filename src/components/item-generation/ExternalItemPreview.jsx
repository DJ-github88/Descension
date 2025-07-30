import React from 'react';
import ReactDOM from 'react-dom';
import ItemTooltip from './ItemTooltip';

// External Item Preview Component that renders outside the item wizard window
const ExternalItemPreview = ({ itemData, windowPosition, windowSize, isOpen }) => {
  // Only show when the wizard is open and we have some item data
  if (!isOpen || !itemData || Object.keys(itemData).length === 0) {
    return null;
  }

  // Calculate position relative to the wizard window
  const wizardWidth = windowSize?.width || 800;
  const wizardX = windowPosition?.x || 150;
  const wizardY = windowPosition?.y || 50;
  const tooltipWidth = 350;

  // Position the tooltip to the right of the wizard window with some spacing
  let tooltipX = wizardX + wizardWidth + 20; // 20px gap from wizard
  const tooltipY = wizardY; // Align with top of wizard

  // Check if tooltip would go off screen, if so position to the left of wizard
  if (tooltipX + tooltipWidth > window.innerWidth - 20) {
    tooltipX = wizardX - tooltipWidth - 20; // Position to the left instead
  }

  // Ensure tooltip doesn't go off the left edge either
  if (tooltipX < 20) {
    tooltipX = 20; // Minimum distance from left edge
  }

  const position = {
    left: `${tooltipX}px`,
    top: `${tooltipY}px`,
    position: 'fixed',
    zIndex: 99999,
    width: `${tooltipWidth}px`,
    maxHeight: 'none',
    overflow: 'visible'
  };

  // Create a complete item object for the tooltip
  const createPreviewItem = () => {
    // Ensure we have a complete item structure for the tooltip
    const previewItem = {
      id: itemData.id || 'preview-item',
      name: itemData.name || 'Unnamed Item',
      quality: itemData.quality || 'common',
      description: itemData.description || '',
      type: itemData.type || 'miscellaneous',
      subtype: itemData.subtype || '',
      
      // Basic properties
      requiredLevel: itemData.requiredLevel || 0,
      stackable: itemData.stackable || false,
      maxStack: itemData.maxStack || 1,
      
      // Size and slot information
      width: itemData.width || 1,
      height: itemData.height || 1,
      slots: itemData.slots || [],
      
      // Stats
      baseStats: itemData.baseStats || {},
      
      // Combat stats
      combatStats: itemData.combatStats || {},
      
      // Weapon specific
      ...(itemData.type === 'weapon' && {
        weaponSlot: itemData.weaponSlot,
        hand: itemData.hand,
        weaponStats: itemData.weaponStats || {}
      }),
      
      // Armor specific
      ...(itemData.type === 'armor' && {
        armorSlot: itemData.armorSlot,
        armorClass: itemData.armorClass || itemData.combatStats?.armorClass || 0,
        offHandType: itemData.offHandType
      }),
      
      // Accessory specific
      ...(itemData.type === 'accessory' && {
        accessorySlot: itemData.accessorySlot
      }),
      
      // Container specific
      ...(itemData.type === 'container' && {
        containerStats: itemData.containerStats || {}
      }),
      
      // Consumable specific
      ...(itemData.type === 'consumable' && {
        consumableStats: itemData.consumableStats || {}
      }),

      // Miscellaneous specific
      ...(itemData.type === 'miscellaneous' && {
        // Junk properties
        junkType: itemData.junkType,
        condition: itemData.condition,
        origin: itemData.origin,
        estimatedValue: itemData.estimatedValue,

        // Reagent properties
        reagentType: itemData.reagentType,
        magicType: itemData.magicType,
        reagentState: itemData.reagentState,
        requiredFor: itemData.requiredFor,
        quantityPerUse: itemData.quantityPerUse,
        preservationMethod: itemData.preservationMethod,
        magicalProperties: itemData.magicalProperties,
        source: itemData.source,

        // Key properties
        keyType: itemData.keyType,
        unlocks: itemData.unlocks,
        location: itemData.location,
        securityLevel: itemData.securityLevel,
        oneTimeUse: itemData.oneTimeUse,
        specialInstructions: itemData.specialInstructions,

        // Quest properties
        questGiver: itemData.questGiver,
        questObjective: itemData.questObjective,
        questObjectives: itemData.questObjectives,
        questReward: itemData.questReward,
        questChain: itemData.questChain,
        timeLimit: itemData.timeLimit,

        // Trade goods properties
        tradeCategory: itemData.tradeCategory,
        origin: itemData.origin,
        demandLevel: itemData.demandLevel,
        qualityGrade: itemData.qualityGrade,
        merchantNotes: itemData.merchantNotes,

        // Crafting properties
        materialType: itemData.materialType,
        professions: itemData.professions,
        gatheringMethod: itemData.gatheringMethod,
        recipes: itemData.recipes,
        sourceLocations: itemData.sourceLocations,
        specialProperties: itemData.specialProperties,
        craftingNotes: itemData.craftingNotes
      }),

      // Value
      value: itemData.value || { gold: 0, silver: 0, copper: 0 },
      
      // Appearance
      iconId: itemData.iconId || '',
      customIconUrl: itemData.customIconUrl || '',
      
      // Utility features
      utilityStats: itemData.utilityStats || {},
      carryingCapacity: itemData.carryingCapacity || 0,
      lightRadius: itemData.lightRadius || 0,
      
      // Chance on hit effects
      chanceOnBeingHit: itemData.chanceOnBeingHit || [],
      
      // Additional properties that might be needed for tooltip rendering
      durability: itemData.durability,
      currentDurability: itemData.currentDurability,
      enchantments: itemData.enchantments || [],
      setBonus: itemData.setBonus,
      
      // Ensure all nested objects exist to prevent errors
      resistances: itemData.combatStats?.resistances || {},
      damageTypes: itemData.combatStats?.damageTypes || {},
      
      // For weapons, ensure weapon stats are properly structured
      ...(itemData.type === 'weapon' && itemData.weaponStats && {
        weaponStats: {
          damage: itemData.weaponStats.damage || { min: 0, max: 0 },
          damageType: itemData.weaponStats.damageType || 'physical',
          critChance: itemData.weaponStats.critChance || 0,
          critMultiplier: itemData.weaponStats.critMultiplier || 2,
          attackSpeed: itemData.weaponStats.attackSpeed || 1,
          range: itemData.weaponStats.range || 1,
          ...itemData.weaponStats
        }
      })
    };

    return previewItem;
  };

  return ReactDOM.createPortal(
    <div style={position}>
      <ItemTooltip item={createPreviewItem()} />
    </div>,
    document.body
  );
};

export default ExternalItemPreview;
