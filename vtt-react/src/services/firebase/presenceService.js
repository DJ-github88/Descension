/**
 * Firebase Presence Service
 *
 * Tracks user online status and session information in real-time.
 * Uses Firestore with client-side heartbeat for automatic offline detection.
 */

import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';

class PresenceService {
  constructor() {
    this.isConfigured = isFirebaseConfigured && !isDemoMode;
    this.currentUserId = null;
    this.presenceRef = null;
    this.listeners = new Map();
    this.heartbeatInterval = null;
    this.offlineHandlers = [];
  }

  /**
   * Set user as online with character and session data
   */
  async setOnline(userId, characterData, sessionData = {}) {
    if (!this.isConfigured || !db) {
      console.warn('Firebase Firestore not configured, using local presence only');
      return false;
    }

    try {
      this.currentUserId = userId;
      this.presenceRef = doc(db, 'presence', userId);

      const presenceData = {
        userId,
        accountName: sessionData.accountName || null,
        isGuest: sessionData.isGuest || false,
        characterId: characterData.id || null,
        characterName: characterData.name || 'Unknown',
        level: characterData.level || 1,
        class: characterData.class || 'Unknown',
        background: characterData.background || '',
        backgroundDisplayName: characterData.backgroundDisplayName || '',
        path: characterData.path || '',
        pathDisplayName: characterData.pathDisplayName || '',
        race: characterData.race || '',
        subrace: characterData.subrace || '',
        raceDisplayName: characterData.raceDisplayName || '',
        status: 'online',
        statusComment: '',
        sessionType: sessionData.sessionType || null,
        roomId: sessionData.roomId || null,
        roomName: sessionData.roomName || null,
        roomParticipants: sessionData.roomParticipants || null,
        friendId: sessionData.friendId || null,
        connectedAt: serverTimestamp(),
        lastSeen: serverTimestamp()
      };

      console.log('🟢 Setting user online:', userId, presenceData.characterName);

      await setDoc(this.presenceRef, presenceData, { merge: false });

      // Start heartbeat and offline handlers
      this.startHeartbeat(userId);
      this.setupOfflineHandlers(userId);

      return true;
    } catch (error) {
      console.error('❌ Failed to set user online:', error);
      return false;
    }
  }

