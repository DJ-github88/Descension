import { DATA_VERSIONS, DATA_FILES } from '../data/versions';
import useCreatureStore from '../store/creatureStore';
import { getCachedData, setCachedData } from '../services/dataCache';

const STORAGE_VERSION_KEY = 'creature-library-version';

const fetchJSON = (url) => fetch(url).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });

const initCreatureStore = async () => {
  const creatureStore = useCreatureStore.getState();
  const expectedVersion = DATA_VERSIONS.creatures;

  const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
  const versionChanged = storedVersion !== expectedVersion;

  const libraryCreatureIds = new Set(creatureStore.creatures.map(c => c.id));

  const needsUpdate =
    versionChanged ||
    creatureStore.creatures.length === 0;

  if (!needsUpdate) return;

  console.log('Updating creature store from JSON data...');
  if (versionChanged) {
    console.log(`Library version changed: ${storedVersion} -> ${expectedVersion}`);
  }

  try {
    let LIBRARY_CREATURES = null;
    let ADVANCED_ABILITIES = null;
    const expectedAbilitiesVersion = DATA_VERSIONS.abilities;

    // Check IndexedDB cache for creatures
    const cachedCreatures = await getCachedData('creatures');
    if (cachedCreatures && cachedCreatures.version === expectedVersion) {
      LIBRARY_CREATURES = cachedCreatures.data;
    } else {
      LIBRARY_CREATURES = await fetchJSON(DATA_FILES.creatures);
      setCachedData('creatures', expectedVersion, LIBRARY_CREATURES).catch(() => {});
    }

    // Check IndexedDB cache for abilities
    const cachedAbilities = await getCachedData('abilities');
    if (cachedAbilities && cachedAbilities.version === expectedAbilitiesVersion) {
      ADVANCED_ABILITIES = cachedAbilities.data;
    } else {
      ADVANCED_ABILITIES = await fetchJSON(DATA_FILES.abilities);
      setCachedData('abilities', expectedAbilitiesVersion, ADVANCED_ABILITIES).catch(() => {});
    }

    const newCreatures = LIBRARY_CREATURES.map(creature => {
      const advancedAbilities = ADVANCED_ABILITIES?.[creature.id];
      return {
        ...creature,
        ...(advancedAbilities ? { abilities: advancedAbilities } : {}),
        id: creature.id || `creature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
    });

    creatureStore.setCreatures(newCreatures);
    localStorage.setItem(STORAGE_VERSION_KEY, expectedVersion);
    console.log(`Loaded ${newCreatures.length} creatures`);
  } catch (err) {
    console.error('Failed to load creature data:', err);
  }
};

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
    creatureStore.setCreatures(uniqueCreatures);
  }
};

export default initCreatureStore;
