/**
 * Explicit operator entry point for lossless profile recovery
 * (see recoveryCompaction.js). Nothing runs automatically.
 *
 *   mythrillStorageRecovery.survey()  // read-only: storage per family for the active account
 *   mythrillStorageRecovery.plan()    // dry run: what would be removed, nothing changes
 *   mythrillStorageRecovery.apply()   // only after reading plan(); removes identical copies only
 *
 * The public object is defined once per window and never replaced; it delegates
 * to the most recently installed implementation. A module reload (tests, hot
 * reload) therefore cannot leave it bound to a stale module instance's account
 * gate or engine registry, whether or not the property can be redefined.
 */
import { compactDuplicateRecoveryForks, surveyScopedStorage, COMPACTION_CONFIRMATION } from './recoveryCompaction';

const LATEST = Symbol.for('mythrill.storageRecovery.latest');
const NAME = 'mythrillStorageRecovery';

function call(method) {
  return () => {
    const latest = typeof window !== 'undefined' ? window[LATEST] : null;
    if (!latest) throw new Error('Storage recovery is not installed.');
    return latest[method]();
  };
}

export function installStorageRecoveryHook(getFamilyIds) {
  if (typeof window === 'undefined') return null;
  const implementation = {
    survey: () => surveyScopedStorage(),
    plan: () => compactDuplicateRecoveryForks({ familyIds: getFamilyIds(), apply: false }),
    apply: () => compactDuplicateRecoveryForks({ familyIds: getFamilyIds(), apply: true, confirm: COMPACTION_CONFIRMATION })
  };
  try {
    Object.defineProperty(window, LATEST, { value: implementation, configurable: true, writable: true });
    if (!Object.prototype.hasOwnProperty.call(window, NAME)) {
      Object.defineProperty(window, NAME, {
        value: Object.freeze({ survey: call('survey'), plan: call('plan'), apply: call('apply') }),
        configurable: false
      });
    }
  } catch (_error) {
    return null;
  }
  return implementation;
}
