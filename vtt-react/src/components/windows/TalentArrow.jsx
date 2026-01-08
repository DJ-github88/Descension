import React from 'react';
import './TalentArrow.css';

/**
 * TalentArrow Component
 * 
 * Renders connecting arrows between talent nodes
 * Supports vertical, diagonal, and multi-segment paths
 */

const TalentArrow = ({ 
  fromPosition, 
  toPosition, 
  isActive, 
  cellWidth, 
  cellHeight,
  containerRef 
}) => {
  // Calculate arrow path based on positions - TTRPG style (downward only)
  const calculateArrowPath = () => {
    // Start from bottom center of source talent (add offset to clear the border)
    const fromX = fromPosition.x * cellWidth + cellWidth / 2;
    const fromY = fromPosition.y * cellHeight + cellHeight / 2 + 42; // Bottom of 80px talent + 2px spacing

    // End at top center of target talent (subtract offset to clear the border)
    const toX = toPosition.x * cellWidth + cellWidth / 2;
    const toY = toPosition.y * cellHeight + cellHeight / 2 - 42; // Top of 80px talent - 2px spacing

    const deltaX = toX - fromX;
    const deltaY = toY - fromY;

    // Determine arrow type based on position relationship
    if (Math.abs(deltaX) < 5) {
      // Straight vertical arrow
      return {
        type: 'vertical',
        x: fromX,
        y: fromY,
        height: deltaY,
        width: 6
      };
    } else {
      // Diagonal or L-shaped arrow (always has vertical component)
      return {
        type: 'diagonal',
        fromX,
        fromY,
        toX,
        toY,
        deltaX,
        deltaY
      };
    }
  };

  const arrowPath = calculateArrowPath();

  // Render vertical arrow
  if (arrowPath.type === 'vertical') {
    return (
      <div
        className={`talent-arrow talent-arrow-vertical ${isActive ? 'active' : 'inactive'}`}
        style={{
          position: 'absolute',
          left: `${arrowPath.x}px`,
          top: `${arrowPath.y}px`,
          width: `${arrowPath.width}px`,
          height: `${arrowPath.height}px`,
          transform: 'translateX(-50%)'
        }}
      >
        <div className="arrow-line" />
        <div className="arrow-head" />
      </div>
    );
  }

  // Render diagonal/L-shaped arrow using SVG
  if (arrowPath.type === 'diagonal') {
    const { fromX, fromY, toX, toY, deltaX, deltaY } = arrowPath;

    // Calculate SVG viewBox with extra padding for long arrows
    const padding = 30;
    const minX = Math.min(fromX, toX) - padding;
    const minY = Math.min(fromY, toY) - padding;
    const width = Math.abs(deltaX) + (padding * 2);
    const height = Math.abs(deltaY) + (padding * 2);

    // Adjust coordinates relative to SVG viewBox
    const relFromX = fromX - minX;
    const relFromY = fromY - minY;
    const relToX = toX - minX;
    const relToY = toY - minY;

    // Create path with control points for WoW Classic L-shaped arrows
    // For long-distance connections, use a more gradual transition
    const verticalDistance = Math.abs(deltaY);
    const isLongDistance = verticalDistance > cellHeight * 2;

    // Adjust midpoint based on distance - longer arrows transition more gradually
    const transitionRatio = isLongDistance ? 0.4 : 0.5;
    const midY = relFromY + (relToY - relFromY) * transitionRatio;

    // Create L-shaped path (down, across, down)
    const pathD = `
      M ${relFromX} ${relFromY}
      L ${relFromX} ${midY}
      L ${relToX} ${midY}
      L ${relToX} ${relToY}
    `;

    // Generate unique marker ID to avoid conflicts with multiple arrows
    const markerId = `arrowhead-${isActive ? 'active' : 'inactive'}-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <svg
        className={`talent-arrow talent-arrow-diagonal ${isActive ? 'active' : 'inactive'} ${isLongDistance ? 'long-distance' : ''}`}
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
        <defs>
          <marker
            id={markerId}
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            orient="auto"
          >
            <polygon
              points="0,0 12,6 0,12"
              className="arrow-marker"
            />
          </marker>
        </defs>
        <path
          d={pathD}
          className="arrow-path"
          markerEnd={`url(#${markerId})`}
          fill="none"
        />
      </svg>
    );
  }

  return null;
};

/**
 * TalentArrowRenderer Component
 *
 * Manages rendering all arrows for a talent tree
 * Only shows arrows when there's a gap (not directly adjacent)
 * Arrows only travel downward or diagonally down, never horizontally
 */
export const TalentArrowRenderer = ({
  talents,
  learnedTalents,
  cellWidth,
  cellHeight,
  containerRef
}) => {
  const arrows = [];

  talents.forEach(talent => {
    if (!talent.requires) return;

    // Helper function to check if arrow should be shown
    const shouldShowArrow = (fromPos, toPos) => {
      const rowDiff = toPos.y - fromPos.y;
      const colDiff = Math.abs(toPos.x - fromPos.x);

      // Only show arrows that go downward
      if (rowDiff <= 0) return false;

      // Only show arrows if there's a gap (more than 1 row apart)
      // OR if there's both a vertical and horizontal gap (diagonal)
      if (rowDiff > 1) return true; // Vertical gap
      if (rowDiff === 1 && colDiff > 0) return true; // Diagonal with gap

      return false; // Adjacent vertically, no arrow needed
    };

    // Handle single prerequisite
    if (typeof talent.requires === 'string') {
      const prereqTalent = talents.find(t => t.id === talent.requires);
      if (prereqTalent && shouldShowArrow(prereqTalent.position, talent.position)) {
        const isActive = (learnedTalents[talent.requires] || 0) > 0;
        arrows.push(
          <TalentArrow
            key={`arrow-${talent.id}-${talent.requires}`}
            fromPosition={prereqTalent.position}
            toPosition={talent.position}
            isActive={isActive}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            containerRef={containerRef}
          />
        );
      }
    }

    // Handle multiple prerequisites
    if (Array.isArray(talent.requires)) {
      talent.requires.forEach(prereqId => {
        const prereqTalent = talents.find(t => t.id === prereqId);
        if (prereqTalent && shouldShowArrow(prereqTalent.position, talent.position)) {
          const isActive = (learnedTalents[prereqId] || 0) > 0;
          arrows.push(
            <TalentArrow
              key={`arrow-${talent.id}-${prereqId}`}
              fromPosition={prereqTalent.position}
              toPosition={talent.position}
              isActive={isActive}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              containerRef={containerRef}
            />
          );
        }
      });
    }
  });

  return <div className="talent-arrows-container">{arrows}</div>;
};

export default TalentArrow;

