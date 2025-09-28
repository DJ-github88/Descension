import { LIBRARY_CREATURES } from '../data/creatureLibraryData';
import useCreatureStore from '../store/creatureStore';

/**
 * Initialize the creature store with sample creatures
 * This is the single point of initialization to prevent duplicates
 */
const initCreatureStore = () => {
  console.log('🐉 initCreatureStore called');

  const creatureStore = useCreatureStore.getState();
  console.log('📊 Current creature count:', creatureStore.creatures.length);

  // Check if the store already has creatures
  if (creatureStore.creatures.length === 0) {
    console.log('🔄 Initializing creature store with sample creatures');

    // Add sample creatures to the store with duplicate checking
    let addedCount = 0;
    LIBRARY_CREATURES.forEach(creature => {
      // Double-check for existing creature to prevent duplicates
      const existingCreature = creatureStore.creatures.find(c => c.id === creature.id);
      if (!existingCreature) {
        creatureStore.addCreature(creature);
        addedCount++;
      } else {
        console.log('⚠️ Skipping duplicate creature:', creature.name);
      }
    });

    console.log(`✅ Added ${addedCount} creatures to the store`);
  } else {
    console.log('⏭️ Creature store already has creatures, skipping initialization');
  }
};

/**
 * Remove duplicate creatures from the store
 * This can be called to clean up any existing duplicates
 */
export const removeDuplicateCreatures = () => {
  console.log('🧹 Removing duplicate creatures from store');

  const creatureStore = useCreatureStore.getState();
  const uniqueCreatures = [];
  const seenIds = new Set();

  creatureStore.creatures.forEach(creature => {
    if (!seenIds.has(creature.id)) {
      seenIds.add(creature.id);
      uniqueCreatures.push(creature);
    } else {
      console.log('🗑️ Removing duplicate creature:', creature.name, 'ID:', creature.id);
    }
  });

  if (uniqueCreatures.length !== creatureStore.creatures.length) {
    console.log(`📊 Removed ${creatureStore.creatures.length - uniqueCreatures.length} duplicate creatures`);
    // Update the store with unique creatures only
    creatureStore.setCreatures(uniqueCreatures);
  } else {
    console.log('✅ No duplicate creatures found');
  }
};

export default initCreatureStore;
