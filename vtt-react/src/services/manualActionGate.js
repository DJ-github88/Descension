/** P12C-B1 §3 (MYTHRILL_PROJECT_12C_B1_CONTRACT.md): in a shared room, an action that no supported
 * controller (P8/P9/P12A) resolves is manual and the VTT applies nothing — no AP, mana, class resource,
 * HP or cooldown. The old local cast path is not run; only a notice is posted. */
import { getStore } from '../store/storeRegistry';
import { spellDiagnostic } from './spellConsequenceService';
import { strikeDiagnostic } from './weaponStrikeService';

export const MANUAL_NOTE = 'Manual — the VTT applies nothing in this room (no AP, mana, class resource, HP, cooldown or target change). Pay costs with your resource controls and resolve the effect at the table.';
/** The reason this action is manual in the current shared room, or null (supported, or not in a shared room). */
export function manualSharedReason(action) {
  if (!action) return null;
  try { return strikeDiagnostic(action) || spellDiagnostic(action) || null; } catch (_) { return null; }
}
/** Posts the manual notice instead of a local cast. Returns true when the action was manual. */
export function postManualNotice(action, playerName = 'Player') {
  const reason = manualSharedReason(action);
  if (!reason) return false;
  const chat = getStore('chatStore')?.getState?.();
  const notice = { type: 'combat', sender: playerName, timestamp: new Date().toISOString(),
    content: `${playerName} uses ${action.name || 'an action'} — manual: resolved at the table; nothing applied by the VTT (${reason})` };
  if (typeof chat?.addCombatNotification === 'function') chat.addCombatNotification(notice);
  else chat?.addNotification?.('combat', notice);
  return true;
}
