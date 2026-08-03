/**
 * Subregion Maps Database & Registry
 *
 * Maps regional and sub-regional map assets, bounding areas, child polygons,
 * and user custom uploaded maps (stored safely in IndexedDB + memory cache).
 */

import { SUBREGIONS } from './subregions';
import { REGION_POLYGONS } from './regionPolygons';

export const BUILTIN_SUBREGION_MAPS = {
  'nordhalla': {
    id: 'nordhalla',
    name: 'Nordhalla Regional Map',
    regionId: 'nordhalla',
    parentMapId: 'mythril',
    image: '/assets/images/backgrounds/nordhalla.jpeg',
    width: 4096,
    height: 3072,
    description: 'The frozen northern realm of Nordhalla, featuring black fjords, glaciers, and ancient Skald strongholds.',
    subregions: [
      {
        id: 'nordhalla-glacier-heart',
        name: 'Rime-Spire Peaks',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [370, 199],
        points: [[2, 2], [5, 196], [60, 162], [114, 208], [154, 254], [298, 219], [263, 156], [360, 260], [424, 324], [646, 328], [764, 353], [743, 220], [684, 99], [662, 8]]
      },
      {
        id: 'nordhalla-fjord-coast',
        name: 'Skaldfjord Vale',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [3200, 1800],
        points: [[2900, 600], [3900, 800], [3800, 2600], [2800, 2200]]
      },
      {
        id: 'nordhalla-frostfang-wastes',
        name: 'Frostfang Wastes',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [1600, 2400],
        points: [[600, 2100], [2600, 2000], [2500, 2900], [400, 2800]]
      }
    ]
  },
  'nordhalla-glacier-heart': {
    id: 'nordhalla-glacier-heart',
    name: 'Rime-Spire Peaks',
    regionId: 'nordhalla',
    parentMapId: 'nordhalla',
    image: '/assets/images/backgrounds/nordhalla.jpeg',
    width: 4096,
    height: 3072,
    description: 'The warm, varied west-central subregion of Nordhalla: Rime-Spire Peaks, geothermal pine forests, coastal harbors, and ancient keeps.'
  },
  'nordhalla-fjord-coast': {
    id: 'nordhalla-fjord-coast',
    name: 'Skaldfjord Vale',
    regionId: 'nordhalla',
    parentMapId: 'nordhalla',
    image: '/assets/images/backgrounds/nordhalla.jpeg',
    width: 4096,
    height: 3072,
    description: 'The settled river and fjord corridor of Nordhalla: Skaldfjord Vale, Frostholm capital, and the Frozen Archive.'
  },
  'nordhalla-frostfang-wastes': {
    id: 'nordhalla-frostfang-wastes',
    name: 'Frostfang Wastes',
    regionId: 'nordhalla',
    parentMapId: 'nordhalla',
    image: '/assets/images/backgrounds/nordhalla.jpeg',
    width: 4096,
    height: 3072,
    description: 'The desolate whiteout glaciers beyond the Sunder-Wall: Frostfang Wastes, Øsling barrows, and Blizzard\'s End.'
  }
};

const DB_NAME = 'mythrill_maps_db';
const STORE_NAME = 'custom_subregion_maps';
const CUSTOM_MAPS_STORAGE_KEY = 'mythrill_custom_subregion_maps';

// In-memory cache for immediate synchronous lookups
let inMemoryCustomMaps = {};

// Initialize in-memory cache from localStorage on load if available
try {
  const raw = localStorage.getItem(CUSTOM_MAPS_STORAGE_KEY);
  if (raw) inMemoryCustomMaps = JSON.parse(raw);
} catch (e) {
  // ignore
}

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

export const initCustomMaps = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const items = request.result || [];
        items.forEach(item => {
          inMemoryCustomMaps[item.id] = item;
        });
        resolve(inMemoryCustomMaps);
      };
      request.onerror = () => {
        resolve(inMemoryCustomMaps);
      };
    });
  } catch (err) {
    console.warn('Could not load IndexedDB maps:', err);
    return inMemoryCustomMaps;
  }
};

