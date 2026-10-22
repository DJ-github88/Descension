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
import { actionId } from '../../services/authoredAbility';
import { refreshAuthoredAbilities, changeAuthoredAdmission, routeSpellCast } from '../../services/spellConsequenceService';

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
  const entries = Object.values(pending);
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
  return <><AdmittedAbilities /><OwnerPanel /><OwnerChip /><GmPanel /></>;
}
