/**
 * User Profile Service
 *
 * Manages user profile data and avatar persistence to Firebase.
 *
 * Project 4 profile boundary:
 * - The public projection at userProfiles/{uid} contains exactly the frozen
 *   allowlist (displayName, photoURL, friendId, friendId_lowercase, updatedAt,
 *   projectionVersion). It is versioned and queryable by other accounts.
 * - Rich profile data (bio, contact, preferences, stats, avatar settings) is
 *   private and owner-only at userSettings/{uid}.profile.
 * - Legacy mixed public documents are copied privately and then slimmed; they
 *   are never served as a public profile after conversion.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode, isMockOrDevUser, auth } from '../../config/firebase';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  USER_PROFILES: 'userProfiles',
  USER_SETTINGS: 'userSettings'
};

const PUBLIC_PROFILE_FIELDS = [
  'displayName',
  'photoURL',
  'friendId',
  'friendId_lowercase',
  'updatedAt',
  'projectionVersion'
];

/**
 * Check if Firebase is available
 */
function checkFirebaseAvailable(userId = null) {
  if (!isFirebaseConfigured || isDemoMode || !db || (userId && isMockOrDevUser(userId)) || !auth?.currentUser) {
    return false;
  }
  return true;
}

/**
 * Default user profile structure (private)
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

function privateProfileRef(userId) {
  return doc(db, COLLECTIONS.USER_SETTINGS, userId);
}

function publicProfileRef(userId) {
  return doc(db, COLLECTIONS.USER_PROFILES, userId);
}

/**
 * Publish only the frozen public allowlist. Never copies private fields and
 * never publishes the private uploaded avatar URL to the public projection.
 */
async function publishPublicProfile(userId, data = {}) {
  const publicData = { projectionVersion: 1, updatedAt: serverTimestamp() };
  if (data.displayName !== undefined) publicData.displayName = data.displayName || null;
  if (data.photoURL !== undefined) publicData.photoURL = data.photoURL || null;
  if (data.friendId !== undefined) {
    publicData.friendId = data.friendId || null;
    publicData.friendId_lowercase = data.friendId ? String(data.friendId).toLowerCase() : null;
  }
  await setDoc(publicProfileRef(userId), publicData, { merge: true });
}

/**
 * Save user profile to Firebase (private storage + slim public projection).
 */
export async function saveUserProfile(userId, profileData) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Merge with defaults to ensure all private profile fields are present
    const profileToSave = {
      ...DEFAULT_USER_PROFILE,
      ...profileData,
      userId,
      lastUpdated: serverTimestamp(),
      version: 1
    };

    const sanitizedProfile = sanitizeForFirestore(profileToSave);
    await setDoc(privateProfileRef(userId), { profile: sanitizedProfile }, { merge: true });

    await publishPublicProfile(userId, {
      displayName: profileToSave.displayName,
      photoURL: profileToSave.photoURL
    });

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
 * True slim public replacement: exact allowlist only, no merge, so private
 * legacy fields cannot survive in the public document. `projectionVersion: 1`
 * may only exist on a genuinely slim document.
 */
function buildSlimPublicProfile(source = {}) {
  const friendId = typeof source.friendId === 'string' && source.friendId.length > 0
    ? source.friendId
    : null;
  return {
    projectionVersion: 1,
    updatedAt: serverTimestamp(),
    displayName: typeof source.displayName === 'string' ? source.displayName : null,
    photoURL: typeof source.photoURL === 'string' ? source.photoURL : null,
    friendId,
    friendId_lowercase: friendId ? friendId.toLowerCase() : null
  };
}

async function writeSlimPublicProfile(userId, source = {}) {
  await setDoc(publicProfileRef(userId), buildSlimPublicProfile(source));
}

/**
 * Load the owner's private profile. Legacy mixed public documents are copied
 * privately (all non-public fields) before the public document is replaced
 * with the exact slim schema. An existing private copy does not skip an
 * unfinished slim replacement: the public document is re-checked and the
 * migration retried until it is genuinely slim.
 */
