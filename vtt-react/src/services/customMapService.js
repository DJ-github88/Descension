import {
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

// Max decoded dimension for a stored custom-map image. Keeps the base64
// payload small enough to live inside a single Firestore doc (< 1 MiB limit).
const MAX_IMG_DIM = 1024;
const IMG_QUALITY = 0.72;
const MAX_DATA_URL_LENGTH = 700000;

/**
 * Compress an image File/Blob into a base64 data URL capped to MAX_IMG_DIM.
 * Returns { dataUrl, width, height }.
 */
export const compressImageToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.FileReader) {
      return reject(new Error('FileReader not supported'));
    }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let { width, height } = img;
        const longest = Math.max(width, height);
        if (longest > MAX_IMG_DIM) {
          const scale = MAX_IMG_DIM / longest;
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        let quality = IMG_QUALITY;
        let dataUrl = '';
        let canvas;
        do {
          canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas 2D not supported'));
          ctx.drawImage(img, 0, 0, width, height);
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          if (dataUrl.length <= MAX_DATA_URL_LENGTH) break;
          width = Math.max(512, Math.round(width * 0.8));
          height = Math.max(512, Math.round(height * 0.8));
          quality = Math.max(0.45, quality - 0.08);
        } while (width > 512 || height > 512);

        if (dataUrl.length > MAX_DATA_URL_LENGTH) {
          return reject(new Error('Image is too detailed to fit account storage limits'));
        }
        resolve({ dataUrl, width, height });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
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
