import {
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

import { processImage } from '../utils/imageProcessor';

/**
 * Compress an image File/Blob into an optimized WebP data URL.
 * Returns { dataUrl, width, height }.
 */
export const compressImageToDataUrl = async (file) => {
  const result = await processImage(file, 'BATTLEMAP', {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.78
  });
  return {
    dataUrl: result.dataUrl,
    width: result.width,
    height: result.height
  };
};

class CustomMapService {
  constructor() {
    this.isConfigured = isFirebaseConfigured;
  }

  shouldUseLocalStorage(userId) {
    return !this.isConfigured || !userId || userId.startsWith('guest-') || userId === 'dev-user-123' || userId === 'admin-dev-user';
  }

  /**
   * Subscribe to all custom maps owned by the user.
   */
  subscribeToMaps(userId, onUpdate, canAccessCustomMaps = false) {
    if (!canAccessCustomMaps) {
      onUpdate([]);
      return () => {};
    }
    if (this.shouldUseLocalStorage(userId)) {
      onUpdate(this.getLocalMaps(userId));
      return () => {};
    }
    try {
      const mapsCol = collection(db, 'userCustomMaps', userId, 'maps');
      return onSnapshot(mapsCol, (snapshot) => {
        const maps = [];
        snapshot.forEach((d) => maps.push({ id: d.id, ...d.data() }));
         const toMillis = (value) => {
           if (value?.toMillis) return value.toMillis();
           if (value?.seconds) return value.seconds * 1000;
           const parsed = Date.parse(value);
           return Number.isNaN(parsed) ? 0 : parsed;
         };
         maps.sort((a, b) => toMillis(b.updatedAt) - toMillis(a.updatedAt));
        onUpdate(maps);
      }, (error) => {
        if (error?.code !== 'permission-denied') {
          console.error('Error subscribing to custom maps:', error);
        }
      });
    } catch (e) {
      console.error('Failed to setup custom maps listener:', e);
      return () => {};
    }
  }

  async saveMap(userId, map, canAccessCustomMaps = false) {
    if (!canAccessCustomMaps) {
      return { success: false, error: 'Custom Maps require the Archmage (Ultimate) tier.' };
    }
    const mapId = map.id || `cmap-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    if (map.image && map.image.length > MAX_DATA_URL_LENGTH) {
      return { success: false, error: 'Map image is too large. Replace it with a smaller image.' };
    }
    if (this.shouldUseLocalStorage(userId)) {
      const maps = this.getLocalMaps(userId);
      const idx = maps.findIndex((m) => m.id === mapId);
      const record = { ...map, id: mapId, updatedAt: new Date().toISOString() };
      if (idx > -1) maps[idx] = record; else maps.push(record);
      this.saveLocalMaps(userId, maps);
      return { success: true, mapId };
    }
    try {
      const ref = doc(db, 'userCustomMaps', userId, 'maps', mapId);
      const data = { ...map, id: mapId, updatedAt: serverTimestamp() };
      delete data.id;
      await setDoc(ref, data, { merge: true });
      return { success: true, mapId };
    } catch (error) {
      console.error('Error saving custom map:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteMap(userId, mapId, canAccessCustomMaps = false) {
    if (!canAccessCustomMaps) {
      return { success: false, error: 'Custom Maps require the Archmage (Ultimate) tier.' };
    }
    if (this.shouldUseLocalStorage(userId)) {
      const maps = this.getLocalMaps(userId).filter((m) => m.id !== mapId);
      this.saveLocalMaps(userId, maps);
      return { success: true };
    }
    try {
      await deleteDoc(doc(db, 'userCustomMaps', userId, 'maps', mapId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting custom map:', error);
      return { success: false, error: error.message };
    }
  }

  getLocalMaps(userId) {
    const key = `mythrill_custom_maps_${userId || 'guest'}`;
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }

  saveLocalMaps(userId, maps) {
    const key = `mythrill_custom_maps_${userId || 'guest'}`;
    try { localStorage.setItem(key, JSON.stringify(maps)); } catch (e) {}
  }
}

const customMapService = new CustomMapService();
export default customMapService;
