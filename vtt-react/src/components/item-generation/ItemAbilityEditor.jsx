import React, { useEffect, useRef, useState } from 'react';
import { useSpellLibrary } from '../spellcrafting-wizard/context/SpellLibraryContext';
import { newItemAbility, snapshotAbility, itemAbilitySupport, editItemAbility } from '../../services/itemAuthoredAbility';
import './ItemAbility.css';

const types = ['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd', 'slicing', 'stabbing', 'smashing'];
function CompactForm({ association, onKeep, onCancel }) {
  const d = itemAbilitySupport(association).definition;
  const [values, setValues] = useState({ name: d.name, description: d.description, kind: d.effect.kind, formula: d.effect.formula, damageType: d.effect.damageTypes?.[0] || 'arcane', ap: d.resourceCost.actionPoints, mana: d.resourceCost.mana, range: d.targeting.rangeFeet, restriction: d.targeting.restriction });
  const [error, setError] = useState('');
  const text = key => ({ value: values[key], onChange: e => setValues(v => ({ ...v, [key]: e.target.value })) });
  const number = key => ({ value: values[key], onChange: e => setValues(v => ({ ...v, [key]: e.target.value === '' ? '' : Number(e.target.value) })) });
  return <div className="item-ability-fields">
    <label>Ability name<input autoFocus maxLength="120" {...text('name')} /></label>
    <label>Description<textarea maxLength="4000" {...text('description')} /></label>
    <label>Effect<select {...text('kind')}><option value="damage">Direct damage</option><option value="healing">Direct healing</option></select></label>
    {values.kind === 'damage' && <label>Damage type<select {...text('damageType')}>{types.map(t => <option key={t}>{t}</option>)}</select></label>}
    <label>Formula<input {...text('formula')} aria-describedby="item-formula-help" /></label>
    <p id="item-formula-help">One dice group, optionally plus or minus a whole number: 1d6+2.</p>
    <div className="item-ability-numbers">
      <label>AP price<input type="number" min="0" max="20" step="1" {...number('ap')} /></label>
      <label>Mana price<input type="number" min="0" max="10000" step="1" {...number('mana')} /></label>
      <label>Range (ft)<input type="number" min="0" max="300" step="1" {...number('range')} /></label>
    </div>
    <label>One target<select {...text('restriction')}><option value="any">Any supported target</option><option value="self">Self</option><option value="ally">Ally — GM confirms</option><option value="enemy">Enemy — GM confirms</option></select></label>
    {error && <p role="alert">{error}</p>}
    <button type="button" onClick={() => { try { onKeep(editItemAbility(association, values)); } catch (e) { setError(e.message); } }}>Keep ability on item</button>
    <button type="button" onClick={onCancel}>Cancel ability edit</button>
  </div>;
}
export default function ItemAbilityEditor({ itemData, updateItemData, onEditingChange }) {
  const { spells = [] } = useSpellLibrary();
  const [editing, setEditing] = useState(null), [selected, setSelected] = useState('');
  const launcher = useRef(null), wasEditing = useRef(false);
  useEffect(() => { if (wasEditing.current && !editing) launcher.current?.focus(); wasEditing.current = !!editing; }, [editing]);
  const association = itemData.authoredAbility, support = itemAbilitySupport(association);
  const compatible = spells.filter(s => itemAbilitySupport(snapshotAbility(s)).ok);
  const edit = value => { setEditing(value); onEditingChange(!!value); };
  return <section className="item-ability" aria-label="Activated item ability">
    <h3>Activated ability</h3>
    <p>A separate immediate ACTION, using the shared Spell Wizard definition. Saving the item does not admit it. Existing item effects and requirements stay GM-managed.</p>
    {association && <p role="status">{support.ok ? `${support.definition.name} · ${support.definition.resourceCost.actionPoints} AP / ${support.definition.resourceCost.mana} mana · ${support.definition.effect.formula} ${support.definition.effect.kind} · ${support.definition.targeting.rangeFeet} ft · ${support.definition.targeting.restriction}` : `Unsupported/manual — ${support.reason}`}</p>}
    {editing ? <CompactForm association={editing} onKeep={a => { updateItemData({ authoredAbility: a }); edit(null); }} onCancel={() => edit(null)} /> : <>
      {!association && <button ref={launcher} type="button" onClick={() => edit(newItemAbility(crypto.randomUUID()))}>Add activated ability</button>}
      {support.ok && <button ref={launcher} type="button" onClick={() => edit(association)}>Edit activated ability</button>}
      {!association && <><label>Compatible Spell Library definition<select value={selected} onChange={e => setSelected(e.target.value)}><option value="">Choose a saved definition</option>{compatible.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <button type="button" disabled={!selected} onClick={() => { const s = compatible.find(s => s.id === selected); if (s) updateItemData({ authoredAbility: snapshotAbility(s, s.id) }); }}>Associate library snapshot</button></>}
    </>}
    <p>For detailed authoring, use Spellbook → Spell Wizard, save, then select its compatible library definition here. On-hit triggers, passive effects, equipment, charges and consumption are manual; this association grants no item entitlement.</p>
    {editing && <p role="status">Keep or cancel this ability edit before saving the item.</p>}
  </section>;
}
