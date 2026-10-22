import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import { refOf, selectOwnerAttachment } from '../../services/actorConsequenceService';
import { supportSpell, digitalRoll, recordRoll, affordable, sourcePools, describeClassPublic } from '../../services/spellConsequence';
import { sameExactRef } from '../../services/featherSlash';
import { useSpellConsequenceStore, closeOwnerPanel, ownerSource, sendSpellApproval, checkSpellApproval, withdrawSpellApproval, reapproveSpell,
  restoreOwnerStatus, refreshSpellApprovals, gmAcceptSpell, gmDeclineSpell, gmCheckSpellCommand, markSpellReconciled } from '../../services/spellConsequenceService';
import { loadLatestSpell, unresolvedSpell } from '../../services/spellConsequenceCustody';
import { spellDraftContext, loadSpellDraft, loadDiscardedSpellDrafts, saveSpellDraft, discardSpellDraft } from '../../services/spellConsequenceService';
import { describeDraft, sameDraftContext } from '../../services/targetPick';
import useTargetingStore from '../../store/targetingStore';
import './SpellConsequencePanel.css';
import { actionId, readFormula as readAuthoredFormula } from '../../services/authoredAbility';
import { refreshAuthoredAbilities, changeAuthoredAdmission, routeSpellCast } from '../../services/spellConsequenceService';
import { creatureAttempt, saveCreatureRoll, prepareCreatureAbility, cancelCreatureAbility, revalidateCreatureContext } from '../../services/spellConsequenceService';

const nameOf = token => token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Unknown';
const ref = value => value ? `${value.kind}:${value.mapId}:${value.tokenId}` : '';
function advisoryRange(source, target, game, authored) {
  const a = source?.position, b = target?.position;
  if (![a?.x, a?.y, b?.x, b?.y, game.gridSize, game.feetPerTile].every(Number.isFinite) || game.gridSize <= 0) return `Authored range ${authored}. Geometry unavailable — GM adjudication required.`;
  const feet = Math.hypot(a.x - b.x, a.y - b.y) / game.gridSize * game.feetPerTile;
  return `Advisory planar distance ${feet.toFixed(1)} ft; authored ${authored}. Line of effect and reach are GM rulings.`;
}
function resistanceText(target) {
  const values = target?.character?.resistances || target?.stats?.resistances || target?.state?.resistances;
  if (!values || typeof values !== 'object') return 'No declared resistances on this projection.';
  return `Declared resistances (advisory; mitigation is the GM's final amount): ${JSON.stringify(values).slice(0, 160)}`;
}

