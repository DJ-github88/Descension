/**
 * Global Chat Service
 *
 * Manages global chat messages in Firebase Firestore.
 * Provides persistence for chat history across sessions.
 *
 * Read model:
 *  - Queries only the latest N messages (`orderBy timestamp asc` +
 *    `limitToLast(N)`), never the whole collection.
 *  - Real-time updates are applied as document deltas (`docChanges()`), so an
 *    incoming message appends one document instead of re-reading/re-mapping the
 *    entire window.
 *
 * Write model:
 *  - `saveMessage` is wrapped in a short per-user cooldown so rapid sends do
 *    not spam Firestore (client half of the rate limit; see firestore.rules
 *    for the server-side half).
 *
 * NOTE: the live global chat currently runs over socket.io (presenceStore).
 * This service is the persistence layer for chat history and is safe to wire
 * into that flow; it is intentionally self-contained.
 */

import {
  collection,
  doc,
  writeBatch,
  query,
  orderBy,
  limit,
  limitToLast,
  getDocs,
  where,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';
import {
  logFirestoreRead,
  logFirestoreSnapshot,
  withWriteDiagnostics,
  trackListener
} from '../../utils/firestoreDiagnostics';
import { runWithCooldown } from '../../utils/writeThrottle';

const COLLECTIONS = {
  GLOBAL_CHAT: 'globalChat'
};

// Only the latest N messages are ever read.
export const CHAT_MESSAGE_LIMIT = 30;
// Minimum gap between two chat writes from the same user (client-side).
export const CHAT_SEND_COOLDOWN_MS = 750;

class GlobalChatService {
  constructor() {
    this.isConfigured = isFirebaseConfigured && !isDemoMode;
    this.listeners = new Map();
  }

  /**
   * Save a global chat message (cooldown-protected).
   * Returns the new document id, or null when blocked/unavailable.
   */
  async saveMessage(message) {
    if (!this.isConfigured || !db) {
      console.warn('Firebase not configured, message not persisted');
      return null;
    }

    const senderKey = message.senderId || 'anonymous';

    return runWithCooldown(`global-chat:${senderKey}`, CHAT_SEND_COOLDOWN_MS, async () => {
      try {
        const messageData = {
          senderId: message.senderId,
          senderName: message.senderName,
          senderClass: message.senderClass || '',
          senderLevel: message.senderLevel || 1,
          content: message.content,
          type: message.type || 'message', // 'message' | 'system' | 'whisper'
          timestamp: serverTimestamp(),
          createdAt: new Date().toISOString()
        };

        // Batch the message with the per-user cooldown doc so the security
        // rules can enforce a server-side 1s write cooldown (timestamp
        // comparison against chat_cooldowns/{uid}.lastMessageAt).
        const messageRef = doc(collection(db, COLLECTIONS.GLOBAL_CHAT));
        const batch = writeBatch(db);
        batch.set(messageRef, messageData);
        batch.set(
          doc(db, 'chat_cooldowns', senderKey),
          { userId: senderKey, lastMessageAt: serverTimestamp() },
          { merge: true }
        );

        await withWriteDiagnostics(
          COLLECTIONS.GLOBAL_CHAT,
          () => batch.commit(),
          { op: 'batch.commit (message + cooldown)' }
        );

        return messageRef.id;
      } catch (error) {
        console.error('❌ Failed to save global chat message:', error);
        return null;
      }
    });
  }

  /**
   * Load the latest chat messages (chronological order).
   */
  async loadRecentMessages(messageLimit = CHAT_MESSAGE_LIMIT) {
    if (!this.isConfigured || !db) {
      console.warn('Firebase not configured, returning empty chat history');
      return [];
    }

    try {
      const messagesRef = collection(db, COLLECTIONS.GLOBAL_CHAT);
      const q = query(
        messagesRef,
        orderBy('timestamp', 'asc'),
        limitToLast(messageLimit)
      );

      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      logFirestoreRead({ collection: COLLECTIONS.GLOBAL_CHAT, count: messages.length, op: 'getDocs' });
      return messages;
    } catch (error) {
      console.error('❌ Failed to load global chat messages:', error);
      return [];
    }
  }

  /**
   * Subscribe to the latest N chat messages in real time.
   *
   * The callback receives the full (bounded) window; internally only changed
   * documents are applied, so a single incoming message is an O(1) append.
   *
   * @param {Function} callback  receives (messages: Array)
   * @param {Object}   options   { messageLimit, onError }
   * @returns {Function} unsubscribe
   */
  subscribeToMessages(callback, options = {}) {
    const { messageLimit = CHAT_MESSAGE_LIMIT, onError } = options;

    if (!this.isConfigured || !db) {
      console.warn('Firebase not configured, cannot subscribe to messages');
      return () => {};
    }

    // Idempotent: replace any previous chat listener instead of stacking them.
    const existing = this.listeners.get('globalChat');
    if (existing) {
      existing();
      this.listeners.delete('globalChat');
    }

    try {
      const messagesRef = collection(db, COLLECTIONS.GLOBAL_CHAT);
      const q = query(
        messagesRef,
        orderBy('timestamp', 'asc'),
        limitToLast(messageLimit)
      );

      const messagesById = new Map();

      const emit = () => callback(Array.from(messagesById.values()));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          // Apply only document deltas; no full re-map of the window.
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'removed') {
              messagesById.delete(change.doc.id);
            } else {
              messagesById.set(change.doc.id, { id: change.doc.id, ...change.doc.data() });
            }
          });

          // Keep the local window bounded.
          while (messagesById.size > messageLimit) {
            const oldestKey = messagesById.keys().next().value;
            messagesById.delete(oldestKey);
          }

          logFirestoreSnapshot({
            collection: COLLECTIONS.GLOBAL_CHAT,
            changes: snapshot.docChanges(),
            total: messagesById.size
          });

          emit();
        },
        (error) => {
          console.error('❌ Global chat subscription error:', error);
          if (onError) onError(error);
        }
      );

      this.listeners.set('globalChat', unsubscribe);
      trackListener(1);
      return unsubscribe;
    } catch (error) {
      console.error('❌ Failed to subscribe to global chat messages:', error);
      return () => {};
    }
  }

  /**
   * Load messages from a specific user (bounded).
   */
  async loadUserMessages(userId, messageLimit = 50) {
    if (!this.isConfigured || !db) {
      return [];
    }

    try {
      const messagesRef = collection(db, COLLECTIONS.GLOBAL_CHAT);
      const q = query(
        messagesRef,
        where('senderId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(messageLimit)
      );

      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      messages.reverse();
      logFirestoreRead({ collection: COLLECTIONS.GLOBAL_CHAT, count: messages.length, op: 'getDocs' });
      return messages;
    } catch (error) {
      console.error('❌ Failed to load user messages:', error);
      return [];
    }
  }

  /**
   * Clean up listeners
   */
  cleanup() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
      trackListener(-1);
    });
    this.listeners.clear();
  }
}

// Export singleton instance
const globalChatService = new GlobalChatService();
export default globalChatService;
