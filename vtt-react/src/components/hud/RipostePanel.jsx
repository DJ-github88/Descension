import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { refOf, findActor } from '../../services/actorConsequenceService';
import { getBootstrapGateState, isPrivateProjectionIsolated, subscribeBootstrapGate } from '../../persistence/bootstrapPrivacyGate';
import { reactionPrincipal, useReactionWindowStore } from '../../services/reactionWindowService';
import { useRiposteStore, bindRiposte, offerRiposte, refreshRiposte, retainRiposteRoll, approveRiposte, checkRiposteApproval,
  withdrawRiposte, executeRiposte, checkRiposteCommand, controlRiposte } from '../../services/riposteService';
import { weaponForRiposte, digitalRiposteRoll, riposteAcceptedText, UNAPPLIED } from '../../services/riposteExecution';
import { actorKey, useCombatFeedStore } from '../../services/acceptedResultFeed';
import './ReactionWindowPanel.css';
import './RipostePanel.css';

const key = ref => `${ref.kind}:${ref.mapId}:${ref.tokenId}:${ref.instanceId}`;
const label = token => token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Actor';
function AttestForm({ busy, perform }) {
  const creatures = useCreatureStore(s => s.creatureTokens), characters = useCharacterTokenStore(s => s.characterTokens);
  const collection = useReactionWindowStore(), saved = useRiposteStore(s => s.saved);
  const [attackId, setAttackId] = useState(() => crypto.randomUUID()), [parryId, setParryId] = useState(() => crypto.randomUUID());
  const [requestId] = useState(() => crypto.randomUUID()), [source, setSource] = useState(''), [target, setTarget] = useState('');
  const [windowId, setWindowId] = useState(''), [success, setSuccess] = useState(false), [paid, setPaid] = useState(false), [timing, setTiming] = useState(false);
  const [note, setNote] = useState(''), [receipt, setReceipt] = useState('');
  const pcs = characters.filter(t => refOf(t)?.kind === 'character' && t.state.actorContract.primary);
  const foes = creatures.filter(t => refOf(t)?.kind === 'creature');
  const known = saved?.offers?.[requestId];
  return <details open><summary>Structured Parry attestation / fresh Riposte offer</summary>
    <p>Original universal_riposte: exactly1 AP. Prior Parry success/payment is GM-attested, not automatically verified. No second Parry charge.</p>
    <form onSubmit={e => { e.preventDefault(); perform(() => offerRiposte({ requestId, windowEpoch: collection.epoch, windowId: windowId || null,
      source: refOf(pcs.find(t => key(refOf(t)) === source)), target: refOf(foes.find(t => key(refOf(t)) === target)),
      attack: { id: attackId, attacker: refOf(foes.find(t => key(refOf(t)) === target)), defender: refOf(pcs.find(t => key(refOf(t)) === source)) },
      parry: { id: parryId, success, paid, timingConfirmed: timing, note }, receiptRef: receipt || null })); }}>
      <fieldset disabled={busy || !!known}><legend>Exact attack and Parry</legend>
        <label>Triggering attack occurrence<input required maxLength={120} value={attackId} onChange={e => setAttackId(e.target.value)} /></label>
        <label>Parry occurrence<input required maxLength={120} value={parryId} onChange={e => setParryId(e.target.value)} /></label>
        <label>Exact parrying PC<select required value={source} onChange={e => setSource(e.target.value)}><option value="">Choose primary PC</option>{pcs.map(t => <option key={key(refOf(t))} value={key(refOf(t))}>{label(t)}</option>)}</select></label>
        <label>Particular attacking creature<select required value={target} onChange={e => setTarget(e.target.value)}><option value="">Choose original attacker</option>{foes.map(t => <option key={key(refOf(t))} value={key(refOf(t))}>{label(t)}</option>)}</select></label>
        <label>Closed fresh Riposte follow-up<select value={windowId} onChange={e => {
          const w = collection.windows.find(w => w.windowId === e.target.value); setWindowId(e.target.value);
          if (w) { setParryId(w.trigger.causeId); setSource(key(w.source)); }
        }}><option value="">Open fresh8s choice — seal no GM declarations</option>{collection.windows.filter(w => w.status === 'closed' && w.moment === 'follow_up').map(w =>
          <option key={w.windowId} value={w.windowId}>{w.trigger.causeId} · {w.windowId.slice(0, 8)}</option>)}</select></label>
        <p>For an existing manual follow-up: cause reference must be the Parry occurrence, source the parrying PC, audience that PC alone; final card ID universal_riposte. No old Parry window or alias is authority.</p>
        <label><input required type="checkbox" checked={success} onChange={e => setSuccess(e.target.checked)} />I attest this PC successfully parried this particular attack.</label>
        <label><input required type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} />I attest Parry was already fully paid and room pools reconciled; do not charge it again.</label>
        <label><input required type="checkbox" checked={timing} onChange={e => setTiming(e.target.checked)} />I attest timing/5ft/enemy eligibility; success precedes this fresh choice. New offer seals no additional GM declarations.</label>
        <label>Private payment/Parry attestation note<textarea required maxLength={500} value={note} onChange={e => setNote(e.target.value)} /></label>
        <label>Optional existing payment receipt ID<input value={receipt} onChange={e => setReceipt(e.target.value)} /></label>
      </fieldset>
      {!known && <button type="submit" disabled={busy || !collection.epoch}>Attest Parry and offer Riposte</button>}
      {known && <><p>Exact offer request retained: {known.phase}. Editing it cannot mint another opportunity.</p>
        <button type="button" disabled={busy} onClick={() => perform(() => offerRiposte(known.request))}>Check exact retained offer</button></>}
    </form>
  </details>;
}
function OwnerAttempt({ p, perform, busy }) {
  const character = useCharacterStore(), rendered = useCombatFeedStore(s => s.rendered), saved = useRiposteStore(s => s.saved?.owner?.[p.id]);
  const [slot, setSlot] = useState('mainHand'), [ownerType, setOwnerType] = useState(''), [faces, setFaces] = useState(''), [localRoll, setLocalRoll] = useState(null);
  const support = weaponForRiposte(character, slot, ownerType), target = findActor(p.target);
  const visible = !!target && !target.state?.hiddenFromPlayers && !target.hiddenFromPlayers && (rendered[actorKey(p.target)] || 0) > 0;
  const keepRoll = roll => { setLocalRoll(roll); retainRiposteRoll(p, { slot, ownerType, mode: roll.mode, faces: roll.faces }); };
  if (saved?.phase === 'accepted') return <p role="status">{riposteAcceptedText(saved.result)}</p>;
  return <>
    <p>Exact original target: {p.target.mapId}/{p.target.tokenId} · {visible ? 'currently rendered' : 'not visible/available — resolve manually'}. Price1 AP, temporary first. Parry prior payment GM-attested.</p>
    <fieldset disabled={busy || p.status !== 'ready' || !!saved?.roll}><legend>Retained weapon roll — no proficiency roll added</legend>
      <label>Weapon slot<select value={slot} onChange={e => setSlot(e.target.value)}><option value="mainHand">Main hand</option><option value="ranged">Ranged</option></select></label>
      {support.needsType && <label>Actual weapon type<input value={ownerType} onChange={e => setOwnerType(e.target.value)} /></label>}
      <p>{support.supported ? `${support.weapon.name}, d${support.weapon.die}. Formula/mitigation GM-adjudicated.` : support.reason}</p>
      <label>Physical weapon faces<input value={faces} onChange={e => setFaces(e.target.value)} /></label>
      <button type="button" disabled={!support.supported || support.needsType || !!localRoll} onClick={() => perform(() => keepRoll({ mode: 'physical', faces: faces.trim().split(/[\s,]+/).map(Number) }))}>Record physical Riposte faces</button>
      <button type="button" disabled={!support.supported || support.needsType || !!localRoll} onClick={() => perform(() => keepRoll(digitalRiposteRoll(support.weapon.die)))}>Roll digital Riposte once</button>
      {localRoll && !saved?.roll && <button type="button" onClick={() => perform(() => keepRoll(localRoll))}>Retain the same unsaved faces</button>}
    </fieldset>
    {(saved?.roll || localRoll) && <p>Retained {(saved?.roll || localRoll).mode} faces: {(saved?.roll || localRoll).faces.join(', ')}. Revalidation never rerolls them.</p>}
    {saved?.approval && <p>Execution consent: {saved.phase}. This says nothing about manual fees or prior tabletop execution.</p>}
    <button type="button" disabled={busy || !visible || !saved?.roll || p.status !== 'ready' || (saved?.approval && !['withdrawn', 'declined', 'revalidated', 'refused'].includes(saved.phase))}
      onClick={() => perform(() => approveRiposte(p))}>Approve exact target and1 AP Riposte</button>
    {saved?.approval && <><button type="button" disabled={busy} onClick={() => perform(() => checkRiposteApproval(p.id))}>Check exact Riposte approval</button>
      <button type="button" disabled={busy} onClick={() => perform(() => withdrawRiposte(p.id))}>Withdraw execution consent</button></>}
  </>;
}
function GMExecution({ p, perform, busy }) {
  const state = useRiposteStore(), entry = state.pending.find(e => e.approval.opportunityId === p.id), saved = state.saved?.gm?.[p.id];
  const [outcome, setOutcome] = useState(''), [amount, setAmount] = useState(''), [confirmed, setConfirmed] = useState(false);
  const unknown = saved?.command && !['accepted', 'refused', 'reconciled'].includes(saved.phase);
  return <>
    <details><summary>Private structured parent attestation</summary><p>Attack {p.attack?.id}; Parry {p.parry?.id}; {p.parry?.note}</p><p>Receipt reference {p.paymentReference || 'none'}; payment remains GM-attested.</p></details>
    {saved?.phase === 'accepted' ? <p role="status">{riposteAcceptedText(saved.result)}</p> : <>
      {entry && <form onSubmit={e => { e.preventDefault(); perform(() => executeRiposte(entry, { outcome, amount: Number(amount), confirmed })); }}>
        <p>Owner approved exactly1 AP and this target. {entry.approval.roll.mode} faces {entry.approval.roll.faces.join(', ')}; no basic-strike formula applied.</p>
        <fieldset disabled={busy || unknown}><legend>Current GM adjudication</legend>
          <label>Riposte hit or miss<select required value={outcome} onChange={e => setOutcome(e.target.value)}><option value="">GM chooses</option><option value="hit">Hit</option><option value="miss">Paid miss</option></select></label>
          <label>GM final Riposte damage<input required type="number" min="0" max="100000" value={amount} onChange={e => setAmount(e.target.value)} /></label>
          <label><input required type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />I adjudicate current eligibility, hit/miss, arithmetic and mitigation; only AP/HP is applied.</label>
          <button type="submit">Execute approved Riposte —1 AP and HP once</button>
        </fieldset>
      </form>}
      {saved?.command && <><p>Prepared command: {saved.phase} {saved.result?.code || ''}</p><button type="button" disabled={busy} onClick={() => perform(() => checkRiposteCommand(p.id))}>Check same Riposte command</button></>}
      <button type="button" disabled={busy || unknown || ['consumed', 'cancelled', 'collecting'].includes(p.status)} onClick={() => perform(() => controlRiposte(p))}>Revalidate for retained roll / new consent</button>
      <button type="button" disabled={busy || p.status === 'consumed'} onClick={() => perform(() => controlRiposte(p, true))}>Cancel Riposte opportunity / manual takeover</button>
    </>}
  </>;
}
export default function RiposteHost() {
  const socket = useGameStore(s => s.multiplayerSocket), roomId = useGameStore(s => s.multiplayerRoom?.id), gm = useGameStore(s => s.isGMMode);
  const uid = useAuthStore(s => s.user?.uid), selected = useCharacterStore(s => s.currentCharacterId), state = useRiposteStore();
  const [gateVersion, setGateVersion] = useState(0), [show, setShow] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [formVersion, setFormVersion] = useState(0), opener = useRef(null);
  const generation = getBootstrapGateState().accountGeneration;
  useEffect(() => subscribeBootstrapGate(() => setGateVersion(v => v + 1)), []);
  useEffect(() => { if (socket && roomId && uid && !isPrivateProjectionIsolated()) return bindRiposte(socket); }, [socket, roomId, uid, selected, gm, generation, gateVersion]);
  const collecting = state.opportunities.some(p => p.status === 'collecting');
  useEffect(() => { if (!collecting) return; const t = setInterval(refreshRiposte, 1000); return () => clearInterval(t); }, [collecting]);
  const perform = async fn => { setBusy(true); setError(''); try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  if (!socket || !roomId || !uid || isPrivateProjectionIsolated() || state.principal !== reactionPrincipal()) return null;
  if (!gm && !state.opportunities.length && !state.saved?.owner) return null;
  return <>
    <button ref={opener} className="rp-open" type="button" onClick={() => setShow(true)}>Riposte execution — structured opportunity</button>
    {show && createPortal(<section className="rw-panel rp-dialog" role="dialog" aria-modal="false" aria-label="Universal Riposte execution">
      <h3>Universal Riposte ·1 AP · one original attacker</h3>
      <button type="button" onClick={() => { setShow(false); requestAnimationFrame(() => opener.current?.focus()); }}>Close Riposte panel</button>
      <p>Parry success/prior payment is GM-attested, not charged again. Declaring/closing a window executes nothing. A fresh follow-up choice is required.</p>
      <p>{UNAPPLIED}</p>
      {error && <p role="alert">{error}</p>}{state.status && <p role="status">{state.status}</p>}
      <button type="button" disabled={busy} onClick={() => perform(refreshRiposte)}>Refresh Riposte status — no replay</button>
      {gm && <><AttestForm key={formVersion} {...{ busy, perform }} /><button type="button" disabled={busy} onClick={() => setFormVersion(v => v + 1)}>Prepare another parent attestation</button></>}
      {state.opportunities.map(p => <article key={p.id} className="rw-card" aria-label={`Riposte opportunity ${p.id.slice(0, 8)}`}><h4>Riposte {p.id.slice(0, 8)} · {p.status}</h4>
        <p>Follow-up {p.windowId.slice(0, 8)} · {p.parryPayment}</p>
        {gm ? <GMExecution {...{ p, busy, perform }} /> : <OwnerAttempt {...{ p, busy, perform }} />}
      </article>)}
      {Object.entries(state.saved?.gm || {}).filter(([id, record]) => record.command && !state.opportunities.some(p => p.id === id)).map(([id, record]) =>
        <div key={id}><p>Retained previous-runtime command — {record.phase}; no opportunity recreated.</p><button type="button" disabled={busy} onClick={() => perform(() => checkRiposteCommand(id))}>Check retained command {id.slice(0, 8)}</button></div>)}
    </section>, document.body)}
  </>;
}
