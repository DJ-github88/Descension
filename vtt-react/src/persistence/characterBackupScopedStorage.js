/**
 * Project 5 Wave B closure — verified-owner scoped character backup records.
 *
 * Local character backups are recovery copies. They belong to the verified
 * owner that created them (user/guest/dev scope), never to a raw character id
 * or user id string. The retired global `mythrill-backup-*` keys are treated as
 * unknown-owner recovery sources: preserved untouched, never auto-adopted.
 */

import { resolveActiveScope } from './scopedConsumer';
import { buildScopedKey, parseP5ScopedKey } from './keyFormat';
import { readDurable } from './protectedStorage';
import { createScopedNativeFamily } from './scopedNativeFamily';

export const CHARACTER_BACKUP_FAMILY = 'character.backups';
export const LEGACY_BACKUP_PREFIX = 'mythrill-backup-';

const backupFamily = createScopedNativeFamily({ familyId: CHARACTER_BACKUP_FAMILY });

/**
 * Persist a backup record in the active verified-owner scope.
 * @returns {{status: string, key?: string, reason?: string}}
 */
export function saveOwnerBackup(backup) {
  if (!backup || typeof backup !== 'object' || typeof backup.backupId !== 'string') {
    return { status: 'INVALID_BACKUP' };
  }
  return backupFamily.save(backup, [backup.backupId]);
}

/**
 * Read one backup record belonging to the active verified owner.
 * Legacy global backups are intentionally NOT consulted.
 */
export function readOwnerBackup(backupId) {
  const value = backupFamily.load([backupId]);
  if (!value || typeof value !== 'object') return null;
  return value.backupId === backupId ? value : null;
}

/** Remove one backup record belonging to the active verified owner. */
export function removeOwnerBackup(backupId) {
  // Records are stored under a per-backup scoped key; clear only that key.
  const scope = resolveActiveScope();
  if (!scope) return { status: 'NO_ACTIVE_SCOPE' };
  let key;
  try {
    key = buildScopedKey({ scope, familyId: CHARACTER_BACKUP_FAMILY, locator: [backupId] });
  } catch (error) {
    return { status: 'INVALID_LOCATOR', reason: error?.message || 'bad-locator' };
  }
  try {
    localStorage.removeItem(key);
    return { status: 'OK', key };
  } catch (error) {
    return { status: 'STORAGE_ERROR', reason: error?.message || 'remove-failed' };
  }
}

/**
 * List every backup record in the active verified-owner scope.
 * @returns {Array<{storageKey: string, backup: object}>}
 */
export function listOwnerBackups() {
  const scope = resolveActiveScope();
  if (!scope) return [];
  let prefix;
  try {
    prefix = `${buildScopedKey({ scope, familyId: CHARACTER_BACKUP_FAMILY })}:`;
  } catch (_error) {
    return [];
  }
  const records = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const parsed = parseP5ScopedKey(key);
      if (!parsed || parsed.familyId !== CHARACTER_BACKUP_FAMILY) continue;
      const raw = readDurable(key);
      if (!raw.ok || raw.raw === null) continue;
      try {
        let value = JSON.parse(raw.raw);
        // Draft-envelope family: unwrap the stored payload.
        if (value && typeof value === 'object' && 'payload' in value) {
          value = value.payload;
        }
        if (value && typeof value === 'object') records.push({ storageKey: key, backup: value });
      } catch (_error) {
        // malformed record: preserved raw, skipped from listing
      }
    }
  } catch (_error) {
    return [];
  }
  return records;
}
