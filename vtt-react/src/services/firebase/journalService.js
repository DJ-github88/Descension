/**
 * Journal Persistence Service
 *
 * Handles persistence of player journal data:
 * - Player knowledge received from GMs
 * - Personal notes
 * - Journal folders and organization
 * - Knowledge boards and visual connections
 * - Knowledge orbs and relationships
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Journal Persistence Service
 */
class JournalService {

  /**
   * Save complete journal data for a user
   */
  async saveJournal(userId, journalData) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      const firestoreData = {
        // Player received knowledge
        playerKnowledge: journalData.playerKnowledge || [],

        // Personal notes
        playerNotes: journalData.playerNotes || [],

        // Organization
        journalFolders: journalData.journalFolders || [],

        // Knowledge boards
        knowledgeBoards: journalData.knowledgeBoards || [],

        // Board elements
        knowledgeOrbs: journalData.knowledgeOrbs || [],
        knowledgeConnections: journalData.knowledgeConnections || [],

        // Current selections
        currentFolderId: journalData.currentFolderId || null,
        currentBoardId: journalData.currentBoardId || null,

        // Metadata
        lastUpdated: serverTimestamp(),
        version: journalData.version || 1
      };

      await setDoc(docRef, firestoreData, { merge: true });

      return {
        success: true,
        userId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving journal:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load journal data for a user
   */
  async loadJournal(userId) {
    if (!userId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Return default empty journal structure
        return this.getDefaultJournalStructure();
      }

      const data = docSnap.data();

      return {
        // Player received knowledge
        playerKnowledge: data.playerKnowledge || [],

        // Personal notes
        playerNotes: data.playerNotes || [],

        // Organization
        journalFolders: data.journalFolders || [],

        // Knowledge boards
        knowledgeBoards: data.knowledgeBoards || [],

        // Board elements
        knowledgeOrbs: data.knowledgeOrbs || [],
        knowledgeConnections: data.knowledgeConnections || [],

        // Current selections
        currentFolderId: data.currentFolderId || null,
        currentBoardId: data.currentBoardId || null,

        // Metadata
        lastUpdated: data.lastUpdated?.toDate?.() || new Date(data.lastUpdated),
        version: data.version || 1
      };

    } catch (error) {
      console.error('Error loading journal:', error);
      return this.getDefaultJournalStructure();
    }
  }

  /**
   * Get default journal structure
   */
  getDefaultJournalStructure() {
    return {
      playerKnowledge: [],
      playerNotes: [],
      journalFolders: [],
      knowledgeBoards: [],
      knowledgeOrbs: [],
      knowledgeConnections: [],
      currentFolderId: null,
      currentBoardId: null,
      lastUpdated: new Date(),
      version: 1
    };
  }

