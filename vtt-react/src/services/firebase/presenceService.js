/**
 * Firebase Presence Service
 * 
 * Tracks user online status and session information in real-time.
 * Uses Firebase Realtime Database for presence with automatic disconnect handling.
 */

import { 
  ref as dbRef, 
  set, 
  onValue, 
  onDisconnect, 
  serverTimestamp,
  get,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';
import { realtimeDb, isFirebaseConfigured, isDemoMode } from '../../config/firebase';

class PresenceService {
  constructor() {
    this.isConfigured = isFirebaseConfigured && !isDemoMode;
    this.currentUserId = null;
    this.presenceRef = null;
    this.listeners = new Map();
  }

  /**
   * Set user as online with character and session data
   */
  async setOnline(userId, characterData, sessionData = {}) {
    if (!this.isConfigured || !realtimeDb) {
      console.warn('Firebase Realtime Database not configured, using local presence only');
      return false;
    }

    try {
      this.currentUserId = userId;
      this.presenceRef = dbRef(realtimeDb, `presence/${userId}`);

      const presenceData = {
        userId,
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
        sessionType: sessionData.sessionType || null, // 'local' | 'multiplayer' | null
        roomId: sessionData.roomId || null,
        roomName: sessionData.roomName || null,
        roomParticipants: sessionData.roomParticipants || null,
        connectedAt: serverTimestamp(),
        lastSeen: serverTimestamp()
      };

      // Set presence data
      await set(this.presenceRef, presenceData);

      // Set up automatic cleanup on disconnect
      const disconnectRef = onDisconnect(this.presenceRef);
      await disconnectRef.set({
        ...presenceData,
        status: 'offline',
        lastSeen: serverTimestamp()
      });

      console.log('✅ User presence set to online:', userId);
      return true;
    } catch (error) {
      console.error('❌ Failed to set user online:', error);
      return false;
    }
  }

  /**
   * Update user session information (local/multiplayer)
   */
  async updateSession(userId, sessionData) {
    if (!this.isConfigured || !realtimeDb) {
      return false;
    }

    try {
      const presenceRef = dbRef(realtimeDb, `presence/${userId}`);
      
      const updates = {
        sessionType: sessionData.sessionType || null,
        roomId: sessionData.roomId || null,
        roomName: sessionData.roomName || null,
        roomParticipants: sessionData.roomParticipants || null,
        lastSeen: serverTimestamp()
      };

      await set(presenceRef, updates);
      console.log('✅ Session updated for user:', userId, sessionData);
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
    if (!this.isConfigured || !realtimeDb) {
      return false;
    }

    try {
      const presenceRef = dbRef(realtimeDb, `presence/${userId}`);

      // Get current data to preserve other fields
      const snapshot = await get(presenceRef);
      const currentData = snapshot.val();

      if (!currentData) {
        console.warn('No presence data found for user:', userId);
        return false;
      }

      const updates = {
        ...currentData,
        status,
        lastSeen: serverTimestamp()
      };

      // Only update statusComment if provided (null means don't change it)
      if (statusComment !== null) {
        updates.statusComment = statusComment;
      }

      await set(presenceRef, updates);
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
    if (!this.isConfigured || !realtimeDb) {
      return false;
    }

    try {
      const presenceRef = dbRef(realtimeDb, `presence/${userId}`);

      // First get the current presence data to preserve session info
      const snapshot = await get(presenceRef);
      const currentData = snapshot.val();

      if (!currentData) {
        console.warn('No presence data found for user:', userId);
        return false;
      }

      const updates = {
        ...currentData,
        characterId: characterData.id || currentData.characterId,
        characterName: characterData.name || currentData.characterName,
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

      await set(presenceRef, updates);
      console.log('✅ Character data updated for user:', userId, characterData.name);
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
    if (!this.isConfigured || !realtimeDb) {
      return false;
    }

    try {
      const presenceRef = dbRef(realtimeDb, `presence/${userId}`);
      await set(presenceRef, {
        status: 'offline',
        lastSeen: serverTimestamp()
      });
      
      // Cancel onDisconnect
      if (this.presenceRef) {
        await onDisconnect(this.presenceRef).cancel();
      }
      
      console.log('✅ User presence set to offline:', userId);
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
    if (!this.isConfigured || !realtimeDb) {
      console.warn('Firebase not configured, cannot subscribe to online users');
      return () => {};
    }

    try {
      const presenceRef = dbRef(realtimeDb, 'presence');
      
      const unsubscribe = onValue(presenceRef, (snapshot) => {
        const users = [];
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData && userData.status === 'online') {
            users.push(userData);
          }
        });
        callback(users);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Failed to subscribe to online users:', error);
      return () => {};
    }
  }

  /**
   * Subscribe to a specific user's presence
   */
  subscribeToUser(userId, callback) {
    if (!this.isConfigured || !realtimeDb) {
      return () => {};
    }

    try {
      const userPresenceRef = dbRef(realtimeDb, `presence/${userId}`);
      
      const unsubscribe = onValue(userPresenceRef, (snapshot) => {
        const userData = snapshot.val();
        callback(userData);
      });

      this.listeners.set(userId, unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('❌ Failed to subscribe to user:', error);
      return () => {};
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
    }
  }

  /**
   * Get all online users (one-time fetch)
   */
  async getOnlineUsers() {
    if (!this.isConfigured || !realtimeDb) {
      return [];
    }

    try {
      const presenceRef = dbRef(realtimeDb, 'presence');
      const snapshot = await get(presenceRef);
      
      const users = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData && userData.status === 'online') {
          users.push(userData);
        }
      });
      
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
    if (!this.isConfigured || !realtimeDb) {
      return null;
    }

    try {
      const userPresenceRef = dbRef(realtimeDb, `presence/${userId}`);
      const snapshot = await get(userPresenceRef);
      return snapshot.val();
    } catch (error) {
      console.error('❌ Failed to get user presence:', error);
      return null;
    }
  }

  /**
   * Clean up all listeners
   */
  cleanup() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
    
    if (this.currentUserId) {
      this.setOffline(this.currentUserId);
    }
  }
}

// Export singleton instance
const presenceService = new PresenceService();
export default presenceService;

