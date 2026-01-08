import React, { useMemo, memo } from 'react';
import { logger } from '../../utils/logger';
import './GridPreview.css';

/**
 * GridPreview Component
 * Renders a miniature preview of a room's grid state including:
 * - Background images
 * - Creatures and tokens
 * - Terrain data
 * - Grid layout
 */
const GridPreview = ({
  roomData,
  size = 120,
  showGrid = true,
  className = '',
  fallbackType = 'default' // 'default', 'tavern', 'dungeon'
}) => {
  // Extract room state data
  const roomState = useMemo(() => {
    if (!roomData) return null;

    // Debug logging
    logger.debug('GridPreview: Processing room data:', roomData);
    logger.debug('GridPreview: Room type:', roomData?.type, 'isLocal:', roomData?.isLocal);

    // Handle different room data structures
    let gameState = roomData.gameState || roomData;

    // For multiplayer rooms, check if there's nested state
    if (roomData.state) {
      gameState = roomData.state;
    }

    // For local rooms, the gameState might be directly in the room object
    if (roomData.type === 'local' || roomData.isLocal) {
      gameState = roomData.gameState || roomData;
    }

    const extractedState = {
      backgrounds: gameState.backgrounds || [],
      activeBackgroundId: gameState.activeBackgroundId || null,
      backgroundImage: gameState.backgroundImage || null,
      backgroundImageUrl: gameState.backgroundImageUrl || '',
      creatures: gameState.creatures || [],
      tokens: gameState.tokens || [],
      terrainData: gameState.terrainData || gameState.levelEditor?.terrainData || {},
      environmentalObjects: gameState.environmentalObjects || gameState.levelEditor?.environmentalObjects || [],
      mapData: gameState.mapData || {},
      levelEditor: gameState.levelEditor || {},
      // Also check for items/inventory
      droppedItems: gameState.inventory?.droppedItems || gameState.droppedItems || {}
    };

    console.log('GridPreview: Extracted state:', extractedState);
    return extractedState;
  }, [roomData]);

  // Get active background
  const activeBackground = useMemo(() => {
    if (!roomState) return null;
    
    if (roomState.activeBackgroundId && roomState.backgrounds.length > 0) {
      return roomState.backgrounds.find(bg => bg.id === roomState.activeBackgroundId);
    }
    
    // Fallback to legacy background system
    if (roomState.backgroundImageUrl) {
      return { url: roomState.backgroundImageUrl };
    }
    
    return null;
  }, [roomState]);

  // Count entities for preview
  const entityCounts = useMemo(() => {
    if (!roomState) return { creatures: 0, tokens: 0, terrain: 0, objects: 0, items: 0 };

    const counts = {
      creatures: roomState.creatures.length,
      tokens: roomState.tokens.length,
      terrain: Object.keys(roomState.terrainData).length,
      objects: roomState.environmentalObjects.length,
      items: Object.keys(roomState.droppedItems).length
    };

    console.log('GridPreview: Entity counts:', counts);
    return counts;
  }, [roomState]);

  // Determine if room has content
  const hasContent = useMemo(() => {
    if (!roomState) return false;
    const hasAnyContent = activeBackground ||
           entityCounts.creatures > 0 ||
           entityCounts.tokens > 0 ||
           entityCounts.terrain > 0 ||
           entityCounts.objects > 0 ||
           entityCounts.items > 0;

    console.log('GridPreview: Has content:', hasAnyContent, { activeBackground, entityCounts });
    return hasAnyContent;
  }, [roomState, activeBackground, entityCounts]);

  // Render fallback preview based on type
  const renderFallbackPreview = () => {
    const fallbackClass = `grid-preview-fallback grid-preview-fallback-${fallbackType}`;

    // All room types now use the same grid pattern preview for consistency
    // This ensures multiplayer rooms look identical to local rooms
    return (
      <div className={fallbackClass}>
        <div className="grid-pattern"></div>
        <div className="fallback-label">Empty Room</div>
      </div>
    );
  };

  // Render actual room preview
  const renderRoomPreview = () => {
    return (
      <div className="grid-preview-content">
        {/* Background layer */}
        {activeBackground && (
          <div 
            className="preview-background"
            style={{
              backgroundImage: `url(${activeBackground.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
        
        {/* Grid overlay */}
        {showGrid && (
          <div className="preview-grid-overlay" />
        )}
        
        {/* Entities layer */}
        <div className="preview-entities">
          {/* Render creature indicators */}
          {roomState.creatures.slice(0, 6).map((creature, index) => (
            <div
              key={`creature-${index}`}
              className="preview-entity preview-creature"
              style={{
                left: `${15 + (index % 3) * 30}%`,
                top: `${20 + Math.floor(index / 3) * 30}%`
              }}
              title={creature.name || 'Creature'}
            />
          ))}
          
          {/* Render token indicators */}
          {roomState.tokens.slice(0, 4).map((token, index) => (
            <div
              key={`token-${index}`}
              className="preview-entity preview-token"
              style={{
                left: `${60 + (index % 2) * 25}%`,
                top: `${15 + Math.floor(index / 2) * 35}%`
              }}
              title={token.name || 'Token'}
            />
          ))}
          
          {/* Terrain indicators */}
          {Object.keys(roomState.terrainData).slice(0, 8).map((position, index) => (
            <div
              key={`terrain-${index}`}
              className="preview-terrain"
              style={{
                left: `${10 + (index % 4) * 20}%`,
                top: `${60 + Math.floor(index / 4) * 20}%`
              }}
            />
          ))}

          {/* Dropped items indicators */}
          {Object.keys(roomState.droppedItems).slice(0, 4).map((itemId, index) => (
            <div
              key={`item-${index}`}
              className="preview-entity preview-item"
              style={{
                left: `${70 + (index % 2) * 15}%`,
                top: `${70 + Math.floor(index / 2) * 15}%`
              }}
              title="Dropped Item"
            />
          ))}
        </div>
        
        {/* Content summary overlay */}
        {(entityCounts.creatures > 0 || entityCounts.tokens > 0 || entityCounts.items > 0) && (
          <div className="preview-summary">
            {entityCounts.creatures > 0 && (
              <span className="entity-count creatures" title="Creatures">
                🐉 {entityCounts.creatures}
              </span>
            )}
            {entityCounts.tokens > 0 && (
              <span className="entity-count tokens" title="Player Tokens">
                👤 {entityCounts.tokens}
              </span>
            )}
            {entityCounts.items > 0 && (
              <span className="entity-count items" title="Dropped Items">
                📦 {entityCounts.items}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`grid-preview ${className}`}
      style={{ 
        width: size, 
        height: size,
        minWidth: size,
        minHeight: size
      }}
    >
      {hasContent ? renderRoomPreview() : renderFallbackPreview()}
    </div>
  );
};

export default memo(GridPreview);