/** Owner: explicit target, one recorded roll, approved price. Nothing is spent here. */
function OwnerPanel() {
  const owner = useSpellConsequenceStore(value => value.owner);
  const status = useSpellConsequenceStore(value => value.ownerStatus);
  const character = useCharacterStore(value => value);
  const characters = useCharacterTokenStore(value => value.characterTokens);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const gridSize = useGameStore(value => value.gridSize), feetPerTile = useGameStore(value => value.feetPerTile);
  const game = { gridSize, feetPerTile };
  const [targetKey, setTargetKey] = useState('');
  const [physical, setPhysical] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useSpellConsequenceStore(value => value.draftVersion);
  const picking = useTargetingStore(value => value.pickSession?.id === 'p9-spell');
  const startTargetPick = useTargetingStore(value => value.startTargetPick);
  // A closed panel ends its own pick session (contract §1).
  useEffect(() => { if (!owner) useTargetingStore.getState().cancelTargetPickFor('p9-spell'); }, [owner]);
  useEffect(() => {
    if (owner) restoreOwnerStatus();
    // P12C-B1 §2: a retained draft for this same spell restores its target and roll.
    const draft = loadSpellDraft();
    setTargetKey(owner && draft?.context?.spellId === owner.spellId ? draft.targetKey || '' : ''); setPhysical({}); setError('');
  }, [owner]);
  useEffect(() => {
    if (!owner?.origin?.producer?.startsWith('item: ')) return undefined;
    const launcher = document.activeElement;
    document.querySelector('.p9-panel button[aria-label="Close"]')?.focus();
    return () => { if (launcher?.isConnected) launcher.focus(); };
  }, [owner]);
  useSpellConsequenceStore(s => s.registryRevision);
  const support = owner ? supportSpell({ id: owner.spellId }, character) : null;
  if (!owner) return null;
  const source = ownerSource();
  const all = [...characters, ...creatures];
  const candidates = source.token ? all.filter(token => refOf(token) && token.mapId === source.mapId && (refOf(token).kind === 'creature' || token.state.actorContract.primary)) : [];
  const target = candidates.find(token => ref(refOf(token)) === targetKey);
  const latest = loadLatestSpell();
  const pending = unresolvedSpell(latest);
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  // P12C-B1 §2: the recorded roll lives in a draft bound to this owner, character, attachment and spell.
  const ctx = spellDraftContext({ characterId: character.currentCharacterId, sourceRef: source.ref, spellId: owner.spellId });
  const draft = loadSpellDraft(), draftHere = draft && ctx && sameDraftContext(draft.context, ctx) ? draft : null;
  const draftElsewhere = draft && !draftHere ? draft : null;
  const roll = draftHere?.roll || null;
  const record = mode => {
    try {
      const value = mode === 'digital' ? digitalRoll(support.reading) : recordRoll('physical', support.reading, support.reading.dice.map((group, i) => Array.from({ length: group.count }, (_, j) => Number(physical[`${i}:${j}`]))));
      saveSpellDraft({ context: ctx, label: support.name, roll: value, targetKey }); setError('');
    } catch (e) { setError(e.message); }
  };
  const chooseTarget = value => { setTargetKey(value); if (draftHere) { try { saveSpellDraft({ context: ctx, label: draftHere.label, roll: draftHere.roll, targetKey: value }); } catch (e) { setError(e.message); } } };
  const rangeFeet = Number(support?.raw?.targetingConfig?.rangeDistance);
  const rangeLabel = Number.isFinite(rangeFeet) && rangeFeet > 0 ? `card range ${rangeFeet} ft (${support.raw.targetingConfig.rangeType || 'authored'})` : '';
  const pick = () => startTargetPick({ id: 'p9-spell', label: support.name, sourceRef: source.ref, candidates: candidates.map(token => refOf(token)), rangeFeet, rangeLabel,
    reasonFor: () => 'Not an exact bound target for this spell (creatures and primary characters on your map).', onPick: value => chooseTarget(ref(value)), onCancel: () => {} });
  const discarded = loadDiscardedSpellDrafts();
  if (picking) return null; // the panel steps aside while picking on the map; its state is kept
  const ownerCandidates = all.filter(token => token.state?.actorContract?.primary && token.ownerUserId && refOf(token)?.characterId === character.currentCharacterId);
  const pools = source.token ? sourcePools(source.token) : null;
  return createPortal(<div className="p9-overlay" role="dialog" aria-label="Supported spell cast">
    <div className="p9-panel">
      <header><h3>{support?.name || owner.spellId}</h3><button type="button" onClick={closeOwnerPanel} aria-label="Close">×</button></header>
      {owner.origin?.producer?.startsWith('item: ') && <p>From {owner.origin.producer}. Item requirements remain GM-managed.</p>}
      {!support?.supported ? <p className="p9-diagnostic">{support?.reason}</p> : <>
        <p className="p9-note">Supported room ability: nothing is spent until the GM accepts. One roll, one payment, one result.</p>
        <dl className="p9-facts">
          <dt>Effect</dt><dd>{support.kind === 'damage' ? `${support.damageTypes.join('/')} damage` : 'direct healing'} · {support.reading.reading}</dd>
          <dt>Price</dt><dd>{support.price.ap} AP · {support.price.mana} mana{pools ? ` (temporary first; you have AP ${pools.ap.current}+${pools.ap.temp} temp, mana ${pools.mana.current}+${pools.mana.temp} temp)` : ''}</dd>
          {support.payment.classPayment && <><dt>Class</dt><dd>{describeClassPublic(support.payment.classPayment.before)} → {describeClassPublic(support.payment.classPayment.after)}</dd></>}
          {support.cooldown.value > 0 && <><dt>Cooldown</dt><dd>{support.cooldown.value} ({support.cooldown.type}) — starts when the GM accepts</dd></>}
        </dl>
        {!support.payment.affordable && <p className="p9-diagnostic">{support.payment.reason}</p>}
        {source.error ? <div className="p9-diagnostic"><p>{source.error}</p>
           {ownerCandidates.length === 1 && <button type="button" onClick={() => selectOwnerAttachment(refOf(ownerCandidates[0]))}>Use this owner attachment</button>}</div> : <>
          {owner.origin?.producer?.startsWith('item: ') && <p>Source: {nameOf(source.token)} · selected primary owner PC</p>}
          {draftElsewhere && <div className="p9-diagnostic p12c-draft" role="alert"><p>An unsent recorded roll is retained for <strong>{describeDraft(draftElsewhere)}</strong>. A recorded roll never moves to another spell: cast it from that spell, or discard it explicitly.</p>
            <button type="button" disabled={busy} onClick={() => perform(async() => discardSpellDraft())}>Discard recorded roll</button></div>}
          <div className="p12c-pick"><button type="button" disabled={pending || busy || !source.ref} onClick={pick}>Pick on map</button><span className="p9-meta">{rangeLabel ? `${rangeLabel} — advisory` : 'No card range — GM adjudicates'}</span></div>
          <label>Target <select value={targetKey} disabled={pending || busy} onChange={event => chooseTarget(event.target.value)}>
            <option value="">Select an exact bound target</option>
            {candidates.map(token => <option key={ref(refOf(token))} value={ref(refOf(token))}>{nameOf(token)} · {refOf(token).kind} · {token.id}{sameExactRef(refOf(token), source.ref) ? ' (you)' : ''}</option>)}
          </select></label>
          {target && <p className="p9-advisory">{advisoryRange(source.token, target, game, `${support.raw.targetingConfig?.rangeType || ''} ${support.raw.targetingConfig?.rangeDistance ?? '?'} ft`)} {resistanceText(target)}</p>}
          {target && !roll && !pending && !draftElsewhere && <div className="p9-roll">
            <button type="button" disabled={busy} onClick={() => record('digital')}>Roll {support.reading.dice.map(g => `${g.count}d${g.sides}`).join(' + ')} once</button>
            <span>or physical faces:</span>
            {support.reading.dice.flatMap((group, i) => Array.from({ length: group.count }, (_, j) => <input key={`${i}:${j}`} aria-label={`d${group.sides} face ${j + 1}`} type="number" min="1" max={group.sides}
              value={physical[`${i}:${j}`] || ''} onChange={event => setPhysical({ ...physical, [`${i}:${j}`]: event.target.value })} />))}
            <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button>
          </div>}
          {roll && <p className="p9-roll-result">Recorded {roll.mode} roll: [{roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {roll.constant >= 0 ? '+' : '-'} {Math.abs(roll.constant)} = <strong>{roll.total}</strong>. The GM confirms the final amount. Kept on this device for this spell through target changes and reloads.</p>}
          {!pending && <button type="button" className="p9-primary" disabled={busy || !target || !roll || !support.payment.affordable || !affordable(pools, support.price)}
            onClick={() => perform(() => sendSpellApproval({ spellId: owner.spellId, targetRef: refOf(target), roll, origin: owner.origin }))}>Approve price and send to GM</button>}
        </>}
      </>}
      {!!discarded.length && <details className="p12c-discarded"><summary>Discarded unsent rolls on this device ({discarded.length})</summary><ul>{discarded.map((d, i) => <li key={i}>{describeDraft(d)}</li>)}</ul></details>}
      {status && <div className="p9-status" role="status"><p>{status.message}</p>
        {status.latest?.approval && <p className="p9-meta">Approval {status.latest.approval.approvalId} · {status.latest.custody}</p>}
        {['awaiting', 'unknown', 'prepared'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(checkSpellApproval)}>Check this same approval</button>}
        {['awaiting', 'unknown'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(withdrawSpellApproval)}>Withdraw before acceptance</button>}
        {status.phase === 'reapproval' && <button type="button" disabled={busy} onClick={() => perform(reapproveSpell)}>Review and approve again (same roll)</button>}
        {status.phase === 'unresolved' && <button type="button" disabled={busy} onClick={() => markSpellReconciled()}>Reconciled with the GM — clear this approval</button>}
      </div>}
      {error && <p className="p9-diagnostic">{error}</p>}
    </div>
  </div>, document.body);
}

/** GM: explicit adjudication and one consequence; observers never execute. */
function GmPanel() {
  const isGM = useGameStore(value => value.isGMMode);
  const pending = useSpellConsequenceStore(value => value.gmPending);
  const status = useSpellConsequenceStore(value => value.gmStatus);
  const characters = useCharacterTokenStore(value => value.characterTokens);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const gridSize = useGameStore(value => value.gridSize), feetPerTile = useGameStore(value => value.feetPerTile);
  const game = { gridSize, feetPerTile };
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (isGM) refreshSpellApprovals(); }, [isGM]);
   const entries = Object.values(pending).filter(e => e.approval.source.kind !== 'creature');
  const extra = Object.entries(status).filter(([id, value]) => !pending[id] && ['unknown', 'unresolved', 'reapproval', 'accepted', 'declined', 'refused', 'retry'].includes(value.phase));
  if (!entries.length && !extra.length) return null;
  const all = [...characters, ...creatures];
  const find = value => all.find(token => sameExactRef(refOf(token), value));
  const perform = async action => { setBusy(true); try { await action(); } finally { setBusy(false); } };
  return <section className="p9-gm" aria-label="Spell adjudication">
    {entries.map(({ approval }) => {
      const draft = drafts[approval.approvalId] || {}, update = values => setDrafts({ ...drafts, [approval.approvalId]: { ...draft, ...values } });
      const source = find(approval.source), target = find(approval.target), state = status[approval.approvalId];
      return <article key={approval.approvalId} className="p9-gm-card">
        <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
        <p>{approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
        <p className="p9-meta">{approval.roll.reading}</p>
        <p>Owner-approved price: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</p>
        <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
        <label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range, defense and mitigation</label>
        <label>Final {approval.spell.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
        <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label>
        <div className="p9-actions">
          <button type="button" className="p9-primary" disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted'].includes(state?.phase)} onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: draft.final === '' || draft.final === undefined ? NaN : Number(draft.final), reason: draft.reason || '', adjudicated: draft.adjudicated === true }))}>Accept one consequence</button>
          <button type="button" disabled={busy || ['submitting', 'unknown'].includes(state?.phase)} onClick={() => perform(() => gmDeclineSpell(approval.approvalId))}>Decline</button>
          {state?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(approval.approvalId))}>Check same command</button>}
        </div>
        {state?.message && <p role="status">{state.message}</p>}
      </article>;
    })}
    {extra.map(([id, value]) => <p key={id} role="status" className="p9-meta">Spell {id.slice(0, 8)}: {value.message}
      {value.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(id))}>Check same command</button>}</p>)}
  </section>;
}

