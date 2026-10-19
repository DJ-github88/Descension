import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { refOf } from '../../services/actorConsequenceService';
import { useReactionWindowStore, bindReactionWindows, openReactionWindow, changeReactionIntent, interruptReactionWindow,
  refreshReactionWindows, retryWindowRequest, advanceWindowNarration } from '../../services/reactionWindowService';
import { reactionPrincipal } from '../../services/reactionWindowService';
import { getBootstrapGateState, isPrivateProjectionIsolated } from '../../persistence/bootstrapPrivacyGate';
import { phaseLabel } from '../combat-narration-preview/narrationQueue';
import './ReactionWindowPanel.css';

const MOMENTS = ['targeting', 'before_roll', 'after_roll', 'on_hit', 'after_damage', 'follow_up'];
const words = value => value.replace(/_/g, ' ');
const key = ref => `${ref.kind}:${ref.mapId}:${ref.tokenId}:${ref.instanceId}`;
const name = token => token.character?.name || token.state?.customName || token.name || token.id;
function GMPrepare({ perform, busy, windows, epoch }) {
  const creatures = useCreatureStore(s => s.creatureTokens), characters = useCharacterTokenStore(s => s.characterTokens);
  const uid = useAuthStore(s => s.user?.uid);
  const actors = [...creatures, ...characters].filter(t => refOf(t));
  const [source, setSource] = useState(''), [audience, setAudience] = useState([]), [moment, setMoment] = useState('after_roll');
  const [causeId, setCauseId] = useState(() => crypto.randomUUID()), [occurrence, setOccurrence] = useState('1');
  const [parent, setParent] = useState(''), [none, setNone] = useState(true), [gmRef, setGmRef] = useState(''), [note, setNote] = useState('');
  const invited = actors.filter(t => refOf(t).kind === 'character' && refOf(t).ownerUid !== uid && t.state.actorContract.primary);
  const controlled = actors.filter(t => refOf(t).kind === 'creature' || refOf(t).ownerUid === uid);
  return <details className="rw-prepare"><summary>Prepare private declaration window</summary>
    <form onSubmit={e => { e.preventDefault(); perform(() => openReactionWindow({
      trigger: { causeId, occurrence, moment, basis: 'gm-manual' }, source: refOf(actors.find(t => key(refOf(t)) === source)),
      invited: invited.filter(t => audience.includes(key(refOf(t)))).map(refOf),
      gmCommit: { refs: none ? [] : [refOf(controlled.find(t => key(refOf(t)) === gmRef))], note: none ? '' : note },
      ...(parent ? { parentWindowId: parent } : {})
    })); }}>
      <p>GM-attested moment. Hold the base action manually. This collector does not validate card ownership, price or effect.</p>
      <fieldset disabled={busy}><legend>Exact opportunity</legend>
        <label>Causal action reference<input required maxLength={120} value={causeId} onChange={e => setCauseId(e.target.value)} /></label>
        <label>Occurrence<input required maxLength={120} value={occurrence} onChange={e => setOccurrence(e.target.value)} /></label>
        <label>Moment<select value={moment} onChange={e => setMoment(e.target.value)}>{MOMENTS.map(m => <option key={m} value={m}>{words(m)}</option>)}</select></label>
        <label>Trigger source<select required value={source} onChange={e => setSource(e.target.value)}><option value="">Choose exact actor</option>{actors.map(t => <option key={key(refOf(t))} value={key(refOf(t))}>{name(t)}</option>)}</select></label>
        <label>Parent closed window<select value={parent} onChange={e => setParent(e.target.value)}><option value="">None — initial opportunity</option>
          {windows.filter(w => w.status === 'closed').map(w => <option key={w.windowId} value={w.windowId}>{words(w.moment)} · {w.windowId.slice(0, 8)}</option>)}</select></label>
      </fieldset>
      <fieldset disabled={busy}><legend>GM-attested eligible owners (private)</legend>{invited.map(t => {
        const k = key(refOf(t)); return <label key={k}><input type="checkbox" checked={audience.includes(k)} onChange={e => setAudience(a => e.target.checked ? [...a, k] : a.filter(v => v !== k))} />{name(t)}</label>;
      })}</fieldset>
      <fieldset disabled={busy}><legend>GM choices — seal before players can declare</legend>
        <label><input type="checkbox" checked={none} onChange={e => setNone(e.target.checked)} />Seal no GM declarations</label>
        {!none && <><label>GM-controlled reactor<select required value={gmRef} onChange={e => setGmRef(e.target.value)}><option value="">Choose actor</option>{controlled.map(t => <option key={key(refOf(t))} value={key(refOf(t))}>{name(t)}</option>)}</select></label>
          <label>Private GM choices<textarea required maxLength={500} value={note} onChange={e => setNote(e.target.value)} /></label></>}
      </fieldset>
      <button disabled={busy || !epoch || !audience.length} type="submit">Seal GM choices and open 8 seconds</button>
    </form>
  </details>;
}
function OwnerIntent({ window: w, perform, busy, closed }) {
  const first = w.intents[0], last = first?.history.slice(-1)[0];
  const [card, setCard] = useState(first?.cardKey || ''), [note, setNote] = useState(last?.note || '');
  const input = useRef(null), current = w.intents.find(i => i.cardKey === card);
  useEffect(() => { if (w.status === 'open') input.current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <>
    <p>Your private intents only. Silence is allowed. Nothing is reserved; payment and effects remain GM-adjudicated.</p>
    <form onSubmit={e => { e.preventDefault(); perform(() => changeReactionIntent(w, { cardKey: card, label: card, note })); }}>
      <fieldset disabled={busy || closed}><legend>Private declaration</legend>
        <label>Card ID or GM-agreed reference<input ref={input} required maxLength={120} pattern={'[a-zA-Z0-9_.:\\/\\-]+'} value={card} onChange={e => setCard(e.target.value)} /></label>
        <label>Private correction / notes<textarea maxLength={500} value={note} onChange={e => setNote(e.target.value)} /></label>
        <button type="submit">{current ? 'Record private correction' : 'Declare privately'}</button>
        <button type="button" disabled={!current || current.withdrawn} onClick={() => perform(() => changeReactionIntent(w, { cardKey: card, label: card, note, withdrawn: true }))}>Withdraw current intent</button>
      </fieldset>
    </form>
    {w.intents.map(intent => { const latest = intent.history.slice(-1)[0]; return <details key={intent.cardKey}>
      <summary>{intent.cardKey}: {intent.withdrawn ? 'withdrawn from collection' : 'declared, not executed'} · revision {intent.revision}</summary>
      <button type="button" onClick={() => { setCard(intent.cardKey); setNote(latest.note); }}>Select this private intent</button>
      <ul>{intent.history.map(h => <li key={h.requestId}>Revision {h.revision}: {h.withdrawn ? 'withdrawn' : 'declared/corrected'} — {h.note || 'No notes'}</li>)}</ul>
    </details>; })}
  </>;
}
function WindowCard({ window: w, gm, perform, busy, tick }) {
  const remaining = Math.max(0, w.remainingMs - (tick - w.receivedAt)), closed = w.status !== 'open' || remaining <= 0;
  useEffect(() => { if (w.status === 'open' && remaining <= 0) refreshReactionWindows(false); }, [w.status, remaining <= 0]); // eslint-disable-line react-hooks/exhaustive-deps
  return <article className="rw-card" aria-label={`${words(w.moment)} declaration window ${w.windowId.slice(0, 8)}`}>
    <h3>{words(w.moment)} · declaration collection</h3>
    <p>Window {w.windowId.slice(0, 8)}</p>
    <p role="timer" aria-live="off">{w.status === 'open' ? `${Math.ceil(remaining / 1000)} seconds to declare${remaining <= 0 ? ' — checking server cutoff' : ''}` : words(w.status)}</p>
    <p>{w.status === 'closed' ? 'Collection closed — GM manual adjudication required. No execution or payment confirmed.' :
      w.status === 'interrupted' ? 'Collection interrupted — manual GM takeover. No cancellation or refund is implied.' :
        'Full eight-second server window. No Pass required; no normal early close.'}</p>
    {gm ? <>
      <p>GM bundle sealed and immutable. Player choices remain private until cutoff; display order is not resolution priority.</p>
      <details><summary>Your precommitted GM choices</summary><p>{w.gmCommit.note || 'Explicitly no GM declarations.'}</p></details>
      {w.status === 'open' && <button type="button" disabled={busy} onClick={() => perform(() => interruptReactionWindow(w))}>Serious interruption — manual takeover</button>}
      {w.status === 'closed' && w.review && <div aria-label="GM private review"><h4>Private review — adjudicate manually</h4>{w.review.map(intent => <details key={`${key(intent.reactor)}:${intent.cardKey}`}>
        <summary>{intent.cardKey} · {intent.withdrawn ? 'withdrawn' : 'declared only'} · {intent.reactor.tokenId}</summary>
        <ul>{intent.history.map(h => <li key={h.requestId}>Revision {h.revision}: {h.withdrawn ? 'withdrawn' : 'declared/corrected'} — {h.note}</li>)}</ul>
      </details>)}</div>}
    </> : <OwnerIntent {...{ window: w, perform, busy, closed }} />}
  </article>;
}
export default function ReactionWindowHost() {
  const socket = useGameStore(s => s.multiplayerSocket), roomId = useGameStore(s => s.multiplayerRoom?.id);
  const gm = useGameStore(s => s.isGMMode), uid = useAuthStore(s => s.user?.uid), selected = useCharacterStore(s => s.currentCharacterId);
  const state = useReactionWindowStore(), [busy, setBusy] = useState(false), [error, setError] = useState(''), [tick, setTick] = useState(performance.now());
  const [selectedWindowId, setSelectedWindowId] = useState('');
  const generation = getBootstrapGateState().accountGeneration;
  const active = state.windows.some(w => w.status === 'open');
  useEffect(() => { if (socket && roomId && uid) return bindReactionWindows(socket); }, [socket, roomId, uid, selected, gm, generation]);
  useEffect(() => { if (!active) return; const t = setInterval(() => setTick(performance.now()), 100); return () => clearInterval(t); }, [active]);
  const perform = async fn => { setBusy(true); setError(''); try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  if (!socket || !roomId || !uid || isPrivateProjectionIsolated() || state.principal !== reactionPrincipal()) return null;
  if (!socket.connected) return createPortal(<section className="rw-overlay rw-panel" role="status">Collection disconnected/unavailable — the original deadline continues. Reconnect checks status, never resubmits.</section>, document.body);
  const selectedWindow = state.windows.find(w => w.windowId === selectedWindowId) || state.windows[state.windows.length - 1];
  const windows = state.windows.filter(w => w.status === 'open');
  if (selectedWindow && selectedWindow.status !== 'open') windows.push(selectedWindow);
  return <>
    {gm && <section className="rw-panel" aria-label="GM declaration preparation"><h3>Declaration opportunities</h3><GMPrepare {...{ perform, busy, windows: state.windows, epoch: state.epoch }} /></section>}
    {(windows.length > 0 || state.status || state.pending || state.interrupted?.length > 0) && createPortal(<section className="rw-overlay rw-panel" aria-label="Private declaration collection">
      <p className="rw-boundary">Collection only — no automatic payment, reservation, roll or effect.</p>
      {state.narration.current && <div role="status" aria-live="polite"><strong>{phaseLabel(state.narration.current)}</strong><p>{state.narration.current.text}</p>
        <button type="button" onClick={advanceWindowNarration}>Dismiss announcement</button></div>}
      {state.status && <p role="status">{state.status}</p>}{error && <p role="alert">{error}</p>}
      <button type="button" disabled={busy} onClick={() => perform(() => refreshReactionWindows())}>Check collection status</button>
      {selectedWindow && <label>Retained opportunity<select value={selectedWindow.windowId} onChange={e => setSelectedWindowId(e.target.value)}>
        {state.windows.map(w => <option key={w.windowId} value={w.windowId}>{words(w.moment)} · {w.status} · {w.windowId.slice(0, 8)}</option>)}
      </select></label>}
      {state.pending && <button type="button" disabled={busy} onClick={() => perform(retryWindowRequest)}>Retry exact pending request</button>}
      {state.interrupted?.length > 0 && <details><summary>Retained unavailable requests — manual GM handling</summary>
        <p>These records were not moved into a new window. No execution, payment, cancellation or refund is confirmed.</p>
        {state.interrupted.map(item => <pre key={item.request.payload.requestId}>{JSON.stringify(item.request.payload, null, 2)}</pre>)}
      </details>}
      {windows.map(w => <WindowCard key={w.windowId} {...{ window: w, gm, perform, busy, tick }} />)}
    </section>, document.body)}
  </>;
}
