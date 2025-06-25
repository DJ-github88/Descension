import { LIBRARY_CREATURES } from '../data/creatureLibraryData';
import useCreatureStore from '../store/creatureStore';

/**
 * Initialize the creature store with sample creatures
 */
export const initCreatureStore = () => {
  console.log('initCreatureStore called');

  const creatureStore = useCreatureStore.getState();
  console.log('Initial creature store state:', creatureStore);
  console.log('Initial number of creatures:', creatureStore.creatures.length);

  // Check if the store already has creatures
  if (creatureStore.creatures.length === 0) {
    console.log('Initializing creature store with sample creatures...');
    console.log('Sample creatures:', LIBRARY_CREATURES);

    // Add sample creatures to the store
    LIBRARY_CREATURES.forEach(creature => {
      console.log('Adding creature to store:', creature.name);
      creatureStore.addCreature(creature);
    });

    console.log(`Added ${LIBRARY_CREATURES.length} sample creatures to the store.`);
    console.log('Updated creature store state:', useCreatureStore.getState());
    console.log('Updated number of creatures:', useCreatureStore.getState().creatures.length);
  } else {
    console.log('Creature store already has creatures, skipping initialization.');
  }
};

export default initCreatureStore;
