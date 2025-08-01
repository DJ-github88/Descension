import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import SimpleCreatureTooltip from './SimpleCreatureTooltip';
import useCreatureStore from '../../../../store/creatureStore';

// External Creature Preview Component that renders outside the creature wizard window
const ExternalCreaturePreview = ({ creatureData, isOpen }) => {
  const { windowPosition, windowSize } = useCreatureStore();
  const [debouncedCreatureData, setDebouncedCreatureData] = useState(creatureData);

  // Debounce creature data updates to prevent constant re-rendering while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCreatureData(creatureData);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [creatureData]);

  // Only show when the wizard is open and we have some creature data
  if (!isOpen || !debouncedCreatureData || Object.keys(debouncedCreatureData).length === 0) {
    return null;
  }

  // Calculate position with fallback values
  const wizardWidth = windowSize?.width || 1200;
  const wizardX = windowPosition?.x || ((window.innerWidth - 1200) / 2);
  const wizardY = windowPosition?.y || ((window.innerHeight - 800) / 2);

  const position = {
    left: wizardX + wizardWidth + 10, // Position to the right of the wizard
    top: wizardY + 60, // Align with wizard content area
    position: 'fixed',
    zIndex: 99999,
    width: '300px',
    maxHeight: 'none',
    overflow: 'visible'
  };

  // Create a complete creature object for the tooltip using debounced data
  const createPreviewCreature = useMemo(() => {
    // Ensure we have a complete creature structure for the tooltip
    const previewCreature = {
      id: debouncedCreatureData.id || 'preview-creature',
      name: debouncedCreatureData.name || 'Unnamed Creature',
      description: debouncedCreatureData.description || '',
      type: debouncedCreatureData.type || 'humanoid',
      size: debouncedCreatureData.size || 'medium',
      tags: debouncedCreatureData.tags || [],
      tokenIcon: debouncedCreatureData.tokenIcon || 'inv_misc_questionmark',
      tokenBorder: debouncedCreatureData.tokenBorder || '#ffffff',
      
      // Statistics
      stats: {
        // Base attributes
        strength: debouncedCreatureData.stats?.strength || 10,
        agility: debouncedCreatureData.stats?.agility || 10,
        constitution: debouncedCreatureData.stats?.constitution || 10,
        intelligence: debouncedCreatureData.stats?.intelligence || 10,
        spirit: debouncedCreatureData.stats?.spirit || 10,
        charisma: debouncedCreatureData.stats?.charisma || 10,

        // Derived stats
        maxHp: debouncedCreatureData.stats?.maxHp || 100,
        currentHp: debouncedCreatureData.stats?.currentHp || debouncedCreatureData.stats?.maxHp || 100,
        maxMana: debouncedCreatureData.stats?.maxMana || 50,
        currentMana: debouncedCreatureData.stats?.currentMana || debouncedCreatureData.stats?.maxMana || 50,
        maxActionPoints: debouncedCreatureData.stats?.maxActionPoints || 6,
        currentActionPoints: debouncedCreatureData.stats?.currentActionPoints || debouncedCreatureData.stats?.maxActionPoints || 6,
        armorClass: debouncedCreatureData.stats?.armorClass || 15,
        armor: debouncedCreatureData.stats?.armor || debouncedCreatureData.stats?.armorClass || 15, // For tooltip compatibility
        initiative: debouncedCreatureData.stats?.initiative || 2,
        
        // Movement
        speed: debouncedCreatureData.stats?.speed || 30,
        flying: debouncedCreatureData.stats?.flying || 0,
        swimming: debouncedCreatureData.stats?.swimming || 15,

        // Vision
        sightRange: debouncedCreatureData.stats?.sightRange || 60,
        darkvision: debouncedCreatureData.stats?.darkvision || 0,

        // Combat stats
        criticalChance: debouncedCreatureData.stats?.criticalChance || 5,
        criticalMultiplier: debouncedCreatureData.stats?.criticalMultiplier || 2,

        // Challenge rating (if available)
        challengeRating: debouncedCreatureData.stats?.challengeRating || null,
        experiencePoints: debouncedCreatureData.stats?.experiencePoints || null
      },

      // Resistances and vulnerabilities
      resistances: debouncedCreatureData.resistances || {},
      vulnerabilities: debouncedCreatureData.vulnerabilities || {},

      // Abilities
      abilities: debouncedCreatureData.abilities || [],

      // Loot table
      lootTable: debouncedCreatureData.lootTable || {
        currency: {
          gold: { min: 0, max: 0 },
          silver: { min: 0, max: 0 },
          copper: { min: 0, max: 0 }
        },
        items: []
      },
      
      // Shopkeeper properties
      isShopkeeper: debouncedCreatureData.isShopkeeper || false,
      shopInventory: debouncedCreatureData.shopInventory || {
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
  }, [debouncedCreatureData]);

  return ReactDOM.createPortal(
    <div style={position}>
      <SimpleCreatureTooltip creature={createPreviewCreature} />
    </div>,
    document.body
  );
};

export default ExternalCreaturePreview;
