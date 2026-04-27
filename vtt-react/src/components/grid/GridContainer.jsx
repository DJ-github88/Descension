import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import useGridItemStore from '../../store/gridItemStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { isPointInPolygon } from '../../utils/VisibilityCalculations';
import ItemTooltip from '../item-generation/ItemTooltip';
import ContainerWindow from '../item-generation/ContainerWindow';
import UnlockContainerModal from '../item-generation/UnlockContainerModal';
import LockSettingsModal from '../item-generation/LockSettingsModal';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import '../../styles/grid-container.css';
import useLongPressContextMenu from '../../hooks/useLongPressContextMenu';
import { getIconUrl } from '../../utils/assetManager';

const GridContainer = ({ gridItem }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showLockSettings, setShowLockSettings] = useState(false);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localPosition, setLocalPosition] = useState(null);
  const dragRafRef = useRef(null);
  const pendingWorldPosRef = useRef(null);
  
  const containerRef = useRef(null);
  const contextMenuRef = useRef(null);
  const lastPointerTypeRef = useRef('mouse');
  const isDraggingRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const longPressHandlers = useLongPressContextMenu();

  // Get current game state for reactive updates
  const cameraX = useGameStore(state => state.cameraX);
  const cameraY = useGameStore(state => state.cameraY);
  const zoomLevel = useGameStore(state => state.zoomLevel);
  const playerZoom = useGameStore(state => state.playerZoom);
  const gridSize = useGameStore(state => state.gridSize);
  const isGMMode = useGameStore(state => state.isGMMode);
  const effectiveZoom = zoomLevel * playerZoom;
  const gridSystem = getGridSystem();

  // Get level editor state for visibility calculations
  const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
  const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
  const visibleArea = useLevelEditorStore(state => state.visibleArea);
  const controlledVisibleTiles = useLevelEditorStore(state => state.controlledVisibleTiles);
  const visibilityPolygon = useLevelEditorStore(state => state.visibilityPolygon);
  const fogOfWarPaths = useLevelEditorStore(state => state.fogOfWarPaths);
  const fogOfWarData = useLevelEditorStore(state => state.fogOfWarData);

  // Get the original item from the item store
  const items = useItemStore(state => state.items);

  // First try to find the item using originalItemStoreId if available
  // This helps with items that came from inventory but originated in the item store
  let originalItem = null;
  if (gridItem.originalItemStoreId) {
    originalItem = items.find(item => item.id === gridItem.originalItemStoreId);
    console.log('GridContainer: Found original item using originalItemStoreId:', originalItem);
  }

  // If not found, try the regular itemId
  if (!originalItem) {
    originalItem = items.find(item => item.id === gridItem.itemId);
  }

  // Get the container functions from the item store
  const openContainers = useItemStore(state => state.openContainers);
  const toggleContainerOpen = useItemStore(state => state.toggleContainerOpen);

  // Get the loot function from the grid item store
  const lootItem = useGridItemStore(state => state.lootItem);
  const removeItemFromGrid = useGridItemStore(state => state.removeItemFromGrid);
  const updateItemPosition = useGridItemStore(state => state.updateItemPosition);
  const setGridItemHidden = useGridItemStore(state => state.setGridItemHidden);
  const updateGridItemProperties = useGridItemStore(state => state.updateGridItemProperties);

  // Use gridItem as fallback when originalItem isn't available in the player's itemStore
  // Compute the combined display item properties
  const displayItem = useMemo(() => {
    if (!originalItem) return gridItem;
    
    // Merge original item properties with grid item overrides
    // Instanced grid item properties (loot, locks, visibility) must take precedence
    return {
      ...originalItem,
      ...gridItem,
      id: gridItem.id, // Always use the unique grid item ID
      containerProperties: {
         ...(originalItem.containerProperties || {}),
         ...(gridItem.containerProperties || {})
      }
    };
  }, [originalItem, gridItem]);

  // Initialize localPosition from gridItem.position
  useEffect(() => {
    if (!isDragging && !isMouseDown && gridItem.position) {
      setLocalPosition(gridItem.position);
    }
  }, [gridItem.position, isDragging, isMouseDown]);

  // Cleanup openContainers on unmount to prevent stale state
  useEffect(() => {
    return () => {
      const { openContainers: currentOpen, toggleContainerOpen: toggle } = useItemStore.getState();
      if (currentOpen.has(gridItem.id)) {
        toggle(gridItem.id);
      }
    };
  }, [gridItem.id]);

  // Simple tooltip handlers (matching character sheet pattern)
  const handleMouseEnter = (e) => {
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

  // Handle context menu
  const handleContextMenu = (e) => {
    console.log('🎒 GridContainer context menu triggered!', originalItem?.name);
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showContextMenu]);

  // Dragging logic
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !isGMMode) return; // Left click only for GM
    if (showContextMenu) return;

    e.preventDefault();
    e.stopPropagation();

    isMouseDownRef.current = true;
    setIsMouseDown(true);

    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isMouseDownRef.current || !isGMMode) return;

      if (!isDraggingRef.current) {
        const moveDist = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
        if (moveDist > 2) {
          isDraggingRef.current = true;
          setIsDragging(true);
        }
      }

      if (isDraggingRef.current) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const screenX = e.clientX - dragOffset.x;
        const screenY = e.clientY - dragOffset.y;
        
        const worldPos = gridSystem.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);
        pendingWorldPosRef.current = worldPos;

        if (!dragRafRef.current) {
          dragRafRef.current = requestAnimationFrame(() => {
            if (pendingWorldPosRef.current) {
              setLocalPosition(pendingWorldPosRef.current);
            }
            dragRafRef.current = null;
          });
        }
      }
    };

    const handleGlobalMouseUp = (e) => {
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = null;
      }

      if (!isMouseDownRef.current) return;

      if (isDraggingRef.current) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const screenX = e.clientX - dragOffset.x;
        const screenY = e.clientY - dragOffset.y;
        
        const worldPos = gridSystem.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);
        const snappedPos = gridSystem.snapToGrid(worldPos.x, worldPos.y);
        const gridCoords = gridSystem.worldToGrid(snappedPos.x + gridSize / 2, snappedPos.y + gridSize / 2);

        updateItemPosition(gridItem.id, {
          x: snappedPos.x + gridSize / 2,
          y: snappedPos.y + gridSize / 2,
          gridPosition: {
            row: gridCoords.y,
            col: gridCoords.x
          }
        });
      }

      isMouseDownRef.current = false;
      isDraggingRef.current = false;
      setIsMouseDown(false);
      setIsDragging(false);
    };

    if (isMouseDown) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = null;
      }
    };
  }, [isMouseDown, dragOffset, gridSystem, gridItem.id, isGMMode, updateItemPosition, gridSize]);

  const handleClick = (e) => {
    // Prevent looting if we were dragging
    if (isDragging) return;

    // Distinguish between touch (usually for tooltips) and mouse (for looting)
    if (lastPointerTypeRef.current === 'touch') {
      setShowTooltip(prev => !prev);
      return;
    }

    // Prevent propagation
    e.stopPropagation();

    // Open the container on click - matches standard container behavior and respects locks
    handleOpenContainer();
  };

  // Handle opening the container
  const handleOpenContainer = () => {
    // Check if the container is locked
    const isLocked = displayItem.containerProperties?.isLocked;

    // GM always bypasses locks
    if (isLocked && !isGMMode) {
      // Show the unlock modal
      setShowUnlockModal(true);
    } else {
      // Open the container if it's not locked or user is GM
      setIsContainerOpen(true);
      if (!openContainers.has(displayItem.id)) {
        toggleContainerOpen(displayItem.id);
      }
    }

    // Close the context menu
    setShowContextMenu(false);
  };

  // Handle successful unlock
  const handleUnlockSuccess = () => {
    // Close the unlock modal
    setShowUnlockModal(false);

    // Open the container
    setIsContainerOpen(true);

    // Update the container properties on the grid so other players see it unlocked
    updateGridItemProperties(gridItem.id, {
      containerProperties: {
        ...(displayItem.containerProperties || {}),
        isLocked: false
      }
    });

    toggleContainerOpen(displayItem.id);
  };

  // Handle saving lock settings
  const handleLockSettingsSave = (settings) => {
    updateGridItemProperties(gridItem.id, {
      containerProperties: {
        ...(displayItem.containerProperties || {}),
        ...settings
      }
    });
    setShowLockSettings(false);
  };



  // Handle removing the container
  const handleRemoveContainer = () => {
    removeItemFromGrid(gridItem.id);
    setShowContextMenu(false);
  };

  // Handle toggling visibility
  const handleToggleVisibility = () => {
    setGridItemHidden(gridItem.id, !gridItem.isHidden);
    setShowContextMenu(false);
  };

  // Convert grid coordinates to screen coordinates using the same system as CreatureToken
  const screenPosition = useMemo(() => {
    // If dragging, use local position
    if (isDragging && localPosition) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const screenPos = gridSystem.worldToScreen(localPosition.x, localPosition.y, viewportWidth, viewportHeight);
      return {
        x: Math.round(screenPos.x),
        y: Math.round(screenPos.y)
      };
    }

    if (!gridItem.gridPosition) return { x: 0, y: 0 };

    // Convert grid position to world coordinates first
    const worldPos = gridSystem.gridToWorld(gridItem.gridPosition.col, gridItem.gridPosition.row);

    // Use same coordinate conversion as CreatureToken for consistency
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, viewportWidth, viewportHeight);

    // Round to integers to prevent sub-pixel jitter/flickering
    return {
      x: Math.round(screenPos.x),
      y: Math.round(screenPos.y)
    };
  }, [
    gridItem.gridPosition?.col,
    gridItem.gridPosition?.row,
    gridSystem,
    cameraX,
    cameraY,
    effectiveZoom,
    gridSize,
    originalItem,
    isDragging,
    localPosition
  ]);

  // Calculate container dimensions based on grid size and zoom
  const containerDimensions = useMemo(() => {
    // For now, we'll make all containers 1x1 to match the grid
    const containerSize = { rows: 1, cols: 1 };
    const containerWidth = containerSize.cols * gridSize * effectiveZoom;
    const containerHeight = containerSize.rows * gridSize * effectiveZoom;
    return { width: containerWidth, height: containerHeight };
  }, [gridSize, effectiveZoom]);

  // Compute visibleAreaSet for O(1) lookups
  const visibleAreaSet = useMemo(() => {
    if (!visibleArea) return new Set();
    const combined = new Set(visibleArea);
    if (controlledVisibleTiles) controlledVisibleTiles.forEach(t => combined.add(t));
    return combined;
  }, [visibleArea, controlledVisibleTiles]);

  // Calculate world position for visibility checks
  const itemWorldPosition = useMemo(() => {
    if (!gridItem.gridPosition) return null;
    return gridSystem.gridToWorld(gridItem.gridPosition.col, gridItem.gridPosition.row);
  }, [gridItem.gridPosition, gridSystem]);

  // Visibility checking - similar to GridItem.jsx
  const containerVisibilityState = useMemo(() => {
    // GM mode - always show containers
    if (isGMMode) return { visible: true, greyedOut: false };

    // Player mode - check visibility based on FOV system
    if (viewingFromToken && dynamicFogEnabled && !isGMMode) {
      // Check if container position is in visible area
      if (!itemWorldPosition || itemWorldPosition.x === undefined || itemWorldPosition.y === undefined) {
        return { visible: false, greyedOut: false };
      }

      // PRIMARY CHECK: Use visibleAreaSet for consistency with fog and afterimage systems
      if (visibleAreaSet && visibleAreaSet.size > 0) {
        // WALL-OCCLUSION FIX: Use visibilityPolygon for precise checks
        if (visibilityPolygon && visibilityPolygon.length >= 3) {
          const isInPolygon = isPointInPolygon(
            itemWorldPosition.x,
            itemWorldPosition.y,
            visibilityPolygon
          );
          // If in polygon, show; if not in polygon, hide (don't grey out)
          return { visible: isInPolygon, greyedOut: false };
        }

        // Fallback to tile-based check (no visibility polygon available)
        const gridCoords = gridSystem.worldToGrid(itemWorldPosition.x, itemWorldPosition.y);
        const tileKey = `${gridCoords.x},${gridCoords.y}`;
        const isInVisibleArea = visibleAreaSet.has(tileKey);
        return { visible: isInVisibleArea, greyedOut: false };
      }

      // If we have a viewing token and dynamic fog but no visible area calculated yet, hide
      if (viewingFromToken && viewingFromToken.position) {
        return { visible: false, greyedOut: false };
      }
      return { visible: true, greyedOut: false };
    }

    // If not viewing from a token and not in GM mode, check if fog covers the map
    if (!viewingFromToken && !isGMMode) {
      const hasFogContent = (fogOfWarPaths && fogOfWarPaths.length > 0) || 
                           (fogOfWarData && Object.keys(fogOfWarData).length > 0);
      if (hasFogContent) {
        return { visible: false, greyedOut: false }; // Map is fogged — hide until player places a token
      }
      return { visible: true, greyedOut: false }; // No fog — show normally
    }

    return { visible: true, greyedOut: false };
  }, [isGMMode, viewingFromToken, dynamicFogEnabled, itemWorldPosition, visibleAreaSet, visibilityPolygon, gridSystem, fogOfWarPaths, fogOfWarData]);

  // Visibility logic
  if (gridItem.isHidden && !isGMMode) return null;
  if (!containerVisibilityState.visible) return null;

  const isGreyedOut = containerVisibilityState.greyedOut;

  return (
    <>
      <div
        ref={containerRef}
        className={`grid-item-container ${gridItem.isHidden && isGMMode ? 'container-gm-hidden' : ''}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`,
          transform: `translate3d(${screenPosition.x}px, ${screenPosition.y}px, 0) translate(-50%, -50%)`,
          border: `${Math.max(1, containerDimensions.width * 0.04)}px solid ${getQualityColor(displayItem.quality)}`,
          boxShadow: `0 0 ${containerDimensions.width * 0.2}px ${getQualityColor(displayItem.quality)}80`,
          backgroundImage: displayItem.imageUrl ? `url(${displayItem.imageUrl})` :
            (displayItem.iconId ? `url(${getIconUrl(displayItem.iconId, 'items')})` :
              `url(${getIconUrl('brown-backpack-sleeping-bag', 'items')})`),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          overflow: 'visible', // Changed to visible for the hidden tag
          cursor: isDragging ? 'grabbing' : 'pointer',
          zIndex: isDragging ? 200 : 100,
          pointerEvents: 'all',
          willChange: 'transform',
          transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
          // Lightened greyed out effect for containers in explored but not visible areas
          opacity: isGreyedOut ? 0.8 : 1,
          filter: 'none'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onPointerDown={(e) => {
          lastPointerTypeRef.current = e.pointerType || 'mouse';
          longPressHandlers.onPointerDown(e);
        }}
        onPointerMove={longPressHandlers.onPointerMove}
        onPointerUp={longPressHandlers.onPointerUp}
        onPointerCancel={longPressHandlers.onPointerCancel}
        >
          {gridItem.isHidden && isGMMode && (
            <div
              className={`condition-ring-wrapper condition-ring-0 condition-ring-static`}
              style={{
                '--ring-index': 0,
                '--ring-radius': 52,
                animationDelay: `0s`,
                inset: `-15%`,
                width: `130%`,
                height: `130%`,
              }}
            >
              <svg
                className={`condition-ring-svg hidden`}
                viewBox="0 0 140 140"
                aria-hidden="true"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <path
                    id={`${gridItem.id}-hidden-ring-path`}
                    d={`M10,10 H130 V130 H10 Z`}
                  />
                </defs>
                <text
                  className={`condition-ring-text condition-text-hidden`}
                  textLength={4 * 120 * 0.98}
                  lengthAdjust="spacing"
                >
                  <textPath href={`#${gridItem.id}-hidden-ring-path`} startOffset="0%">
                    {Array(Math.max(4, Math.floor((4 * 120) / (9 * 6)))).fill("HIDDEN • ").join('')}
                    <animate attributeName="startOffset" from="0%" to="100%" dur="20s" repeatCount="indefinite" />
                  </textPath>
                </text>
              </svg>
            </div>
          )}

          {/* Quantity Badge */}
          {displayItem.quantity > 1 && (
            <div 
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                background: '#8b4513',
                color: '#f4eee0',
                borderRadius: '4px',
                padding: '1px 4px',
                fontSize: `${Math.max(10, gridSize * effectiveZoom * 0.2)}px`,
                fontWeight: 'bold',
                border: '1px solid #5a1e12',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                zIndex: 10,
                pointerEvents: 'none',
                fontFamily: "'Cinzel', serif"
              }}
            >
              {displayItem.quantity}x
            </div>
          )}
        
        {/* Container icon is now a background image */}
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
            <ItemTooltip item={displayItem} />
          </div>
        </TooltipPortal>
      )}

      {showContextMenu && createPortal(
        <UnifiedContextMenu
          visible={true}
          x={contextMenuPosition.x}
          y={contextMenuPosition.y}
          onClose={() => setShowContextMenu(false)}
          items={[

            {
              icon: <i className="fas fa-box-open"></i>,
              label: displayItem.containerProperties?.isLocked ? 'Unlock Container' : 'Open Container',
              onClick: handleOpenContainer
            },
            isGMMode && {
              icon: <i className={`fas ${gridItem.isHidden ? 'fa-eye' : 'fa-eye-slash'}`}></i>,
              label: gridItem.isHidden ? 'Show to Players' : 'Hide from Players',
              onClick: handleToggleVisibility
            },
            isGMMode && {
              icon: <i className="fas fa-lock"></i>,
              label: 'Lock Settings',
              onClick: () => {
                setShowLockSettings(true);
                setShowContextMenu(false);
              }
            },
            isGMMode && {
              icon: <i className="fas fa-trash-alt"></i>,
              label: 'Remove Container',
              onClick: handleRemoveContainer,
              className: 'danger'
            }
          ].filter(Boolean)}
        />,
        document.body
      )}

      {isContainerOpen && displayItem && openContainers.has(displayItem.id) && (
        <ContainerWindow
          container={displayItem}
          onClose={() => {
            setIsContainerOpen(false);
            if (openContainers.has(displayItem.id)) {
              toggleContainerOpen(displayItem.id);
            }
          }}
        />
      )}

      {/* Unlock Container Modal */}
      {showUnlockModal && displayItem && (
        <UnlockContainerModal
          container={displayItem}
          onSuccess={handleUnlockSuccess}
          onClose={() => setShowUnlockModal(false)}
        />
      )}

      {/* Lock Settings Modal (GM only) */}
      {showLockSettings && isGMMode && (
        <LockSettingsModal
          container={displayItem}
          onSave={handleLockSettingsSave}
          onClose={() => setShowLockSettings(false)}
        />
      )}
    </>
  );
};

// Helper function to get quality color
const getQualityColor = (quality) => {
  const qualityLower = quality?.toLowerCase() || 'common';
  return RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;
};

export default GridContainer;
