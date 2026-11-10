/** Shared GM-recorded save outcome branches (one module for every admitted save shape; no per-spell engine).
 * The table rolls the save; the GM records "saved" or "failed"; the engine applies only the branch the admitted
 * definition supports. The VTT never rolls, calculates or validates a save, and a recorded outcome is not proof
 * that it did. Pure data/validation: no RNG, storage, authority or execution.
 *
 * Supported shape (both lanes): one save whose authored outcome is "negates", scoped to exactly one effect block.
 *   - M1 class-effect:v1 — scope "debuffConfig" (the class record's debuff block);
 *   - authored-effect:v1 bundle — scope "condition" (the Wizard bundle's one canonical effect).
 * A save on the direct damage/healing part, "halves"/partial outcomes, whole-bundle saves, repeated saves and
 * saves on several blocks are not represented here and stay manual until the creator decides them.
 * Keep this Node/client module free of object-spread Babel helper imports (CRA otherwise marks CommonJS as ESM). */
const ABILITIES = Object.freeze(['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma']);
const ABILITY_NAMES = Object.freeze({ strength: 'Strength', agility: 'Agility', constitution: 'Constitution', intelligence: 'Intelligence', spirit: 'Spirit', charisma: 'Charisma' });
const OUTCOMES = Object.freeze(['negates']);
const SCOPES = Object.freeze(['debuffConfig', 'condition']);
const MIN_DC = 1;
const MAX_DC = 40;
const BRANCHES = Object.freeze({ saved: 'saved', failed: 'failed', applied: 'applied' });
const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => isObject(value) && Object.keys(value).sort().join('|') === keys.slice().sort().join('|');

/** True for exactly one supported save term: { scope, ability, dc, outcome: 'negates' }. `scopes` narrows the allowed scope. */
function validSave(save, scopes = SCOPES) {
  return exact(save, ['scope', 'ability', 'dc', 'outcome']) && scopes.includes(save.scope) && SCOPES.includes(save.scope) &&
    ABILITIES.includes(save.ability) && Number.isSafeInteger(save.dc) && save.dc >= MIN_DC && save.dc <= MAX_DC && OUTCOMES.includes(save.outcome);
}
/** The outcome branches an owner approves and a GM may record: saved/failed with a save, otherwise one plain branch. */
const branches = save => save ? [BRANCHES.saved, BRANCHES.failed] : [BRANCHES.applied];
/** Whether the block named `scope` applies on `branch`. A "negates" save removes only its own block on "saved". */
function applies(save, branch, scope) {
  if (!branches(save).includes(branch)) return false;
  if (!save || save.scope !== scope) return true;
  return branch === BRANCHES.failed;
}
/** Plain "Constitution DC 12" label. */
const saveLabel = save => `${ABILITY_NAMES[save.ability]} DC ${save.dc}`;
/** What the table and GM do by hand for this save (shown at approval, at GM confirmation and in disclosures). */
function manualText(save) {
  if (!save) return '';
  return `The table rolls the ${saveLabel(save)} save by its own procedure and the GM records saved or failed. The VTT does not roll, calculate or validate the save; a recorded outcome is the GM's record, not a VTT check.`;
}
/** One line per branch from the caller's own wording of the direct part and of the negatable effect
 * (`effectName` is the short name used on the saved line; it defaults to the full effect wording). */
function branchLines(save, { direct, effect, effectName }) {
  const both = [direct, effect].filter(Boolean).join(' + ');
  if (!save) return [{ branch: BRANCHES.applied, text: both }];
  const label = saveLabel(save);
  return [{ branch: BRANCHES.saved, text: `Target saves (${label}, GM records): ${direct ? `${direct}; ` : ''}no ${effectName || effect}` },
    { branch: BRANCHES.failed, text: `Target fails (${label}, GM records): ${both}` }];
}
/** Short narration of a recorded branch. */
function recordedText(save, branch) {
  if (!save) return '';
  return branch === BRANCHES.saved ? `target saved (${saveLabel(save)}, GM recorded)` : `target failed the save (${saveLabel(save)}, GM recorded)`;
}

module.exports = { ABILITIES, ABILITY_NAMES, OUTCOMES, SCOPES, MIN_DC, MAX_DC, BRANCHES, validSave, branches, applies, saveLabel, manualText, branchLines, recordedText };
