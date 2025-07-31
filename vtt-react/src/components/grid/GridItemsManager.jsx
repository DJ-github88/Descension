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
    const removeItemFromGrid = useGridItemStore.getState().removeItemFromGrid;

    // Check each grid item to see if its referenced item still exists
    gridItems.forEach(gridItem => {
      // First check if the item exists directly by itemId
      let itemExists = items.some(item => item.id === gridItem.itemId);

      // If not found and we have an originalItemStoreId, check that too
      if (!itemExists && gridItem.originalItemStoreId) {
        itemExists = items.some(item => item.id === gridItem.originalItemStoreId);
      }

      // For items that don't have a reference in the item store (like inventory items),
      // we should keep them on the grid even if they don't exist in the item store
      if (!itemExists && !gridItem.originalItemStoreId) {
        console.log(`Grid item ${gridItem.id} references an item that no longer exists: ${gridItem.itemId}`);
        // Only remove the grid item if it's not a standalone item (like from inventory)
        // We can identify standalone items by checking if they have all necessary properties
        const isStandaloneItem = gridItem.name && (gridItem.type || gridItem.isCurrency);

        if (!isStandaloneItem) {
          console.log(`Removing grid item ${gridItem.id} because its referenced item no longer exists`);
          removeItemFromGrid(gridItem.id);
        } else {
          console.log(`Keeping standalone grid item ${gridItem.id} (${gridItem.name}) despite missing reference`);
        }
      }
    });
  }, [gridItems, items]);

  // This component doesn't render anything visible
  return null;
};

export default GridItemsManager;
