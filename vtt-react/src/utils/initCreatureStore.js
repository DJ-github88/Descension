import { LIBRARY_CREATURES, CREATURE_LIBRARY_VERSION } from '../data/creatureLibraryData';
import useCreatureStore from '../store/creatureStore';

const STORAGE_VERSION_KEY = 'creature-library-version';

/**
 * Initialize the creature store with sample creatures
 * This is the single point of initialization to prevent duplicates
 * 
 * Now replaces old creatures with new library creatures to ensure the library is up to date
 */
const initCreatureStore = () => {

  const creatureStore = useCreatureStore.getState();
  
  // Check stored version
  const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
  const versionChanged = storedVersion !== CREATURE_LIBRARY_VERSION;

  // Get IDs of creatures in the library
  const libraryCreatureIds = new Set(LIBRARY_CREATURES.map(c => c.id));
  
  // Get IDs of creatures currently in the store
  const storeCreatureIds = new Set(creatureStore.creatures.map(c => c.id));
  
  // Check if we need to update (if library has different creatures or version changed)
  const needsUpdate = 
    versionChanged ||
    creatureStore.creatures.length === 0 || 
    LIBRARY_CREATURES.length !== creatureStore.creatures.length ||
    ![...libraryCreatureIds].every(id => storeCreatureIds.has(id)) ||
    ![...storeCreatureIds].every(id => libraryCreatureIds.has(id));

  if (needsUpdate) {
    console.log('🔄 Updating creature store with new library creatures...');
    if (versionChanged) {
      console.log(`📦 Library version changed: ${storedVersion} -> ${CREATURE_LIBRARY_VERSION}`);
    }
    
    // Clear existing creatures and add new ones
    creatureStore.setCreatures([]);
    
    // Add all library creatures
    let addedCount = 0;
    LIBRARY_CREATURES.forEach(creature => {
      creatureStore.addCreature(creature);
      addedCount++;
    });
    
    // Store the new version
    localStorage.setItem(STORAGE_VERSION_KEY, CREATURE_LIBRARY_VERSION);
    
    console.log(`✅ Loaded ${addedCount} creatures from library`);
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