/** Same authored action workflow, with the current GM as the explicit creature authority. */
function CreaturePanel() {
  const open = useSpellConsequenceStore(s => s.creatureOpen), gm = useGameStore(s => s.isGMMode);
  useSpellConsequenceStore(s => s.draftVersion);
  const gmStatus = useSpellConsequenceStore(s => s.gmStatus), pending = useSpellConsequenceStore(s => s.gmPending);
  const message = useSpellConsequenceStore(s => s.creatureMessage);
  const sourceDetails = useSpellConsequenceStore(s => s.creatureSources) || [];
  const creatures = useCreatureStore(s => s.creatureTokens);
  const [physical, setPhysical] = useState({}), [targetKey, setTargetKey] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [amount, setAmount] = useState(''), [reason, setReason] = useState(''), [adjudicated, setAdjudicated] = useState(false);
  const picking = useTargetingStore(s => s.pickSession?.id === 'p14-creature');
  const latest = creatureAttempt(), c = latest?.creature;
  useEffect(() => {
    if (!open) useTargetingStore.getState().cancelTargetPickFor('p14-creature');
    if (!open) return undefined;
    const launcher = document.activeElement;
    document.querySelector('[aria-label="Creature ability action"] button')?.focus();
    return () => { if (launcher?.isConnected) launcher.focus(); };
  }, [open]);
  const initialTarget = c?.target ? ref(c.target) : '';
  useEffect(() => { setTargetKey(initialTarget); setPhysical({}); setAmount(''); setReason(''); setAdjudicated(false); setError(''); }, [c?.attemptId, initialTarget]);
  if (!gm || !c) return null;
  if (!open) return <p className="p9-chip" role="status">{c.entry.canonicalDefinition.name} · retained {latest.phase}
    <button type="button" onClick={() => { useSpellConsequenceStore.setState({ creatureOpen: true }); refreshSpellApprovals(); }}>Open retained creature action</button></p>;
  const close = () => useSpellConsequenceStore.setState({ creatureOpen: false });
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  const source = creatures.find(t => sameExactRef(refOf(t), c.source)), d = c.entry.canonicalDefinition, reading = readAuthoredFormula(d.effect.formula);
  const candidates = creatures.filter(t => refOf(t)?.kind === 'creature' && refOf(t).mapId === c.source.mapId && !sameExactRef(refOf(t), c.source));
  const target = candidates.find(t => ref(refOf(t)) === targetKey), roll = c.roll, id = latest.approval?.approvalId, status = gmStatus[id];
  const defenses = sourceDetails.find(e => sameExactRef(e.source, c.target || refOf(target)))?.defenses;
  const choose = value => { setTargetKey(ref(value)); if (roll) saveCreatureRoll(roll, value); setAdjudicated(false); };
  const record = mode => perform(async () => saveCreatureRoll(mode === 'digital' ? digitalRoll(reading) : recordRoll('physical', reading, reading.dice.map((g, i) => Array.from({ length: g.count }, (_, j) => Number(physical[`${i}:${j}`])))), refOf(target)));
  const canAccept = latest.phase === 'awaiting' && pending[id] && !['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(status?.phase);
  if (picking) return null;
  return createPortal(<div className="p9-overlay" role="dialog" aria-modal="true" aria-label="Creature ability action" onKeyDown={e => { if (e.key === 'Escape') close(); }}>
    <div className="p9-panel">
      <header><h3>{d.name}</h3><button type="button" aria-label="Close creature action" onClick={close}>×</button></header>
      <p>Source: {nameOf(source)} · {c.source.mapId} / {c.source.tokenId} · incarnation {c.source.instanceId}</p>
      <p>Admitted version {c.entry.definitionRef.definitionVersion} · {d.effect.kind} · {d.effect.formula} · {d.effect.damageTypes?.join('/') || 'healing'}</p>
      <p>Exact price: {c.entry.descriptor.price.ap} AP / {c.entry.descriptor.price.mana} mana · temporary first. Nothing spent before confirmation.</p>
      <p>Authored range {d.targeting.rangeFeet} ft · one {d.targeting.restriction} target. PC targets and self-targeting are unsupported. Flat DR, resistances/vulnerabilities and specific defensive effects remain GM-adjudicated.</p>
      {!latest.approval && <>
        <button type="button" disabled={busy} onClick={() => useTargetingStore.getState().startTargetPick({ id: 'p14-creature', label: d.name, sourceRef: c.source, candidates: candidates.map(refOf), rangeFeet: d.targeting.rangeFeet, rangeLabel: `Authored ${d.targeting.rangeFeet} ft — advisory`, reasonFor: () => 'Choose a distinct exact placed creature on this map; PC targets are unsupported.', onPick: choose, onCancel: () => {} })}>Pick creature on map</button>
        <label>Creature target<select value={targetKey} disabled={busy} onChange={e => choose(refOf(candidates.find(t => ref(refOf(t)) === e.target.value)))}>
          <option value="">Select an exact placed creature</option>{candidates.map(t => <option key={ref(refOf(t))} value={ref(refOf(t))}>{nameOf(t)} · {t.id}</option>)}
        </select></label>
        {target && !roll && <div className="p9-roll"><button type="button" disabled={busy} onClick={() => record('digital')}>Roll {d.effect.formula} once</button>
          {reading.dice.flatMap((g, i) => Array.from({ length: g.count }, (_, j) => <label key={`${i}:${j}`}>d{g.sides} face {j + 1}<input type="number" min="1" max={g.sides} value={physical[`${i}:${j}`] ?? ''} onChange={e => setPhysical({ ...physical, [`${i}:${j}`]: e.target.value })} /></label>))}
          <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button></div>}
      </>}
      {roll && <p className="p9-roll-result">Retained {roll.mode} faces [{roll.dice.map(g => g.faces.join(', ')).join(' | ')}] · {roll.reading} = {roll.total}. Closing/reloading retains this attempt and its faces.</p>}
      {c.target && <p>Target: {nameOf(creatures.find(t => sameExactRef(refOf(t), c.target)))} · {c.target.mapId} / {c.target.tokenId} · incarnation {c.target.instanceId}</p>}
      {defenses && <details><summary>Target's authored defenses and abilities (GM adjudication)</summary><p>Flat DR: {defenses.flatDR ?? 'not declared'}. Resistances/vulnerabilities and specific defensive effects remain manual.</p><pre className="creature-ability-json">{JSON.stringify(defenses, null, 2)}</pre></details>}
      {roll && !['accepted', 'reconciled', 'unresolved'].includes(latest.phase) && <button type="button" disabled={busy || ['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase)} onClick={() => perform(prepareCreatureAbility)}>{latest.approval ? 'Revalidate original attempt (same roll)' : 'Validate source, target and retained roll'}</button>}
      {roll && latest.approval && !['accepted', 'reconciled', 'unknown', 'unresolved'].includes(latest.phase) && !['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase) && <button type="button" disabled={busy} onClick={() => perform(revalidateCreatureContext)}>Refresh admission or change target (keep faces)</button>}
      {canAccept && <>
        <label><input type="checkbox" checked={adjudicated} onChange={e => setAdjudicated(e.target.checked)} /> I adjudicated legality, range, target restrictions, defense and mitigation</label>
        <label>Final {d.effect.kind === 'damage' ? 'damage' : 'healing'}<input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <label>Reason (required if different from {roll.total})<input type="text" value={reason} onChange={e => setReason(e.target.value)} /></label>
        <button type="button" className="p9-primary" disabled={busy || !adjudicated || amount === ''} onClick={() => perform(() => gmAcceptSpell(id, { finalAmount: amount === '' ? NaN : Number(amount), reason, adjudicated }))}>Confirm one creature consequence</button>
      </>}
      {status?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(id))}>Check same command</button>}
      {(status?.phase === 'unresolved' || latest.phase === 'unresolved') && <p role="alert">Exact recovery unavailable. Manual reconciliation required; no new attempt is created.</p>}
      <p role="status">{latest.phase === 'accepted' ? `Accepted · ${latest.result?.status || 'accepted live'} · receipt ${latest.result?.receipt?.commandId}` : status?.message || message || `Retained ${latest.phase}.`}</p>
      {latest.result?.receipt && <p>Payment and HP installed together. {latest.result.receipt.actors.map(a => `${a.ref.tokenId}: AP ${a.finalResources.ap.current ?? 'unavailable'}+${a.finalResources.ap.temp} temp, mana ${a.finalResources.mana.current ?? 'unavailable'}+${a.finalResources.mana.temp} temp, HP ${a.finalResources.hp.current}+${a.finalResources.hp.temp} temp`).join(' · ')}</p>}
      {!['unknown', 'unresolved'].includes(status?.phase) && <button type="button" disabled={busy} onClick={() => perform(cancelCreatureAbility)}>Finish or explicitly cancel (keep evidence)</button>}
      {error && <p className="p9-diagnostic" role="alert">{error}</p>}
    </div>
  </div>, document.body);
}

function OwnerChip() {
  const owner = useSpellConsequenceStore(value => value.owner);
  const status = useSpellConsequenceStore(value => value.ownerStatus);
  if (owner || !status?.latest?.approval || !['awaiting', 'unknown', 'reapproval', 'prepared', 'unresolved'].includes(status.phase)) return null;
  return <p className="p9-chip" role="status">{status.latest.approval.spell.name}: {status.message}
    <button type="button" onClick={() => useSpellConsequenceStore.setState({ owner: { spellId: status.latest.approval.spell.definitionId, origin: status.latest.origin } })}>Open</button></p>;
}

function AdmittedAbilities() {
  const roomId = useGameStore(s => s.multiplayerRoom?.id), gm = useGameStore(s => s.isGMMode);
  const entries = useSpellConsequenceStore(s => s.authoredRoomId === roomId ? s.authoredEntries : null) || [];
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('Refresh to check current room admission.');
  const perform = async action => { setBusy(true); try { const r = await action(); setMessage(r?.success ? 'Room admission refreshed. Range, defense and final amount remain GM-adjudicated.' : `Unavailable (${r?.code || 'unknown'}).`); } catch (e) { setMessage(e.message); } finally { setBusy(false); } };
  return <details className="p9-admitted"><summary>Admitted abilities</summary><section aria-label="Admitted abilities">
    <p>Wizard abilities execute only after the GM admits an exact version, you approve its cost and roll, and the GM accepts its final result.</p>
    <button type="button" disabled={busy} onClick={() => perform(refreshAuthoredAbilities)}>Refresh admitted abilities</button>
    <p role="status">{message}</p>
    {!entries.length && <p>No admitted ability has been loaded for this room.</p>}
    {entries.map(e => <div key={actionId(e.definitionRef)} className="p9-admitted-row"><strong>{e.canonicalDefinition.name}</strong> · version {e.definitionRef.definitionVersion} · {e.descriptor.price.ap} AP / {e.descriptor.price.mana} mana · {e.canonicalDefinition.effect.formula} · {e.descriptor.targeting.rangeFeet} ft
      <span>{e.revoked ? ' — Revoked (history retained)' : ' — Admitted for immediate damage/healing'}</span>
      {!e.revoked && <button type="button" disabled={busy} onClick={() => { if (!routeSpellCast({ id: actionId(e.definitionRef) }, { producer: 'admitted-library' })) setMessage('This installed binding is unavailable to your current character.'); }}>Use admitted ability</button>}
      {gm && !e.revoked && <button type="button" disabled={busy} onClick={() => perform(() => changeAuthoredAdmission('revoke', e.definitionRef))}>Revoke this version</button>}
    </div>)}
  </section></details>;
}

export default function SpellConsequenceHost() {
  const shared = useGameStore(value => value.isInMultiplayer);
  useEffect(() => { if (shared) restoreOwnerStatus(); }, [shared]);
  if (!shared) return null;
  return <><AdmittedAbilities /><OwnerPanel /><OwnerChip /><GmPanel /><CreaturePanel /></>;
}
