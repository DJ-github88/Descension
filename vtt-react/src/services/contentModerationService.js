/**
 * Content Moderation Service
 *
 * Handles content reporting, filtering, and moderation for community features
 */

import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Content moderation collections
const MODERATION_COLLECTIONS = {
  REPORTS: 'contentReports',
  FILTERED_WORDS: 'filteredWords',
  MODERATION_ACTIONS: 'moderationActions'
};

// Content types that can be moderated
export const CONTENT_TYPES = {
  SPELL: 'spell',
  CREATURE: 'creature',
  ITEM: 'item',
  CAMPAIGN: 'campaign',
  ROOM: 'room',
  CHARACTER: 'character',
  COMMENT: 'comment',
  POST: 'post'
};

// Report reasons
export const REPORT_REASONS = {
  INAPPROPRIATE: 'inappropriate_content',
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  HATE_SPEECH: 'hate_speech',
  VIOLENCE: 'graphic_violence',
  COPYRIGHT: 'copyright_violation',
  MISLEADING: 'misleading_information',
  OTHER: 'other'
};

// Content status
export const CONTENT_STATUS = {
  PENDING: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REMOVED: 'removed',
  FLAGGED: 'flagged'
};

// Default filtered words (can be extended)
const DEFAULT_FILTERED_WORDS = [
  // Offensive language
  'damn', 'hell', 'crap', 'ass', 'bastard', 'bitch', 'shit', 'fuck', 'cunt', 'pussy',
  // Hate speech
  'nigger', 'faggot', 'kike', 'chink', 'gook', 'wetback', 'spic', 'coon', 'heeb',
  // Violence/threats
  'kill', 'murder', 'rape', 'torture', 'abuse', 'harm', 'hurt',
  // Other inappropriate content
  'porn', 'sex', 'naked', 'nude', 'pedophile', 'child'
];

/**
 * Initialize content moderation
 */
export async function initializeContentModeration() {
  try {
    // Ensure filtered words collection exists with defaults
    await initializeFilteredWords();
    console.log('Content moderation initialized');
  } catch (error) {
    console.error('Failed to initialize content moderation:', error);
  }
}

/**
 * Initialize filtered words with defaults
 */
