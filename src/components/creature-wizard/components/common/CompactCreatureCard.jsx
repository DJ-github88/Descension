import React, { memo } from 'react';
import { getCreatureSizeMapping } from '../../../../store/creatureStore';
import '../../styles/CompactCreatureCard.css';

// Helper function to format type name
const formatTypeName = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper function to format size name
const formatSizeName = (size) => {
  return size.charAt(0).toUpperCase() + size.slice(1);
};

// Helper function to get color for creature type
const getTypeColor = (type) => {
  const typeColors = {
    aberration: '#9932CC', // Dark Orchid
    beast: '#8B4513', // Saddle Brown
    celestial: '#FFD700', // Gold
    construct: '#708090', // Slate Gray
    dragon: '#DC143C', // Crimson
    elemental: '#20B2AA', // Light Sea Green
    fey: '#9370DB', // Medium Purple
    fiend: '#8B0000', // Dark Red
    giant: '#A0522D', // Sienna
    humanoid: '#4682B4', // Steel Blue
    monstrosity: '#556B2F', // Dark Olive Green
    ooze: '#32CD32', // Lime Green
    plant: '#228B22', // Forest Green
    undead: '#4B0082', // Indigo
  };

  return typeColors[type.toLowerCase()] || '#7a3b2e'; // Default to rustic red
};

// Helper function to calculate ability modifier
const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

// Helper function to format modifier with + or - sign
const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const CompactCreatureCard = ({ creature }) => {
  if (!creature) return null;

  // Get size mapping for grid display
  const sizeMapping = getCreatureSizeMapping(creature.size);

  return (
    <div className="compact-creature-card wow-style-card">
      {/* Creature icon and name */}
      <div className="compact-card-header">
        <div
          className="compact-creature-icon"
          style={{
            backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon}.jpg)`,
            borderColor: creature.tokenBorder
          }}
        ></div>
        <div className="compact-creature-name-type">
          <h2 className="compact-creature-name">{creature.name}</h2>
          <div className="compact-creature-type-size">
            <span
              className="compact-creature-type"
              style={{ backgroundColor: getTypeColor(creature.type) }}
            >
              {formatTypeName(creature.type)}
            </span>
            <span className="compact-creature-size">
              {formatSizeName(creature.size)} ({sizeMapping.width}x{sizeMapping.height})
            </span>
          </div>
        </div>
      </div>

      {/* Main stats (HP, AC, Initiative) */}
      <div className="compact-creature-main-stats">
        <div className="compact-main-stat">
          <div className="compact-main-stat-value">{creature.stats.maxHp}</div>
          <div className="compact-main-stat-label">HP</div>
        </div>
        <div className="compact-main-stat">
          <div className="compact-main-stat-value">{creature.stats.armor || creature.stats.armorClass}</div>
          <div className="compact-main-stat-label">Armor</div>
        </div>
        <div className="compact-main-stat">
          <div className="compact-main-stat-value">{formatModifier(creature.stats.initiative)}</div>
          <div className="compact-main-stat-label">INIT</div>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CompactCreatureCard);
