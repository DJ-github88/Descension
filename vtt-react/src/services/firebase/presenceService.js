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
  query,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode, isMockOrDevUser, auth } from '../../config/firebase';
import { logFirestoreSnapshot, trackListener } from '../../utils/firestoreDiagnostics';

class PresenceService {
  constructor() {
    this.isConfigured = isFirebaseConfigured && !isDemoMode;
    this.currentUserId = null;
    this.presenceRef = null;
    this.listeners = new Map();
    this.heartbeatInterval = null;
    this.visibilityTimer = null;
    this.isCleanedUp = false;
    this._boundHandlers = [];
  }

  /**
   * Set user as online with character and session data
   */
  async setOnline(userId, characterData, sessionData = {}) {
    if (!this.isConfigured || !db || isMockOrDevUser(userId) || !auth?.currentUser) {
      return true;
    }

    try {
      this.isCleanedUp = false;
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
        partyId: sessionData.partyId || null,
        partyName: sessionData.partyName || null,
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
    if (!this.isConfigured || !db || isMockOrDevUser(userId) || !auth?.currentUser) {
      return;
    }

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
        console.debug('Heartbeat skipped/ended:', error?.message || error);
      }
    }, 30000); // 30 seconds
  }

  /**
   * Setup offline detection handlers
   */
  setupOfflineHandlers(userId) {
    if (!this.isConfigured || !db || isMockOrDevUser(userId) || !auth?.currentUser) {
      return;
    }

    // Remove any handlers registered by a previous setOnline call before
    // adding new ones - `_boundHandlers` was overwritten on every call, so
    // every re-init leaked a full set of window listeners.
    this.removeOfflineHandlers();

    const handleOffline = async () => {
      if (this.isCleanedUp) return;
      console.log('🔴 Setting user offline:', userId);
      await this.setOffline(userId);
    };

    // Timer for delayed offline on visibility change
    const VISIBILITY_OFFLINE_DELAY = 5 * 60 * 1000; // 5 minutes

    // Listen for page visibility changes
    // CRITICAL FIX: Only go offline after prolonged hidden state (5 minutes)
    // This prevents users from appearing offline when just switching tabs
    const handleVisibilityChange = () => {
      if (this.isCleanedUp) return;
      if (document.visibilityState === 'hidden') {
        // Start timer - only go offline after 5 minutes hidden
        this.visibilityTimer = setTimeout(() => {
          this.visibilityTimer = null;
          handleOffline();
        }, VISIBILITY_OFFLINE_DELAY);
      } else {
        // Cancel timer if user returns before 5 minutes
        if (this.visibilityTimer) {
          clearTimeout(this.visibilityTimer);
          this.visibilityTimer = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleOffline);
    window.addEventListener('unload', handleOffline);
    window.addEventListener('offline', handleOffline);

    this._boundHandlers = [handleVisibilityChange, handleOffline];
  }

  /**
   * Remove offline-detection handlers registered by setupOfflineHandlers.
   */
  removeOfflineHandlers() {
    if (!this._boundHandlers || this._boundHandlers.length === 0) return;
    const [handleVisibilityChange, handleOffline] = this._boundHandlers;
    if (handleVisibilityChange) {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    if (handleOffline) {
      window.removeEventListener('beforeunload', handleOffline);
      window.removeEventListener('unload', handleOffline);
      window.removeEventListener('offline', handleOffline);
    }
    this._boundHandlers = [];
  }

  /**
   * Update user session information (local/multiplayer)
   */
  async updateSession(userId, sessionData) {
    if (!this.isConfigured || !db || isMockOrDevUser(userId) || !auth?.currentUser) {
      return true;
    }

    try {
      const presenceRef = doc(db, 'presence', userId);

      const updates = {
        sessionType: sessionData.sessionType || null,
        roomId: sessionData.roomId !== undefined ? sessionData.roomId : null,
        roomName: sessionData.roomName !== undefined ? sessionData.roomName : null,
        roomParticipants: sessionData.roomParticipants !== undefined ? sessionData.roomParticipants : null,
        partyId: sessionData.partyId !== undefined ? sessionData.partyId : null,
        partyName: sessionData.partyName !== undefined ? sessionData.partyName : null,
        lastSeen: serverTimestamp()
      };

      await updateDoc(presenceRef, updates);
      return true;
    } catch (error) {
      console.debug('Failed to update session:', error?.message || error);
      return false;
    }
  }

  /**
   * Update user status (online/away/busy) and optional status comment
   */
  async updateStatus(userId, status, statusComment = null) {
    if (!this.isConfigured || !db || this.isCleanedUp || isMockOrDevUser(userId) || !auth?.currentUser) {
      return true;
    }

    try {
      const presenceRef = doc(db, 'presence', userId);

      // Partial update - no getDoc + full-document setDoc round trip.
      const updates = {
        status,
        lastSeen: serverTimestamp()
      };

      // Only update statusComment if provided (null means don't change it)
      if (statusComment !== null) {
        updates.statusComment = statusComment;
      }

      await updateDoc(presenceRef, updates);
      return true;
    } catch (error) {
      console.debug('Failed to update status:', error?.message || error);
      return false;
    }
  }

  /**
   * Update user character data (when switching characters)
   */
  async updateCharacterData(userId, characterData) {
    if (!this.isConfigured || !db || isMockOrDevUser(userId) || !auth?.currentUser) {
      return true;
    }

    try {
      const presenceRef = doc(db, 'presence', userId);

      // Partial update - no getDoc + full-document setDoc round trip. Only
      // fields actually provided are written; others keep their current value.
      const updates = { lastSeen: serverTimestamp() };
      const copyIfPresent = (key, value) => {
        if (value !== undefined && value !== null && value !== '') {
          updates[key] = value;
        }
      };

      copyIfPresent('characterId', characterData.id);
      copyIfPresent('characterName', characterData.name);
      copyIfPresent('accountName', characterData.accountName);
      if (characterData.isGuest !== undefined) updates.isGuest = characterData.isGuest;
      copyIfPresent('level', characterData.level);
      copyIfPresent('class', characterData.class);
      copyIfPresent('background', characterData.background);
      copyIfPresent('backgroundDisplayName', characterData.backgroundDisplayName);
      copyIfPresent('path', characterData.path);
      copyIfPresent('pathDisplayName', characterData.pathDisplayName);
      copyIfPresent('race', characterData.race);
      copyIfPresent('subrace', characterData.subrace);
      copyIfPresent('raceDisplayName', characterData.raceDisplayName);

      await updateDoc(presenceRef, updates);
      return true;
    } catch (error) {
      console.debug('Failed to update character data:', error?.message || error);
      return false;
    }
  }

  /**
   * Set user as offline
   */
  async setOffline(userId) {
    if (!this.isConfigured || !db || this.isCleanedUp || isMockOrDevUser(userId) || !auth?.currentUser) {
      return true;
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
    if (!this.isConfigured || !db || !auth?.currentUser) {
      callback([]);
      return () => { };
    }

    // Idempotent: replacing the listener must unsubscribe the previous one,
    // otherwise every call (GlobalSocketManager + GlobalChatWindow + account
    // switch) accumulates another full-collection listener.
    const existing = this.listeners.get('__onlineUsers__');
    if (existing) {
      existing();
      this.listeners.delete('__onlineUsers__');
    }

    const emit = (users) => {
      if (users.length !== this._lastOnlineCount) {
        console.log('👥 Online users updated:', users.length, 'users');
        this._lastOnlineCount = users.length;
      }
      callback(users);
    };

    const buildUsers = (usersById) => {
      const users = [];
      usersById.forEach((userData, id) => {
        if (this.isUserOnline(userData)) {
          users.push(userData);
        } else {
          // Stale (no heartbeat) - drop so the map does not grow forever.
          usersById.delete(id);
        }
      });
      return users;
    };

    const attach = (targetQuery) => {
      const usersById = new Map();
      const unsubscribe = onSnapshot(
        targetQuery,
        (snapshot) => {
          // Incremental: only touch documents that actually changed instead of
          // re-scanning the entire presence collection on every heartbeat.
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'removed') {
              usersById.delete(change.doc.id);
            } else {
              usersById.set(change.doc.id, change.doc.data());
            }
          });

          logFirestoreSnapshot({
            collection: 'presence',
            changes: snapshot.docChanges(),
            total: usersById.size
          });

          emit(buildUsers(usersById));
        },
        (error) => {
          console.debug('Presence subscription ended/skipped:', error?.message || error);
        }
      );
      this.listeners.set('__onlineUsers__', unsubscribe);
      trackListener(1);
      return unsubscribe;
    };

    try {
      // Only online-ish statuses, capped: avoids downloading offline records
      // and unbounded collection growth. Falls back to the full collection if
      // the status field/index is unavailable.
      const onlineQuery = query(
        collection(db, 'presence'),
        where('status', 'in', ['online', 'away', 'busy']),
        limit(200)
      );
      return attach(onlineQuery);
    } catch (error) {
      console.debug('Failed to subscribe to online users:', error?.message || error);
      return () => { };
    }
  }

  /**
   * Subscribe to a specific user's presence
   */
  subscribeToUser(userId, callback) {
    if (!this.isConfigured || !db || isMockOrDevUser(userId) || !auth?.currentUser) {
      return () => { };
    }

    // Replace any existing listener for this user instead of leaking it.
    const existing = this.listeners.get(userId);
    if (existing) {
      existing();
      this.listeners.delete(userId);
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
      trackListener(1);
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
        if (this.isUserOnline(userData)) {
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
   * Check if a user is truly online (valid status AND fresh lastSeen)
   * @param {Object|null} presenceData - The presence data from Firestore
   * @param {number} stalenessThresholdMs - Threshold in ms (default 90 seconds)
   * @returns {boolean} - True if user is truly online
   */
  isUserOnline(presenceData, stalenessThresholdMs = 90 * 1000) {
    if (!presenceData) return false;

    const validStatuses = ['online', 'away', 'busy'];
    if (!validStatuses.includes(presenceData.status)) return false;

    const lastSeen = presenceData.lastSeen;
    if (!lastSeen) return false;

    try {
      const lastSeenTime = typeof lastSeen.toDate === 'function'
        ? lastSeen.toDate()
        : new Date(lastSeen);

      // Use server time offset if available for more accurate age calculation
      const lastSeenTimeMs = lastSeenTime.getTime();
      const ageMs = Date.now() - lastSeenTimeMs;

      return ageMs < stalenessThresholdMs;
    } catch (e) {
      console.warn('⚠️ Failed to parse lastSeen timestamp:', e);
      return false;
    }
  }

  /**
   * Clean up all listeners and heartbeat
   */
  cleanup() {
    console.log('🧹 Cleaning up presence service for user:', this.currentUserId);

    this.isCleanedUp = true;

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Clear visibility timer
    if (this.visibilityTimer) {
      clearTimeout(this.visibilityTimer);
      this.visibilityTimer = null;
    }

    // Remove all tracked event listeners
    this.removeOfflineHandlers();

    // Unsubscribe all user listeners
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
      trackListener(-1);
    });
    this.listeners.clear();

    // Set current user offline if we still have a userId and Firebase is available
    const userId = this.currentUserId;
    this.currentUserId = null;
    if (userId) {
      this.setOffline(userId).catch(err => {
        console.warn('⚠️ Could not set offline during cleanup (auth may already be revoked):', err.code || err.message);
      });
    }
  }
}

// Export singleton instance
const presenceService = new PresenceService();
export default presenceService;
