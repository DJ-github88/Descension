import React, { useRef, useEffect } from 'react';
import { CompactForm } from '../../../item-generation/ItemAbilityEditor';
import { clone, newItemAbility, snapshotAbility, itemAbilitySupport } from '../../../../services/itemAuthoredAbility';
import { useSpellLibrary } from '../../../spellcrafting-wizard/context/SpellLibraryContext';
import AuthoredAdmission from '../../../spellcrafting-wizard/components/library/AuthoredAdmission';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';

export function CreatureAbilityDetails({ association, saved = false }) {
  if (association === undefined) return null;
  const support = itemAbilitySupport(association), d = support.definition;
  return <section className="item-ability" aria-label="Creature activated ability">
    <h3>{association?.record?.name || 'Preserved activated ability'}</h3>
    <p role="status">{support.ok ? `Supported immediate ACTION · ${d.effect.kind} · ${d.effect.formula} ${d.effect.damageTypes?.join(', ') || 'healing'} · ${d.resourceCost.actionPoints} AP / ${d.resourceCost.mana} mana · ${d.targeting.rangeFeet} ft · one ${d.targeting.restriction} target` : `Unsupported/manual — ${support.reason}`}</p>
    {d?.description && <p>{d.description}</p>}
    <p>Creature casting unavailable: A1 requires an exact primary owner PC. Admission does not authorize this creature to cast. Saving and admission spend nothing. A matching PC may reuse the admitted definition through normal Admitted abilities permissions.</p>
    {association?.librarySpellId && <p>Detached Spell Library snapshot. Library edits or deletion do not replace this content.</p>}
    <details><summary>Inspect whole preserved definition</summary><pre className="creature-ability-json">{JSON.stringify(association, null, 2)}</pre></details>
    {saved && support.ok && <AuthoredAdmission spell={association.record} />}
    {!saved && <p>Not saved/admitted from this editor. Save the creature, then inspect its library entry for explicit room admission.</p>}
  </section>;
}

export default function CreatureAbilityEditor() {
  const state = useCreatureWizard(), dispatch = useCreatureWizardDispatch();
  const { spells = [] } = useSpellLibrary();
  const launcher = useRef(null), wasEditing = useRef(false);
  const edit = state.abilityEdit;
  useEffect(() => { if (wasEditing.current && !edit) launcher.current?.focus(); wasEditing.current = !!edit; }, [edit]);
  const update = patch => dispatch(wizardActionCreators.setBasicInfo(patch));
  const support = itemAbilitySupport(state.authoredAbility);
  // IDs are selection identities, never names or array positions. Refuse ambiguous provenance.
  const compatible = spells.filter(s => s.id && spells.filter(other => other.id === s.id).length === 1 && itemAbilitySupport(snapshotAbility(s)).ok);
  const ambiguous = spells.some(s => !s.id || spells.filter(other => other.id === s.id).length > 1);
  return <section className="item-ability" aria-label="Creature ability authoring">
    <h3>Separate activated ability</h3>
    <p>Author one immediate damage or healing definition. Existing creature abilities, triggers and tactics remain separate and manual.</p>
    <CreatureAbilityDetails association={state.authoredAbility} />
    {edit ? <CompactForm association={edit.association} initialValues={edit.values} subject="creature" onValuesChange={values => update({ abilityEdit: { ...edit, values } })}
      onKeep={association => update({ authoredAbility: association, abilityEdit: null })} onCancel={() => update({ abilityEdit: null })} /> : <>
      {state.authoredAbility === undefined && <button type="button" ref={launcher} onClick={() => update({ abilityEdit: { association: newItemAbility(crypto.randomUUID()) } })}>Add activated ability</button>}
      {support.ok && <button type="button" ref={launcher} onClick={() => update({ abilityEdit: { association: clone(state.authoredAbility) } })}>Edit activated ability</button>}
      {state.authoredAbility === undefined && <label>Compatible Spell Library definition<select value="" onChange={e => {
        const selected = compatible.filter(s => s.id === e.target.value);
        if (selected.length === 1) update({ abilityEdit: { association: snapshotAbility(selected[0], selected[0].id) } });
      }}><option value="">Choose a saved definition to inspect</option>{compatible.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
    </>}
    {ambiguous && <p role="status">Library records with missing or duplicate IDs cannot be selected. Resolve their identities in the source library; no record is guessed.</p>}
    {edit && <p role="status">Keep or cancel this ability edit before navigating or saving. Closing and reopening the Creature window retains this session's unfinished edit.</p>}
  </section>;
}
