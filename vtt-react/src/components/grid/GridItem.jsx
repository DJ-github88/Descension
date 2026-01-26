import React, { useState, useRef, useEffect, useMemo } from 'react';
import useItemStore from '../../store/itemStore';
import useGridItemStore from '../../store/gridItemStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { getIconUrl } from '../../utils/assetManager';
import '../../styles/grid-container.css'; // Re-use grid-container styles for now or basic styles

const GridItem = ({ gridItem }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const dragStartPositionRef = useRef({ x: 0, y: 0 });

  // Get current game state
  const cameraX = useGameStore(state => state.cameraX);
  const cameraY = useGameStore(state => state.cameraY);
  const zoomLevel = useGameStore(state => state.zoomLevel);
  const playerZoom = useGameStore(state => state.playerZoom);
  const gridSize = useGameStore(state => state.gridSize);
  const effectiveZoom = zoomLevel * playerZoom;
  const gridSystem = getGridSystem();

  // Get level editor state for visibility calculations
  const isGMMode = useGameStore(state => state.isGMMode); // Note: isGMMode is in gameStore
  const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
  const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
  const visibleArea = useLevelEditorStore(state => state.visibleArea);

  // Compute visibleAreaSet for O(1) lookups
  const visibleAreaSet = useMemo(() => {
    if (!visibleArea) return new Set();
    return new Set(visibleArea);
  }, [visibleArea]);

  // Get stores actions
  const lootItem = useGridItemStore(state => state.lootItem);
  const removeItemFromGrid = useGridItemStore(state => state.removeItemFromGrid);

  // Get the item definition
  const items = useItemStore(state => state.items);
  let item = null;
  // Try to find by original ID first (persisted inventory items)
  if (gridItem.originalItemStoreId) {
    item = items.find(i => i.id === gridItem.originalItemStoreId);
  }
  // Fallback to itemId (template ID)
  if (!item && gridItem.itemId) {
    item = items.find(i => i.id === gridItem.itemId);
  }

  // Calculate world position
  const itemPosition = useMemo(() => {
    if (!gridItem.gridPosition) {
      console.warn('⚠️ GridItem missing gridPosition:', {
        gridItemId: gridItem.id,
        gridItemPosition: gridItem.position,
        gridItemGridPosition: gridItem.gridPosition
      });
      return { x: 0, y: 0 };
    }

    // Verify gridPosition has required fields
    if (!gridItem.gridPosition || gridItem.gridPosition.col === undefined || gridItem.gridPosition.row === undefined) {
      console.error('❌ GridItem has invalid gridPosition:', {
        gridItemId: gridItem.id,
        gridPosition: gridItem.gridPosition,
        fullGridItem: gridItem
      });
      return { x: 0, y: 0 };
    }

    const worldPos = gridSystem.gridToWorld(gridItem.gridPosition.col, gridItem.gridPosition.row);

     return worldPos;
  }, [gridItem.gridPosition, gridSystem]);

  // Check visibility (using the logic recovered from the corrupted file)
  const itemVisibilityState = useMemo(() => {
    // GM mode - always show items regardless of visibility system
    if (isGMMode) {
      return true;
    }

    // Player mode - check visibility based on FOV system
    if (viewingFromToken && dynamicFogEnabled && !isGMMode) {
      // Check if item position is in visible area
      if (!itemPosition || itemPosition.x === undefined || itemPosition.y === undefined) {
        return false;
      }

      // PRIMARY CHECK: Use visibleAreaSet for consistency with fog and afterimage systems
      if (visibleAreaSet && visibleAreaSet.size > 0) {
        const itemGridCoords = gridSystem.worldToGrid(itemPosition.x, itemPosition.y);
        const itemTileKey = `${itemGridCoords.x},${itemGridCoords.y}`;
        // Only show item if it's in the visible area
        return visibleAreaSet.has(itemTileKey);
      }

      // FIX: Show items during room initialization when visibleAreaSet is not yet calculated
      // If visibleAreaSet is null or empty (no fog data yet), show items based on distance to viewing token
      // This ensures GM-placed items are visible to players when they first enter a room
      if (!visibleArea || visibleAreaSet.size === 0) {
        // If viewingFromToken is not set yet (player just joined), default to showing items
        // Items will be hidden once player token view is established and FOV is calculated
        if (!viewingFromToken || !viewingFromToken.position) {
          return true; // Show items initially
        }
      }

      // Not in visible area - hide item (afterimages will show it in explored areas)
      return false;
    }

    // FIX: If not viewing from a token and not in GM mode, always visible (normal view)
    // This ensures items are visible to players when not viewing from any token and not in GM mode
    if (!viewingFromToken && !isGMMode) {
      return true; // Show items when not viewing from any token and not in GM mode
    }

    return true;
  }, [viewingFromToken, dynamicFogEnabled, itemPosition, gridSize, gridItem.id, gridItem.name, isGMMode, visibleAreaSet, gridSystem, visibleArea]);

  // Calculate screen position
  const screenPosition = useMemo(() => {
    if (!itemPosition) return { x: 0, y: 0 };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const screenPos = gridSystem.worldToScreen(itemPosition.x, itemPosition.y, viewportWidth, viewportHeight);

     return screenPos;
  }, [itemPosition, gridSystem, cameraX, cameraY, effectiveZoom]);

  // Handle interactions
  const handleMouseEnter = (e) => {
    setShowTooltip(true);
    setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
  };

  const handleMouseMove = (e) => {
    if (showTooltip) {
      setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleLoot = () => {
    lootItem(gridItem.id);
  };

  const handleClick = (e) => {
    // Only loot if this wasn't a drag operation
    if (!isDraggingRef.current) {
      e.stopPropagation();
      lootItem(gridItem.id);
    }
  };

  const handleDragStart = (e) => {
    // Set global flag for Grid to accept the drop
    window.isDraggingItem = true;
    isDraggingRef.current = true;
    dragStartTimeRef.current = Date.now();
    dragStartPositionRef.current = { x: e.clientX, y: e.clientY };

    // Use the gridItem data directly as it contains the source of truth for the instance
    // Merge with item definition to ensure all render properties are available during drag
    const dragData = {
      ...item, // Item definition properties (name, type, stats)
      ...gridItem, // Instance properties (id, position, quantity)
      type: 'item' // Explicitly set type for Grid.jsx detection
    };

    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';

    // Create a custom drag image that looks like the loot orb
    try {
      const dragImage = document.createElement('div');
      dragImage.style.width = `${itemSize}px`;
      dragImage.style.height = `${itemSize}px`;
      dragImage.style.borderRadius = '50%';
      dragImage.style.border = `2px solid ${RARITY_COLORS[item.quality?.toLowerCase()]?.border || RARITY_COLORS.common.border}`;
      dragImage.style.boxShadow = `0 0 10px ${RARITY_COLORS[item.quality?.toLowerCase()]?.border || RARITY_COLORS.common.border}80`;
      dragImage.style.backgroundColor = 'rgba(34, 34, 34, 0.9)';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-9999px';
      dragImage.style.display = 'flex';
      dragImage.style.alignItems = 'center';
      dragImage.style.justifyContent = 'center';
      dragImage.style.overflow = 'hidden';

      if (item.iconId) {
        const img = document.createElement('img');
        img.src = getIconUrl(item.iconId, 'items');
        img.style.width = '80%';
        img.style.height = '80%';
        img.style.objectFit = 'contain';
        dragImage.appendChild(img);
      } else {
        dragImage.style.color = 'white';
        dragImage.style.fontSize = `${itemSize * 0.5}px`;
        dragImage.textContent = '?';
      }

      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, itemSize / 2, itemSize / 2);

      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    } catch (error) {
      console.warn('Could not set custom drag image:', error);
    }
  };

  const handleDragEnd = (e) => {
    window.isDraggingItem = false;

    // Calculate drag distance to determine if it was a drag or a click
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - dragStartPositionRef.current.x, 2) +
      Math.pow(e.clientY - dragStartPositionRef.current.y, 2)
    );

    // If drag distance is less than 5 pixels, consider it a click, not a drag
    if (dragDistance < 5) {
      isDraggingRef.current = false;
    } else {
      // It was a drag, keep flag true briefly to prevent click handler
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    }
  };

  if (!item || !itemVisibilityState) return null;

  const qualityColor = RARITY_COLORS[item.quality?.toLowerCase()]?.border || RARITY_COLORS.common.border;
  const itemSize = gridSize * effectiveZoom * 0.6; // Slightly smaller than tile

  return (
    <>
      <div
        className="grid-item-orb"
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        data-quality={item.quality?.toLowerCase() || 'common'}
        data-currency={gridItem.isCurrency ? 'true' : 'false'}
        data-type={item.type?.toLowerCase() || 'misc'}
        data-container={gridItem.isContainer ? 'true' : 'false'}
        style={{
          position: 'absolute',
          left: screenPosition.x,
          top: screenPosition.y,
          width: `${itemSize}px`,
          height: `${itemSize}px`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `2px solid ${qualityColor}`,
          boxShadow: `0 0 10px ${qualityColor}80`,
          backgroundImage: item.iconId ? `url(${getIconUrl(item.iconId, 'items')})` : 'none',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundColor: 'transparent',
          backgroundRepeat: 'no-repeat',
          cursor: 'grab',
          zIndex: 90,
          pointerEvents: 'all'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {!item.iconId && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: `${itemSize * 0.5}px`,
            textShadow: '0 0 3px black, 0 0 5px black',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%'
          }}>
            ?
          </div>
        )}
      </div>

      {showTooltip && (
        <TooltipPortal>
          <div style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 9999,
            pointerEvents: 'none'
          }}>
            <ItemTooltip item={item} />
          </div>
        </TooltipPortal>
      )}
    </>
  );
};

export default GridItem;