async function initializeFilteredWords() {
  try {
    const filteredWordsRef = collection(db, MODERATION_COLLECTIONS.FILTERED_WORDS);
    const existingWords = await getDocs(filteredWordsRef);

    if (existingWords.empty) {
      // Add default filtered words
      const batchPromises = DEFAULT_FILTERED_WORDS.map(word =>
        addDoc(filteredWordsRef, {
          word: word.toLowerCase(),
          severity: 'high',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );

      await Promise.all(batchPromises);
      console.log('Default filtered words initialized');
    }
  } catch (error) {
    console.error('Failed to initialize filtered words:', error);
  }
}

/**
 * Report content for moderation
 */
export async function reportContent(contentType, contentId, reporterId, reason, description = '', metadata = {}) {
  try {
    const reportData = {
      contentType,
      contentId,
      reporterId,
      reason,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...metadata
      }
    };

    const docRef = await addDoc(collection(db, MODERATION_COLLECTIONS.REPORTS), reportData);

    console.log(`Content reported: ${contentType}/${contentId} - ${reason}`);

    return {
      success: true,
      reportId: docRef.id
    };
  } catch (error) {
    console.error('Failed to report content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all reports (admin function)
 */
export async function getContentReports(filters = {}) {
  try {
    let reportsQuery = collection(db, MODERATION_COLLECTIONS.REPORTS);

    // Apply filters
    if (filters.status) {
      reportsQuery = query(reportsQuery, where('status', '==', filters.status));
    }
    if (filters.contentType) {
      reportsQuery = query(reportsQuery, where('contentType', '==', filters.contentType));
    }
    if (filters.reason) {
      reportsQuery = query(reportsQuery, where('reason', '==', filters.reason));
    }

    // Order by creation date (newest first)
    reportsQuery = query(reportsQuery, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(reportsQuery);
    const reports = [];

    snapshot.forEach(doc => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      reports
    };
  } catch (error) {
    console.error('Failed to get content reports:', error);
    return {
      success: false,
      error: error.message,
      reports: []
    };
  }
}

/**
 * Moderate content (approve/reject/remove)
 */
export async function moderateContent(reportId, action, moderatorId, reason = '', metadata = {}) {
  try {
    const reportRef = doc(db, MODERATION_COLLECTIONS.REPORTS, reportId);
    const reportDoc = await getDocs(query(collection(db, MODERATION_COLLECTIONS.REPORTS), where('__name__', '==', reportId)));

    if (reportDoc.empty) {
      throw new Error('Report not found');
    }

    const reportData = reportDoc.docs[0].data();

    // Update report status
    await updateDoc(reportRef, {
      status: action,
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
      moderationReason: reason,
      updatedAt: new Date()
    });

    // Log moderation action
    await addDoc(collection(db, MODERATION_COLLECTIONS.MODERATION_ACTIONS), {
      reportId,
      action,
      moderatorId,
      reason,
      contentType: reportData.contentType,
      contentId: reportData.contentId,
      createdAt: new Date(),
      metadata
    });

    // Take action on content based on moderation decision
    if (action === 'remove') {
      await removeContent(reportData.contentType, reportData.contentId, reason);
    }

    console.log(`Content moderated: ${action} - ${reportData.contentType}/${reportData.contentId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to moderate content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Remove content (implementation depends on content type)
 */
async function removeContent(contentType, contentId, reason) {
  try {
    // This would need to be implemented based on how each content type is stored
    // For now, we'll just log the action
    console.log(`Content removal requested: ${contentType}/${contentId} - ${reason}`);

    // Example implementations for different content types:
    switch (contentType) {
      case CONTENT_TYPES.SPELL:
        // Remove from spells collection
        // await deleteDoc(doc(db, 'spells', contentId));
        break;
      case CONTENT_TYPES.CREATURE:
        // Remove from creatures collection
        // await deleteDoc(doc(db, 'creatures', contentId));
        break;
      case CONTENT_TYPES.ITEM:
        // Remove from items collection
        // await deleteDoc(doc(db, 'items', contentId));
        break;
      default:
        console.warn(`Content removal not implemented for type: ${contentType}`);
    }
  } catch (error) {
    console.error('Failed to remove content:', error);
  }
}

/**
 * Check content against filters
 */
export async function checkContent(content, contentType) {
  try {
    if (!content || typeof content !== 'string') {
      return { isClean: true, violations: [] };
    }

    const filteredWords = await getFilteredWords();
    const contentLower = content.toLowerCase();
    const violations = [];

    for (const word of filteredWords) {
      if (word.active && contentLower.includes(word.word.toLowerCase())) {
        violations.push({
          word: word.word,
          severity: word.severity,
          foundAt: contentLower.indexOf(word.word.toLowerCase())
        });
      }
    }

    return {
      isClean: violations.length === 0,
      violations,
      contentType
    };
  } catch (error) {
    console.error('Failed to check content:', error);
    return {
      isClean: true,
      violations: [],
      error: error.message
    };
  }
}

/**
 * Get filtered words
 */
export async function getFilteredWords() {
  try {
    const wordsQuery = query(
      collection(db, MODERATION_COLLECTIONS.FILTERED_WORDS),
      where('active', '==', true)
    );

    const snapshot = await getDocs(wordsQuery);
    const words = [];

    snapshot.forEach(doc => {
      words.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return words;
  } catch (error) {
    console.error('Failed to get filtered words:', error);
    return [];
  }
}

/**
 * Add filtered word
 */
export async function addFilteredWord(word, severity = 'medium') {
  try {
    await addDoc(collection(db, MODERATION_COLLECTIONS.FILTERED_WORDS), {
      word: word.toLowerCase(),
      severity,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to add filtered word:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove filtered word
 */
export async function removeFilteredWord(wordId) {
  try {
    await deleteDoc(doc(db, MODERATION_COLLECTIONS.FILTERED_WORDS, wordId));
    return { success: true };
  } catch (error) {
    console.error('Failed to remove filtered word:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get moderation statistics
 */
export async function getModerationStats() {
  try {
    const reportsQuery = collection(db, MODERATION_COLLECTIONS.REPORTS);
    const actionsQuery = collection(db, MODERATION_COLLECTIONS.MODERATION_ACTIONS);

    const [reportsSnapshot, actionsSnapshot] = await Promise.all([
      getDocs(reportsQuery),
      getDocs(actionsQuery)
    ]);

    const stats = {
      totalReports: reportsSnapshot.size,
      pendingReports: 0,
      resolvedReports: 0,
      moderationActions: actionsSnapshot.size,
      reportsByType: {},
      reportsByReason: {},
      actionsByType: {}
    };

    reportsSnapshot.forEach(doc => {
      const data = doc.data();
      stats.reportsByType[data.contentType] = (stats.reportsByType[data.contentType] || 0) + 1;
      stats.reportsByReason[data.reason] = (stats.reportsByReason[data.reason] || 0) + 1;

      if (data.status === 'pending') {
        stats.pendingReports++;
      } else {
        stats.resolvedReports++;
      }
    });

    actionsSnapshot.forEach(doc => {
      const data = doc.data();
      stats.actionsByType[data.action] = (stats.actionsByType[data.action] || 0) + 1;
    });

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Failed to get moderation stats:', error);
    return {
      success: false,
      error: error.message,
      stats: {}
    };
  }
}

/**
 * Sanitize content (remove or replace filtered words)
 */
export async function sanitizeContent(content, replacement = '***') {
  try {
    if (!content || typeof content !== 'string') {
      return content;
    }

    const filteredWords = await getFilteredWords();
    let sanitized = content;

    for (const word of filteredWords) {
      if (word.active) {
        const regex = new RegExp(word.word, 'gi');
        sanitized = sanitized.replace(regex, replacement);
      }
    }

    return sanitized;
  } catch (error) {
    console.error('Failed to sanitize content:', error);
    return content;
  }
}