  /**
   * Update player knowledge (add new knowledge from GM)
   */
  async updatePlayerKnowledge(userId, knowledgeUpdates) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      const updateData = {
        playerKnowledge: knowledgeUpdates,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify(knowledgeUpdates)]).size
      };

    } catch (error) {
      console.error('Error updating player knowledge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update player notes
   */
  async updatePlayerNotes(userId, notesUpdates) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      const updateData = {
        playerNotes: notesUpdates,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify(notesUpdates)]).size
      };

    } catch (error) {
      console.error('Error updating player notes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update journal folders
   */
  async updateJournalFolders(userId, foldersUpdates) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      const updateData = {
        journalFolders: foldersUpdates,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify(foldersUpdates)]).size
      };

    } catch (error) {
      console.error('Error updating journal folders:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update knowledge boards
   */
  async updateKnowledgeBoards(userId, boardsUpdates) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      const updateData = {
        knowledgeBoards: boardsUpdates,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify(boardsUpdates)]).size
      };

    } catch (error) {
      console.error('Error updating knowledge boards:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update knowledge board elements (orbs and connections)
   */
  async updateKnowledgeBoardElements(userId, orbsUpdates, connectionsUpdates) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      const updateData = {
        knowledgeOrbs: orbsUpdates,
        knowledgeConnections: connectionsUpdates,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify({ orbsUpdates, connectionsUpdates })]).size
      };

    } catch (error) {
      console.error('Error updating knowledge board elements:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Set current folder selection
   */
  async setCurrentFolder(userId, folderId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      await updateDoc(docRef, {
        currentFolderId: folderId,
        lastUpdated: serverTimestamp()
      });

      return { success: true };

    } catch (error) {
      console.error('Error setting current folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Set current board selection
   */
  async setCurrentBoard(userId, boardId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');

      await updateDoc(docRef, {
        currentBoardId: boardId,
        lastUpdated: serverTimestamp()
      });

      return { success: true };

    } catch (error) {
      console.error('Error setting current board:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add new knowledge from GM (append to existing)
   */
  async addKnowledge(userId, newKnowledge) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // First get current journal
      const currentJournal = await this.loadJournal(userId);
      const updatedKnowledge = [...currentJournal.playerKnowledge, newKnowledge];

      return await this.updatePlayerKnowledge(userId, updatedKnowledge);

    } catch (error) {
      console.error('Error adding knowledge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add new note (append to existing)
   */
  async addNote(userId, newNote) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // First get current journal
      const currentJournal = await this.loadJournal(userId);
      const updatedNotes = [...currentJournal.playerNotes, newNote];

      return await this.updatePlayerNotes(userId, updatedNotes);

    } catch (error) {
      console.error('Error adding note:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove knowledge item
   */
  async removeKnowledge(userId, knowledgeId) {
    if (!userId || !knowledgeId) {
      throw new Error('User ID and Knowledge ID are required');
    }

    try {
      // First get current journal
      const currentJournal = await this.loadJournal(userId);
      const updatedKnowledge = currentJournal.playerKnowledge.filter(k => k.id !== knowledgeId);

      return await this.updatePlayerKnowledge(userId, updatedKnowledge);

    } catch (error) {
      console.error('Error removing knowledge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove note
   */
  async removeNote(userId, noteId) {
    if (!userId || !noteId) {
      throw new Error('User ID and Note ID are required');
    }

    try {
      // First get current journal
      const currentJournal = await this.loadJournal(userId);
      const updatedNotes = currentJournal.playerNotes.filter(n => n.id !== noteId);

      return await this.updatePlayerNotes(userId, updatedNotes);

    } catch (error) {
      console.error('Error removing note:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Move knowledge to different folder
   */
  async moveKnowledgeToFolder(userId, knowledgeId, folderId) {
    if (!userId || !knowledgeId) {
      throw new Error('User ID and Knowledge ID are required');
    }

    try {
      // First get current journal
      const currentJournal = await this.loadJournal(userId);
      const updatedKnowledge = currentJournal.playerKnowledge.map(k =>
        k.id === knowledgeId ? { ...k, folderId } : k
      );

      return await this.updatePlayerKnowledge(userId, updatedKnowledge);

    } catch (error) {
      console.error('Error moving knowledge to folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Move note to different folder
   */
  async moveNoteToFolder(userId, noteId, folderId) {
    if (!userId || !noteId) {
      throw new Error('User ID and Note ID are required');
    }

    try {
      // First get current journal
      const currentJournal = await this.loadJournal(userId);
      const updatedNotes = currentJournal.playerNotes.map(n =>
        n.id === noteId ? { ...n, folderId } : n
      );

      return await this.updatePlayerNotes(userId, updatedNotes);

    } catch (error) {
      console.error('Error moving note to folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete journal data for a user
   */
  async deleteJournal(userId) {
    if (!userId) return;

    try {
      const docRef = doc(db, 'users', userId, 'journal', 'main');
      await deleteDoc(docRef);
      return { success: true };

    } catch (error) {
      console.error('Error deleting journal:', error);
      return { success: false, error: error.message };
    }
  }
}

const journalService = new JournalService();
export default journalService;
