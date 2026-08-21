/**
 * Cloud Storage Triggers
 *
 * Atomically manages storage quota accounting in Firestore whenever
 * files are uploaded or deleted in Firebase Storage.
 */

const { onObjectFinalized, onObjectDeleted } = require('firebase-functions/v2/storage');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Helper to extract userId and category from storage path
 *
 * Supported formats:
 * - users/{userId}/{category}/{fileName}
 * - avatars/{userId}/{fileName}
 * - media/{userId}/{category}/{fileName}
 * - audio/{userId}/{fileName}
 */
function parseStoragePath(filePath) {
  if (!filePath || filePath.startsWith('system-assets/')) {
    return null; // System assets are free and read-only
  }

  const parts = filePath.split('/');
  if (parts.length >= 3 && parts[0] === 'users') {
    return {
      userId: parts[1],
      category: parts[2],
      fileName: parts.slice(3).join('/')
    };
  }

  if (parts.length >= 2 && (parts[0] === 'avatars' || parts[0] === 'audio')) {
    return {
      userId: parts[1],
      category: parts[0],
      fileName: parts.slice(2).join('/')
    };
  }

  if (parts.length >= 3 && parts[0] === 'media') {
    return {
      userId: parts[1],
      category: parts[2],
      fileName: parts.slice(3).join('/')
    };
  }

  return null;
}

/**
 * Trigger: On Object Upload / Finalize
 * Atomically increments user's storageUsedBytes in Firestore.
 */
exports.onStorageObjectFinalized = onObjectFinalized(
  { region: 'europe-west1', cpu: 'gcf_gen1' },
  async (event) => {
    const object = event.data;
    const filePath = object.name;
    const sizeBytes = parseInt(object.size || '0', 10);

    if (!filePath || sizeBytes <= 0) return;

    const parsed = parseStoragePath(filePath);
    if (!parsed || !parsed.userId) return;

    const userRef = db.collection('users').doc(parsed.userId);

    try {
      await userRef.set(
        {
          storageUsedBytes: admin.firestore.FieldValue.increment(sizeBytes),
          storageUsage: {
            total: admin.firestore.FieldValue.increment(sizeBytes),
            [parsed.category]: admin.firestore.FieldValue.increment(sizeBytes),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          },
          lastStorageUpdate: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      console.log(`[Storage Finalize] Added ${sizeBytes} bytes to user ${parsed.userId} (${parsed.category})`);
    } catch (error) {
      console.error(`[Storage Finalize Error] Failed to increment storage for user ${parsed.userId}:`, error);
      throw error;
    }
  }
);

/**
 * Trigger: On Object Delete
 * Atomically decrements user's storageUsedBytes in Firestore.
 */
exports.onStorageObjectDeleted = onObjectDeleted(
  { region: 'europe-west1', cpu: 'gcf_gen1' },
  async (event) => {
    const object = event.data;
    const filePath = object.name;
    const sizeBytes = parseInt(object.size || '0', 10);

    if (!filePath || sizeBytes <= 0) return;

    const parsed = parseStoragePath(filePath);
    if (!parsed || !parsed.userId) return;

    const userRef = db.collection('users').doc(parsed.userId);

    try {
      await userRef.set(
        {
          storageUsedBytes: admin.firestore.FieldValue.increment(-sizeBytes),
          storageUsage: {
            total: admin.firestore.FieldValue.increment(-sizeBytes),
            [parsed.category]: admin.firestore.FieldValue.increment(-sizeBytes),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          },
          lastStorageUpdate: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      console.log(`[Storage Delete] Decremented ${sizeBytes} bytes from user ${parsed.userId} (${parsed.category})`);
    } catch (error) {
      console.error(`[Storage Delete Error] Failed to decrement storage for user ${parsed.userId}:`, error);
      throw error;
    }
  }
);
