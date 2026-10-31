import React from 'react';
import './AuthoredConditionFields.css';
import { occurrenceText } from '../../../../services/sharedConditionProfile';

export const newAuthoredCondition = () => ({ profile: 'authored-condition:v1', conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: '', gmNote: '' });
/** A10: composable authored effect — one canonical effect (Stunned or one movement change), optionally
 * combined with this definition's direct damage or healing, and an explicit structured expiry. */
export const newAuthoredEffect = () => ({ profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'target-next-end', durationText: '', gmNote: '' });
const EXPIRY = [
  ['gm-manual', 'Manual — the GM removes this exact instance'],
  ['target-next-start', "Start of the target's next turn"],
  ['target-next-end', "End of the target's next turn"],
  ['target-start-count', "Start of a counted upcoming turn of the target (2nd or later)"],
  ['target-end-count', "End of a counted upcoming turn of the target (2nd or later)"]
];
const COUNTED = ['target-start-count', 'target-end-count'];
const MAX_OCCURRENCES = 10;
function AuthoredEffectFields({ value, onChange }) {
  const set = patch => onChange({ ...value, ...patch });
  const chooseEffect = effect => {
    const { movementFeet, label, ...rest } = value; // eslint-disable-line no-unused-vars
    onChange(effect === 'movement' ? { ...rest, effect, movementFeet: -10, label: '' } : { ...rest, effect });
  };
  return <fieldset className="item-ability-fields authored-effect-fields"><legend>Composed effect · structured expiry</legend>
    <p>One canonical effect on one distinct creature. Add Damage or Healing as a second effect type to apply it in the same accepted result; the payment, any HP change and this effect install together or not at all.</p>
    <label>Canonical effect<select value={value.effect} onChange={e => chooseEffect(e.target.value)}>
      <option value="stunned">Stunned — no actions, reactions or voluntary movement</option>
      <option value="movement">Movement change — feet per movement AP</option>
    </select></label>
    {value.effect === 'movement' && <>
      <label>Effect name shown on the target<input maxLength={60} value={value.label || ''} onChange={e => set({ label: e.target.value })} /></label>
      <label>Movement change (ft, multiples of 5, −60 to +60)<input type="number" min={-60} max={60} step={5} value={value.movementFeet ?? ''}
        onChange={e => set({ movementFeet: e.target.value === '' ? '' : Number(e.target.value) })} /></label>
      <p>Applied after other speed conditions, never below 0 ft. Different named effects on one target add together; casting this same effect again from the same source refreshes its duration instead of stacking its value. The same effect from another source, a changed version, or another effect with the same name is refused for the GM to resolve.</p>
    </>}
    <label>Expiry<select value={value.expiryPolicy} onChange={e => {
      const expiryPolicy = e.target.value, { occurrences, ...rest } = value; // eslint-disable-line no-unused-vars
      onChange(COUNTED.includes(expiryPolicy) ? { ...rest, expiryPolicy, occurrences: Number.isInteger(occurrences) && occurrences >= 2 ? occurrences : 2 } : { ...rest, expiryPolicy });
    }}>
      {EXPIRY.map(([id, text]) => <option key={id} value={id}>{text}</option>)}
    </select></label>
    {COUNTED.includes(value.expiryPolicy) && <label>Target-turn {value.expiryPolicy === 'target-start-count' ? 'starts' : 'ends'} to count (whole number, 2 to {MAX_OCCURRENCES})<input type="number" min={2} max={MAX_OCCURRENCES} step={1}
      value={value.occurrences ?? ''} onChange={e => set({ occurrences: e.target.value === '' ? '' : Number(e.target.value) })} /></label>}
    <p>{value.expiryPolicy === 'gm-manual' ? 'The GM removes it with the shared condition controls.'
      : COUNTED.includes(value.expiryPolicy) ? `Expires automatically at the ${Number.isInteger(value.occurrences) && value.occurrences >= 2 ? occurrenceText(value.expiryPolicy === 'target-start-count' ? 'start' : 'end', value.occurrences) : 'chosen turn boundary (enter a count)'}. Each GM-confirmed turn advance is counted once; the effect stays until the last one. Needs active authenticated turn tracking with the target in the roster; if the roster changes the effect becomes GM-managed. Without tracking the action is refused and nothing is charged.`
      : 'Expires automatically at that GM-confirmed turn boundary while authenticated turn tracking is active. Without it, the action is refused and nothing is charged.'} “One round”, seconds or other prose are not converted.</p>
    <label>Source-authored duration text<input maxLength={300} value={value.durationText} onChange={e => set({ durationText: e.target.value })} /></label>
    <label>Required GM adjudication note<textarea maxLength={1000} value={value.gmNote} onChange={e => set({ gmNote: e.target.value })} /></label>
    <p>Eligibility, range, saves, immunity and success stay GM-resolved; only a confirmed success is automated. Conditional-on-hit, critical-only or save-dependent parts are not inferred and keep a definition manual.</p>
  </fieldset>;
}
/** Shared explicit authoring fields; names/icons/prose never confer mechanics. */
export default function AuthoredConditionFields({ value, onChange }) {
  if (value?.profile === 'authored-effect:v1') return <AuthoredEffectFields value={value} onChange={onChange} />;
  return <fieldset className="item-ability-fields authored-effect-fields"><legend>Canonical Stunned · manual expiry</legend>
    <p>Immediate successful application only. No actions, reactions or voluntary movement while active.
      The GM resolves eligibility, range, saves and success, records STR/AGI save failure and applies the table’s advantage procedure.</p>
    <label>Source-authored duration<input maxLength={300} value={value.durationText} onChange={e => onChange({ ...value, durationText: e.target.value })} /></label>
    <p>{value.durationText || 'Authored duration'} — GM removes. No automatic countdown or Shield Bash schedule.</p>
    <label>Required GM adjudication note<textarea maxLength={1000} value={value.gmNote} onChange={e => onChange({ ...value, gmNote: e.target.value })} /></label>
    <p>Execution supports one distinct placed creature target from an admitted placed creature, with explicit AP/mana prices. Item/PC routes remain unavailable.</p>
  </fieldset>;
}
