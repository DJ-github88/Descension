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
import { authored as directSaveAuthored, describe as describeDirectSave, ruleText as directSaveRuleText } from '../../../../services/directSave';

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

/** The compiler refused this record at its stored trigger section first. */
function triggerRefusal(reason) {
  return /^(triggers?|triggerConfig):/i.test(String(reason || ''));
}

/**
 * A save component the compiler has not evaluated because a different stored section was
 * refused first. Describe the authored save and the whole-record verdict without claiming
 * the save shape itself is unsupported.
 */
function recordManualText({ label, raw, authored, directKind, reason }) {
  const rider = riderLabelOf(authored);
  const direct = directKind ? `direct ${directKind}` : 'direct damage or healing';
  const stopped = reason ? ` Prism stopped at ${reason}` : ' See execution compatibility for the blocking section.';
  const supportedTerms = raw?.outcome === 'negates' && ABILITY_NAMES[raw?.ability] && Number.isSafeInteger(raw?.dc);

  if (!supportedTerms) {
    return `Save component${label ? ` (${label})` : ''}: the authored save is preserved as written. The whole ability is manual —${stopped}`;
  }

  return `Save component${label ? ` (${label})` : ''}: ${manualText({ ability: raw.ability, dc: raw.dc, outcome: raw.outcome })} On a save, only the rider "${rider}" is negated; the ${direct} part still applies on both outcomes. The whole ability is manual —${stopped}`;
}

/**
 * Computes the disclosure from a compiler-bearing saved record (stored record with
 * `authoredDraft`, or the Review's `draftSubject`). Returns null when the record
 * carries no authored save or no saved draft. The compiler remains the authority.
 */
/** Direct-damage save (handoff/direct-damage-save/CONTRACT.md): a save authored on the Direct Damage part itself. The compiler
 * decides; this only words its verdict, naming the one component the save changes. */
function directSaveDisclosure(record, draft) {
  const config = draft.damageConfig;
  const raw = { ability: config.savingThrowConfig?.savingThrowType ?? config.savingThrow, dc: config.savingThrowConfig?.difficultyClass ?? config.difficultyClass };
  const label = labelFor(null, raw);
  const result = definitionFromWizard(record, { classId: 'arcanoneer', definitionVersion: 1 });
  if (result.ok && isObject(result.definition?.save)) {
    const save = result.definition.save;
    return { executable: true, status: 'executable', component: 'direct-damage', text: describeDirectSave(save), label: saveLabel(save), save };
  }
  const halves = (config.savingThrowConfig?.partialEffect ?? config.partialEffect) === true;
  const reason = result.ok ? '' : ` Prism stopped at: ${result.reason}`;
  return {
    executable: false,
    status: 'unsupported-shape',
    component: 'direct-damage',
    text: `Saving throw on the Direct Damage part${label ? ` (${label})` : ''}: manual only — it would change this damage part (${halves ? directSaveRuleText({ outcome: 'halves' }) : 'no damage'} on a save), but Prism does not run it as authored. Resolve it at the table; the GM records the outcome.${reason}`,
    label,
    save: null
  };
}

export function saveDisclosureForRecord(record, { riderLabel } = {}) {
  const draft = record?.authoredDraft;
  const authored = draft?.controlConfig?.authoredCondition;
  const raw = authored?.save;
  if (!isObject(raw)) return isObject(draft) && directSaveAuthored(draft.damageConfig) ? directSaveDisclosure(record, draft) : null;

  const result = definitionFromWizard(record, { classId: 'arcanoneer', definitionVersion: 1 });
  const label = labelFor(null, raw);
  if (!result.ok || !result.definition?.effects?.save) {
    if (!result.ok && triggerRefusal(result.reason)) {
      return {
        executable: false,
        status: 'record-manual',
        text: recordManualText({
          label,
          raw,
          authored,
          directKind: draft?.damageConfig ? 'damage' : draft?.healingConfig ? 'healing' : null,
          reason: result.reason
        }),
        label,
        save: null
      };
    }
    return { executable: false, status: 'unsupported-shape', text: manualOnlyText(label), label, save: null };
  }

  const save = result.definition.effects.save;
  return {
    executable: true,
    status: 'executable',
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
