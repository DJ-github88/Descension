import React, { useMemo, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import SimpleCreatureTooltip from './SimpleCreatureTooltip';
import useSettingsStore from '../../../../store/settingsStore';

// External Creature Preview Component that renders attached to the creature wizard window
const ExternalCreaturePreview = ({ creatureData, isOpen, activeView }) => {
  const windowScale = useSettingsStore(state => state.windowScale);
  const mountRef = useRef(null);
  const [portalTarget, setPortalTarget] = useState(null);
  const [showOnLeft, setShowOnLeft] = useState(false);

  // Find the closest draggable-window container on mount
  useEffect(() => {
    if (mountRef.current) {
      const draggableWindow = mountRef.current.closest('.draggable-window');
      if (draggableWindow) {
        setPortalTarget(draggableWindow);
      }
    }
  }, [isOpen]); // Re-run if open state changes to ensure we bind properly

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
        armor: creatureData.stats?.armor || 15,
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

  // Track parent window position in screen coordinates to flip left/right dynamically
  useEffect(() => {
    if (!portalTarget) return;

    let rafId;
    const checkBoundaries = () => {
      const rect = portalTarget.getBoundingClientRect();
      const tooltipWidth = 320;
      const margin = 10;
      const spaceRight = window.innerWidth - rect.right;
      const neededSpace = (tooltipWidth * windowScale) + margin;

      // If not enough space on the right, show on the left
      const shouldShowOnLeft = spaceRight < neededSpace;
      setShowOnLeft(shouldShowOnLeft);

      rafId = requestAnimationFrame(checkBoundaries);
    };

    rafId = requestAnimationFrame(checkBoundaries);
    return () => cancelAnimationFrame(rafId);
  }, [portalTarget, windowScale]);

  // Only show when the wizard is open, we have creature data, AND we're in wizard/create mode (not library or community)
  if (!isOpen || !creatureData || Object.keys(creatureData).length === 0 || activeView === 'library' || activeView === 'community') {
    return <span ref={mountRef} style={{ display: 'none' }} />;
  }

  const tooltipWidth = 320;
  const tooltipGap = 10;

  // Position relative to the parent window container
  const positionStyle = {
    position: 'absolute',
    top: '80px', // Aligned with the wizard content area
    width: `${tooltipWidth}px`,
    zIndex: 99999,
    maxHeight: 'none',
    overflow: 'visible',
    pointerEvents: 'auto',
    // Apply scale translation origin depending on which side it renders
    transformOrigin: showOnLeft ? 'top right' : 'top left'
  };

  if (showOnLeft) {
    positionStyle.right = `calc(100% + ${tooltipGap}px)`;
    positionStyle.left = 'auto';
  } else {
    positionStyle.left = `calc(100% + ${tooltipGap}px)`;
    positionStyle.right = 'auto';
  }

  return (
    <>
      {/* Hidden element in the React tree to query the closest .draggable-window */}
      <span ref={mountRef} style={{ display: 'none' }} />

      {portalTarget && ReactDOM.createPortal(
        <div
          className="external-creature-preview-portal-custom"
          style={positionStyle}
        >
          <div className="external-creature-preview-interactive">
            <SimpleCreatureTooltip creature={createPreviewCreature} />
          </div>
        </div>,
        portalTarget
      )}
    </>
  );
};

export default ExternalCreaturePreview;
