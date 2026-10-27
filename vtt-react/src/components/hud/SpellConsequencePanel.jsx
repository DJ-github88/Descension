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
import { saveCreatureResolution } from '../../services/spellConsequenceService';
import { STUNNED, stunnedRecordsFor } from '../../services/sharedConditionProfile';
import { designateVoluntaryCondition, respondToVoluntaryCondition, retainedTargetResponses } from '../../services/spellConsequenceService';
import { gmConditionResolution, saveGmConditionResolution } from '../../services/spellConsequenceService';
import { gmCheckOffer, useBlockingStore, gmCheckBlockCommand } from '../../services/blockingService';

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
  const condition = support?.kind === 'condition';
  const candidates = source.token ? all.filter(token => refOf(token) && token.mapId === source.mapId && (!condition || !sameExactRef(refOf(token), source.ref)) && (refOf(token).kind === 'creature' || token.state.actorContract.primary)) : [];
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
        <p className="p9-note">Supported room ability: nothing is spent until the GM accepts. {condition ? 'One approved price and duration, one successful canonical condition.' : 'One roll, one payment, one result.'}</p>
        <dl className="p9-facts">
          <dt>Effect</dt><dd>{condition ? `Canonical Stunned — ${STUNNED.description}` : `${support.kind === 'damage' ? `${support.damageTypes.join('/')} damage` : 'direct healing'} · ${support.reading.reading}`}</dd>
          {condition && <><dt>Timing</dt><dd>{support.timing.durationText} — GM removes. {support.timing.gmNote}</dd></>}
          <dt>Price</dt><dd>{support.price.ap} AP · {support.price.mana} mana{pools ? ` (temporary first; you have AP ${pools.ap.current}+${pools.ap.temp} temp, mana ${pools.mana.current}+${pools.mana.temp} temp)` : ''}</dd>
          {support.payment.classPayment && <><dt>Class</dt><dd>{describeClassPublic(support.payment.classPayment.before)} → {describeClassPublic(support.payment.classPayment.after)}</dd></>}
          {support.cooldown.value > 0 && <><dt>Cooldown</dt><dd>{support.cooldown.value} ({support.cooldown.type}) — starts when the GM accepts</dd></>}
        </dl>
        {!support.payment.affordable && <p className="p9-diagnostic">{support.payment.reason}</p>}
        {source.error ? <div className="p9-diagnostic"><p>{source.error}</p>
           {ownerCandidates.length === 1 && <button type="button" onClick={() => selectOwnerAttachment(refOf(ownerCandidates[0]))}>Use this owner attachment</button>}</div> : <>
          {(condition || owner.origin?.producer?.startsWith('item: ')) && <p>Source: {nameOf(source.token)} · selected primary owner PC · {source.ref.tokenId} / {source.ref.instanceId}</p>}
          {draftElsewhere && <div className="p9-diagnostic p12c-draft" role="alert"><p>An unsent recorded roll is retained for <strong>{describeDraft(draftElsewhere)}</strong>. A recorded roll never moves to another spell: cast it from that spell, or discard it explicitly.</p>
            <button type="button" disabled={busy} onClick={() => perform(async() => discardSpellDraft())}>Discard recorded roll</button></div>}
          <div className="p12c-pick"><button type="button" disabled={pending || busy || !source.ref} onClick={pick}>Pick on map</button><span className="p9-meta">{rangeLabel ? `${rangeLabel} — advisory` : 'No card range — GM adjudicates'}</span></div>
          <label>Target <select value={targetKey} disabled={pending || busy} onChange={event => chooseTarget(event.target.value)}>
            <option value="">Select an exact bound target</option>
            {candidates.map(token => <option key={ref(refOf(token))} value={ref(refOf(token))}>{nameOf(token)} · {refOf(token).kind} · {token.id}{sameExactRef(refOf(token), source.ref) ? ' (you)' : ''}</option>)}
          </select></label>
          {target && <p className="p9-advisory">{advisoryRange(source.token, target, game, `${support.raw.targetingConfig?.rangeType || ''} ${support.raw.targetingConfig?.rangeDistance ?? '?'} ft`)} {resistanceText(target)}</p>}
           {target && condition && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the action and spending, not the target’s consent. Stunned is hostile by default: the GM can install successful Stunned without target acknowledgement, including offline. Voluntary applications require separate GM designation and target acceptance. The GM resolves eligibility, range, saves, immunity and success manually. Changed terms require fresh approval. Failed/unexecuted attempt costs remain manual.</p>}
          {target && !condition && !roll && !pending && !draftElsewhere && <div className="p9-roll">
            <button type="button" disabled={busy} onClick={() => record('digital')}>Roll {support.reading.dice.map(g => `${g.count}d${g.sides}`).join(' + ')} once</button>
            <span>or physical faces:</span>
            {support.reading.dice.flatMap((group, i) => Array.from({ length: group.count }, (_, j) => <input key={`${i}:${j}`} aria-label={`d${group.sides} face ${j + 1}`} type="number" min="1" max={group.sides}
              value={physical[`${i}:${j}`] || ''} onChange={event => setPhysical({ ...physical, [`${i}:${j}`]: event.target.value })} />))}
            <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button>
          </div>}
          {roll && <p className="p9-roll-result">Recorded {roll.mode} roll: [{roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {roll.constant >= 0 ? '+' : '-'} {Math.abs(roll.constant)} = <strong>{roll.total}</strong>. The GM confirms the final amount. Kept on this device for this spell through target changes and reloads.</p>}
          {!pending && <button type="button" className="p9-primary" disabled={busy || !target || (!condition && !roll) || !support.payment.affordable || !affordable(pools, support.price)}
            onClick={() => perform(() => sendSpellApproval({ spellId: owner.spellId, targetRef: refOf(target), roll, origin: owner.origin }))}>{condition ? 'Approve exact price, target and Stunned duration' : 'Approve price and send to GM'}</button>}
        </>}
      </>}
      {!!discarded.length && <details className="p12c-discarded"><summary>Discarded unsent rolls on this device ({discarded.length})</summary><ul>{discarded.map((d, i) => <li key={i}>{describeDraft(d)}</li>)}</ul></details>}
      {status && <div className="p9-status" role="status"><p>{status.message}</p>
        {status.latest?.approval && <p className="p9-meta">Approval {status.latest.approval.approvalId} · {status.latest.custody}</p>}
        {status.latest?.approval?.conditionTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {status.latest.approval.price.ap} AP / {status.latest.approval.price.mana} mana · canonical Stunned · {status.latest.approval.conditionTerms.timing.durationText} — GM removes.</p>}
        {['awaiting', 'unknown', 'prepared'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(checkSpellApproval)}>Check this same approval</button>}
        {['awaiting', 'unknown'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(withdrawSpellApproval)}>Withdraw before acceptance</button>}
        {status.phase === 'reapproval' && <button type="button" disabled={busy} onClick={() => perform(reapproveSpell)}>{condition ? 'Review changed terms before fresh approval' : 'Review and approve again (same roll)'}</button>}
        {status.phase === 'unresolved' && <button type="button" disabled={busy} onClick={() => markSpellReconciled()}>Reconciled with the GM — clear this approval</button>}
      </div>}
      {error && <p className="p9-diagnostic">{error}</p>}
    </div>
  </div>, document.body);
}

