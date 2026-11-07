import React from 'react';
import './AuthoredConditionFields.css';
import { occurrenceText, ATTRIBUTE, ATTRIBUTE_NAMES, PERIODIC, tickScheduleText } from '../../../../services/sharedConditionProfile';

export const newAuthoredCondition = () => ({ profile: 'authored-condition:v1', conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: '', gmNote: '' });
/** A10: composable authored effect — one canonical effect (Stunned, one movement change or one attribute change), optionally
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
// M5: a periodic effect names WHERE its ticks fall (start/end of the target's turns) and HOW MANY (1…10); nothing else.
const TICKS = [
  ['target-next-start', "One tick — start of the target's next turn"],
  ['target-next-end', "One tick — end of the target's next turn"],
  ['target-start-count', "Several ticks — start of each of the target's next turns"],
  ['target-end-count', "Several ticks — end of each of the target's next turns"]
];
const PERIODIC_FIELDS = ['periodicKind', 'periodicFormula', 'periodicDamageType', 'tickRoll'];
const TIMING_POLICY = { 'target-next-start': 'authored-target-next-start', 'target-next-end': 'authored-target-next-end', 'target-start-count': 'authored-target-start-count', 'target-end-count': 'authored-target-end-count' };
function AuthoredEffectFields({ value, onChange }) {
  const set = patch => onChange({ ...value, ...patch });
  const chooseEffect = effect => {
    const { movementFeet, label, attribute, attributeAmount, ...kept } = value; // eslint-disable-line no-unused-vars
    const rest = Object.fromEntries(Object.entries(kept).filter(([k]) => !PERIODIC_FIELDS.includes(k)));
    onChange(effect === 'movement' ? { ...rest, effect, movementFeet: -10, label: '' }
      : effect === 'attribute' ? { ...rest, effect, attribute: ATTRIBUTE.attributes[0], attributeAmount: -2, label: '' }
        : effect === 'periodic' ? { ...rest, effect, periodicKind: 'damage', periodicFormula: '1d6', periodicDamageType: PERIODIC.damageTypes[2], tickRoll: 'each-tick', label: '',
          expiryPolicy: rest.expiryPolicy === 'gm-manual' ? 'target-next-start' : rest.expiryPolicy } : { ...rest, effect });
  };
  const periodic = value.effect === 'periodic';
  return <fieldset className="item-ability-fields authored-effect-fields"><legend>Composed effect · structured expiry</legend>
    <p>{value.effect === 'periodic' ? 'One periodic damage or healing effect on one distinct creature. You may add Damage (for damage ticks) or Healing (for healing ticks) as a second effect type for one immediate part rolled at cast (player character casters only; a creature caster keeps the combined ability manual); the payment, the immediate HP change and this periodic effect install together or not at all.'
      : 'One canonical effect on one distinct creature. Add Damage or Healing as a second effect type to apply it in the same accepted result; the payment, any HP change and this effect install together or not at all.'}</p>
    <label>Canonical effect<select value={value.effect} onChange={e => chooseEffect(e.target.value)}>
      <option value="stunned">Stunned — no actions, reactions or voluntary movement</option>
      <option value="movement">Movement change — feet per movement AP</option>
      <option value="attribute">Attribute change — flat change to one attribute score</option>
      <option value="periodic">Periodic damage or healing — ticks at the target's turns</option>
    </select></label>
    {periodic && <>
      <label>Effect name shown on the target<input maxLength={60} value={value.label || ''} onChange={e => set({ label: e.target.value })} /></label>
      <label>Each tick<select value={value.periodicKind} onChange={e => {
        const { periodicDamageType, ...rest } = value; // eslint-disable-line no-unused-vars
        onChange(e.target.value === 'damage' ? { ...rest, periodicKind: 'damage', periodicDamageType: PERIODIC.damageTypes[2] } : { ...rest, periodicKind: 'healing' });
      }}>
        <option value="damage">Damage</option><option value="healing">Healing</option>
      </select></label>
      <label>Tick amount (dice, e.g. 1d6 or 2d4+1)<input maxLength={20} value={value.periodicFormula || ''} onChange={e => set({ periodicFormula: e.target.value.trim() })} /></label>
      {value.periodicKind === 'damage' && <label>Damage type<select value={value.periodicDamageType || ''} onChange={e => set({ periodicDamageType: e.target.value })}>
        {!value.periodicDamageType && <option value="">Choose a damage type</option>}
        {PERIODIC.damageTypes.map(type => <option key={type} value={type}>{type}</option>)}
      </select></label>}
      <label>Tick roll<select value={value.tickRoll || ''} onChange={e => set({ tickRoll: e.target.value })}>
        <option value="each-tick">Roll when each tick is resolved</option>
      </select></label>
      <p>One creature target. An optional immediate part must be the same kind as the ticks and is rolled once, at cast; it never decides the ticks. The price is paid once, when it is cast — never per tick.
        At each listed boundary the GM's authenticated turn advance records one due tick; HP changes only when the GM resolves that tick with its own roll and final amount.
        Saves, stacking and refreshing are not automated: a second periodic effect on the same target is refused for the GM to resolve. A player character target stays manual.</p>
    </>}
    {value.effect === 'movement' && <>
      <label>Effect name shown on the target<input maxLength={60} value={value.label || ''} onChange={e => set({ label: e.target.value })} /></label>
      <label>Movement change (ft, multiples of 5, −60 to +60)<input type="number" min={-60} max={60} step={5} value={value.movementFeet ?? ''}
        onChange={e => set({ movementFeet: e.target.value === '' ? '' : Number(e.target.value) })} /></label>
      <p>Applied after other speed conditions, never below 0 ft. Different named effects on one target add together; casting this same effect again from the same source refreshes its duration instead of stacking its value. The same effect from another source, a changed version, or another effect with the same name is refused for the GM to resolve.</p>
    </>}
    {value.effect === 'attribute' && <>
      <label>Effect name shown on the target<input maxLength={60} value={value.label || ''} onChange={e => set({ label: e.target.value })} /></label>
      <label>Attribute<select value={value.attribute || ATTRIBUTE.attributes[0]} onChange={e => set({ attribute: e.target.value })}>
        {ATTRIBUTE.attributes.map(id => <option key={id} value={id}>{ATTRIBUTE_NAMES[id]}</option>)}
      </select></label>
      <label>Change to the score (whole number, {ATTRIBUTE.minAmount} to +{ATTRIBUTE.maxAmount}, not 0)<input type="number" min={ATTRIBUTE.minAmount} max={ATTRIBUTE.maxAmount} step={1} value={value.attributeAmount ?? ''}
        onChange={e => set({ attributeAmount: e.target.value === '' ? '' : Number(e.target.value) })} /></label>
      <p>Added once on top of the target's sheet score (base, level-up gains, heritage, origin and equipment); those are never rewritten, and removal or expiry restores the previous value. A bonus needs the target owner's acceptance; a penalty is hostile and applied under GM authority.</p>
      <p>Changes: the target owner's supported spell formulas that name this attribute. Agility also reaches the basic weapon strike that uses it; Intelligence and Spirit do not add weapon damage. Not changed automatically: initiative and turn order, sheet-only derived figures, saves, maximum HP or mana, or any refill of HP, mana or AP.</p>
      <p>Only one change to the same attribute can be active on a target. How two changes combine (adding, highest only or refreshing) is not decided yet, so a second one is refused for the GM to resolve. Only {ATTRIBUTE.attributes.map(id => ATTRIBUTE_NAMES[id]).join(', ')} is supported in this version.</p>
    </>}
    <label>{periodic ? 'Ticks' : 'Expiry'}<select value={value.expiryPolicy} onChange={e => {
      const expiryPolicy = e.target.value, { occurrences, ...rest } = value; // eslint-disable-line no-unused-vars
      onChange(COUNTED.includes(expiryPolicy) ? { ...rest, expiryPolicy, occurrences: Number.isInteger(occurrences) && occurrences >= 2 ? occurrences : 2 } : { ...rest, expiryPolicy });
    }}>
      {(periodic ? TICKS : EXPIRY).map(([id, text]) => <option key={id} value={id}>{text}</option>)}
    </select></label>
    {COUNTED.includes(value.expiryPolicy) && <label>{periodic ? `Number of ticks (whole number, 2 to ${MAX_OCCURRENCES})` : `Target-turn ${value.expiryPolicy === 'target-start-count' ? 'starts' : 'ends'} to count (whole number, 2 to ${MAX_OCCURRENCES})`}<input type="number" min={2} max={MAX_OCCURRENCES} step={1}
      value={value.occurrences ?? ''} onChange={e => set({ occurrences: e.target.value === '' ? '' : Number(e.target.value) })} /></label>}
    <p>{periodic ? (!COUNTED.includes(value.expiryPolicy) || (Number.isInteger(value.occurrences) && value.occurrences >= 2)
      ? `${tickScheduleText(TIMING_POLICY[value.expiryPolicy], value.occurrences)}. The effect ends with its last tick. Needs active authenticated turn tracking with the target in the roster; without it the action is refused and nothing is charged. If the roster changes or combat ends, no further ticks are recorded and the GM manages the rest.`
      : 'Enter the number of ticks.')
      : value.expiryPolicy === 'gm-manual' ? 'The GM removes it with the shared condition controls.'
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
