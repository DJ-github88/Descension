import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import useItemStore from '../../store/itemStore';
import useGridItemStore from '../../store/gridItemStore';
import useInventoryStore from '../../store/inventoryStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { getIconUrl } from '../../utils/assetManager';
import '../../styles/grid-item.css';

const GridItem = ({ gridItem }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);
  const itemRef = useRef(null);
  const isDraggingRef = useRef(false);
  const justFinishedDragRef = useRef(false); // Track if we just finished a drag to prevent click from looting
  
  // FIXED: Use refs for screen position to enable imperative DOM updates (like tokens)
  const screenPositionRef = useRef({ x: 0, y: 0 });
  const worldPositionRef = useRef(null);
  const cameraUpdateRafRef = useRef(null);
  const pendingCameraUpdateRef = useRef(false);

  const DRAG_THRESHOLD = 5; // Minimum pixels to move before starting drag

  // Ensure component is interactive
  useEffect(() => {
    // Force the component to be interactive
    if (itemRef.current) {
      itemRef.current.style.pointerEvents = 'all';
      itemRef.current.style.zIndex = '1000';
    }
  }, [gridItem.id]);

  // FIXED: Only subscribe to zoom for size calculations - camera changes are handled imperatively
  // This prevents unnecessary re-renders during camera drag
  const zoomLevel = useGameStore(state => state.zoomLevel);
  const playerZoom = useGameStore(state => state.playerZoom);
  const gridSize = useGameStore(state => state.gridSize);

  const effectiveZoom = zoomLevel * playerZoom;
  const gridSystem = getGridSystem();
  
  // Get visibility data for FOV checks
  // PERFORMANCE FIX: Use selective subscriptions to prevent re-renders on unrelated store changes
  const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
  const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
  const visibleArea = useLevelEditorStore(state => state.visibleArea);
  const isGMMode = useGameStore(state => state.isGMMode);
  
  // Get visible area as a Set for fast lookup (matches token visibility logic)
  const visibleAreaSet = useMemo(() => {
    if (!visibleArea) return null;
    return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
  }, [visibleArea]);
  
  // Get item position for visibility check
  const itemPosition = useMemo(() => {
    if (gridItem.position && gridItem.position.x !== undefined && gridItem.position.y !== undefined) {
      return gridItem.position;
    } else if (gridItem.gridPosition) {
      const worldPos = gridSystem.gridToWorld(gridItem.gridPosition.col, gridItem.gridPosition.row);
      return worldPos;
    }
    return null;
  }, [gridItem.position, gridItem.gridPosition, gridSystem]);
  
  // Check if this item is visible based on FOV (only if viewing from a token)
  // CRITICAL: Items should be hidden when not in visibleAreaSet - afterimages will show them in explored areas
  // Returns: true = fully visible, false = hidden
  const itemVisibilityState = useMemo(() => {
    // If viewing from a token AND dynamic fog is enabled, check FOV visibility
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

      // If visibleAreaSet exists but is empty, item is not visible
      if (visibleAreaSet && visibleAreaSet.size === 0) {
        return false;
      }

      // Distance-based fallback ONLY when visibleAreaSet is null (not yet calculated)
      // This prevents items from being hidden during initialization
      if (!visibleAreaSet && viewingFromToken && viewingFromToken.position) {
        const dx = itemPosition.x - viewingFromToken.position.x;
        const dy = itemPosition.y - viewingFromToken.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const visionRange = 6; // Default vision range in tiles
        const maxDistance = visionRange * gridSize;

        if (distance <= maxDistance) {
          return true; // Fully visible (fallback only during initialization)
        }
      }

      // Not in visible area - hide the item (afterimages will show it in explored areas)
      return false;
    }
    
    // If not viewing from a token or in GM mode, always visible (normal view)
    return true;
  }, [viewingFromToken, dynamicFogEnabled, itemPosition, gridSize, gridItem.id, gridItem.name, isGMMode, visibleAreaSet, gridSystem]);
  
  // Check if item should be visible at all
  // CRITICAL: Items should only be visible when in visibleAreaSet
  // Afterimages handle showing items in explored areas
  const isItemVisible = useMemo(() => {
    return itemVisibilityState === true;
  }, [itemVisibilityState]);

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



  // FIXED: Use imperative DOM updates for screen position (like tokens)
  // This prevents floating/movement during camera drag by updating DOM directly
  const updateScreenPosition = useCallback((worldPos) => {
    if (!worldPos) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const newPosition = gridSystem.worldToScreen(worldPos.x, worldPos.y, viewportWidth, viewportHeight);
    
    screenPositionRef.current = newPosition;
    
    const element = itemRef.current;
    if (element) {
      element.style.left = `${newPosition.x}px`;
      element.style.top = `${newPosition.y}px`;
    }
  }, [gridSystem]);
  
  // Get world position from gridItem (either world coords or grid coords)
  const getWorldPosition = useCallback(() => {
    if (gridItem.position && gridItem.position.x !== undefined && gridItem.position.y !== undefined) {
      return { x: gridItem.position.x, y: gridItem.position.y };
    } else if (gridItem.gridPosition) {
      return gridSystem.gridToWorld(gridItem.gridPosition.col, gridItem.gridPosition.row);
    }
    return { x: 0, y: 0 };
  }, [gridItem.position?.x, gridItem.position?.y, gridItem.gridPosition?.col, gridItem.gridPosition?.row, gridSystem]);
  
  // Update world position ref when gridItem changes
  useEffect(() => {
    const worldPos = getWorldPosition();
    worldPositionRef.current = worldPos;
    updateScreenPosition(worldPos);
  }, [getWorldPosition, updateScreenPosition]);
  
  // FIXED: Subscribe to camera changes and update position imperatively (like tokens)
  // CRITICAL FIX: Batch position updates during camera drag to match camera RAF timing
  // This prevents grid items from "hovering" during grid drag
  useEffect(() => {
    const handleCameraChange = () => {
      // Check if camera is being dragged
      const isDraggingCamera = window._isDraggingCamera || false;
      
      if (isDraggingCamera) {
        // During camera drag, batch updates via RAF to match camera update timing
        // This prevents items from updating with intermediate camera values
        pendingCameraUpdateRef.current = true;
        
        if (cameraUpdateRafRef.current === null) {
          cameraUpdateRafRef.current = requestAnimationFrame(() => {
            if (pendingCameraUpdateRef.current && worldPositionRef.current) {
              updateScreenPosition(worldPositionRef.current);
              pendingCameraUpdateRef.current = false;
            }
            cameraUpdateRafRef.current = null;
          });
        }
      } else {
        // When not dragging, update immediately for responsiveness
        if (worldPositionRef.current) {
          updateScreenPosition(worldPositionRef.current);
        }
      }
    };

    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (
        state.cameraX !== prevState.cameraX ||
        state.cameraY !== prevState.cameraY ||
        state.zoomLevel !== prevState.zoomLevel ||
        state.playerZoom !== prevState.playerZoom
      ) {
        handleCameraChange();
      }
    });
    
    return () => {
      unsubscribe();
      // Clean up RAF on unmount
      if (cameraUpdateRafRef.current !== null) {
        cancelAnimationFrame(cameraUpdateRafRef.current);
        cameraUpdateRafRef.current = null;
      }
    };
  }, [updateScreenPosition]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (worldPositionRef.current) {
        updateScreenPosition(worldPositionRef.current);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScreenPosition]);
  
  // Get current screen position (for initial render and when not using imperative updates)
  const screenPosition = screenPositionRef.current;

  // Calculate orb size based on grid size and zoom
  const orbSize = useMemo(() => {
    const baseSize = gridSize * 0.6;
    return baseSize * effectiveZoom;
  }, [gridSize, effectiveZoom]);

  // Get functions from the grid item store
  const lootItem = useGridItemStore(state => state.lootItem);
  const updateItemPosition = useGridItemStore(state => state.updateItemPosition);

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

  // Handle global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      // Check if we should start dragging based on threshold
      if (!isDraggingRef.current && dragStartPos) {
        const distance = Math.sqrt(
          Math.pow(e.clientX - dragStartPos.x, 2) +
          Math.pow(e.clientY - dragStartPos.y, 2)
        );

        if (distance >= DRAG_THRESHOLD) {
          setIsDragging(true);
          isDraggingRef.current = true;
        } else {
          return; // Don't start dragging yet
        }
      }

      if (!isDraggingRef.current) return;

      e.preventDefault();

      // Calculate new position with drag offset
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Convert screen position to world coordinates
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const worldPos = gridSystem.screenToWorld(newX, newY, viewportWidth, viewportHeight);

      // Convert to grid coordinates and snap to grid center
      const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);
      const snappedWorldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

      // Convert back to screen coordinates for visual positioning
      const snappedScreenPos = gridSystem.worldToScreen(snappedWorldPos.x, snappedWorldPos.y, viewportWidth, viewportHeight);

      // Update drag position to snapped position
      setDragPosition({
        x: snappedScreenPos.x,
        y: snappedScreenPos.y,
        gridX: gridCoords.x,
        gridY: gridCoords.y,
        worldX: snappedWorldPos.x,
        worldY: snappedWorldPos.y
      });
    };

    const handleGlobalMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Clear drag start position
      setDragStartPos(null);

      // If we were dragging, mark that we just finished a drag
      if (isDraggingRef.current) {
        justFinishedDragRef.current = true;
        // Reset the flag after a short delay to allow click handler to check it
        setTimeout(() => {
          justFinishedDragRef.current = false;
        }, 100);
      }

      if (!isDraggingRef.current) return;

      setIsDragging(false);
      isDraggingRef.current = false;

      // If we have a valid drag position, update the item's position
      if (dragPosition && dragPosition.gridX !== undefined && dragPosition.gridY !== undefined) {
        const newPosition = {
          x: dragPosition.worldX,
          y: dragPosition.worldY,
          gridPosition: {
            row: dragPosition.gridY,
            col: dragPosition.gridX
          }
        };

        // Update the item position in the store
        updateItemPosition(gridItem.id, newPosition);
      }

      // Clear drag position
      setDragPosition(null);
    };

    if (isDragging || dragStartPos) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStartPos, dragOffset, gridSystem, gridItem.id, updateItemPosition, dragPosition, DRAG_THRESHOLD]);

  // Mouse event handlers for dragging and tooltips
  const handleMouseEnter = (e) => {
    if (!isDragging) {
      setShowTooltip(true);
      setTooltipPosition({
        x: e.clientX + 15,
        y: e.clientY - 10
      });
    }
  };

  const handleMouseMove = (e) => {
    if (showTooltip && !isDragging) {
      setTooltipPosition({
        x: e.clientX + 15,
        y: e.clientY - 10
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setShowTooltip(false);
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only handle left mouse button

    e.preventDefault();
    e.stopPropagation();

    setShowTooltip(false); // Hide tooltip when mouse down

    // Reset the just-finished-drag flag when starting a new interaction
    justFinishedDragRef.current = false;

    // Store initial mouse position for drag threshold
    setDragStartPos({ x: e.clientX, y: e.clientY });

    // Calculate drag offset from the center of the orb
    const rect = itemRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setDragOffset({
      x: e.clientX - centerX,
      y: e.clientY - centerY
    });
  };

  // Handle click to loot the item
  const handleClick = (e) => {
    // Don't loot if we were dragging or just finished dragging
    if (isDraggingRef.current || justFinishedDragRef.current) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const currentUser = useInventoryStore.getState().characterName || 'Player';
    const result = lootItem(gridItem.id, 'default', currentUser);

    // Force inventory UI refresh
    setTimeout(() => {
      const currentState = useInventoryStore.getState();
      useInventoryStore.setState({
        ...currentState,
        items: [...currentState.items]
      });
    }, 100);
  };

  // Helper function to get icon based on item type and subtype
  const getItemIcon = (type, subtype, currencyType) => {
    // Handle currency items with coin icons - use the same icon for all types (CSS filters handle colors)
    if (type === 'currency') {
      // All currency types use the same coin icon, CSS filters differentiate them
      return 'Container/Coins/golden-coin-single-isometric';
    }
    
    // Handle miscellaneous items with subtypes
    if (type === 'miscellaneous') {
      const miscIcons = {
        'TRADE_GOODS': 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins',
        'CRAFTING': 'Misc/Profession Resources/resource-bar-ingot-brick-brown-orange',
        'TOOL': 'Tools/claw-hammer',
        'QUEST': 'Misc/Books/book-folded-letter-envelope',
        'MATERIAL': 'Misc/Profession Resources/resource-log-wood-grain-cut-end',
        'REAGENT': 'Misc/Profession Resources/resource-crystal-gem-blue-teal-beige-star-glint',
        'JUNK': 'Misc/Bones/bone-femur-long-bone-diagonal'
      };
      return miscIcons[subtype] || 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins';
    }
    
    // Handle accessory items with subtypes
    if (type === 'accessory') {
      const accessoryIcons = {
        'NECKLACE': 'Armor/Neck/teal-crystal-pendant',
        'RING': 'Armor/Finger/finger-simple-teal-diamond-ring',
        'AMULET': 'Armor/Neck/fiery-orb-amulet'
      };
      return accessoryIcons[subtype] || 'Armor/Finger/finger-simple-teal-diamond-ring';
    }
    
    // Default local icons for different item types (using local paths, not WoW IDs)
    const typeIcons = {
      weapon: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt-simple',
      armor: 'Armor/Chest/chest-simple-tan-tunic',
      accessory: 'Armor/Finger/finger-simple-teal-diamond-ring',
      consumable: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
      miscellaneous: 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins',
      material: 'Misc/Profession Resources/First Aid/first-aid-bandage-rolled-fabric-beige-tan',
      quest: 'Misc/Books/book-folded-letter-envelope',
      container: 'Container/Pouch/pouch-01'
    };

    return typeIcons[type] || 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins';
  };

  // Create item object for tooltip
  const itemForTooltip = originalItem ? {
    ...originalItem,
    // Always use quantity from gridItem since it might be stacked
    quantity: gridItem.quantity || 1,
    // Preserve customName from grid item if it exists (for renamed items)
    customName: gridItem.customName || originalItem.customName,
    // Preserve subtype from gridItem if available (important for miscellaneous items)
    subtype: gridItem.subtype || originalItem.subtype,
    // Preserve currencyType from gridItem if available (important for currency items)
    currencyType: gridItem.currencyType || originalItem.currencyType
  } : {
    ...gridItem,
    id: gridItem.itemId,
    name: gridItem.customName || gridItem.name || 'Unknown Item',
    quality: gridItem.quality || gridItem.rarity || 'common',
    rarity: gridItem.rarity || gridItem.quality || 'common',
    type: gridItem.type || 'misc',
    subtype: gridItem.subtype || null,
    currencyType: gridItem.currencyType || null,
    description: gridItem.description || 'An item.'
  };

  // Get the appropriate icon for the loot orb
  // Always ensure we have an iconId - use item's iconId, gridItem's iconId, or fallback
  const iconId = itemForTooltip.iconId || gridItem.iconId || getItemIcon(itemForTooltip.type, itemForTooltip.subtype, itemForTooltip.currencyType);

  // State for handling image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [effectiveIconId, setEffectiveIconId] = useState(null);

  // Preload the image to check if it exists, with fallback
  useEffect(() => {
    // Reset state
    setImageLoaded(false);
    setImageError(false);
    
    const itemType = itemForTooltip.type;
    const itemSubtype = itemForTooltip.subtype;
    const itemCurrencyType = itemForTooltip.currencyType;
    const primaryIconId = iconId || getItemIcon(itemType, itemSubtype, itemCurrencyType);
    const fallbackIconId = getItemIcon(itemType, itemSubtype, itemCurrencyType);
    
    // Always set effectiveIconId to something, even if we haven't loaded yet
    // This ensures we at least try to show an icon
    setEffectiveIconId(primaryIconId || fallbackIconId);
    
    if (!primaryIconId && !fallbackIconId) {
      setImageError(true);
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 2; // Try primary, then fallback
    
    const tryLoadIcon = (iconIdToTry, isFallback = false) => {
      attempts++;
      const img = new Image();
      const iconUrl = getIconUrl(iconIdToTry, 'items', true);
      
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
        setEffectiveIconId(iconIdToTry);
      };
      img.onerror = () => {
        // If primary icon fails and we haven't tried fallback yet, try it
        if (!isFallback && fallbackIconId && fallbackIconId !== iconIdToTry && attempts < maxAttempts) {
          setEffectiveIconId(fallbackIconId); // Set fallback immediately
          tryLoadIcon(fallbackIconId, true);
        } else {
          // Image failed to load - don't show it, show gradient instead
          setImageError(true);
          setImageLoaded(false);
          // Keep effectiveIconId set in case we want to retry later, but don't show it
          setEffectiveIconId(fallbackIconId || iconIdToTry);
        }
      };
      
      img.src = iconUrl;
    };
    
    tryLoadIcon(primaryIconId, false);
  }, [iconId, itemForTooltip.type, itemForTooltip.subtype, itemForTooltip.currencyType]);



  // Don't render if not visible (unless in GM mode or not viewing from a token)
  if (!isItemVisible) {
    return null;
  }
  
  // CRITICAL: Items are never greyed out - they're either visible or hidden
  // Afterimages handle showing items in explored areas with ghostly appearance
  const isGreyedOut = false;

  return (
    <>
      <div
        ref={itemRef}
        className={`grid-item-orb ${imageLoaded && !imageError && effectiveIconId ? 'has-icon' : ''}`}
        data-quality={itemForTooltip.quality || itemForTooltip.rarity || 'common'}
        data-type={itemForTooltip.type}
        data-currency={itemForTooltip.type === 'currency' ? (itemForTooltip.currencyType || 'gold') : undefined}
        style={{
          position: 'absolute',
          // CRITICAL: Always include position in React style to prevent jumping during re-renders
          // When dragging, use drag position; otherwise use the ref value (updated imperatively)
          left: isDragging && dragPosition ? dragPosition.x : screenPositionRef.current.x,
          top: isDragging && dragPosition ? dragPosition.y : screenPositionRef.current.y,
          width: `${orbSize}px`,
          height: `${orbSize}px`,
          transform: 'translate(-50%, -50%)',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: isDragging ? 10000 : 1000, // Higher z-index when dragging
          pointerEvents: 'all',
          boxSizing: 'border-box',
          borderRadius: '50%',
          opacity: isDragging ? 0.9 : (isGreyedOut ? 0.4 : 1), // Greyed out when in explored but not visible
          // Apply currency filters via CSS using data-currency attribute (more reliable)
          // Only apply grey filter inline if needed, otherwise let CSS handle currency filters
          filter: isGreyedOut ? 'grayscale(0.8) brightness(0.6) !important' : undefined,
          boxShadow: isDragging
            ? '0 8px 16px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.8)'
            : '0 2px 4px rgba(0, 0, 0, 0.2)',
          // No transition on position properties to prevent floating during camera movement
          transition: isDragging ? 'none' : 'filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
          // Conditionally add background image for the item icon
          // Only show icon if it loaded successfully, otherwise show gradient background
          // For currency items, always show the icon with CSS filters for coloring
          ...(imageLoaded && !imageError && effectiveIconId ? {
            backgroundImage: `url(${getIconUrl(effectiveIconId, 'items', true)})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'transparent' // Override any CSS background colors
          } : {
            // Fallback to original orb styling with gradients only (when no icon or icon failed to load)
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
        onMouseDown={handleMouseDown}
      >
        {/* Quantity display for stacked items */}
        {(itemForTooltip.quantity && itemForTooltip.quantity > 1) && (
          <div
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              backgroundColor: 'white',
              color: 'black',
              fontSize: `${Math.max(10, orbSize * 0.2)}px`,
              fontWeight: 'bold',
              padding: '1px 4px',
              borderRadius: '50%',
              border: '2px solid rgba(0, 0, 0, 0.6)',
              minWidth: '16px',
              minHeight: '16px',
              textAlign: 'center',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: 'none',
              pointerEvents: 'none',
              zIndex: 2,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
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