/** GM: explicit adjudication and one consequence; observers never execute. */
export function GmPanel() {
  const isGM = useGameStore(value => value.isGMMode);
  const roomId = useGameStore(value => value.multiplayerRoom?.id);
  const pending = useSpellConsequenceStore(value => value.gmPending);
  const status = useSpellConsequenceStore(value => value.gmStatus);
  const characters = useCharacterTokenStore(value => value.characterTokens);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const gridSize = useGameStore(value => value.gridSize), feetPerTile = useGameStore(value => value.feetPerTile);
  const game = { gridSize, feetPerTile };
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);
  useSpellConsequenceStore(s => s.draftVersion);
  useEffect(() => { if (isGM) refreshSpellApprovals(); }, [isGM]);
   const entries = Object.values(pending).filter(e => e.approval.roomId === roomId && e.approval.source.kind !== 'creature');
  const extra = Object.entries(status).filter(([id, value]) => !pending[id] && ['unknown', 'unresolved', 'reapproval', 'accepted', 'declined', 'refused', 'retry'].includes(value.phase));
  if (!isGM || (!entries.length && !extra.length)) return null;
  const all = [...characters, ...creatures];
  const find = value => all.find(token => sameExactRef(refOf(token), value));
  const perform = async action => { setBusy(true); try { await action(); } finally { setBusy(false); } };
  return <section className="p9-gm" aria-label="Spell adjudication">
    {entries.map(({ approval }) => {
      const draft = drafts[approval.approvalId] || {}, update = values => setDrafts({ ...drafts, [approval.approvalId]: { ...draft, ...values } });
      const source = find(approval.source), target = find(approval.target), state = status[approval.approvalId];
      const condition = approval.spell.kind === 'condition';
      const resolution = condition ? gmConditionResolution(approval.approvalId) || { gmConfirmed: false, timing: approval.conditionTerms.timing, timingNote: '', evidence: '' } : null;
      const updateResolution = values => { try { saveGmConditionResolution(approval.approvalId, { ...resolution, ...values }); } catch (e) { update({ error: e.message }); } };
      return <article key={approval.approvalId} className="p9-gm-card">
        <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
        {condition ? <><p>Canonical Stunned · {STUNNED.description}</p><p>{approval.conditionTerms.timing.durationText} — GM removes. {approval.conditionTerms.timing.gmNote}</p>
          <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration is owner-approved; a clarification cannot replace it. Changed terms require a newly admitted version and fresh approval.</p></> : <><p>{approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
        <p className="p9-meta">{approval.roll.reading}</p></>}
        <p>Owner-approved price: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</p>
        <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
         {condition ? <fieldset disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)}><legend>Private GM resolution</legend>
          <label>GM timing clarification (required)<input maxLength={300} value={resolution.timingNote} onChange={e => updateResolution({ timingNote: e.target.value, gmConfirmed: false })} /></label>
          <label>Private manual resolution evidence<textarea maxLength={2000} value={resolution.evidence} onChange={e => updateResolution({ evidence: e.target.value, gmConfirmed: false })} /></label>
           <label><input type="checkbox" checked={resolution.gmConfirmed === true} onChange={e => updateResolution({ gmConfirmed: e.target.checked })} /> I resolved eligibility/range/saves/immunity and confirm that this Stunned outcome succeeded</label>
          <p>Only successful application is automated. Failed/unexecuted attempt costs remain GM-managed.</p>
        </fieldset> : <><label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range, defense and mitigation</label>
        <label>Final {approval.spell.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
        <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label></>}
         {draft.error && <p role="alert">{draft.error}</p>}
         {condition && approval.target.kind === 'character' && <TargetPolicy approvalId={approval.approvalId} disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)} />}
        <div className="p9-actions">
          <button type="button" className="p9-primary" disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase) || (condition && (!resolution.gmConfirmed || !resolution.timingNote.trim()))} onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: condition ? 0 : draft.final === '' || draft.final === undefined ? NaN : Number(draft.final), reason: condition ? '' : draft.reason || '', adjudicated: condition ? resolution.gmConfirmed : draft.adjudicated === true }))}>{condition ? 'Confirm PC payment and Stunned together' : 'Accept one consequence'}</button>
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
  const characters = useCharacterTokenStore(s => s.characterTokens);
  const blockStatuses = useBlockingStore(s => s.gmStatus);
  const [physical, setPhysical] = useState({}), [targetKey, setTargetKey] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [amount, setAmount] = useState(''), [reason, setReason] = useState(''), [adjudicated, setAdjudicated] = useState(false);
  const [blockApplicable, setBlockApplicable] = useState(false);
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
  const source = creatures.find(t => sameExactRef(refOf(t), c.source)), d = c.entry.canonicalDefinition, condition = d.effect.kind === 'condition', reading = condition ? null : readAuthoredFormula(d.effect.formula);
   const candidates = [...creatures, ...characters].filter(t => refOf(t) && refOf(t).mapId === c.source.mapId &&
      (sameExactRef(refOf(t), c.source) ? c.selfAllowed : d.targeting.rangeFeet > 0 && d.targeting.restriction !== 'self' && (refOf(t).kind === 'creature' || t.state.actorContract.primary)));
   const target = candidates.find(t => ref(refOf(t)) === targetKey), roll = c.roll, id = latest.approval?.approvalId, status = gmStatus[id];
   const selected = [...creatures, ...characters].find(t => sameExactRef(refOf(t), c.target)) || target;
   const hp = selected && (refOf(selected)?.kind === 'creature' ? { current: selected.state?.currentHp, max: selected.state?.maxHp ?? selected.stats?.maxHp } : selected.character?.health);
   const capped = hp && amount !== '' && Number.isSafeInteger(Number(amount)) && Number(amount) >= 0 ? Math.max(0, Math.min(Number(amount), hp.max - hp.current)) : null;
  const defenses = sourceDetails.find(e => sameExactRef(e.source, c.target || refOf(target)))?.defenses;
   const resolution = c.resolution || { gmConfirmed: false, timing: d.timing, timingNote: '', evidence: '' };
   const choose = value => { setTargetKey(ref(value)); if (condition) saveCreatureResolution({ ...resolution, gmConfirmed: false }, value); else if (roll) saveCreatureRoll(roll, value); setAdjudicated(false); };
  const record = mode => perform(async () => saveCreatureRoll(mode === 'digital' ? digitalRoll(reading) : recordRoll('physical', reading, reading.dice.map((g, i) => Array.from({ length: g.count }, (_, j) => Number(physical[`${i}:${j}`])))), refOf(target)));
  const canAccept = latest.phase === 'awaiting' && pending[id] && !['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(status?.phase);
  if (picking) return null;
  return createPortal(<div className="p9-overlay" role="dialog" aria-modal="true" aria-label="Creature ability action" onKeyDown={e => { if (e.key === 'Escape') close(); }}>
    <div className="p9-panel">
      <header><h3>{d.name}</h3><button type="button" aria-label="Close creature action" onClick={close}>×</button></header>
      <p>Source: {nameOf(source)} · {c.source.mapId} / {c.source.tokenId} · incarnation {c.source.instanceId}</p>
      <p>Admitted version {c.entry.definitionRef.definitionVersion} · {condition ? 'canonical Stunned' : `${d.effect.kind} · ${d.effect.formula} · ${d.effect.damageTypes?.join('/') || 'healing'}`}</p>
      <p>Exact price: {c.entry.descriptor.price.ap} AP / {c.entry.descriptor.price.mana} mana · temporary first. Nothing spent before confirmation.</p>
        <p>Authored range {d.targeting.rangeFeet} ft · one {d.targeting.restriction} target. {condition ? 'One distinct bound creature or primary PC. The GM resolves eligibility, range, saves, immunity and success. Hostile Stunned needs no target acknowledgement; disconnected targets do not veto installation.' : c.selfAllowed ? 'Self healing uses this exact creature; no owner offer or equipment.' : 'Self is unavailable for this targeting/effect profile. Primary PCs require the exact owner’s acceptance.'}</p>
      {condition && <><p>{STUNNED.description}</p><p>{d.timing.durationText} — GM removes. {d.timing.gmNote}</p>
        <details><summary>Preserved duration metadata (no automatic interpretation)</summary><pre>{JSON.stringify(d.timing.authoredDuration, null, 2)}</pre></details>
        <p>Any ambiguous timing needs an explicit GM ruling below. STR/AGI save failure and the table’s advantage procedure remain manually recorded/applied. Preparing or cancelling spends nothing. Recording no application does not make a tabletop attempt free; unsuccessful attempts and their costs are manual.</p>
        {!latest.approval && <fieldset disabled={busy || !target}><legend>GM-resolved successful application</legend>
          <label>GM timing note (required)<input maxLength={300} value={resolution.timingNote} onChange={e => saveCreatureResolution({ ...resolution, timing: d.timing, timingNote: e.target.value, gmConfirmed: false }, refOf(target))} /></label>
          <label>Manual resolution evidence (optional)<textarea maxLength={2000} value={resolution.evidence} onChange={e => saveCreatureResolution({ ...resolution, timing: d.timing, evidence: e.target.value, gmConfirmed: false }, refOf(target))} /></label>
          <label><input type="checkbox" checked={resolution.gmConfirmed === true} onChange={e => saveCreatureResolution({ ...resolution, timing: d.timing, gmConfirmed: e.target.checked }, refOf(target))} /> I resolved eligibility/range/saves/immunity and confirm that this Stunned outcome succeeded</label>
        </fieldset>}
        {latest.approval && <p>Retained successful outcome: {resolution.timingNote}. Manual evidence: {resolution.evidence || 'none recorded; software did not roll or verify a save'}.</p>}
      </>}
      {!latest.approval && <>
          <button type="button" disabled={busy} onClick={() => useTargetingStore.getState().startTargetPick({ id: 'p14-creature', label: d.name, sourceRef: c.source, candidates: candidates.map(refOf), rangeFeet: d.targeting.rangeFeet, rangeLabel: `Authored ${d.targeting.rangeFeet} ft — advisory`, reasonFor: () => 'Choose an eligible exact bound target on this map; Self requires compatible direct healing.', onPick: choose, onCancel: () => {} })}>Pick creature on map</button>
         <label>Creature or primary PC target<select value={targetKey} disabled={busy} onChange={e => choose(refOf(candidates.find(t => ref(refOf(t)) === e.target.value)))}>
           <option value="">Select an exact placed creature</option>{candidates.map(t => <option key={ref(refOf(t))} value={ref(refOf(t))}>{sameExactRef(refOf(t), c.source) ? `Self — ${nameOf(t)}` : nameOf(t)} · {t.id}</option>)}
        </select></label>
        {target && !condition && !roll && <div className="p9-roll"><button type="button" disabled={busy} onClick={() => record('digital')}>Roll {d.effect.formula} once</button>
          {reading.dice.flatMap((g, i) => Array.from({ length: g.count }, (_, j) => <label key={`${i}:${j}`}>d{g.sides} face {j + 1}<input type="number" min="1" max={g.sides} value={physical[`${i}:${j}`] ?? ''} onChange={e => setPhysical({ ...physical, [`${i}:${j}`]: e.target.value })} /></label>))}
          <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button></div>}
      </>}
      {roll && <p className="p9-roll-result">Retained {roll.mode} faces [{roll.dice.map(g => g.faces.join(', ')).join(' | ')}] · {roll.reading} = {roll.total}. Closing/reloading retains this attempt and its faces.</p>}
        {c.target && <p>Target: {nameOf([...creatures, ...characters].find(t => sameExactRef(refOf(t), c.target)))} · {c.target.mapId} / {c.target.tokenId} · incarnation {c.target.instanceId}</p>}
       {hp && !condition && <p>Current HP: {hp.current} / {hp.max}{d.effect.kind === 'healing' && capped !== null && latest.phase !== 'accepted' ? ` · Proposed healing ${amount} · Actual HP to restore after cap: ${capped}` : ''}</p>}
      {defenses && <details><summary>Target's authored defenses and abilities (GM adjudication)</summary><p>Flat DR: {defenses.flatDR ?? 'not declared'}. Resistances/vulnerabilities and specific defensive effects remain manual.</p><pre className="creature-ability-json">{JSON.stringify(defenses, null, 2)}</pre></details>}
       {roll && c.target?.kind === 'character' && !latest.approval && <fieldset disabled={busy}><legend>Exact owner proposal</legend>
         <label>Proposed {d.effect.kind === 'healing' ? 'healing' : 'damage before equipment block'}<input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></label>
         {d.effect.kind === 'damage' && <label><input type="checkbox" checked={blockApplicable} onChange={e => setBlockApplicable(e.target.checked)} /> I rule that equipment blocking applies to this ability</label>}
         <label>Targeting and {d.effect.kind === 'healing' ? 'healing' : 'blocking applicability'} ruling (required)<input maxLength={300} value={reason} onChange={e => setReason(e.target.value)} /></label>
         <p>Healing requires explicit owner acceptance of this amount, with no equipment. Changing it requires a new acceptance with these retained source faces.</p>
       </fieldset>}
        {(roll || (condition && resolution.gmConfirmed && resolution.timingNote.trim())) && !['accepted', 'reconciled', 'unresolved'].includes(latest.phase) && !latest.pcOffer && <button type="button" disabled={busy || ['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase)} onClick={() => perform(() => prepareCreatureAbility({ proposedAmount: amount === '' ? NaN : Number(amount), blockApplicable, ruling: reason }))}>{condition ? latest.approval ? 'Revalidate original condition attempt' : 'Validate successful condition application' : latest.approval ? 'Revalidate original attempt (same roll)' : c.target?.kind === 'character' ? 'Offer exact proposal to PC owner' : 'Validate source, target and retained roll'}</button>}
       {latest.pcOffer && <p role="status">Continue in block/consent adjudication below. {blockStatuses[c.attemptId]?.message || 'Original owner offer retained.'}
         <button type="button" disabled={busy} onClick={() => perform(() => blockStatuses[c.attemptId]?.command ? gmCheckBlockCommand(c.attemptId) : gmCheckOffer(c.attemptId))}>Check original PC offer or command</button></p>}
      {(roll || condition) && latest.approval && !['accepted', 'reconciled', 'unknown', 'unresolved'].includes(latest.phase) && !['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase) && <button type="button" disabled={busy} onClick={() => perform(revalidateCreatureContext)}>{condition ? 'Refresh admission or change target (keep evidence)' : 'Refresh admission or change target (keep faces)'}</button>}
        {canAccept && !latest.pcOffer && <>
         {condition && c.target?.kind === 'character' && <TargetPolicy approvalId={id} disabled={busy} />}
        <label><input type="checkbox" checked={adjudicated} onChange={e => setAdjudicated(e.target.checked)} /> {condition ? 'I reviewed the retained successful outcome, timing and exact authored price' : 'I adjudicated legality, range, target restrictions, defense and mitigation'}</label>
        {!condition && <>
        <label>Final {d.effect.kind === 'damage' ? 'damage' : 'healing'}<input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <label>Reason (required if different from {roll.total})<input type="text" value={reason} onChange={e => setReason(e.target.value)} /></label>
        </>}
        <button type="button" className="p9-primary" disabled={busy || !adjudicated || (!condition && amount === '')} onClick={() => perform(() => gmAcceptSpell(id, { finalAmount: condition ? 0 : amount === '' ? NaN : Number(amount), reason, adjudicated }))}>{condition ? 'Confirm payment and Stunned together' : 'Confirm one creature consequence'}</button>
      </>}
      {status?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(id))}>Check same command</button>}
      {(status?.phase === 'unresolved' || latest.phase === 'unresolved') && <p role="alert">Exact recovery unavailable. Manual reconciliation required; no new attempt is created.</p>}
      <p role="status">{latest.phase === 'accepted' ? `Accepted · ${latest.result?.status || 'accepted live'} · receipt ${latest.result?.receipt?.commandId}` : status?.message || message || `Retained ${latest.phase}.`}</p>
       {latest.result?.receipt && (condition ? <p>Payment and canonical Stunned installed together. Exact instance {c.attemptId} · source {c.source.tokenId} / {c.source.instanceId}. {resolution.timing.durationText} — GM removes.</p> : <p>Payment and HP installed together. {latest.result.receipt.actors.map(a => `${a.ref.tokenId}: AP ${a.finalResources.ap.current ?? 'unavailable'}+${a.finalResources.ap.temp} temp, mana ${a.finalResources.mana.current ?? 'unavailable'}+${a.finalResources.mana.temp} temp, HP ${a.finalResources.hp.current}+${a.finalResources.hp.temp} temp`).join(' · ')}</p>)}
       {latest.result?.receipt && d.effect.kind === 'healing' && <p>GM-approved healing: {latest.result.receipt.adjudication.finalAmount}. Actual HP restored: {JSON.parse(latest.result.receipt.adjudication.chosenResult).actualHealing ?? 'see accepted HP result'}.</p>}
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
    <p>Wizard abilities execute only after the GM admits an exact version, you approve its exact terms, and the GM confirms its result. Canonical Stunned uses manual success/timing, without damage dice.</p>
    <button type="button" disabled={busy} onClick={() => perform(refreshAuthoredAbilities)}>Refresh admitted abilities</button>
    <p role="status">{message}</p>
    {!entries.length && <p>No admitted ability has been loaded for this room.</p>}
    {entries.map(e => <div key={actionId(e.definitionRef)} className="p9-admitted-row"><strong>{e.canonicalDefinition.name}</strong> · version {e.definitionRef.definitionVersion} · {e.descriptor.price.ap} AP / {e.descriptor.price.mana} mana · {e.canonicalDefinition.effect.formula} · {e.descriptor.targeting.rangeFeet} ft
      <span>{e.revoked ? ' — Revoked (history retained)' : e.creatureOnly ? ' — Exact creature-source admission; use placed Inspect' : e.canonicalDefinition.effect.kind === 'condition' ? ` — PC→distinct creature or primary PC canonical Stunned · ${e.canonicalDefinition.timing.durationText} — GM removes` : ' — Admitted for immediate damage/healing'}</span>
      {!e.revoked && !e.creatureOnly && <button type="button" disabled={busy} onClick={() => { if (!routeSpellCast({ id: actionId(e.definitionRef) }, { producer: 'admitted-library' })) setMessage('This installed binding is unavailable to your current character.'); }}>Use admitted ability</button>}
      {gm && !e.revoked && <button type="button" disabled={busy} onClick={() => perform(() => changeAuthoredAdmission('revoke', e.definitionRef))}>Revoke this version</button>}
    </div>)}
  </section></details>;
}

function TargetPolicy({ approvalId, disabled }) {
  const proposal = useSpellConsequenceStore(s => s.gmPending[approvalId]?.targetProposal);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  return <div className="p9-note"><p>{proposal ? `Voluntary Stunned — ${proposal.withdrawn ? 'target acceptance withdrawn; close this attempt' : proposal.accepted ? 'exact target accepted' : 'waiting for explicit target acceptance; silence never accepts'}. Source payment consent remains separate.` : 'Hostile Stunned — current GM success authority. Target notification is informational, not permission. No target acknowledgement is required.'}</p>
    {!proposal && <button type="button" disabled={disabled || busy} onClick={async() => { setBusy(true); setError(''); try { await designateVoluntaryCondition(approvalId); } catch (e) { setError(e.message); } finally { setBusy(false); } }}>GM: designate voluntary application</button>}
    {error && <p role="alert">{error}</p>}</div>;
}

function TargetConditions() {
  useCharacterTokenStore(s => s.characterTokens);
  useSpellConsequenceStore(s => s.draftVersion);
  const characterId = useCharacterStore(s => s.currentCharacterId);
  const proposals = useSpellConsequenceStore(s => s.targetProposals) || [];
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => { refreshSpellApprovals(); }, [characterId]);
  const source = ownerSource(), records = source.token ? stunnedRecordsFor(source.token).filter(r => r.sourceEntityId.startsWith('authored-condition:')) : [];
  const retained = retainedTargetResponses();
  // Reading/acknowledging/reporting never emits an action or changes a condition.
  if (!records.length && !proposals.length && !retained.length) return null;
  const respond = async(p, accept) => { setBusy(true); setError(''); try { await respondToVoluntaryCondition(p, accept); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <details className="p9-admitted"><summary>Stunned notices and voluntary proposals ({records.length + proposals.length})</summary>
    <section aria-label="Target Stunned notices"><button type="button" disabled={busy} onClick={() => refreshSpellApprovals()}>Refresh original target proposals</button>
      <p>Accepted hostile Stunned does not require your permission or acknowledgement. To request correction, message the GM with the exact instance below; the GM uses shared condition controls to correct/remove that instance. Reporting does not undo, duplicate or refund it.</p>
      {records.map(r => <p key={r.id} role="status">Accepted canonical Stunned · instance {r.id} · {r.authoredDuration} — GM removes. Source identity is withheld on this notice. View the same instance on your sheet/token.</p>)}
      {retained.map(e => <p key={e.command.commandId} role="status">Original target response {e.command.proposalId}: outcome unavailable. No replacement consent is created. <button type="button" disabled={busy} onClick={() => respond(e.proposal || e.command, e.command.accept)}>Check original target response</button></p>)}
      {proposals.filter(p => p.target.characterId === characterId).map(p => <div key={p.proposalId}><h4>GM-designated voluntary Stunned</h4><p>{p.source} (exact opaque source handle {p.sourceHandle}) → exact target {p.target.tokenId}/{p.target.instanceId}. Canonical Stunned: {STUNNED.description} {p.durationText} — GM removes. Source price {p.price.ap} AP / {p.price.mana} mana. Admitted definition {p.definitionId} · version/hash {p.definitionVersionOrHash}. Exact proposal {p.proposalId} · server-bound terms handle {p.termsHash}. No source resources are authorized by your acceptance.</p>
        <p>{p.withdrawn ? 'Withdrawn. A fresh proposal is required.' : p.accepted ? 'Your exact acceptance is recorded; installation still requires the GM.' : 'Waiting for your affirmative acceptance. Silence, timeout and disconnection never accept.'}</p>
        {!p.withdrawn && <><button type="button" disabled={busy || p.accepted} onClick={() => respond(p, true)}>Accept this exact voluntary Stunned</button><button type="button" disabled={busy} onClick={() => respond(p, false)}>Withdraw target acceptance before installation</button></>}
      </div>)}{error && <p role="alert">{error}</p>}
    </section></details>;
}

export default function SpellConsequenceHost() {
  const shared = useGameStore(value => value.isInMultiplayer);
  useEffect(() => { if (shared) restoreOwnerStatus(); }, [shared]);
  if (!shared) return null;
  return <><AdmittedAbilities /><TargetConditions /><OwnerPanel /><OwnerChip /><GmPanel /><CreaturePanel /></>;
}
