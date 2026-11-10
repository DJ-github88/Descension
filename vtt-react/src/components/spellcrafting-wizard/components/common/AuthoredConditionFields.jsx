import React from 'react';
import './AuthoredConditionFields.css';
import { occurrenceText, ATTRIBUTE, ATTRIBUTE_NAMES, DAMAGE_REDUCTION, PERIODIC, tickScheduleText } from '../../../../services/sharedConditionProfile';
import { ABILITIES as SAVE_ABILITIES, ABILITY_NAMES as SAVE_ABILITY_NAMES, MIN_DC, MAX_DC } from '../../../../services/saveBranch';

export const newAuthoredCondition = () => ({ profile: 'authored-condition:v1', conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: '', gmNote: '' });
/** A10: composable authored effect — one canonical effect (Stunned, one movement change, one attribute change or one flat DR change), optionally
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
    const { movementFeet, label, attribute, attributeAmount, drAmount, ...kept } = value; // eslint-disable-line no-unused-vars
    const rest = Object.fromEntries(Object.entries(kept).filter(([k]) => !PERIODIC_FIELDS.includes(k) && !(['periodic', 'damageReduction'].includes(effect) && k === 'save')));
    onChange(effect === 'movement' ? { ...rest, effect, movementFeet: -10, label: '' }
      : effect === 'attribute' ? { ...rest, effect, attribute: ATTRIBUTE.attributes[0], attributeAmount: -2, label: '' }
      : effect === 'damageReduction' ? { ...rest, effect, drAmount: 3, label: '' }
        : effect === 'periodic' ? { ...rest, effect, periodicKind: 'damage', periodicFormula: '1d6', periodicDamageType: PERIODIC.damageTypes[2], tickRoll: 'each-tick', label: '',
          expiryPolicy: rest.expiryPolicy === 'gm-manual' ? 'target-next-start' : rest.expiryPolicy } : { ...rest, effect });
  };
  const periodic = value.effect === 'periodic';
  return <fieldset className="item-ability-fields authored-effect-fields"><legend>Composed effect · structured expiry</legend>
    <p>{value.effect === 'periodic' ? 'One periodic damage or healing effect on one distinct creature. You may add Damage (for damage ticks) or Healing (for healing ticks) as a second effect type for one immediate part rolled at cast (player character casters only; a creature caster keeps the combined ability manual); the payment, the immediate HP change and this periodic effect install together or not at all.'
      : 'One canonical effect on one distinct creature (or player character with explicit target-owner consent). Add Damage or Healing as a second effect type to apply it in the same accepted result; the payment, any HP change and this effect install together or not at all.'}</p>
    <label>Canonical effect<select value={value.effect} onChange={e => chooseEffect(e.target.value)}>
      <option value="stunned">Stunned — no actions, reactions or voluntary movement</option>
      <option value="movement">Movement change — feet per movement AP</option>
      <option value="attribute">Attribute change — flat change to one attribute score</option>
      <option value="damageReduction">Flat damage reduction — +1 to +20 flat DR</option>
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
    {value.effect === 'damageReduction' && <>
      <label>Effect name shown on the target<input maxLength={60} value={value.label || ''} onChange={e => set({ label: e.target.value })} /></label>
      <label>Flat damage reduction (whole number, +{DAMAGE_REDUCTION.minAmount} to +{DAMAGE_REDUCTION.maxAmount})<input type="number" min={DAMAGE_REDUCTION.minAmount} max={DAMAGE_REDUCTION.maxAmount} step={1} value={value.drAmount ?? ''}
        onChange={e => set({ drAmount: e.target.value === '' ? '' : Number(e.target.value) })} /></label>
      <p>Temporary positive flat DR (+{DAMAGE_REDUCTION.minAmount} to +{DAMAGE_REDUCTION.maxAmount}) on one exact actor. It never rewrites base equipment or character stats, and exact GM removal or turn expiry restores the prior value. On a player character target, this beneficial effect requires the target owner's explicit acceptance.</p>
      <p>{DAMAGE_REDUCTION.notAutomated}</p>
      <p>{DAMAGE_REDUCTION.combinationPolicy}</p>
    </>}
    <label>{periodic ? 'Ticks' : 'Expiry'}<select value={value.expiryPolicy} onChange={e => {
      const expiryPolicy = e.target.value, { occurrences, ...rest } = value; // eslint-disable-line no-unused-vars
      // A save keeps the chosen expiry: manual or a structured target-turn expiry (both recorded outcomes then need turn tracking).
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
    {!periodic && value.effect !== 'damageReduction' && <fieldset className="authored-effect-save"><legend>Saving throw (optional)</legend>
      <label className="authored-effect-check"><input type="checkbox" checked={!!value.save} onChange={e => {
        const { save, ...rest } = value; // eslint-disable-line no-unused-vars
        onChange(e.target.checked ? { ...rest, save: { ability: 'constitution', dc: 12, outcome: 'negates' } } : rest);
      }} /> The target may save to negate this effect</label>
      {value.save && <>
        <label>Saving ability<select value={value.save.ability} onChange={e => set({ save: { ...value.save, ability: e.target.value } })}>
          {SAVE_ABILITIES.map(id => <option key={id} value={id}>{SAVE_ABILITY_NAMES[id]}</option>)}
        </select></label>
        <label>Difficulty (DC, whole number {MIN_DC} to {MAX_DC})<input type="number" min={MIN_DC} max={MAX_DC} step={1} value={value.save.dc ?? ''}
          onChange={e => set({ save: { ...value.save, dc: e.target.value === '' ? '' : Number(e.target.value) } })} /></label>
        <label>On a successful save<select value={value.save.outcome} onChange={e => set({ save: { ...value.save, outcome: e.target.value } })}>
          <option value="negates">This effect is not applied (negates it)</option>
        </select></label>
        <p>The table rolls the save and the GM records saved or failed; the VTT does not roll, calculate or check it. The direct damage or healing applies on both outcomes, so this needs a Damage or Healing effect type as well. One creature target and a player character caster only. {value.expiryPolicy === 'gm-manual' ? 'With manual expiry the GM removes the instance.' : 'With this turn-boundary expiry, both outcomes need active authenticated turn tracking with the target in the roster: without it, recording either outcome is refused and nothing is charged. A save installs nothing and leaves earlier effects as they are; a failed save installs the effect with this expiry.'} A save on the damage itself, half damage and repeated saves are not automated.</p>
      </>}
    </fieldset>}
    <label>Source-authored duration text<input maxLength={300} value={value.durationText} onChange={e => set({ durationText: e.target.value })} /></label>
    <label>Required GM adjudication note<textarea maxLength={1000} value={value.gmNote} onChange={e => set({ gmNote: e.target.value })} /></label>
    <p>Eligibility, range, immunity and success stay GM-resolved. A save is automated only as entered above (the GM records the table's result); conditional-on-hit, critical-only or other save-dependent parts are not inferred and keep a definition manual.</p>
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
