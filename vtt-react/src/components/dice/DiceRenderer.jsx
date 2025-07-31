import React, { useRef, useEffect, useState, useMemo } from 'react';
import useDiceStore, { DICE_TYPES, DICE_THEMES } from '../../store/diceStore';
import useGameStore from '../../store/gameStore';
import './DiceRenderer.css';

// Simulate dice roll with animation on grid
const rollDice = (diceType, quantity) => {
  const results = [];
  for (let i = 0; i < quantity; i++) {
    const value = Math.floor(Math.random() * DICE_TYPES[diceType].sides) + 1;
    results.push({
      id: `${diceType}_${i}_${Date.now()}`,
      type: diceType,
      value: value,
      sides: DICE_TYPES[diceType].sides
    });
  }
  return results;
};

// Grid-integrated dice renderer (simplified version)
const DiceRenderer = ({
  isVisible,
  diceToRoll = [],
  onRollComplete,
  physicsSettings = {}
}) => {
  const { selectedTheme } = useDiceStore();
  const {
    cameraX,
    cameraY,
    zoomLevel,
    playerZoom,
    gridSize
  } = useGameStore();

  const [rollingDice, setRollingDice] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  // Calculate effective zoom and grid bounds
  const effectiveZoom = zoomLevel * playerZoom;

  // Get visible grid area in world coordinates
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const worldViewWidth = viewportWidth / effectiveZoom;
  const worldViewHeight = viewportHeight / effectiveZoom;

  // Generate dice instances when rolling starts
  useEffect(() => {
    if (diceToRoll.length > 0 && !isRolling) {
      setIsRolling(true);

      const diceInstances = [];
      let diceIndex = 0;
      const totalDice = diceToRoll.reduce((sum, d) => sum + d.quantity, 0);

      diceToRoll.forEach(diceGroup => {
        for (let i = 0; i < diceGroup.quantity; i++) {
          // Position dice randomly within visible grid area
          const gridX = cameraX + (Math.random() - 0.5) * worldViewWidth * 0.6;
          const gridY = cameraY + (Math.random() - 0.5) * worldViewHeight * 0.6;

          diceInstances.push({
            id: `${diceGroup.type}_${i}_${Date.now()}_${diceIndex}`,
            type: diceGroup.type,
            gridX: gridX,
            gridY: gridY,
            animationDelay: diceIndex * 0.1
          });
          diceIndex++;
        }
      });

      setRollingDice(diceInstances);

      // Simulate rolling delay
      setTimeout(() => {
        const allResults = [];
        diceToRoll.forEach(diceGroup => {
          const results = rollDice(diceGroup.type, diceGroup.quantity);
          allResults.push(...results);
        });

        onRollComplete?.(allResults);
        setIsRolling(false);
        setRollingDice([]);
      }, 3000); // 3 second rolling animation
    }
  }, [diceToRoll, isRolling, onRollComplete, cameraX, cameraY, worldViewWidth, worldViewHeight]);

  if (!isVisible) return null;

  return (
    <div className="dice-renderer-grid-overlay">
      {isRolling && (
        <div className="dice-on-grid-container">
          {rollingDice.map((dice, index) => {
            // Convert world coordinates to screen coordinates
            const screenX = (dice.gridX - cameraX) * effectiveZoom + viewportWidth / 2;
            const screenY = (dice.gridY - cameraY) * effectiveZoom + viewportHeight / 2;

            return (
              <div
                key={dice.id}
                className="dice-on-grid"
                style={{
                  left: `${screenX}px`,
                  top: `${screenY}px`,
                  '--dice-color': DICE_TYPES[dice.type]?.color || '#8B4513',
                  '--animation-delay': `${dice.animationDelay}s`,
                  '--grid-size': `${gridSize * effectiveZoom * 0.6}px`
                }}
              >
                <span className="dice-icon">
                  {DICE_TYPES[dice.type]?.icon || '⚀'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiceRenderer;
