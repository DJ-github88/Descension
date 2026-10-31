import React, { useRef, useEffect, useState } from 'react';
import { CompactForm } from '../../../item-generation/ItemAbilityEditor';
import { clone, newItemAbility, snapshotAbility, itemAbilitySupport } from '../../../../services/itemAuthoredAbility';
import { useSpellLibrary } from '../../../spellcrafting-wizard/context/SpellLibraryContext';
import AuthoredAdmission from '../../../spellcrafting-wizard/components/library/AuthoredAdmission';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import { refOf, bindActor } from '../../../../services/actorConsequenceService';
import { openCreatureAbility, refreshAuthoredAbilities, useSpellConsequenceStore } from '../../../../services/spellConsequenceService';
import useGameStore from '../../../../store/gameStore';
import useCreatureStore from '../../../../store/creatureStore';
import { creatureSelfHealing, definitionSummary } from '../../../../services/authoredAbility';

export function CreatureAbilityDetails({ association: suppliedAssociation, saved = false, token }) {
  const gm = useGameStore(s => s.isGMMode), shared = useGameStore(s => s.isInMultiplayer);
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  const liveToken = useCreatureStore(s => token && s.creatureTokens.find(t => t.id === token.id && t.mapId === token.mapId));
  const sourceRef = refOf(liveToken || token);
  const sources = useSpellConsequenceStore(s => s.creatureSources) || [];
  const association = token && sourceRef ? sources.find(e => e.source.instanceId === sourceRef.instanceId && e.source.tokenId === sourceRef.tokenId && e.source.mapId === sourceRef.mapId)?.association ?? suppliedAssociation : suppliedAssociation;
  const sourceInstance = sourceRef?.instanceId;
  useEffect(() => { if (token && sourceInstance && gm && shared) refreshAuthoredAbilities(); }, [token, sourceInstance, gm, shared]);
  const perform = async action => { setBusy(true); try { const r = await action(); if (r?.success === false) setMessage(r.error || r.code); else setMessage(''); } catch (e) { setMessage(e.message); } finally { setBusy(false); } };
  if (association === undefined) return token && shared && gm && !sourceRef ? <section className="item-ability" aria-label="Creature activated ability"><h3>Placed creature ability</h3><p>Bind this exact placed actor to inspect its saved association securely. Binding spends nothing.</p><button type="button" disabled={busy} onClick={() => perform(() => bindActor(token.id, 'creature'))}>Bind this placed creature</button>{message && <p role="status">{message}</p>}</section> : null;
   const support = itemAbilitySupport(association), d = support.definition;
   const selfAllowed = creatureSelfHealing(d, association?.record);
  return <section className="item-ability" aria-label="Creature activated ability">
    <h3>{association?.record?.name || 'Preserved activated ability'}</h3>
    <p role="status">{support.ok ? `Supported immediate ACTION · ${definitionSummary(d)} · ${d.resourceCost.actionPoints} AP / ${d.resourceCost.mana} mana · ${d.targeting.rangeFeet} ft · one ${d.targeting.restriction} target` : `Unsupported/manual — ${support.reason}`}</p>
    {d?.description && <p>{d.description}</p>}
    <p>{token ? 'GM creature action: one exact target on the same map, including Self for compatible direct healing. Preparation spends nothing; confirmation installs authored payment and the supported effect together. Condition success and expiry are GM-managed.' : 'Library admission alone does not authorize a creature source. Place this creature, then Inspect its saved ability and admit that exact placed source.'}</p>
    {d && (d.targeting.rangeFeet === 0 || d.targeting.restriction === 'self') && <p role="status">Authored range {d.targeting.rangeFeet} ft / {d.targeting.restriction}. {selfAllowed ? 'Choose Self for direct capped healing.' : 'No compatible self route; keep this definition manual.'} Distinct range-zero targets remain unsupported.</p>}
    {association?.librarySpellId && <p>Detached Spell Library snapshot. Library edits or deletion do not replace this content.</p>}
    <details><summary>Inspect whole preserved definition</summary><pre className="creature-ability-json">{JSON.stringify(association, null, 2)}</pre></details>
    {saved && support.ok && (!token || sourceRef) && <AuthoredAdmission spell={association.record} sourceRef={sourceRef} />}
    {token && shared && gm && !sourceRef && <button type="button" disabled={busy} onClick={() => perform(() => bindActor(token.id, 'creature'))}>Bind this placed creature</button>}
    {token && shared && gm && sourceRef && support.ok && <button type="button" disabled={busy || (!selfAllowed && (d.targeting.rangeFeet === 0 || d.targeting.restriction === 'self'))} onClick={() => perform(() => openCreatureAbility(sourceRef))}>Use for this creature</button>}
    {message && <p role="status">{message}</p>}
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
    <p>Author one immediate damage, healing or canonical Stunned definition. Select condition definitions saved in Spell Wizard; existing creature abilities, triggers and tactics remain manual.</p>
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
