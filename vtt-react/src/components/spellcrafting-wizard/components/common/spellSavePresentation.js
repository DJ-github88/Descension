/**
 * Saved-spell card rider-local save disclosure (presentation only).
 *
 * The Review and admission surfaces already describe the installed GM-recorded save
 * branch. A saved spell card can reach the same verdict because this module feeds the
 * stored saved record (or the Review's exact draft subject) to the shared compiler
 * (`definitionFromWizard`) and then reuses the shared saveBranch wording. It does not
 * parse save strings, grant eligibility or change compiler/server behavior; a card
 * without a compiler-bearing record simply omits the line rather than guessing.
 */

import { ABILITY_NAMES, saveLabel, manualText } from '../../../../services/saveBranch';
import { definitionFromWizard } from '../../../../services/authoredAbility';

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/** The one rider a rider-local save negates, in the card's own label vocabulary. */
function riderLabelOf(authored) {
  if (authored?.effect === 'stunned') return 'Canonical Stunned';
  if (authored?.label) return authored.label;
  if (authored?.effect === 'movement') return 'Movement';
  if (authored?.effect === 'attribute') return `${authored.attribute || 'Attribute'} change`;
  if (authored?.effect === 'periodic') return 'Periodic effect';
  if (authored?.effect === 'damageReduction') return 'Damage reduction';
  return 'this rider';
}

function labelFor(save, raw) {
  if (save) return saveLabel(save);
  const ability = ABILITY_NAMES[raw?.ability] || (typeof raw?.ability === 'string' ? raw.ability : '');
  return ability && Number.isSafeInteger(raw?.dc) ? `${ability} DC ${raw.dc}` : '';
}

function executableText(save, riderLabel, directKind) {
  const rider = riderLabel || 'this rider';
  const direct = directKind ? `direct ${directKind}` : 'direct damage or healing';
  return `Save: ${manualText(save)} On a save, only the rider "${rider}" is negated; the ${direct} part still applies on both outcomes.`;
}

function manualOnlyText(label) {
  return `Saving throw${label ? ` (${label})` : ''}: manual only — Prism cannot run this save shape as authored. Resolve it at the table; the GM records the outcome.`;
}

/**
 * Computes the disclosure from a compiler-bearing saved record (stored record with
 * `authoredDraft`, or the Review's `draftSubject`). Returns null when the record
 * carries no authored save or no saved draft. The compiler remains the authority.
 */
export function saveDisclosureForRecord(record, { riderLabel } = {}) {
  const draft = record?.authoredDraft;
  const authored = draft?.controlConfig?.authoredCondition;
  const raw = authored?.save;
  if (!isObject(raw)) return null;

  const result = definitionFromWizard(record, { classId: 'arcanoneer', definitionVersion: 1 });
  const label = labelFor(null, raw);
  if (!result.ok || !result.definition?.effects?.save) {
    return { executable: false, text: manualOnlyText(label), label, save: null };
  }

  const save = result.definition.effects.save;
  return {
    executable: true,
    text: executableText(save, riderLabel || riderLabelOf(authored), result.definition.effects.direct?.kind),
    label: labelFor(save, raw),
    save
  };
}

/**
 * Card entry point. Uses a disclosure computed by the real map (library/preview) when
 * one is attached; otherwise compiles a raw saved record that carries `authoredDraft`.
 * A display-only card without either source omits the line instead of synthesizing facts.
 */
export function authoredSaveDisclosure(spell, options) {
  if (spell?.authoredSaveDisclosure !== undefined) return spell.authoredSaveDisclosure;
  if (!spell?.authoredDraft) return null;
  return saveDisclosureForRecord(spell, options);
}
