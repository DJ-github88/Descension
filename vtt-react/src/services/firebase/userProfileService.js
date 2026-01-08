/**
 * User Profile Service
 *
 * Manages user profile data and avatar persistence to Firebase.
 * Handles profile customization, avatar uploads, and user preferences.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured, isDemoMode } from '../../config/firebase';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  USER_PROFILES: 'userProfiles'
};

/**
 * Check if Firebase is available
 */
function checkFirebaseAvailable() {
  if (!isFirebaseConfigured || isDemoMode || !db) {
    console.warn('Firebase not configured or in demo mode');
    return false;
  }
  return true;
}

/**
 * Default user profile structure
 */
export const DEFAULT_USER_PROFILE = {
  // Basic profile info
  displayName: '',
  bio: '',
  title: '', // e.g., "Dungeon Master", "Player", "Game Designer"

  // Avatar/Profile picture
  avatarUrl: null,
  avatarType: 'default', // 'default', 'uploaded', 'generated'
  avatarSettings: {
    style: 'fantasy', // 'fantasy', 'modern', 'cute'
    backgroundColor: '#2c3e50',
    textColor: '#ecf0f1'
  },

  // Gaming preferences
  favoriteClasses: [],
  favoriteRaces: [],
  playStyle: 'casual', // 'casual', 'competitive', 'storyteller', 'tactical'
  gameMasterExperience: 'player', // 'player', 'beginner_gm', 'experienced_gm', 'professional'

  // Social features
  isPublic: true,
  showOnlineStatus: true,
  allowFriendRequests: true,
  allowDirectMessages: true,
  shareGameStats: false,

  // Achievement/Stats (computed)
  totalGamesPlayed: 0,
  totalCharactersCreated: 0,
  totalCampaignsRun: 0,
  favoriteDiceRoll: null,
  joinedDate: null,

  // Customization
  profileTheme: 'default', // 'default', 'dark', 'fantasy', 'modern'
  badgePreferences: {
    showAchievementBadges: true,
    showClassMasteryBadges: true,
    showCampaignCompletionBadges: true
  },

  // Contact/External links
  website: '',
  discordTag: '',
  twitchChannel: '',
  youtubeChannel: '',

  // Metadata
  version: 1,
  lastUpdated: new Date().toISOString()
};

/**
 * Save user profile to Firebase
 */
export async function saveUserProfile(userId, profileData) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Merge with defaults to ensure all profile fields are present
    const profileToSave = {
      ...DEFAULT_USER_PROFILE,
      ...profileData,
      userId,
      lastUpdated: serverTimestamp(),
      version: 1
    };

    const profileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    await setDoc(profileRef, profileToSave, { merge: true });

    // Update user's basic profile reference
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        displayName: profileToSave.displayName,
        profileLastUpdated: serverTimestamp(),
        hasProfile: true
      });
    }

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Load user profile from Firebase
 */
export async function loadUserProfile(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { ...DEFAULT_USER_PROFILE };
    }

    if (!userId) {
      return { ...DEFAULT_USER_PROFILE };
    }

    const profileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
      const profileData = profileDoc.data();
      return {
        ...DEFAULT_USER_PROFILE,
        ...profileData
      };
    } else {
      return { ...DEFAULT_USER_PROFILE };
    }

  } catch (error) {
    console.error('Error loading user profile:', error);
    return { ...DEFAULT_USER_PROFILE };
  }
}

/**
 * Update user profile (partial update)
 */
export async function updateUserProfile(userId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const profileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    await updateDoc(profileRef, {
      ...updates,
      lastUpdated: serverTimestamp()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Upload avatar image to Firebase Storage
 */
export async function uploadAvatar(userId, file) {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not available');
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `avatar_${userId}_${Date.now()}.${fileExtension}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, `avatars/${userId}/${fileName}`);
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user profile with new avatar
    await updateUserProfile(userId, {
      avatarUrl: downloadURL,
      avatarType: 'uploaded'
    });

    return {
      success: true,
      avatarUrl: downloadURL,
      fileName
    };

  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete avatar from Firebase Storage
 */
export async function deleteAvatar(userId, avatarUrl) {
  try {
    if (!storage || !avatarUrl) {
      return { success: false };
    }

    // Extract file path from URL
    const urlParts = avatarUrl.split('/o/')[1];
    if (!urlParts) {
      return { success: false };
    }

    const filePath = decodeURIComponent(urlParts.split('?')[0]);

    // Delete from Firebase Storage
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);

    // Update user profile
    await updateUserProfile(userId, {
      avatarUrl: null,
      avatarType: 'default'
    });

    return { success: true };

  } catch (error) {
    console.error('Error deleting avatar:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate avatar from initials/name
 */
export function generateAvatarFromName(displayName, settings = {}) {
  const {
    size = 100,
    backgroundColor = '#2c3e50',
    textColor = '#ecf0f1',
    fontSize = 40
  } = settings;

  // Get initials from display name
  const initials = displayName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  // Create SVG avatar
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}"
            fill="${textColor}" text-anchor="middle" dy=".35em" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;

  // Convert SVG to data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

  return {
    avatarUrl: dataUrl,
    avatarType: 'generated',
    initials
  };
}

/**
 * Update user gaming statistics
 */
export async function updateUserStats(userId, stats) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    const updates = {};
    Object.keys(stats).forEach(key => {
      if (['totalGamesPlayed', 'totalCharactersCreated', 'totalCampaignsRun', 'favoriteDiceRoll'].includes(key)) {
        updates[key] = stats[key];
      }
    });

    if (Object.keys(updates).length > 0) {
      await updateUserProfile(userId, updates);
    }

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Export user profile for backup
 */
export async function exportUserProfile(userId) {
  try {
    const profile = await loadUserProfile(userId);
    // Remove sensitive data from export
    const { userId: _, lastUpdated, ...exportableProfile } = profile;
    return exportableProfile;
  } catch (error) {
    console.error('Error exporting user profile:', error);
    return null;
  }
}

/**
 * Import user profile from backup
 */
export async function importUserProfile(userId, profileData) {
  try {
    // Validate and sanitize imported data
    const validatedProfile = {};
    Object.keys(DEFAULT_USER_PROFILE).forEach(key => {
      if (profileData.hasOwnProperty(key)) {
        // Skip sensitive fields that shouldn't be imported
        if (!['userId', 'avatarUrl'].includes(key)) {
          validatedProfile[key] = profileData[key];
        }
      }
    });

    return await saveUserProfile(userId, validatedProfile);
  } catch (error) {
    console.error('Error importing user profile:', error);
    return { success: false, error: error.message };
  }
}
