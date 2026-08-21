/**
 * Mythrill VTT Cloud Functions
 *
 * Exports storage triggers (quota tracking) and Firestore cascade cleanup triggers.
 */

const { onStorageObjectFinalized, onStorageObjectDeleted } = require('./storageTriggers');
const {
  onCharacterDeleted,
  onCampaignDeleted,
  onCustomMapDeleted,
  onRoomDeleted
} = require('./cascadeCleanup');

module.exports = {
  // Storage Quota Accounting
  onStorageObjectFinalized,
  onStorageObjectDeleted,

  // Cascade Storage Cleanup
  onCharacterDeleted,
  onCampaignDeleted,
  onCustomMapDeleted,
  onRoomDeleted
};
