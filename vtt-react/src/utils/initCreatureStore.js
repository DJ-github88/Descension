import { LIBRARY_CREATURES } from '../data/creatureLibraryData';
import useCreatureStore from '../store/creatureStore';

/**
 * Initialize the creature store with sample creatures
 */
const initCreatureStore = () => {
  // initCreatureStore called

  const creatureStore = useCreatureStore.getState();
  // Initial creature store state and count tracked

  // Check if the store already has creatures
  if (creatureStore.creatures.length === 0) {
    // Initializing creature store with sample creatures

    // Add sample creatures to the store
    LIBRARY_CREATURES.forEach(creature => {
      // Adding creature to store
      creatureStore.addCreature(creature);
    });

    // Added sample creatures to the store
  } else {
    // Creature store already has creatures, skipping initialization
  }
};

export default initCreatureStore;