// Immediately invoke background initialization
initCustomMaps();

export const getCustomMaps = () => {
  return { ...inMemoryCustomMaps };
};

export const saveCustomMap = async (mapData) => {
  const mapId = mapData.id || `custom-map-${Date.now()}`;
  const newMap = {
    ...mapData,
    id: mapId,
    createdAt: mapData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Update in-memory cache immediately
  inMemoryCustomMaps[mapId] = newMap;

  // 2. Persist to IndexedDB (supports multi-megabyte images)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(newMap);
  } catch (err) {
    console.warn('Could not save to IndexedDB, falling back:', err);
  }

  // 3. Fallback attempt to localStorage (lightweight metadata)
  try {
    localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(inMemoryCustomMaps));
  } catch (e) {
    // If image is too large for 5MB localStorage, save light copy to localStorage
    try {
      const lightCopy = {};
      Object.keys(inMemoryCustomMaps).forEach(k => {
        const item = inMemoryCustomMaps[k];
        lightCopy[k] = { ...item, image: item.image.startsWith('data:') ? 'indexeddb_stored' : item.image };
      });
      localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(lightCopy));
    } catch (e2) {
      // Ignore localStorage quota errors since IndexedDB handles large images
    }
  }

  return newMap;
};

export const deleteCustomMap = async (mapId) => {
  if (inMemoryCustomMaps[mapId]) {
    delete inMemoryCustomMaps[mapId];

    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(mapId);
    } catch (err) {
      console.warn('Could not delete from IndexedDB:', err);
    }

    try {
      localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(inMemoryCustomMaps));
    } catch (e) {
      // ignore
    }
    return true;
  }
  return false;
};

export const getSubregionMap = (mapId) => {
  if (!mapId || mapId === 'mythril') return null;

  // Helper to filter out low-res placeholder images (e.g. 1024x768 nordhalla.jpeg)
  const isHighResMap = (mapObj) => {
    if (!mapObj || !mapObj.image) return false;
    // Low-res preview assets should be bypassed in favor of 8K master map
    if (typeof mapObj.image === 'string' && mapObj.image.includes('nordhalla.jpeg')) {
      return false;
    }
    return true;
  };

  // 1. Check custom uploaded high-res subregion maps
  if (inMemoryCustomMaps[mapId] && isHighResMap(inMemoryCustomMaps[mapId])) {
    return inMemoryCustomMaps[mapId];
  }

  // 2. Custom map lookup by matching regionId property
  const subregionObj = SUBREGIONS[mapId];
  const customByRegion = Object.values(inMemoryCustomMaps).find(
    m => (m.regionId === mapId || (subregionObj && m.regionId === subregionObj.regionId)) && isHighResMap(m)
  );
  if (customByRegion) return customByRegion;

  // 3. Check built-in subregion maps if high resolution asset exists
  if (BUILTIN_SUBREGION_MAPS[mapId] && isHighResMap(BUILTIN_SUBREGION_MAPS[mapId])) {
    return BUILTIN_SUBREGION_MAPS[mapId];
  }

  if (subregionObj && subregionObj.regionId) {
    const parentRegionId = subregionObj.regionId;
    if (BUILTIN_SUBREGION_MAPS[parentRegionId] && isHighResMap(BUILTIN_SUBREGION_MAPS[parentRegionId])) {
      return BUILTIN_SUBREGION_MAPS[parentRegionId];
    }
  }

  // Fallback to null so MapCanvas uses 8192x6016 8K master map asset
  return null;
};

export const getAllAvailableSubregionMaps = () => {
  return {
    ...BUILTIN_SUBREGION_MAPS,
    ...inMemoryCustomMaps
  };
};

export default BUILTIN_SUBREGION_MAPS;
