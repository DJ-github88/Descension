import React, { useEffect } from 'react';
import useGridItemStore from '../../store/gridItemStore';
import useItemStore from '../../store/itemStore';

/**
 * GridItemsManager is a component that manages the lifecycle of grid items.
 * It doesn't render anything visible but handles synchronization between
 * the grid item store and other stores.
 */
const GridItemsManager = () => {
  // Get the grid items and item store
  const gridItems = useGridItemStore(state => state.gridItems);
  const items = useItemStore(state => state.items);

  // Cleanup any grid items that reference items that no longer exist
  useEffect(() => {
    if (gridItems.length === 0 || items.length === 0) return;

    const removeItemFromGrid = useGridItemStore.getState().removeItemFromGrid;
    const itemIds = new Set(items.map(item => item.id));
    const itemsToRemove = [];

    gridItems.forEach(gridItem => {
      const itemExists = itemIds.has(gridItem.itemId) ||
        (gridItem.originalItemStoreId && itemIds.has(gridItem.originalItemStoreId));

      if (!itemExists && !gridItem.originalItemStoreId) {
        const isStandaloneItem = gridItem.name && (gridItem.type || gridItem.isCurrency);
        if (!isStandaloneItem) {
          itemsToRemove.push(gridItem.id);
        }
      }
    });

    if (itemsToRemove.length > 0) {
      itemsToRemove.forEach(id => removeItemFromGrid(id));
    }
  }, [gridItems, items]);

  // This component doesn't render anything visible
  return null;
};

export default GridItemsManager;
