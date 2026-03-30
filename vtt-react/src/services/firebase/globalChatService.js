/**
 * Global Chat Service
 * 
 * Manages global chat messages in Firebase Firestore.
 * Provides persistence for chat history across sessions.
 */

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';

const COLLECTIONS = {
  GLOBAL_CHAT: 'globalChat'
};

class GlobalChatService {
  constructor() {
    this.isConfigured = isFirebaseConfigured && !isDemoMode;
    this.listeners = new Map();
  }

  /**
   * Save a global chat message
   */
  async saveMessage(message) {
    if (!this.isConfigured || !db) {
      console.warn('Firebase not configured, message not persisted');
      return null;
    }

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

      const docRef = await addDoc(collection(db, COLLECTIONS.GLOBAL_CHAT), messageData);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ Failed to save global chat message:', error);
      return null;
    }
  }

  /**
   * Load recent chat messages
   */
  async loadRecentMessages(messageLimit = 100) {
    if (!this.isConfigured || !db) {
      console.warn('Firebase not configured, returning empty chat history');
      return [];
    }

    try {
      const messagesRef = collection(db, COLLECTIONS.GLOBAL_CHAT);
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(messageLimit)
      );

      const snapshot = await getDocs(q);
      const messages = [];

      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Reverse to get chronological order
      messages.reverse();

      return messages;
    } catch (error) {
      console.error('❌ Failed to load global chat messages:', error);
      return [];
    }
  }

  /**
   * Subscribe to new chat messages in real-time
   */
  subscribeToMessages(callback, messageLimit = 100) {
    if (!this.isConfigured || !db) {
      console.warn('Firebase not configured, cannot subscribe to messages');
      return () => {};
    }

    try {
      const messagesRef = collection(db, COLLECTIONS.GLOBAL_CHAT);
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(messageLimit)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = [];
        
        snapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Reverse to get chronological order
        messages.reverse();
        
        callback(messages);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Failed to subscribe to global chat messages:', error);
      return () => {};
    }
  }

  /**
   * Load messages from a specific user
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
      const messages = [];

      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });

      messages.reverse();
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
    });
    this.listeners.clear();
  }
}

// Export singleton instance
const globalChatService = new GlobalChatService();
export default globalChatService;

