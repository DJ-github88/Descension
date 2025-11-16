import { LIBRARY_CREATURES } from '../data/creatureLibraryData';
import useCreatureStore from '../store/creatureStore';

/**
 * Initialize the creature store with sample creatures
 * This is the single point of initialization to prevent duplicates
 */
const initCreatureStore = () => {

  const creatureStore = useCreatureStore.getState();

  // Check if the store already has creatures
  if (creatureStore.creatures.length === 0) {

    // Add sample creatures to the store with duplicate checking
    let addedCount = 0;
    LIBRARY_CREATURES.forEach(creature => {
      // Double-check for existing creature to prevent duplicates
      const existingCreature = creatureStore.creatures.find(c => c.id === creature.id);
      if (!existingCreature) {
        creatureStore.addCreature(creature);
        addedCount++;
      } else {
      }
    });

  } else {
  }
};

/**
 * Remove duplicate creatures from the store
 * This can be called to clean up any existing duplicates
 */
export const removeDuplicateCreatures = () => {

  const creatureStore = useCreatureStore.getState();
  const uniqueCreatures = [];
  const seenIds = new Set();

  creatureStore.creatures.forEach(creature => {
    if (!seenIds.has(creature.id)) {
      seenIds.add(creature.id);
      uniqueCreatures.push(creature);
    }
  });

  if (uniqueCreatures.length !== creatureStore.creatures.length) {
    // Update the store with unique creatures only
    creatureStore.setCreatures(uniqueCreatures);
  } else {
  }
};

export default initCreatureStore;
