import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import SimpleCreatureTooltip from './SimpleCreatureTooltip';
import useCreatureStore from '../../../../store/creatureStore';
import useGameStore from '../../../../store/gameStore';

// External Creature Preview Component that renders outside the creature wizard window
const ExternalCreaturePreview = ({ creatureData, isOpen, activeView }) => {
  const { windowPosition, windowSize } = useCreatureStore();
  const windowScale = useGameStore(state => state.windowScale);

  // Only show when the wizard is open, we have creature data, AND we're in wizard/create mode (not library)
  if (!isOpen || !creatureData || Object.keys(creatureData).length === 0 || activeView === 'library') {
    return null;
  }

  // Calculate position with fallback values and live updates - REACTIVE
  const wizardWidth = (windowSize?.width || 1200) * windowScale;
  const wizardX = windowPosition?.x || ((window.innerWidth - 1200) / 2);
  const wizardY = windowPosition?.y || ((window.innerHeight - 800) / 2);

  // Debug logging
  console.log('ExternalCreaturePreview positioning:', {
    windowPosition,
    windowSize,
    windowScale,
    wizardWidth,
    wizardX,
    wizardY,
    calculatedLeft: wizardX + wizardWidth + 15
  });

  const position = {
    left: wizardX + wizardWidth + 15, // Small gap from creature wizard
    top: wizardY + 60, // Aligned with content area
    position: 'fixed',
    zIndex: 99999,
    width: '300px',
    maxHeight: 'none',
    overflow: 'visible'
  };

  // Create a complete creature object for the tooltip using real-time data
  const createPreviewCreature = useMemo(() => {
    // Ensure we have a complete creature structure for the tooltip
    const previewCreature = {
      id: creatureData.id || 'preview-creature',
      name: creatureData.name || 'Unnamed Creature',
      description: creatureData.description || '',
      type: creatureData.type || 'humanoid',
      size: creatureData.size || 'medium',
      tags: creatureData.tags || [],
      tokenIcon: creatureData.tokenIcon || 'inv_misc_questionmark',
      tokenBorder: creatureData.tokenBorder || '#ffffff',
      
      // Statistics
      stats: {
        // Base attributes
        strength: creatureData.stats?.strength || 10,
        agility: creatureData.stats?.agility || 10,
        constitution: creatureData.stats?.constitution || 10,
        intelligence: creatureData.stats?.intelligence || 10,
        spirit: creatureData.stats?.spirit || 10,
        charisma: creatureData.stats?.charisma || 10,

        // Derived stats
        maxHp: creatureData.stats?.maxHp || 100,
        currentHp: creatureData.stats?.currentHp || creatureData.stats?.maxHp || 100,
        maxMana: creatureData.stats?.maxMana || 50,
        currentMana: creatureData.stats?.currentMana || creatureData.stats?.maxMana || 50,
        maxActionPoints: creatureData.stats?.maxActionPoints || 6,
        currentActionPoints: creatureData.stats?.currentActionPoints || creatureData.stats?.maxActionPoints || 6,
        armorClass: creatureData.stats?.armorClass || 15,
        armor: creatureData.stats?.armor || creatureData.stats?.armorClass || 15, // For tooltip compatibility
        initiative: creatureData.stats?.initiative || 2,
        
        // Movement
        speed: creatureData.stats?.speed || 30,
        flying: creatureData.stats?.flying || 0,
        swimming: creatureData.stats?.swimming || 15,

        // Vision
        sightRange: creatureData.stats?.sightRange || 60,
        darkvision: creatureData.stats?.darkvision || 0,

        // Combat stats
        criticalChance: creatureData.stats?.criticalChance || 5,
        criticalMultiplier: creatureData.stats?.criticalMultiplier || 2,

        // Challenge rating (if available)
        challengeRating: creatureData.stats?.challengeRating || null,
        experiencePoints: creatureData.stats?.experiencePoints || null
      },

      // Resistances and vulnerabilities
      resistances: creatureData.resistances || {},
      vulnerabilities: creatureData.vulnerabilities || {},

      // Abilities
      abilities: creatureData.abilities || [],

      // Loot table
      lootTable: creatureData.lootTable || {
        currency: {
          gold: { min: 0, max: 0 },
          silver: { min: 0, max: 0 },
          copper: { min: 0, max: 0 }
        },
        items: []
      },

      // Shopkeeper properties
      isShopkeeper: creatureData.isShopkeeper || false,
      shopInventory: creatureData.shopInventory || {
        items: [],
        restockOnLongRest: false,
        shopName: '',
        shopDescription: '',
        buyRates: {
          default: 30,
          categories: {
            weapon: 50,
            armor: 50,
            consumable: 50,
            accessory: 45,
            container: 40,
            miscellaneous: 35
          }
        }
      }
    };

    return previewCreature;
  }, [creatureData]);

  return ReactDOM.createPortal(
    <div style={{
      ...position,
      transform: `scale(${windowScale})`,
      transformOrigin: 'top left'
    }}>
      <SimpleCreatureTooltip creature={createPreviewCreature} />
    </div>,
    document.body
  );
};

export default ExternalCreaturePreview;
