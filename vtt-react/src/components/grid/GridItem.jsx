import React, { useState, useRef, useEffect, useMemo } from 'react';
import useItemStore from '../../store/itemStore';
import useGridItemStore from '../../store/gridItemStore';
import useInventoryStore from '../../store/inventoryStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import '../../styles/grid-item.css';

const GridItem = ({ gridItem }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);

  // Ensure component is interactive
  useEffect(() => {
    // Force the component to be interactive
    if (itemRef.current) {
      itemRef.current.style.pointerEvents = 'all';
      itemRef.current.style.zIndex = '1000';
    }
  }, [gridItem.id]);

  // Get current game state for reactive updates - use specific selectors to avoid unnecessary re-renders
  const cameraX = useGameStore(state => state.cameraX);
  const cameraY = useGameStore(state => state.cameraY);
  const zoomLevel = useGameStore(state => state.zoomLevel);
  const playerZoom = useGameStore(state => state.playerZoom);
  const gridSize = useGameStore(state => state.gridSize);
  const gridOffsetX = useGameStore(state => state.gridOffsetX);
  const gridOffsetY = useGameStore(state => state.gridOffsetY);
  const gridMovesWithBackground = useGameStore(state => state.gridMovesWithBackground);

  const effectiveZoom = zoomLevel * playerZoom;
  const gridSystem = getGridSystem();

  // Get the original item from the item store - use a more specific selector
  const originalItem = useMemo(() => {
    if (gridItem.originalItemStoreId) {
      return useItemStore.getState().items.find(item => item.id === gridItem.originalItemStoreId);
    }
    if (gridItem.itemId) {
      return useItemStore.getState().items.find(item => item.id === gridItem.itemId);
    }
    return null;
  }, [gridItem.originalItemStoreId, gridItem.itemId]);



  // Convert coordinates to screen coordinates using the same system as CreatureToken
  const screenPosition = useMemo(() => {
    // Use world coordinates if available (like creature tokens), otherwise fall back to grid coordinates
    if (gridItem.position && gridItem.position.x !== undefined && gridItem.position.y !== undefined) {
      // Use world coordinates directly (same as CreatureToken)
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const screenPos = gridSystem.worldToScreen(gridItem.position.x, gridItem.position.y, viewportWidth, viewportHeight);
      return screenPos;
    } else if (gridItem.gridPosition) {
      // Fallback to grid coordinates
      try {
        const worldPos = gridSystem.gridToWorld(gridItem.gridPosition.col, gridItem.gridPosition.row);
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, viewportWidth, viewportHeight);
        return screenPos;
      } catch (error) {
        // Final fallback
        const worldX = (gridItem.gridPosition.col * gridSize) + gridOffsetX + (gridSize / 2);
        const worldY = (gridItem.gridPosition.row * gridSize) + gridOffsetY + (gridSize / 2);
        return {
          x: (worldX - cameraX) * effectiveZoom + window.innerWidth / 2,
          y: (worldY - cameraY) * effectiveZoom + window.innerHeight / 2
        };
      }
    }

    return { x: 0, y: 0 };
  }, [
    gridItem.position?.x,
    gridItem.position?.y,
    gridItem.gridPosition?.col,
    gridItem.gridPosition?.row,
    gridSystem,
    cameraX,
    cameraY,
    effectiveZoom,
    gridSize,
    gridOffsetX,
    gridOffsetY
  ]);

  // Calculate orb size based on grid size and zoom
  const orbSize = useMemo(() => {
    const baseSize = gridSize * 0.6;
    return baseSize * effectiveZoom;
  }, [gridSize, zoomLevel, playerZoom, effectiveZoom]);

  // Get the loot function from the grid item store
  const lootItem = useGridItemStore(state => state.lootItem);

  // Force re-render when gridItem changes to ensure proper event handling
  // This is the key fix for the interaction issue
  useEffect(() => {
    // This effect ensures the component re-renders when gridItem changes
    // which fixes the issue where items dropped from inventory don't have tooltips/interactions
    if (itemRef.current) {
      // Ensure the element is always interactive
      itemRef.current.style.pointerEvents = 'all';
      itemRef.current.style.zIndex = '1000';

      // Manually attach event listeners as a fallback
      const element = itemRef.current;

      const handleMouseEnterFallback = (e) => {
        // Fallback mouse enter
        setShowTooltip(true);
        setTooltipPosition({
          x: e.clientX + 15,
          y: e.clientY - 10
        });
      };

      const handleMouseLeaveFallback = () => {
        setShowTooltip(false);
      };

      // Remove existing listeners first
      element.removeEventListener('mouseenter', handleMouseEnterFallback);
      element.removeEventListener('mouseleave', handleMouseLeaveFallback);

      // Add new listeners
      element.addEventListener('mouseenter', handleMouseEnterFallback);
      element.addEventListener('mouseleave', handleMouseLeaveFallback);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnterFallback);
        element.removeEventListener('mouseleave', handleMouseLeaveFallback);
      };
    }
  }, [gridItem.id, gridItem.itemId, gridItem.name, gridItem.type, originalItem]);

  // Simple tooltip handlers
  const handleMouseEnter = (e) => {
    // GridItem mouse enter
    setShowTooltip(true);
    setTooltipPosition({
      x: e.clientX + 15,
      y: e.clientY - 10
    });
  };

  const handleMouseMove = (e) => {
    if (showTooltip) {
      setTooltipPosition({
        x: e.clientX + 15,
        y: e.clientY - 10
      });
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Handle click to loot the item
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`🎯 GRID ITEM CLICKED: ${gridItem.id} (${gridItem.name || 'Unknown'})`);
    console.log(`🎯 Grid item data:`, gridItem);

    const currentUser = useInventoryStore.getState().characterName || 'Player';
    console.log(`🎯 Current user: ${currentUser}`);

    const result = lootItem(gridItem.id, 'default', currentUser);
    console.log(`🎯 Loot result: ${result}`);

    setTimeout(() => {
      const currentState = useInventoryStore.getState();
      useInventoryStore.setState({
        ...currentState,
        items: [...currentState.items]
      });
    }, 200);
  };

  // Helper function to get icon based on item type
  const getItemIcon = (type, subtype) => {
    // Default icons for different item types
    const typeIcons = {
      weapon: 'inv_sword_04',
      armor: 'inv_chest_cloth_01',
      accessory: 'inv_jewelry_ring_01',
      consumable: 'inv_potion_51',
      miscellaneous: 'inv_misc_questionmark',
      material: 'inv_fabric_wool_01',
      quest: 'inv_misc_note_01',
      container: 'inv_box_01'
    };

    return typeIcons[type] || 'inv_misc_questionmark';
  };

  // Create item object for tooltip
  const itemForTooltip = originalItem ? {
    ...originalItem,
    // Always use quantity from gridItem since it might be stacked
    quantity: gridItem.quantity || 1
  } : {
    ...gridItem,
    id: gridItem.itemId,
    name: gridItem.name || 'Unknown Item',
    quality: gridItem.quality || gridItem.rarity || 'common',
    rarity: gridItem.rarity || gridItem.quality || 'common',
    type: gridItem.type || 'misc',
    description: gridItem.description || 'An item.'
  };

  // Get the appropriate icon for the loot orb
  const iconId = itemForTooltip.iconId || getItemIcon(itemForTooltip.type, itemForTooltip.subtype);

  // State for handling image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Preload the image to check if it exists
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageLoaded(false);
      setImageError(true);
    };
    img.src = `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
  }, [iconId]);



  return (
    <>
      <div
        ref={itemRef}
        className="grid-item-orb"
        data-quality={itemForTooltip.quality || itemForTooltip.rarity || 'common'}
        data-type={itemForTooltip.type}
        data-currency={itemForTooltip.type === 'currency' ? (itemForTooltip.currencyType || 'gold') : undefined}
        style={{
          position: 'absolute',
          left: screenPosition.x,
          top: screenPosition.y,
          width: `${orbSize}px`,
          height: `${orbSize}px`,
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          zIndex: 1000, // Increased z-index significantly
          pointerEvents: 'all',
          boxSizing: 'border-box',
          borderRadius: '50%',
          // Conditionally add background image for the item icon
          ...(imageLoaded && !imageError ? {
            backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          } : {
            // Fallback to original orb styling with gradients
            background: `
              radial-gradient(ellipse at 25% 25%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 30%, transparent 60%),
              radial-gradient(ellipse at 70% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 40%),
              radial-gradient(circle at center, var(--orb-color, #ffffff) 0%, var(--orb-color-mid, #cccccc) 60%, var(--orb-color-dark, #999999) 100%)
            `
          }),
          // Add a subtle border with quality color
          border: `2px solid ${RARITY_COLORS[itemForTooltip.quality || itemForTooltip.rarity || 'common']?.border || '#8B4513'}`
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onMouseDown={(e) => {
          // GridItem mouse down
          e.stopPropagation(); // Prevent event bubbling
        }}
      >
        {/* Quantity display for stacked items */}
        {(itemForTooltip.quantity && itemForTooltip.quantity > 1) && (
          <div
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              fontSize: `${Math.max(10, orbSize * 0.2)}px`,
              fontWeight: 'bold',
              padding: '1px 4px',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              minWidth: '16px',
              textAlign: 'center',
              lineHeight: '1',
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.8)',
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            {itemForTooltip.quantity}
          </div>
        )}
      </div>

      {showTooltip && (
        <TooltipPortal>
          <div
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translate(10px, -50%)',
              pointerEvents: 'none',
              zIndex: 999999999
            }}
          >
            <ItemTooltip item={itemForTooltip} />
          </div>
        </TooltipPortal>
      )}
    </>
  );
};

export default GridItem;
