/**
 * Cascade Cleanup Triggers (Project 4 — proof-bound destructive cleanup)
 *
 * A deleted Firestore document is a trigger to EVALUATE storage cleanup, not
 * proof of asset ownership. Automatic deletion happens only when the source
 * document carries an Admin-protected `cleanupAssets` descriptor proving:
 *   - exact source-document binding
 *   - trusted source owner (character metadata.userId / map path user / room gmId)
 *   - configured bucket identity
 *   - canonical UID-owned object path
 *   - exclusive document-owned deletion scope
 *   - matching current object generation
 *
 * URL-only legacy references and unknown ownership always mean NO DELETE.
 */

const { onDocumentDeleted } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const storage = admin.storage();

const { cleanupSourceAssets, CLEANUP_CODES } = require('./cleanupRunner');

/**
 * Trigger: On Character Document Deleted
 * Deletes only Admin-descriptor-proven character-owned assets.
 */
exports.onCharacterDeleted = onDocumentDeleted(
  { document: 'characters/{charId}', region: 'europe-west1' },
  async (event) => {
    const charData = event.data?.data();
    if (!charData) return;
    await cleanupSourceAssets({
      storage,
      sourceType: 'character',
      sourceDocumentPath: `characters/${event.params.charId}`,
      sourceDoc: charData,
      loggerPrefix: 'Cascade Cleanup:character'
    });
  }
);

/**
 * Trigger: On Campaign Document Deleted (legacy top-level collection).
 * No trustworthy owner contract exists for this legacy shape; assets are never
 * deleted from it. Do not retarget this into worldbuilding persistence (P5).
 */
exports.onCampaignDeleted = onDocumentDeleted(
  { document: 'campaigns/{campaignId}', region: 'europe-west1' },
  async (event) => {
    const campaign = event.data?.data();
    if (!campaign) return;
    const descriptors = Array.isArray(campaign.cleanupAssets) ? campaign.cleanupAssets : [];
    if (descriptors.length > 0) {
      console.warn('[Cascade Cleanup:campaign] Refused legacy campaign cleanup (no trustworthy owner contract)', {
        campaignId: event.params.campaignId,
        descriptors: descriptors.length
      });
    }
  }
);

/**
 * Trigger: On Custom Map Deleted
 * Source owner is the map path UID; descriptors must match it.
 */
exports.onCustomMapDeleted = onDocumentDeleted(
  { document: 'userCustomMaps/{userId}/maps/{mapId}', region: 'europe-west1' },
  async (event) => {
    const map = event.data?.data();
    if (!map) return;
    await cleanupSourceAssets({
      storage,
      sourceType: 'customMap',
      sourceDocumentPath: `userCustomMaps/${event.params.userId}/maps/${event.params.mapId}`,
      sourceDoc: map,
      params: { userId: event.params.userId },
      loggerPrefix: 'Cascade Cleanup:customMap'
    });
  }
);

/**
 * Trigger: On Room Deleted
 * Source owner is the recorded room gmId.
 */
exports.onRoomDeleted = onDocumentDeleted(
  { document: 'rooms/{roomId}', region: 'europe-west1' },
  async (event) => {
    const room = event.data?.data();
    if (!room) return;
    await cleanupSourceAssets({
      storage,
      sourceType: 'room',
      sourceDocumentPath: `rooms/${event.params.roomId}`,
      sourceDoc: room,
      loggerPrefix: 'Cascade Cleanup:room'
    });
  }
);

// Test/operator helper: inject a fake bucket while exercising the same
// orchestration the real triggers use.
exports._cleanupSourceAssets = (options = {}) => cleanupSourceAssets({ storage, ...options });
exports.CLEANUP_CODES = CLEANUP_CODES;
