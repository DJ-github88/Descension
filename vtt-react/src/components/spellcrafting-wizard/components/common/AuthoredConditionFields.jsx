import React from 'react';

export const newAuthoredCondition = () => ({ profile: 'authored-condition:v1', conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: '', gmNote: '' });
/** Shared explicit authoring fields; names/icons/prose never confer mechanics. */
export default function AuthoredConditionFields({ value, onChange }) {
  return <fieldset className="item-ability-fields"><legend>Canonical Stunned · manual expiry</legend>
    <p>Immediate successful application only. No actions, reactions or voluntary movement while active.
      The GM resolves eligibility, range, saves and success, records STR/AGI save failure and applies the table’s advantage procedure.</p>
    <label>Source-authored duration<input maxLength={300} value={value.durationText} onChange={e => onChange({ ...value, durationText: e.target.value })} /></label>
    <p>{value.durationText || 'Authored duration'} — GM removes. No automatic countdown or Shield Bash schedule.</p>
    <label>Required GM adjudication note<textarea maxLength={1000} value={value.gmNote} onChange={e => onChange({ ...value, gmNote: e.target.value })} /></label>
    <p>Execution supports one distinct placed creature target from an admitted placed creature, with explicit AP/mana prices. Item/PC routes remain unavailable.</p>
  </fieldset>;
}
