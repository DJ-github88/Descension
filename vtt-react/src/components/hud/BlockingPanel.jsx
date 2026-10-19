import React, { useEffect, useMemo, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import { refOf } from '../../services/actorConsequenceService';
import { ownerSource } from '../../services/spellConsequenceService';
import { DAMAGE_TYPES, MANUAL, MANUAL_LABELS, requiredManual, firstAvailable, SIZES } from '../../services/equipmentBlocking';
import { findEntry, pendingUnequips } from '../../services/blockingCustody';
import { useBlockingStore, refreshOwnBlocking, refreshBlockLists, ownEligiblePieces, submitDeclaration, checkDeclaration, resolveOwnConflict, settleUnequip,
  approveBlock, checkBlockApproval, withdrawBlock, loadBlockingCustody, gmOfferBlock, gmPlanBlock, gmAcceptBlock, gmCheckBlockCommand, gmDeclineBlock, gmCancelOffer } from '../../services/blockingService';
import './WeaponStrikePanel.css';
import './BlockingPanel.css';

const keyOf = ref => ref ? `${ref.kind}:${ref.mapId}:${ref.tokenId}` : '';
const nameOf = token => token?.state?.customName || token?.character?.name || token?.name || token?.creature?.name || token?.id || 'Unknown';
const usePerform = () => {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return { busy, error, perform };
};
function describe(declaration) {
  if (!declaration) return 'not declared';
  if (declaration.mode === 'none') return 'Don’t block';
  const [first, ...rest] = declaration.pieces;
  return `${first.name} ${first.broken ? 'broken' : first.currentDie}${rest.length ? ` (+${rest.length} backup${rest.length > 1 ? 's' : ''})` : ''}`;
}

function DeclarationEditor({ declaration }) {
  const sheetEquipment = useCharacterStore(s => s.equipment);
  const eligible = useMemo(() => ownEligiblePieces(), [sheetEquipment]); // eslint-disable-line react-hooks/exhaustive-deps
  const [order, setOrder] = useState([]);
  const { busy, error, perform } = usePerform();
  // Reset only when the room declaration itself changes, never when a refused attempt re-reads the view.
  const revision = declaration?.revision ?? 0, eligibleKey = eligible.map(p => `${p.slot}:${p.currentDie}`).join(',');
  useEffect(() => { setOrder((declaration?.pieces || []).filter(p => !p.broken).map(p => p.slot).filter(slot => eligible.some(p => p.slot === slot))); }, [revision, eligibleKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const move = (index, delta) => setOrder(o => { const next = [...o]; const [item] = next.splice(index, 1); next.splice(index + delta, 0, item); return next; });
  return <fieldset className="p12b-editor" disabled={busy}><legend>Favored blocking piece and backups</legend>
    <p className="p12-meta">Set on your own turn (any time outside combat). The first available piece blocks; backups step in, in order, if it can’t.</p>
    <ol aria-label="Chosen blocking order">{order.map((slot, index) => { const piece = eligible.find(p => p.slot === slot); return <li key={slot}>
      {index === 0 ? 'Favored: ' : 'Backup: '}<strong>{piece.name}</strong> · {piece.kind} · {piece.currentDie}
      <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${piece.name} up`}>Up</button>
      <button type="button" onClick={() => setOrder(o => o.filter(s => s !== slot))} aria-label={`Remove ${piece.name}`}>Remove</button></li>; })}</ol>
    {eligible.filter(p => !order.includes(p.slot)).map(p => <button type="button" key={p.slot} onClick={() => setOrder(o => [...o, p.slot])}>Add {p.name} ({p.kind} {p.currentDie})</button>)}
    {!eligible.length && <p>No equipped armor or shield with a durability die.</p>}
    <div className="p12-actions">
      <button type="button" disabled={!order.length} onClick={() => perform(() => submitDeclaration({ mode: 'block', slots: order }))}>Save blocking declaration</button>
      <button type="button" onClick={() => perform(() => submitDeclaration({ mode: 'none' }))}>Don’t block</button>
    </div>{error && <p role="alert">{error}</p>}
  </fieldset>;
}
function OfferCard({ offer, piece }) {
  const [mode, setMode] = useState('physical'), [face, setFace] = useState('');
  const { busy, error, perform } = usePerform();
  const a = offer.attack;
  return <article className="p12-gm-card" aria-label={`Block roll for ${a.ability.name}`}>
    <h4>{a.ability.name}: {a.proposedDamage} {a.damageType} ({a.outcome})</h4>
    <p className="p12-meta">GM-declared hit · attack {a.roll.dice} [{a.roll.faces.join(', ')}]</p>
    {piece && a.outcome === 'critical' && piece.kind === 'armor' ? <p>Criticals go around armor: no block roll. The GM resolves this hit without a block.</p> : piece ? <>
      <p>Blocks with <strong>{piece.name}</strong> · {piece.kind} · {piece.currentDie}</p>
      <fieldset disabled={busy}><legend>Block roll · {piece.currentDie}</legend>
        <label><input type="radio" checked={mode === 'digital'} onChange={() => setMode('digital')} /> Roll digitally</label>
        <label><input type="radio" checked={mode === 'physical'} onChange={() => setMode('physical')} /> Physical face</label>
        {mode === 'physical' && <label>Natural face (1–{SIZES[piece.currentDie]}) <input inputMode="numeric" value={face} onChange={e => setFace(e.target.value)} /></label>}
        <button type="button" onClick={() => perform(() => approveBlock(offer.commandId, { mode, face }))}>Approve block roll</button>
      </fieldset></> : <p>No available blocking piece. The GM resolves this hit without a block.</p>}
    {error && <p role="alert">{error}</p>}
  </article>;
}
/** P12B-r1 (§3.9 R4): closed attacks keep their recorded outcome; visible to the GM and the target's owner. */
const CLOSED_WORDS = { consumed: 'applied', voided: 'voided by the GM', withdrawn: 'block roll withdrawn', withdrawn_by_gm: 'offer withdrawn by the GM', invalidated: 'closed (could no longer apply)' };
function ClosedAttacks() {
  const closed = useBlockingStore(s => s.closedOffers) || [];
  const shown = closed.filter(c => c.code !== 'consumed').slice(-4);
  if (!shown.length) return null;
  return <details className="p12b-closed"><summary>Closed attacks ({shown.length})</summary><ul>{shown.map(c => <li key={c.commandId}>
    {c.ability?.name}: attack [{(c.attackRoll?.faces || []).join(', ')}] · {c.outcome}{c.block ? ` · block face ${c.block.face} on ${c.block.slot} ${c.block.die}` : ''} — {CLOSED_WORDS[c.code] || c.code}. Cannot be rolled again.</li>)}</ul></details>;
}
function OwnerDialog({ onClose }) {
  const view = useBlockingStore(s => s.ownView), offers = useBlockingStore(s => s.offers), status = useBlockingStore(s => s.ownerStatus), notice = useBlockingStore(s => s.notice);
  const custody = useCharacterStore(s => s.roomEquipmentCustody);
  useCharacterTokenStore(s => s.characterTokens);
  const source = ownerSource();
  const entry = source.ref ? findEntry(custody, source.ref) : null;
  const pending = pendingUnequips(custody);
  const shared = source.token?.character?.equipment;
  const piece = firstAvailable(view?.declaration, shared);
  const saved = loadBlockingCustody();
  const { busy, error, perform } = usePerform();
  return <section className="p12-panel p12b-panel" role="dialog" aria-label="Blocking and wear">
    <header><h3>Blocking and wear</h3><button type="button" onClick={onClose}>Close</button></header>
    {source.error ? <p role="alert">{source.error}</p> : <>
      <p>Room declaration: <strong>{describe(view?.declaration)}</strong>{view?.declaration ? ` · revision ${view.declaration.revision}` : ''}</p>
      {view?.declaration?.mode === 'block' && <ul aria-label="Room blocking order">{view.declaration.pieces.map(p => <li key={p.slot}>{p.name} · {p.kind} · {p.broken ? 'broken' : p.currentDie}</li>)}</ul>}
      {Object.values(offers).map(offer => <OfferCard key={offer.commandId} offer={offer} piece={piece} />)}
      {!!entry?.conflicts?.length && <section className="p12b-conflicts" aria-label="Equipment conflicts">
        <h4>Competing values — your choice</h4>
        <p className="p12-meta">The room committed wear that your sheet could not take automatically. Both values are kept until you choose.</p>
        {entry.conflicts.map((c, index) => c.slot === null ? <article key={index}>
          <p>The room’s blocking declaration changed elsewhere ({(c.room || []).map(p => `${p.name} ${p.currentDie}`).join(' → ') || 'Don’t block'}). Wear is held until you re-align; each differing die then becomes its own choice.</p>
          <button type="button" disabled={busy} onClick={() => perform(() => resolveOwnConflict(index, 'room'))}>Re-align with the room declaration</button></article>
          : <article key={index}><p>{c.slot} · room {c.roomDie ?? '—'} · your sheet {c.privateDie ?? 'not found'} · {c.reason}</p>
          {c.roomDie && <button type="button" disabled={busy} onClick={() => perform(() => resolveOwnConflict(index, 'room'))}>Use room value ({c.roomDie})</button>}
          <button type="button" disabled={busy} onClick={() => perform(() => resolveOwnConflict(index, 'private'))}>Keep my sheet value{c.privateDie ? ` (${c.privateDie})` : ''}</button></article>)}
      </section>}
      {notice?.capacity && <p role="alert">Equipment custody is full of unresolved items from other rooms or attachments; wear from this room cannot be recorded on your sheet until they are resolved.</p>}
      {!!pending.length && <p role="status">A broken piece stays equipped (inert) until your pack has room. <button type="button" onClick={() => perform(async() => settleUnequip())}>Move broken piece to pack</button></p>}
      <DeclarationEditor declaration={view?.declaration} />
      <ClosedAttacks />
      {saved?.declaration && ['unknown', 'submitting'].includes(saved.declaration.phase) && <button type="button" disabled={busy} onClick={() => perform(checkDeclaration)}>Check same declaration</button>}
      {saved?.owner?.approval && ['awaiting', 'unknown', 'prepared'].includes(saved.owner.phase) && <div className="p12-actions">
        <button type="button" disabled={busy} onClick={() => perform(checkBlockApproval)}>Check same block roll</button>
        <button type="button" disabled={busy} onClick={() => perform(withdrawBlock)}>Withdraw block roll</button></div>}
    </>}
    {status?.message && <p role="status">{status.message}</p>}{error && <p role="alert">{error}</p>}
  </section>;
}

function GmOfferForm() {
  const creatures = useCreatureStore(s => s.creatureTokens), characters = useCharacterTokenStore(s => s.characterTokens);
  const [form, setForm] = useState({ source: '', target: '', name: '', dice: '', faces: '', outcome: 'hit', damageType: 'slicing', proposedDamage: '', apCost: '0' });
  const { busy, error, perform } = usePerform();
  const update = values => setForm(f => ({ ...f, ...values }));
  const sources = creatures.filter(t => refOf(t)?.kind === 'creature');
  const source = sources.find(t => keyOf(refOf(t)) === form.source);
  const targets = characters.filter(t => t.state?.actorContract?.primary && refOf(t) && (!source || refOf(t).mapId === refOf(source).mapId));
  const target = targets.find(t => keyOf(refOf(t)) === form.target);
  return <fieldset className="p12b-offer" disabled={busy}><legend>Creature attack → owner block roll</legend>
    <p className="p12-meta">You declare the hit (Evasion and hit/miss are your ruling). The owner rolls their blocking die; nothing applies until you confirm.</p>
    <label>Attacking creature <select value={form.source} onChange={e => update({ source: e.target.value })}><option value="">Choose a bound creature</option>{sources.map(t => <option key={keyOf(refOf(t))} value={keyOf(refOf(t))}>{nameOf(t)} · {t.id}</option>)}</select></label>
    <label>Target character <select value={form.target} onChange={e => update({ target: e.target.value })}><option value="">Choose a bound character</option>{targets.map(t => <option key={keyOf(refOf(t))} value={keyOf(refOf(t))}>{nameOf(t)} · {t.id}</option>)}</select></label>
    <label>Attack name <input maxLength={80} value={form.name} onChange={e => update({ name: e.target.value })} /></label>
    <label>Attack dice <input maxLength={40} value={form.dice} placeholder="e.g. 2d8+5" onChange={e => update({ dice: e.target.value })} /></label>
    <label>Attack faces <input value={form.faces} placeholder="e.g. 6, 3" onChange={e => update({ faces: e.target.value })} /></label>
    <label>GM-declared result <select value={form.outcome} onChange={e => update({ outcome: e.target.value })}><option value="hit">Hit</option><option value="critical">Critical</option></select></label>
    <label>Damage type <select value={form.damageType} onChange={e => update({ damageType: e.target.value })}>{DAMAGE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></label>
    <label>Proposed damage (before the block) <input inputMode="numeric" value={form.proposedDamage} onChange={e => update({ proposedDamage: e.target.value })} /></label>
    <label>Creature AP cost (authored card) <input inputMode="numeric" value={form.apCost} onChange={e => update({ apCost: e.target.value })} /></label>
    <button type="button" disabled={!source || !target} onClick={() => perform(() => gmOfferBlock({ source: refOf(source), target: refOf(target), ability: { id: null, name: form.name },
      roll: { mode: 'physical', dice: form.dice, faces: form.faces }, outcome: form.outcome, damageType: form.damageType, proposedDamage: form.proposedDamage, apCost: form.apCost }))}>Offer block roll to owner</button>
    {error && <p role="alert">{error}</p>}
  </fieldset>;
}
function GmPendingCard({ entry }) {
  const { approval } = entry;
  const offer = useBlockingStore(s => s.gmOffers[approval.attack.commandId]);
  const status = useBlockingStore(s => s.gmStatus[approval.attack.commandId]);
  const [manual, setManual] = useState({}), [final, setFinal] = useState(''), [reason, setReason] = useState(''), [plan, setPlan] = useState(null), [why, setWhy] = useState('');
  const { busy, error, perform } = usePerform();
  const required = offer ? requiredManual(offer.attack) : [];
  const draft = () => ({ manual: Object.entries(manual).filter(([, v]) => v.on).map(([category, v]) => ({ category, note: v.note || '' })), finalAmount: final === '' ? undefined : final, reason });
  const locked = ['submitting', 'unknown'].includes(status?.phase);
  // P12B-r1 (§3.9): stale state never re-rolls. The GM confirms the recorded rolls or voids.
  const revalidate = status?.phase === 'revalidate', blockRuling = status?.phase === 'blockRuling';
  const changes = status?.details?.changes;
  const pool = (label, value) => value ? `${label} ${value.before?.current ?? '?'}${value.before?.temp ? `+${value.before.temp}` : ''} → ${value.now?.current ?? '?'}${value.now?.temp ? `+${value.now.temp}` : ''}` : null;
  return <article className="p12-gm-card" aria-label="Pending block roll">
    <h4>{offer ? `${offer.attack.ability.name}: ${offer.attack.proposedDamage} ${offer.attack.damageType} (${offer.attack.outcome})` : 'Block roll'}</h4>
    <p>Owner rolled <strong>{approval.roll.faces[0]}</strong> ({approval.roll.mode}) on {approval.blocking.die} · slot {approval.blocking.slot}</p>
    {revalidate && <section className="p12b-ruling" aria-label="Attack revalidation">
      <p role="status">{status.message}</p>
      {changes && <p className="p12-meta">Changed since the offer: {[pool('HP', changes.hp), pool('mana', changes.mana), pool('AP', changes.ap)].filter(Boolean).join(' · ')}{changes.conditionsChanged ? ' · conditions changed' : ''}{status.details?.reason === 'history_unavailable' ? ' · full history unavailable' : ''}</p>}
      <label>Why the recorded rolls still stand (public, required) <input maxLength={300} value={why} onChange={e => setWhy(e.target.value)} /></label>
      <button type="button" disabled={busy || !why.trim()} onClick={() => perform(() => gmAcceptBlock(approval.approvalId, { ...draft(), revalidation: { reason: why } }))}>Recorded rolls still stand — apply</button>
    </section>}
    {blockRuling && <section className="p12b-ruling" aria-label="Block ruling">
      <p role="status">{status.message}</p>
      {status.details?.recorded && <p className="p12-meta">Recorded: face {status.details.recorded.face} on {status.details.recorded.slot} {status.details.recorded.die} (revision {status.details.recorded.revision}) · now: {status.details.current ? `${status.details.current.slot} ${status.details.current.die} (revision ${status.details.current.revision})` : 'unavailable'}</p>}
    </section>}
    <button type="button" disabled={busy} onClick={() => perform(async() => setPlan((await gmPlanBlock(approval.approvalId, draft())).preview))}>{blockRuling ? 'Check the recorded piece again' : 'Review block'}</button>
    {plan && <p>{plan.piece.name}: face {plan.face}{plan.defending ? ' × 2 (Defending)' : ''} = {plan.reduction} → after block <strong>{plan.afterBlock}</strong>; wear {plan.piece.currentDie} → {plan.broken ? 'broken' : plan.afterDie}</p>}
    <fieldset disabled={busy || locked}><legend>GM rulings (not automated)</legend>
      {MANUAL.map(category => <div key={category}><label><input type="checkbox" checked={!!manual[category]?.on || false} onChange={e => setManual(m => ({ ...m, [category]: { ...m[category], on: e.target.checked } }))} />
        {MANUAL_LABELS[category]}{required.includes(category) ? ' — required' : ''}</label>
        {manual[category]?.on && <input aria-label={`${category} note`} maxLength={300} value={manual[category].note || ''} onChange={e => setManual(m => ({ ...m, [category]: { ...m[category], note: e.target.value } }))} />}</div>)}
      <label>Final HP damage {plan ? `(after block ${plan.afterBlock})` : ''} <input inputMode="numeric" value={final} onChange={e => setFinal(e.target.value)} placeholder="defaults to after-block amount" /></label>
      <label>Adjustment reason (public; required if different) <input maxLength={2000} value={reason} onChange={e => setReason(e.target.value)} /></label>
    </fieldset>
    <div className="p12-actions">
      {!blockRuling && !revalidate && <button type="button" disabled={busy || locked} onClick={() => perform(() => gmAcceptBlock(approval.approvalId, draft()))}>Confirm and apply</button>}
      <button type="button" disabled={busy || locked} onClick={() => perform(() => gmDeclineBlock(approval.approvalId))}>{blockRuling ? 'Void block roll — resolve HP by hand' : 'Void attack (nothing applied)'}</button>
      {status?.command && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckBlockCommand(approval.attack.commandId))}>Check same command</button>}
    </div>
    {status?.message && <p role="status">{status.message}</p>}{error && <p role="alert">{error}</p>}
  </article>;
}
export default function BlockingHost() {
  const shared = useGameStore(s => s.isInMultiplayer), roomId = useGameStore(s => s.multiplayerRoom?.id), socket = useGameStore(s => s.multiplayerSocket), isGM = useGameStore(s => s.isGMMode);
  const uid = useAuthStore(s => s.user?.uid);
  const open = useBlockingStore(s => s.ownerOpen), view = useBlockingStore(s => s.ownView), notice = useBlockingStore(s => s.notice), offers = useBlockingStore(s => s.offers);
  const gmPending = useBlockingStore(s => s.gmPending), gmOffers = useBlockingStore(s => s.gmOffers), gmStatus = useBlockingStore(s => s.gmStatus);
  const projection = useCharacterStore(s => s.roomActorProjection);
  useEffect(() => {
    useBlockingStore.setState({ ownView: null, offers: {}, ownerStatus: null, gmOffers: {}, gmPending: {}, gmStatus: {}, gmViews: {}, notice: null, closedOffers: [] });
    if (shared && uid && roomId) { refreshBlockLists(); if (!isGM) refreshOwnBlocking(); }
  }, [shared, uid, roomId, socket, isGM]);
  useEffect(() => { if (shared && !isGM && projection) refreshOwnBlocking(); }, [shared, isGM, projection?.ref?.instanceId]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!shared) return null;
  const toggle = () => useBlockingStore.setState(s => ({ ownerOpen: !s.ownerOpen }));
  return <>
    {!isGM && <button type="button" className="p12-chip p12b-chip" onClick={toggle} aria-expanded={open}>
      Blocking: {describe(view?.declaration)}{Object.keys(offers).length ? ' · block roll requested' : ''}{notice?.conflicts ? ` · ${notice.conflicts} conflict${notice.conflicts > 1 ? 's' : ''}` : ''}{notice?.pending ? ' · broken piece awaiting pack space' : ''}
    </button>}
    {!isGM && open && <OwnerDialog onClose={toggle} />}
    {isGM && <section className="p12-gm p12b-gm" aria-label="Creature attack block adjudication">
      <GmOfferForm />
      {Object.values(gmOffers).filter(o => !Object.values(gmPending).some(e => e.approval.attack.commandId === o.commandId)).map(o => <article key={o.commandId} className="p12-gm-card" role="status">
        <p>Waiting for the owner’s block roll: {o.attack.ability.name} ({o.attack.proposedDamage} {o.attack.damageType})</p>
        <button type="button" onClick={() => gmCancelOffer(o.commandId)}>Withdraw offer</button></article>)}
      {Object.values(gmPending).map(entry => <GmPendingCard key={entry.approval.approvalId} entry={entry} />)}
      <ClosedAttacks />
      {Object.entries(gmStatus).filter(([id, s]) => !gmOffers[id] && ['accepted', 'unknown', 'refused', 'voided'].includes(s.phase)).slice(-4).map(([id, s]) => <article key={id} className="p12-gm-card" role="status">
        <p>{s.message}</p>{s.phase === 'unknown' && <button type="button" onClick={() => gmCheckBlockCommand(id)}>Check same command</button>}</article>)}
    </section>}
  </>;
}
