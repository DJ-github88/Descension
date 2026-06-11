import {
  doc,
  collection,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

class MapAnnotationService {
  constructor() {
    this.isConfigured = isFirebaseConfigured;
  }

  /**
   * Helper to check if we should fall back to localStorage
   */
  shouldUseLocalStorage(userId) {
    return !this.isConfigured || !userId || userId.startsWith('guest-') || userId === 'dev-user-123';
  }

  /**
   * Pins Firestore/LocalStorage operations
   */
  subscribeToPins(userId, onUpdate) {
    if (this.shouldUseLocalStorage(userId)) {
      const pins = this.getLocalPins(userId);
      onUpdate(pins);
      // Return a dummy unsubscribe function
      return () => {};
    }

    try {
      const pinsCol = collection(db, 'userMapAnnotations', userId, 'pins');
      return onSnapshot(pinsCol, (snapshot) => {
        const pins = [];
        snapshot.forEach((doc) => {
          pins.push({ id: doc.id, ...doc.data() });
        });
        onUpdate(pins);
      }, (error) => {
        if (error?.code !== 'permission-denied') {
          console.error('Error subscribing to pins:', error);
        }
      });
    } catch (e) {
      console.error('Failed to setup pins listener:', e);
      return () => {};
    }
  }

  async savePin(userId, pin) {
    const pinId = pin.id;
    if (this.shouldUseLocalStorage(userId)) {
      const pins = this.getLocalPins(userId);
      const index = pins.findIndex(p => p.id === pinId);
      if (index > -1) {
        pins[index] = pin;
      } else {
        pins.push(pin);
      }
      this.saveLocalPins(userId, pins);
      return { success: true };
    }

    try {
      const pinRef = doc(db, 'userMapAnnotations', userId, 'pins', pinId);
      const data = {
        ...pin,
        updatedAt: serverTimestamp()
      };
      // Delete undefined fields or id
      delete data.id;
      await setDoc(pinRef, data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving pin to Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  async deletePin(userId, pinId) {
    if (this.shouldUseLocalStorage(userId)) {
      const pins = this.getLocalPins(userId);
      const filtered = pins.filter(p => p.id !== pinId);
      this.saveLocalPins(userId, filtered);
      return { success: true };
    }

    try {
      const pinRef = doc(db, 'userMapAnnotations', userId, 'pins', pinId);
      await deleteDoc(pinRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting pin from Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  getLocalPins(userId) {
    const key = `mythrill_map_pins_${userId || 'guest'}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveLocalPins(userId, pins) {
    const key = `mythrill_map_pins_${userId || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(pins));
  }

  /**
   * Areas Firestore/LocalStorage operations
   */
  subscribeToAreas(userId, onUpdate) {
    if (this.shouldUseLocalStorage(userId)) {
      const areas = this.getLocalAreas(userId);
      onUpdate(areas);
      return () => {};
    }

    try {
      const areasCol = collection(db, 'userMapAnnotations', userId, 'areas');
      return onSnapshot(areasCol, (snapshot) => {
        const areas = [];
        snapshot.forEach((doc) => {
          areas.push({ id: doc.id, ...doc.data() });
        });
        onUpdate(areas);
      }, (error) => {
        if (error?.code !== 'permission-denied') {
          console.error('Error subscribing to areas:', error);
        }
      });
    } catch (e) {
      console.error('Failed to setup areas listener:', e);
      return () => {};
    }
  }

  async saveArea(userId, area) {
    const areaId = area.id;
    if (this.shouldUseLocalStorage(userId)) {
      const areas = this.getLocalAreas(userId);
      const index = areas.findIndex(a => a.id === areaId);
      if (index > -1) {
        areas[index] = area;
      } else {
        areas.push(area);
      }
      this.saveLocalAreas(userId, areas);
      return { success: true };
    }

    try {
      const areaRef = doc(db, 'userMapAnnotations', userId, 'areas', areaId);
      const data = {
        ...area,
        updatedAt: serverTimestamp()
      };
      delete data.id;
      await setDoc(areaRef, data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving area to Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteArea(userId, areaId) {
    if (this.shouldUseLocalStorage(userId)) {
      const areas = this.getLocalAreas(userId);
      const filtered = areas.filter(a => a.id !== areaId);
      this.saveLocalAreas(userId, filtered);
      return { success: true };
    }

    try {
      const areaRef = doc(db, 'userMapAnnotations', userId, 'areas', areaId);
      await deleteDoc(areaRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting area from Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  getLocalAreas(userId) {
    const key = `mythrill_map_areas_${userId || 'guest'}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveLocalAreas(userId, areas) {
    const key = `mythrill_map_areas_${userId || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(areas));
  }

  /**
   * Map Shares Firestore/LocalStorage operations
   */
  subscribeToIncomingShares(userId, onUpdate) {
    if (this.shouldUseLocalStorage(userId)) {
      const shares = this.getLocalShares(userId);
      const incoming = shares.filter(s => s.toUserId === userId && s.status === 'pending');
      onUpdate(incoming);
      return () => {};
    }

    try {
      const sharesCol = collection(db, 'mapShares');
      const q = query(
        sharesCol,
        where('toUserId', '==', userId),
        where('status', '==', 'pending')
      );
      return onSnapshot(q, (snapshot) => {
        const shares = [];
        snapshot.forEach((doc) => {
          shares.push({ id: doc.id, ...doc.data() });
        });
        onUpdate(shares);
      }, (error) => {
        if (error?.code !== 'permission-denied') {
          console.error('Error subscribing to map shares:', error);
        }
      });
    } catch (e) {
      console.error('Failed to setup map shares listener:', e);
      return () => {};
    }
  }

  async createShare(userId, shareData) {
    const shareId = `share-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fullShareData = {
      id: shareId,
      fromUserId: userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours expiry
      ...shareData
    };

    if (this.shouldUseLocalStorage(userId)) {
      // For demo mode / local storage, we also save it in the target friend's simulated storage list
      const targetUserId = shareData.toUserId;
      const key = `mythrill_map_shares_${targetUserId}`;
      const existing = localStorage.getItem(key);
      const targetShares = existing ? JSON.parse(existing) : [];
      targetShares.push(fullShareData);
      localStorage.setItem(key, JSON.stringify(targetShares));
      return { success: true, shareId };
    }

    try {
      const docRef = await addDoc(collection(db, 'mapShares'), {
        ...fullShareData,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      return { success: true, shareId: docRef.id };
    } catch (error) {
      console.error('Error creating map share in Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  async updateShareStatus(userId, shareId, status) {
    if (this.shouldUseLocalStorage(userId)) {
      const key = `mythrill_map_shares_${userId}`;
      const shares = this.getLocalShares(userId);
      const updated = shares.map(s => s.id === shareId ? { ...s, status } : s);
      localStorage.setItem(key, JSON.stringify(updated));
      return { success: true };
    }

    try {
      const shareRef = doc(db, 'mapShares', shareId);
      await updateDoc(shareRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating map share status in Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteShare(userId, shareId) {
    if (this.shouldUseLocalStorage(userId)) {
      const key = `mythrill_map_shares_${userId}`;
      const shares = this.getLocalShares(userId);
      const filtered = shares.filter(s => s.id !== shareId);
      localStorage.setItem(key, JSON.stringify(filtered));
      return { success: true };
    }

    try {
      const shareRef = doc(db, 'mapShares', shareId);
      await deleteDoc(shareRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting map share in Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  getLocalShares(userId) {
    const key = `mythrill_map_shares_${userId || 'guest'}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
}

const mapAnnotationService = new MapAnnotationService();
export default mapAnnotationService;
