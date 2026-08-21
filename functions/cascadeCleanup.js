/**
 * Cascade Cleanup Triggers
 *
 * Automatically deletes orphaned files in Firebase Storage when
 * characters, campaigns, scenes, or custom maps are deleted from Firestore.
 */

const { onDocumentDeleted } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const storage = admin.storage();

/**
 * Extract storage path from a download URL or storage path string.
 */
function extractStoragePath(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;
  if (urlOrPath.startsWith('data:') || urlOrPath.startsWith('/assets/')) return null;

  try {
    const marker = '/o/';
    const idx = urlOrPath.indexOf(marker);
    if (idx !== -1) {
      const raw = urlOrPath.substring(idx + marker.length).split('?')[0];
      return decodeURIComponent(raw);
    }
    if (
      urlOrPath.startsWith('users/') ||
      urlOrPath.startsWith('media/') ||
      urlOrPath.startsWith('avatars/') ||
      urlOrPath.startsWith('audio/')
    ) {
      return urlOrPath;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Safely delete a file from the default storage bucket
 */
async function deleteStorageFile(storagePath) {
  if (!storagePath) return false;
  try {
    const bucket = storage.bucket();
    const file = bucket.file(storagePath);
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`[Cascade Cleanup] Successfully deleted storage object: ${storagePath}`);
      return true;
    }
  } catch (error) {
    console.warn(`[Cascade Cleanup Warning] Could not delete ${storagePath}:`, error.message);
  }
  return false;
}

/**
 * Trigger: On Character Document Deleted
 * Cleans up character portrait and avatar from storage.
 */
exports.onCharacterDeleted = onDocumentDeleted(
  { document: 'characters/{charId}', region: 'europe-west1' },
  async (event) => {
    const charData = event.data?.data();
    if (!charData) return;

    const urlsToDelete = [
      charData.avatarUrl,
      charData.image,
      charData.characterImage,
      charData.lore?.characterImage,
      charData.lore?.avatarUrl,
      charData.tokenSettings?.customIcon
    ].filter(Boolean);

    for (const url of urlsToDelete) {
      const path = extractStoragePath(url);
      if (path) {
        await deleteStorageFile(path);
      }
    }
  }
);

/**
 * Trigger: On Campaign Document Deleted
 * Cleans up campaign banner, custom maps, and NPC portraits from storage.
 */
exports.onCampaignDeleted = onDocumentDeleted(
  { document: 'campaigns/{campaignId}', region: 'europe-west1' },
  async (event) => {
    const campaign = event.data?.data();
    if (!campaign) return;

    const pathsToDelete = new Set();

    if (campaign.bannerImage) {
      const p = extractStoragePath(campaign.bannerImage);
      if (p) pathsToDelete.add(p);
    }

    if (Array.isArray(campaign.npcs)) {
      campaign.npcs.forEach((npc) => {
        if (npc.image) {
          const p = extractStoragePath(npc.image);
          if (p) pathsToDelete.add(p);
        }
      });
    }

    if (Array.isArray(campaign.customMaps)) {
      campaign.customMaps.forEach((map) => {
        if (map.imageUrl || map.image) {
          const p = extractStoragePath(map.imageUrl || map.image);
          if (p) pathsToDelete.add(p);
        }
      });
    }

    for (const path of pathsToDelete) {
      await deleteStorageFile(path);
    }
  }
);

/**
 * Trigger: On Custom Map Deleted
 * Cleans up world map images from storage.
 */
exports.onCustomMapDeleted = onDocumentDeleted(
  { document: 'userCustomMaps/{userId}/maps/{mapId}', region: 'europe-west1' },
  async (event) => {
    const map = event.data?.data();
    if (!map) return;

    const path = extractStoragePath(map.image || map.imageUrl);
    if (path) {
      await deleteStorageFile(path);
    }
  }
);

/**
 * Trigger: On Room / Scene Deleted
 * Cleans up custom battlemap background images from storage.
 */
exports.onRoomDeleted = onDocumentDeleted(
  { document: 'rooms/{roomId}', region: 'europe-west1' },
  async (event) => {
    const room = event.data?.data();
    if (!room) return;

    const urlsToDelete = [
      room.backgroundImage,
      room.mapImage,
      room.thumbnailUrl
    ].filter(Boolean);

    for (const url of urlsToDelete) {
      const path = extractStoragePath(url);
      if (path) {
        await deleteStorageFile(path);
      }
    }
  }
);
