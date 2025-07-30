import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import useGridItemStore from '../../store/gridItemStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import ItemTooltip from '../item-generation/ItemTooltip';
import ContainerWindow from '../item-generation/ContainerWindow';
import UnlockContainerModal from '../item-generation/UnlockContainerModal';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import '../../styles/grid-container.css';

const GridContainer = ({ gridItem }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const containerRef = useRef(null);
  const contextMenuRef = useRef(null);

  // Get current game state for reactive updates
  const gameState = useGameStore();
  const { cameraX, cameraY, zoomLevel, playerZoom, gridSize } = gameState;
  const effectiveZoom = zoomLevel * playerZoom;
  const gridSystem = getGridSystem();

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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  // Handle opening the container
  const handleOpenContainer = () => {
    // Check if the container is locked
    const isLocked = originalItem.containerProperties?.isLocked;

    if (isLocked) {
      // Show the unlock modal
      setShowUnlockModal(true);
    } else {
      // Open the container if it's not locked
      setIsContainerOpen(true);
      toggleContainerOpen(originalItem.id);
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
    toggleContainerOpen(originalItem.id);
  };

  // Handle looting the container
  const handleLootContainer = () => {
    lootItem(gridItem.id);
    setShowContextMenu(false);
  };

  // Handle removing the container
  const handleRemoveContainer = () => {
    removeItemFromGrid(gridItem.id);
    setShowContextMenu(false);
  };

  // Convert grid coordinates to screen coordinates using the same system as GridItem
  const screenPosition = useMemo(() => {
    if (!gridItem.gridPosition || !originalItem) return { x: 0, y: 0 };

    try {
      // Use the same coordinate system as GridItem and GM notes
      const worldPos = gridSystem.gridToWorld(gridItem.gridPosition.col, gridItem.gridPosition.row);
      const viewport = gridSystem.getViewportDimensions();
      const screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);

      return screenPos;
    } catch (error) {
      // Fallback calculation using simplified grid positioning
      const worldX = (gridItem.gridPosition.col * gridSize) + (gridSize / 2);
      const worldY = (gridItem.gridPosition.row * gridSize) + (gridSize / 2);

      return {
        x: (worldX - cameraX) * effectiveZoom + window.innerWidth / 2,
        y: (worldY - cameraY) * effectiveZoom + window.innerHeight / 2
      };
    }
  }, [
    gridItem.gridPosition?.col,
    gridItem.gridPosition?.row,
    gridSystem,
    cameraX,
    cameraY,
    zoomLevel,
    playerZoom,
    effectiveZoom,
    gridSize,
    originalItem
  ]);

  // Calculate container dimensions based on grid size and zoom
  const containerDimensions = useMemo(() => {
    // For now, we'll make all containers 1x1 to match the grid
    const containerSize = { rows: 1, cols: 1 };
    const containerWidth = containerSize.cols * gridSize * effectiveZoom;
    const containerHeight = containerSize.rows * gridSize * effectiveZoom;
    return { width: containerWidth, height: containerHeight };
  }, [gridSize, effectiveZoom]);

  // If the original item doesn't exist, don't render anything (early return after all hooks)
  if (!originalItem) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="grid-container"
        style={{
          position: 'absolute',
          left: screenPosition.x,
          top: screenPosition.y,
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`,
          transform: 'translate(-50%, -50%)',
          border: `${Math.max(1, containerDimensions.width * 0.04)}px solid ${getQualityColor(originalItem.quality)}`,
          boxShadow: `0 0 ${containerDimensions.width * 0.2}px ${getQualityColor(originalItem.quality)}80`,
          backgroundImage: originalItem.imageUrl ? `url(${originalItem.imageUrl})` :
            (originalItem.iconId ? `url(https://wow.zamimg.com/images/wow/icons/large/${originalItem.iconId}.jpg)` :
            'url(https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg)'),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          zIndex: 20,
          pointerEvents: 'all',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        onClick={(e) => {
          // Only show context menu on left click, not when dragging
          if (e.button === 0) {
            handleContextMenu(e);
          }
        }}
      >
        <div
          className="grid-container-header"
          style={{
            fontSize: `${Math.max(8, containerDimensions.width * 0.08)}px`,
            padding: `${Math.max(2, containerDimensions.width * 0.02)}px`,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            textAlign: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {originalItem.name}
        </div>
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
            <ItemTooltip item={originalItem} />
          </div>
        </TooltipPortal>
      )}

      {showContextMenu && createPortal(
        <div
          ref={contextMenuRef}
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            zIndex: 10000
          }}
        >
          <div className="context-menu-item" onClick={handleOpenContainer}>
            <i className="fas fa-box-open"></i> {originalItem.containerProperties?.isLocked ? 'Unlock Container' : 'Open Container'}
          </div>
          <div className="context-menu-item" onClick={handleRemoveContainer}>
            <i className="fas fa-trash-alt"></i> Remove Container
          </div>
        </div>,
        document.body
      )}

      {isContainerOpen && openContainers.has(originalItem.id) && (
        <ContainerWindow
          container={originalItem}
          onClose={() => {
            setIsContainerOpen(false);
            toggleContainerOpen(originalItem.id);
          }}
        />
      )}

      {/* Unlock Container Modal */}
      {showUnlockModal && (
        <UnlockContainerModal
          container={originalItem}
          onSuccess={handleUnlockSuccess}
          onClose={() => setShowUnlockModal(false)}
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
