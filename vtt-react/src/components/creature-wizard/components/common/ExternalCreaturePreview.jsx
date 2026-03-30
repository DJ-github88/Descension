import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import SimpleCreatureTooltip from './SimpleCreatureTooltip';
import useCreatureStore from '../../../../store/creatureStore';
import useSettingsStore from '../../../../store/settingsStore';

// External Creature Preview Component that renders outside the creature wizard window
const ExternalCreaturePreview = ({ creatureData, isOpen, activeView }) => {
  const { windowPosition, windowSize } = useCreatureStore();
  const windowScale = useSettingsStore(state => state.windowScale);

  // Create a complete creature object for the tooltip using real-time data
  // This must be called before any early returns to follow Rules of Hooks
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

  // Only show when the wizard is open, we have creature data, AND we're in wizard/create mode (not library or community)
  if (!isOpen || !creatureData || Object.keys(creatureData).length === 0 || activeView === 'library' || activeView === 'community') {
    return null;
  }

  // Calculate position with fallback values and live updates - REACTIVE
  // Use correct width based on activeView (library/wizard = 900px, community = 1100px)
  const defaultWidth = activeView === 'community' ? 1100 : 900;
  const wizardX = windowPosition?.x ?? ((window.innerWidth - defaultWidth) / 2);
  const wizardY = windowPosition?.y ?? ((window.innerHeight - 800) / 2);

  // Position tooltip very close to the creature window and responsive to width changes
  const baseWindowX = windowPosition?.x ?? wizardX;
  const baseWindowY = windowPosition?.y ?? wizardY;
  const baseWindowWidth = (windowSize?.width || defaultWidth) * windowScale;
  const windowRightEdge = baseWindowX + baseWindowWidth;

  const tooltipGap = 10; // Small gap next to window edge
  const tooltipWidth = 320; // matches tooltip max-width; we clamp using scaled width
  const margin = 10;

  let left = windowRightEdge + tooltipGap;
  const scaledTooltipWidth = tooltipWidth * windowScale;

  // If tooltip would go off-screen to the right, flip to the left of the window.
  if (left + scaledTooltipWidth > window.innerWidth - margin) {
    left = baseWindowX - scaledTooltipWidth - tooltipGap;
  }

  // Final clamp to viewport
  left = Math.max(margin, Math.min(left, window.innerWidth - scaledTooltipWidth - margin));

  const position = {
    left, // Responsive to window position/size/scale
    top: baseWindowY + 80, // Aligned with window content area
    position: 'fixed',
    zIndex: 99999,
    width: `${tooltipWidth}px`,
    maxHeight: 'none',
    overflow: 'visible'
  };

  return ReactDOM.createPortal(
    <div
      className="external-creature-preview-portal"
      style={{
        ...position,
        transform: `scale(${windowScale})`,
        transformOrigin: 'top left'
      }}
    >
      <div className="external-creature-preview-interactive">
        <SimpleCreatureTooltip creature={createPreviewCreature} />
      </div>
    </div>,
    document.body
  );
};

export default ExternalCreaturePreview;