export async function loadUserProfile(userId) {
  try {
    if (!checkFirebaseAvailable(userId)) {
      return { ...DEFAULT_USER_PROFILE, displayName: userId === 'admin-dev-user' ? 'Admin' : 'Adventurer' };
    }

    if (!userId) {
      return { ...DEFAULT_USER_PROFILE };
    }

    const privateDoc = await getDoc(privateProfileRef(userId));
    const legacyDoc = await getDoc(publicProfileRef(userId)).catch(() => null);
    const legacyData = legacyDoc && legacyDoc.exists() ? (legacyDoc.data() || {}) : null;

    const needsSlim = !legacyData
      || legacyData.projectionVersion !== 1
      || Object.keys(legacyData).some((key) => !PUBLIC_PROFILE_FIELDS.includes(key));

    if (privateDoc.exists() && privateDoc.data()?.profile) {
      const privateData = privateDoc.data().profile || {};
      const privateProfile = {
        ...DEFAULT_USER_PROFILE,
        ...privateData
      };
      if (needsSlim) {
        // R8.5/R11: preserve non-public legacy fields that exist only in the
        // mixed public document BEFORE the true slim replacement. Existing
        // private values always win; legacy only fills missing fields. The
        // preservation fill and the slim replacement commit as ONE atomic
        // batch, so a failed preservation can never leave a slimmed public
        // document (public stays mixed and the migration retries next load).
        const preserved = {};
        if (legacyData) {
          for (const [key, value] of Object.entries(legacyData)) {
            if (PUBLIC_PROFILE_FIELDS.includes(key)) {continue;}
            preserved[key] = value;
          }
        }
        const fill = {};
        for (const [key, value] of Object.entries(preserved)) {
          if (privateData[key] === undefined) {fill[key] = value;}
        }
        try {
          const batch = writeBatch(db);
          if (Object.keys(fill).length > 0) {
            batch.set(privateProfileRef(userId), {
              profile: sanitizeForFirestore(fill)
            }, { merge: true });
          }
          batch.set(publicProfileRef(userId), buildSlimPublicProfile(legacyData || privateProfile));
          await batch.commit();
          Object.assign(privateProfile, fill);
        } catch (migrationError) {
          console.warn('Profile migration pending retry (public document untouched):', migrationError?.message || migrationError);
        }
      }
      return privateProfile;
    }

    if (legacyData) {
      // Preserve ALL non-public legacy content privately before slimming.
      const privateProfile = { ...DEFAULT_USER_PROFILE };
      for (const [key, value] of Object.entries(legacyData)) {
        if (PUBLIC_PROFILE_FIELDS.includes(key)) {continue;}
        privateProfile[key] = value;
      }
      if (legacyData.displayName !== undefined) {privateProfile.displayName = legacyData.displayName;}
      if (legacyData.photoURL !== undefined) {privateProfile.photoURL = legacyData.photoURL;}
      privateProfile.userId = userId;
      privateProfile.version = 1;

      await setDoc(privateProfileRef(userId), {
        profile: sanitizeForFirestore(privateProfile)
      }, { merge: true });

      try {
        await writeSlimPublicProfile(userId, legacyData);
      } catch (slimError) {
        // Private preservation succeeded; slim retry happens on next load.
        console.warn('Public profile slim replacement pending retry:', slimError?.message || slimError);
      }
      return privateProfile;
    }

    return { ...DEFAULT_USER_PROFILE };

  } catch (error) {
    console.error('Error loading user profile:', error);
    return { ...DEFAULT_USER_PROFILE };
  }
}

/**
 * Update user profile (partial update) in private storage; republish only the
 * public allowlist subset.
 */
export async function updateUserProfile(userId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const sanitizedUpdates = sanitizeForFirestore(updates);
    await setDoc(privateProfileRef(userId), {
      profile: { ...sanitizedUpdates, lastUpdated: serverTimestamp() }
    }, { merge: true });

    const publicUpdates = {};
    if (updates.displayName !== undefined) publicUpdates.displayName = updates.displayName;
    if (updates.photoURL !== undefined) publicUpdates.photoURL = updates.photoURL;
    if (Object.keys(publicUpdates).length > 0) {
      await publishPublicProfile(userId, publicUpdates);
    }

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Upload avatar image to Firebase Storage with WebP conversion and immutable caching
 */
export async function uploadAvatar(userId, file) {
  try {
    const { uploadAsset } = await import('./uploadService');
    const result = await uploadAsset(userId, file, 'portraits', {
      profile: 'PORTRAIT',
      customMetadata: { avatarFor: userId }
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload avatar');
    }

    // The uploaded asset is private; only the private profile references it.
    await updateUserProfile(userId, {
      avatarUrl: result.url,
      avatarType: 'uploaded'
    });

    return {
      success: true,
      avatarUrl: result.url,
      fileName: result.storagePath
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
    if (!avatarUrl) {
      return { success: false };
    }

    const { deleteAsset } = await import('./uploadService');
    await deleteAsset(userId, avatarUrl);

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
 * Update user gaming statistics (private)
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
 * Export user profile for backup (private data only)
 */
export async function exportUserProfile(userId) {
  try {
    const profile = await loadUserProfile(userId);
    // Remove sensitive data from export
    const { userId: _userId, lastUpdated, ...exportableProfile } = profile;
    return exportableProfile;
  } catch (error) {
    console.error('Error exporting user profile:', error);
    return null;
  }
}

/**
 * Import user profile from backup (private data only)
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