  /**
   * Start heartbeat to keep presence alive
   */
  startHeartbeat(userId) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      try {
        const presenceRef = doc(db, 'presence', userId);
        await updateDoc(presenceRef, {
          lastSeen: serverTimestamp()
        });
      } catch (error) {
        console.error('❌ Heartbeat failed:', error);
      }
    }, 30000); // 30 seconds
  }

  /**
   * Setup offline detection handlers
   */
  setupOfflineHandlers(userId) {
    const handleOffline = async () => {
      console.log('🔴 Setting user offline:', userId);
      await this.setOffline(userId);
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleOffline();
      }
    });

    // Listen for beforeunload (user closing tab/browser)
    window.addEventListener('beforeunload', handleOffline);
    window.addEventListener('unload', handleOffline);

    // Listen for offline events (network connection)
    window.addEventListener('offline', handleOffline);

    this.offlineHandlers.push(handleOffline);
  }

  /**
   * Update user session information (local/multiplayer)
   */
  async updateSession(userId, sessionData) {
    if (!this.isConfigured || !db) {
      return false;
    }

    try {
      const presenceRef = doc(db, 'presence', userId);

      const updates = {
        sessionType: sessionData.sessionType || null,
        roomId: sessionData.roomId || null,
        roomName: sessionData.roomName || null,
        roomParticipants: sessionData.roomParticipants || null,
        lastSeen: serverTimestamp()
      };

      await updateDoc(presenceRef, updates);
      console.log('📡 Updated session for user:', userId, updates);
      return true;
    } catch (error) {
      console.error('❌ Failed to update session:', error);
      return false;
    }
  }

  /**
   * Update user status (online/away/busy) and optional status comment
   */
  async updateStatus(userId, status, statusComment = null) {
    if (!this.isConfigured || !db) {
      return false;
    }

    try {
      const presenceRef = doc(db, 'presence', userId);

      // Get current data to preserve other fields
      const snapshot = await getDoc(presenceRef);
      if (!snapshot.exists()) {
        console.warn('⚠️ No presence data found for user:', userId);
        return false;
      }

      const currentData = snapshot.data();
      const updates = {
        ...currentData,
        status,
        lastSeen: serverTimestamp()
      };

      // Only update statusComment if provided (null means don't change it)
      if (statusComment !== null) {
        updates.statusComment = statusComment;
      }

      await setDoc(presenceRef, updates, { merge: true });
      console.log('🔄 Updated status for user:', userId, status);
      return true;
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      return false;
    }
  }

  /**
   * Update user character data (when switching characters)
   */
  async updateCharacterData(userId, characterData) {
    if (!this.isConfigured || !db) {
      return false;
    }

    try {
      const presenceRef = doc(db, 'presence', userId);

      // First get current presence data to preserve session info
      const snapshot = await getDoc(presenceRef);
      if (!snapshot.exists()) {
        console.warn('⚠️ No presence data found for user:', userId);
        return false;
      }

      const currentData = snapshot.data();
      const updates = {
        ...currentData,
        characterId: characterData.id || currentData.characterId,
        characterName: characterData.name || currentData.characterName,
        accountName: characterData.accountName || currentData.accountName,
        isGuest: characterData.isGuest !== undefined ? characterData.isGuest : currentData.isGuest,
        level: characterData.level || currentData.level,
        class: characterData.class || currentData.class,
        background: characterData.background || currentData.background,
        backgroundDisplayName: characterData.backgroundDisplayName || currentData.backgroundDisplayName,
        path: characterData.path || currentData.path,
        pathDisplayName: characterData.pathDisplayName || currentData.pathDisplayName,
        race: characterData.race || currentData.race,
        subrace: characterData.subrace || currentData.subrace,
        raceDisplayName: characterData.raceDisplayName || currentData.raceDisplayName,
        lastSeen: serverTimestamp()
      };

      await setDoc(presenceRef, updates, { merge: true });
      console.log('🎭 Updated character data for user:', userId, characterData.name);
      return true;
    } catch (error) {
      console.error('❌ Failed to update character data:', error);
      return false;
    }
  }

  /**
   * Set user as offline
   */
  async setOffline(userId) {
    if (!this.isConfigured || !db) {
      return false;
    }

    try {
      const presenceRef = doc(db, 'presence', userId);

      await updateDoc(presenceRef, {
        status: 'offline',
        lastSeen: serverTimestamp()
      });

      console.log('🔴 Set user offline:', userId);
      return true;
    } catch (error) {
      console.error('❌ Failed to set user offline:', error);
      return false;
    }
  }

  /**
   * Subscribe to all online users
   */
  subscribeToOnlineUsers(callback) {
    if (!this.isConfigured || !db) {
      console.warn('⚠️ Firebase not configured, cannot subscribe to online users');
      return () => { };
    }

    try {
      const presenceRef = collection(db, 'presence');

      const unsubscribe = onSnapshot(presenceRef, (snapshot) => {
        const users = [];
        snapshot.forEach((docSnapshot) => {
          const userData = docSnapshot.data();
          // Include 'idle' as an online status
          if (userData && ['online', 'away', 'busy', 'idle'].includes(userData.status)) {
            users.push(userData);
          }
        });
        console.log('👥 Online users updated:', users.length, 'users');
        callback(users);
      }, (error) => {
        console.error('❌ Failed to subscribe to online users:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Failed to subscribe to online users:', error);
      return () => { };
    }
  }

  /**
   * Subscribe to a specific user's presence
   */
  subscribeToUser(userId, callback) {
    if (!this.isConfigured || !db) {
      return () => { };
    }

    try {
      const userPresenceRef = doc(db, 'presence', userId);

      const unsubscribe = onSnapshot(userPresenceRef, (snapshot) => {
        const userData = snapshot.data();
        console.log('👤 User presence updated:', userId, userData?.status);
        callback(userData);
      }, (error) => {
        console.error('❌ Failed to subscribe to user:', userId, error);
        callback(null);
      });

      this.listeners.set(userId, unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('❌ Failed to subscribe to user:', userId, error);
      return () => { };
    }
  }

  /**
   * Unsubscribe from a specific user
   */
  unsubscribeFromUser(userId) {
    const unsubscribe = this.listeners.get(userId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(userId);
      console.log('🔌 Unsubscribed from user:', userId);
    }
  }

  /**
   * Get all online users (one-time fetch)
   */
  async getOnlineUsers() {
    if (!this.isConfigured || !db) {
      return [];
    }

    try {
      const presenceRef = collection(db, 'presence');
      const snapshot = await getDocs(presenceRef);

      const users = [];
      snapshot.forEach((docSnapshot) => {
        const userData = docSnapshot.data();
        if (userData && userData.status === 'online') {
          users.push(userData);
        }
      });

      console.log('👥 Fetched online users:', users.length);
      return users;
    } catch (error) {
      console.error('❌ Failed to get online users:', error);
      return [];
    }
  }

  /**
   * Get a specific user's presence (one-time fetch)
   */
  async getUserPresence(userId) {
    if (!this.isConfigured || !db) {
      return null;
    }

    try {
      const userPresenceRef = doc(db, 'presence', userId);
      const snapshot = await getDoc(userPresenceRef);
      return snapshot.data();
    } catch (error) {
      console.error('❌ Failed to get user presence:', error);
      return null;
    }
  }

  /**
   * Clean up all listeners and heartbeat
   */
  cleanup() {
    console.log('🧹 Cleaning up presence service for user:', this.currentUserId);

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Remove offline handlers
    if (this.offlineHandlers.length > 0) {
      this.offlineHandlers.forEach((handler) => {
        document.removeEventListener('visibilitychange', handler);
        window.removeEventListener('beforeunload', handler);
        window.removeEventListener('unload', handler);
        window.removeEventListener('offline', handler);
      });
      this.offlineHandlers = [];
    }

    // Unsubscribe all user listeners
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();

    // Set current user offline if we're still authenticated
    if (this.currentUserId) {
      this.setOffline(this.currentUserId).catch(err => {
        console.error('❌ Failed to set offline during cleanup:', err);
      });
      this.currentUserId = null;
    }
  }
}

// Export singleton instance
const presenceService = new PresenceService();
export default presenceService;
