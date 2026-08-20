import React from 'react';
import './TalentArrow.css';

/**
 * TalentArrow Component
 * 
 * Renders crisp connecting lines/arrows between talent nodes
 * Supports vertical, diagonal, and multi-segment WoW Classic style paths
 */

const TalentArrow = ({ 
  fromPosition, 
  toPosition, 
  isActive, 
  cellWidth, 
  cellHeight,
  talentSize = 48
}) => {
  // Center of source node
  const fromX = fromPosition.x * cellWidth + cellWidth / 2;
  const fromY = fromPosition.y * cellHeight + cellHeight / 2 + talentSize / 2;

  // Center of target node
  const toX = toPosition.x * cellWidth + cellWidth / 2;
  const toY = toPosition.y * cellHeight + cellHeight / 2 - talentSize / 2;

  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  // If vertical straight line
  if (Math.abs(deltaX) < 4) {
    return (
      <div
        className={`talent-arrow talent-arrow-vertical ${isActive ? 'active' : 'inactive'}`}
        style={{
          position: 'absolute',
          left: `${fromX}px`,
          top: `${fromY}px`,
          width: '4px',
          height: `${Math.max(4, deltaY)}px`,
          transform: 'translateX(-50%)',
          pointerEvents: 'none'
        }}
      >
        <div className="arrow-line" />
      </div>
    );
  }

  // Diagonal / L-shaped connecting line using SVG
  const padding = 20;
  const minX = Math.min(fromX, toX) - padding;
  const minY = Math.min(fromY, toY) - padding;
  const width = Math.abs(deltaX) + padding * 2;
  const height = Math.abs(deltaY) + padding * 2;

  const relFromX = fromX - minX;
  const relFromY = fromY - minY;
  const relToX = toX - minX;
  const relToY = toY - minY;

  const midY = relFromY + (relToY - relFromY) * 0.5;

  const pathD = `
    M ${relFromX} ${relFromY}
    L ${relFromX} ${midY}
    L ${relToX} ${midY}
    L ${relToX} ${relToY}
  `;

  return (
    <svg
      className={`talent-arrow talent-arrow-diagonal ${isActive ? 'active' : 'inactive'}`}
      style={{
        position: 'absolute',
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <path
        d={pathD}
        className="arrow-path"
        fill="none"
      />
    </svg>
  );
};

/**
 * TalentArrowRenderer Component
 *
 * Manages rendering all arrows for a talent tree
 */
export const TalentArrowRenderer = ({
  talents,
  learnedTalents,
  cellWidth,
  cellHeight,
  talentSize = 48
}) => {
  if (!talents || !talents.length) return null;

  const arrows = [];

  talents.forEach(talent => {
    if (!talent.requires) return;

    const prereqIds = Array.isArray(talent.requires) ? talent.requires : [talent.requires];

    prereqIds.forEach(prereqId => {
      const prereqTalent = talents.find(t => t.id === prereqId);
      if (prereqTalent && prereqTalent.position && talent.position) {
        const rowDiff = talent.position.y - prereqTalent.position.y;
        if (rowDiff > 0) {
          const isActive = (learnedTalents[prereqId] || 0) >= (prereqTalent.maxRanks || 1);
          arrows.push(
            <TalentArrow
              key={`arrow-${talent.id}-${prereqId}`}
              fromPosition={prereqTalent.position}
              toPosition={talent.position}
              isActive={isActive}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              talentSize={talentSize}
            />
          );
        }
      }
    });
  });

  return <div className="talent-arrows-container">{arrows}</div>;
};

export default TalentArrow;
