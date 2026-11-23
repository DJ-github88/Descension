/**
 * Stored-trigger visibility and automation disclosure (presentation only).
 *
 * The shared compiler remains the only admission authority. This module describes the
 * trigger sections a stored record carries and whether the record is currently executable;
 * it never grants, widens or executes trigger support. The card can render this beside the
 * authored trigger sections, including on surfaces that do not mount ExecutionCompatibility.
 */

import { definitionFromWizard } from '../../../../services/authoredAbility';
import { explain, authoredScopes } from '../../../../services/executionPlan';

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const hasKeys = value => isObject(value) && Object.keys(value).length > 0;

export const MANUAL_TRIGGER_TEXT = 'Manual only — Prism cannot run this stored trigger configuration. Resolve it at the table; the GM records the outcome.';

export function hasStoredTriggers(triggerConfig) {
  if (!isObject(triggerConfig)) return false;
  return Boolean(
    (triggerConfig.global?.compoundTriggers || []).length > 0 ||
    hasKeys(triggerConfig.effectTriggers) ||
    hasKeys(triggerConfig.conditionalEffects) ||
    hasKeys(triggerConfig.buffDebuffTriggers) ||
    triggerConfig.requiredConditions?.enabled
  );
}

/**
 * The one shared explanation of what Prism does with a record's triggers, for Review and card surfaces.
 * `result` is the whole-record compiler result. Returns null when there is nothing to say.
 * `runs` is true only when the whole record compiled with its follow-up marker; even then it describes a saved
 * spell, not a room: the GM still has to pair it with one character before anything can be offered.
 */
export function triggerPlanForRecord(record, result) {
  try {
    const explained = explain(record, result);
    if (!explained.heading) return null;
    if (!explained.executableClaim && result && !result.ok && /^triggers?\b/i.test(String(result.reason || ''))) {
      const scopes = authoredScopes(record);
      const entries = scopes?.entries || [];
      const triggerRefusals = (scopes?.refusals || []).filter(r => r.section !== 'spellType');
      const hasWhole = entries.some(e => e.scope?.kind === 'whole-spell') || triggerRefusals.some(r => r.scope?.kind === 'whole-spell');
      const hasPart = entries.some(e => e.scope?.kind === 'component') || triggerRefusals.some(r => r.scope?.kind === 'component');
      if ((hasWhole && hasPart) || (entries.length + triggerRefusals.length > 1)) {
        const lines = [
          {
            kind: 'mixed-trigger-combination',
            text: 'Mixed trigger combination: Prism runs at most one single approved trigger scope per spell (one whole-spell follow-up, one watched Direct Damage part, or one critical-hit rider gate) with no combined or extra trigger rules. All stored triggers stay preserved as written and GM-manual.'
          },
          ...explained.triggers.map(t => ({
            kind: 'stored-trigger',
            text: `"${t.name}" on ${t.governs}: kept as written; not run by Prism while combined with other triggers or rules.`
          })),
          ...explained.manual.map(m => ({
            kind: 'stored-section',
            text: (m.scope?.kind === 'whole-spell' ? '' : `On ${m.governs}: `) + m.reason
          }))
        ];
        return { runs: false, heading: explained.heading, lines };
      }
    }
    return { runs: explained.executableClaim === true, heading: explained.heading, lines: explained.lines.map(line => ({ kind: line.kind, text: line.text })) };
  } catch (_) {
    return null;
  }
}

/**
 * Compiler-derived disclosure for a saved record (or a draft wrapped with authoredDraft).
 * Returns null when the record has no non-default stored trigger section and the plan has nothing to say.
 * A record with authoredDraft and none of the known stored trigger sections still gets a disclosure when the plan has
 * something to say: a spell type Prism does not run (a passive) or trigger data it does not recognise.
 */
export function triggerDisclosureForRecord(record) {
  const draft = record?.authoredDraft;
  const triggerConfig = draft?.triggerConfig || record?.triggerConfig;
  const stored = hasStoredTriggers(triggerConfig);
  // Cheap, compile-free check: does the record carry anything the plan would mention (a stored trigger or section in
  // any scope, an unknown trigger section, a spell type Prism does not run)? If not, nothing is compiled or disclosed.
  let mentioned = false;
  if (draft) {
    try { const scopes = authoredScopes(record); mentioned = scopes.entries.length > 0 || scopes.refusals.length > 0; } catch (_) { mentioned = false; }
  }
  if (!stored && !mentioned) return null;

  const result = draft
    ? definitionFromWizard(record, { classId: record.catalogueSource?.classId || 'arcanoneer', definitionVersion: 1 })
    : null;
  const plan = draft ? triggerPlanForRecord(record, result) : null;
  if (!stored) {
    // No stored trigger: there is no trigger configuration to call manual, only the plan's own statement.
    return plan ? { manual: false, executable: Boolean(result?.ok), text: '', reason: result && !result.ok ? result.reason : null, plan } : null;
  }
  const manual = !result || !result.ok;

  return {
    manual,
    executable: Boolean(result?.ok),
    text: manual ? MANUAL_TRIGGER_TEXT : '',
    reason: result && !result.ok ? result.reason : null,
    plan
  };
}

/**
 * Card entry point. Uses an attached disclosure when a real map supplied one; otherwise
 * compiles a raw record that carries authoredDraft. A card without a compiler-bearing
 * record still discloses that non-default stored triggers are not executed.
 */
export function authoredTriggerDisclosure(spell) {
  if (spell?.authoredTriggerDisclosure !== undefined) return spell.authoredTriggerDisclosure;

  const triggerConfig = spell?.authoredDraft?.triggerConfig || spell?.triggerConfig;
  if (!spell?.authoredDraft) {
    if (!hasStoredTriggers(triggerConfig)) return null;
    return { manual: true, executable: false, text: MANUAL_TRIGGER_TEXT, reason: null };
  }
  return triggerDisclosureForRecord(spell);
}
