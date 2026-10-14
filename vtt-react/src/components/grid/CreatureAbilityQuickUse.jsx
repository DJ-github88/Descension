import React, { useState, useRef, useEffect, useSyncExternalStore, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useMapStore from '../../store/mapStore';
import { getBootstrapGateState, subscribeBootstrapGate } from '../../persistence/bootstrapPrivacyGate';
import CreatureAbilityConfirmDialog from './CreatureAbilityConfirmDialog';
import { refOf, refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand } from '../../services/actorConsequenceService';
import { canonical, supportsFeatherSlash, exactActor, sameExactRef, planFeatherSlash, digitalFaces, recordedFaces, rangeDiagnostic, featherReceipt } from '../../services/featherSlash';
import { featherContext, loadLatestFeather, retainLatestFeather, consumeFeatherReceipt } from '../../services/featherSlashCustody';
import './CreatureAbilityQuickUse.css';

const allTokens = () => [...useCreatureStore.getState().creatureTokens, ...useCharacterTokenStore.getState().characterTokens];
const numericInput = value => typeof value === 'string' && value.trim() && /^\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : NaN;
const identity = ref => ref ? `${ref.kind} · ${ref.roomId}/${ref.mapId}/${ref.tokenId} · incarnation ${ref.instanceId}${ref.ownerUid ? ` · owner ${ref.ownerUid} / character ${ref.characterId}` : ''}` : 'Unbound — use Actor attachment controls to bind explicitly.';
const receiptKey = result => result?.receipt && JSON.stringify([featherContext().uid, result.receipt.roomId, result.receipt.submitterUid, result.receipt.commandId]);

export function FeatherSlashResult({ result }) {
  const view = featherReceipt(result);
  if (!view) return null;
  return <section className="feather-result" aria-label="Accepted Feather Slash result">
    <h4>Feather Slash — accepted receipt</h4>
    <p>{view.recorded.sourceName} → {view.recorded.targetName}</p>
    <p>{view.recorded.mode} dice: [{view.recorded.faces.join(', ')}] + 5 = {view.recorded.total}. GM final: {view.receipt.adjudication.finalAmount} slicing.</p>
    <p>{view.receipt.adjudication.adjustmentReason || 'GM confirmed the recorded total.'}</p>
    <p>Source AP {view.source.finalResources.ap.current} + temp {view.source.finalResources.ap.temp}; target HP {view.target.finalResources.hp.current} + temp {view.target.finalResources.hp.temp}.</p>
    <p>{identity(view.receipt.source)}<br />{identity(view.receipt.target)}</p>
    <p role="status">{view.status}{view.receipt.checkpointRevision !== null ? ` · checkpoint revision ${view.receipt.checkpointRevision}` : ' · no checkpoint / no crash durability'}</p>
    <small>Already resolved · {view.receipt.commandId}. Checking this receipt is not another attack.</small>
  </section>;
}

/** Only quick-use control extracted from CreatureToken. Manual resource controls
 * stay with the token; unsupported quick-use is explicitly notice-only. */
export default function useCreatureAbilityQuickUse({ tokenId, creature, token }) {
  const [draft, setDraft] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const draftRef = useRef(null), flight = useRef(null), origin = useRef(null);
  const panelRef = useRef(null);
  const displayContext = useRef(null);
  const dismissedReceipt = useRef(null);
  const gate = useSyncExternalStore(subscribeBootstrapGate, getBootstrapGateState);
  const outcome = useGameStore(state => state.actorConsequenceStatus);
  const game = useGameStore();
  const creatures = useCreatureStore(state => state.creatureTokens), characters = useCharacterTokenStore(state => state.characterTokens);
  const mapId = useMapStore(state => state.currentMapId);
  const [displayed, setDisplayed] = useState(null);
  const update = useCallback(next => { draftRef.current = next; setDraft(next); }, []);
  const originIsCurrent = useCallback(() => origin.current && origin.current.mapId === useMapStore.getState().currentMapId &&
    origin.current.generation === getBootstrapGateState().accountGeneration && origin.current.context.uid === featherContext().uid &&
    origin.current.context.roomId === useGameStore.getState().multiplayerRoom?.id, []);
  const current = useCallback(() => originIsCurrent() && origin.current.context.current(), [originIsCurrent]);
  const close = useCallback(() => {
    if (flight.current) return;
    if (draftRef.current?.roll && !draftRef.current.command && current()) retainLatestFeather(origin.current.context, { ...draftRef.current, phase: 'cancelled' });
    update(null); setError('');
  }, [current, update]);
  useEffect(() => {
    if (origin.current && !originIsCurrent()) {
      update(null); setError(''); setBusy(false); origin.current = null;
    }
    if (displayContext.current && !displayContext.current.current()) setDisplayed(null);
    const view = consumeFeatherReceipt(outcome);
    const pendingDraft = draftRef.current;
    if (view && current() && pendingDraft?.command?.commandId === view.receipt.commandId && canonical(pendingDraft.result) !== canonical(outcome)) {
      update({ ...pendingDraft, phase: 'accepted', result: outcome });
    }
    if (view && sameExactRef(view.receipt.source, refOf(token)) && dismissedReceipt.current !== receiptKey(outcome)) { displayContext.current = featherContext(); setDisplayed(outcome); }
    if (!view) {
      const retained = loadLatestFeather();
      if (sameExactRef(featherReceipt(retained?.result)?.receipt.source, refOf(token)) && dismissedReceipt.current !== receiptKey(retained.result)) { displayContext.current = featherContext(); setDisplayed(retained.result); }
    }
  }, [outcome, tokenId, token, mapId, gate, game.multiplayerRoom?.id, game.isInMultiplayer, current, originIsCurrent, update]);
  const dialogOpen = !!draft?.supported && originIsCurrent();
  useEffect(() => {
    if (!dialogOpen) return undefined;
    const previous = document.activeElement;
    panelRef.current?.querySelector('button')?.focus();
    const keys = event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
      if (event.key !== 'Tab') return;
      const controls = [...panelRef.current.querySelectorAll('button, input, select, textarea')].filter(element => !element.disabled);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', keys, true);
    return () => { window.removeEventListener('keydown', keys, true); if (previous?.isConnected) previous.focus(); };
  }, [dialogOpen, close]);
  const open = (mapped, _rollText, raw) => {
    if (flight.current) return;
    setError('');
    const context = featherContext(), sourceRef = refOf(token);
    origin.current = { context, mapId, generation: gate.accountGeneration, rawIdentity: canonical(raw), sourceRef };
    const retained = loadLatestFeather(context);
    if (retained?.command && ['prepared', 'unknown'].includes(retained.phase) && !sameExactRef(retained.command.source, sourceRef)) {
      update({ ...retained, raw, supported: true, sourceRef: retained.command.source, targetRef: retained.command.target });
      setError('An unresolved Feather Slash is retained for the displayed source. Only check that same command; no new action or UUID.'); return;
    }
    if (retained?.command && retained.command.source?.tokenId === tokenId && (['prepared', 'unknown'].includes(retained.phase) ||
      (retained.phase === 'accepted' && supportsFeatherSlash(raw, token?.creatureId)))) {
      update({ ...retained, raw, supported: true, sourceRef: retained.command.source, targetRef: retained.command.target }); return;
    }
    if (retained?.phase === 'draft' && sameExactRef(retained.sourceRef, sourceRef) && canonical(retained.raw) === origin.current.rawIdentity &&
      supportsFeatherSlash(raw, token?.creatureId)) { update({ ...retained, supported: true }); return; }
    update({ raw: raw && JSON.parse(JSON.stringify(raw)), mapped, supported: supportsFeatherSlash(raw, token?.creatureId) && context.current(), sourceRef, targetRef: null, roll: null, faces: ['', ''], adjudicated: false, finalInput: '', reason: '', phase: 'draft' });
  };
  const select = value => {
    const candidate = [...creatures, ...characters].find(item => `${refOf(item)?.kind || (item.character ? 'character' : 'creature')}:${item.id}` === value && item.mapId === mapId);
    const targetRef = refOf(candidate);
    const next = { ...draftRef.current, targetKey: value, targetRef, roll: null, faces: ['', ''], adjudicated: false, finalInput: '', reason: '', command: null, phase: 'draft' };
    try { update(draftRef.current.roll ? retainLatestFeather(origin.current.context, next) : next); setError(''); }
    catch (err) { setError(err.message); }
  };
  const record = physical => {
    try {
      if (!current()) throw Error('Owner/room/map changed; open a current action.');
      const d = draftRef.current, tokens = allTokens();
      const source = exactActor(tokens, d.sourceRef, game.multiplayerRoom?.id, mapId), target = exactActor(tokens, d.targetRef, game.multiplayerRoom?.id, mapId);
      if (sameExactRef(d.sourceRef, d.targetRef)) throw Error('Choose a distinct target.');
      if (d.roll) return;
      const roll = physical ? recordedFaces('physical', d.faces.map(numericInput)) : digitalFaces();
      update(retainLatestFeather(origin.current.context, { ...d, roll, sourceRevision: source.state.actorContract.revision, targetRevision: target.state.actorContract.revision, finalInput: '', adjudicated: false })); setError('');
    } catch (err) { setError(err.message); }
  };
  const confirm = () => {
    if (flight.current) return flight.current;
    const context = origin.current?.context;
    flight.current = Promise.resolve().then(async() => {
      setBusy(true); setError('');
      try {
        if (!current()) throw Error('Owner/room/map changed; open a current action.');
        if (!useGameStore.getState().isGMMode) throw Error('Current GM adjudication required.');
        let d = draftRef.current;
        if (d.command) {
          // A current correlated read restores projection admission after rejoin
          // or principal-generation changes. It never rebases the retained command.
          const snapshot = await refreshActorSnapshot();
          if (!current()) return;
          if (!snapshot.success) throw Error(`${snapshot.code || snapshot.error} — use the existing attachment/reconciliation controls, then check the same command.`);
        }
        if (!d.command) {
          const snapshot = await refreshActorSnapshot();
          if (!current()) return;
          if (!snapshot.success) throw Error(snapshot.code || snapshot.error);
          d = draftRef.current;
          const tokens = allTokens(), source = exactActor(tokens, d.sourceRef, context.roomId, mapId), target = exactActor(tokens, d.targetRef, context.roomId, mapId);
          if (source.state.actorContract.revision !== d.sourceRevision || target.state.actorContract.revision !== d.targetRevision) throw Error('Actor changed after recording; explicitly start a new preparation. Nothing submitted.');
          const liveRaw = useCreatureStore.getState().creatures.find(c => c.id === source.creatureId)?.abilities?.find(a => a.id === d.raw.id);
          if (canonical(liveRaw) !== origin.current.rawIdentity) throw Error('Authored source changed; explicitly start a new preparation.');
          const plan = planFeatherSlash({ raw: d.raw, sourceRef: d.sourceRef, targetRef: d.targetRef, tokens, roomId: context.roomId, mapId, roll: d.roll, adjudicated: d.adjudicated, finalAmount: numericInput(d.finalInput), reason: d.reason, geometry: rangeDiagnostic(source, target, game.gridSize, game.feetPerTile) });
          d = retainLatestFeather(context, { ...d, command: prepareActorCommand(plan.entries, plan.extra), phase: 'prepared' }); update(d);
        }
        // Persist submission intent before emitting. After this point, Close is
        // never an undo, and reload/rejoin only checks these exact command bytes.
        d = retainLatestFeather(context, { ...d, phase: 'unknown' }); update(d);
        const result = await submitPreparedActorCommand(d.command);
        if (!current()) return;
        // A retired socket delivery says nothing about server acceptance. The
        // current owner/room must check these same bytes, never replace them.
        const phase = result.success ? 'accepted' : ['outcome_unknown', 'room_connection_unavailable', 'snapshot_required', 'retired_principal'].includes(result.code) ? 'unknown' : 'refused';
        const settled = retainLatestFeather(context, { ...d, phase, result }); update(settled);
        if (result.success) { consumeFeatherReceipt(result); displayContext.current = context; setDisplayed(result); }
        else setError(`${result.code || result.error}${phase === 'unknown' ? ' — check the same command; no undo or automatic replay. Unknown lost runtime work needs manual reconciliation.' : ' — nothing accepted; explicitly start a new preparation.'}`);
      } catch (err) { if (current()) setError(err.message); }
      finally { if (context?.current()) setBusy(false); flight.current = null; }
    });
    return flight.current;
  };
  let geometry = 'Geometry/calibration unavailable — GM adjudication required.';
  if (draft?.targetRef) {
    try { geometry = rangeDiagnostic(exactActor(allTokens(), draft.sourceRef, game.multiplayerRoom?.id, mapId), exactActor(allTokens(), draft.targetRef, game.multiplayerRoom?.id, mapId), game.gridSize, game.feetPerTile); } catch (_) { /* visible binding identity remains diagnostic */ }
  }
  const candidates = [...creatures, ...characters].filter(item => item.mapId === mapId);
  const accepted = draft?.result?.success && current() ? draft.result : displayContext.current?.current() ? displayed : null;
  const dialog = draft && originIsCurrent() ? draft.supported ? createPortal(<div className="creature-ability-confirm-overlay" onMouseDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()}>
    <div ref={panelRef} className="creature-ability-confirm-dialog feather-dialog" role="dialog" aria-modal="true" aria-label="Feather Slash adjudication">
      <div className="ability-confirm-header"><h3>Feather Slash</h3><button className="ability-confirm-close" disabled={busy} onClick={close} aria-label="Close Feather Slash">Close</button></div>
      <div className="ability-confirm-content">
        <p>Branvig · grimmstalk_feather_slash · {draft.raw?.spellType} / {draft.raw?.typeConfig?.castTimeType}<br />Single enemy · melee 10 ft · somatic · 1 AP / 0 mana · 2d8 + 5 slicing · DICE · cooldown 0</p>
        <p>Source: {identity(draft.sourceRef)}</p>
        {!draft.command && <>
          <label>Feather Slash target <select aria-label="Feather Slash target" value={draft.targetKey || ''} disabled={busy} onChange={event => select(event.target.value)}><option value="">Select one explicit target</option>{candidates.map(item => <option key={`${item.character ? 'character' : 'creature'}:${item.id}`} value={`${refOf(item)?.kind || (item.character ? 'character' : 'creature')}:${item.id}`}>{item.state?.customName || item.character?.name || item.name || item.id} · {item.id}{!refOf(item) ? ' · unbound' : ''}</option>)}</select></label>
          <p>Target: {identity(draft.targetRef)}</p><p>{geometry}</p>
          {!draft.roll ? <fieldset disabled={busy}><legend>Record one result after selecting the target</legend><button onClick={() => record(false)}>Roll two d8 once</button><div className="feather-faces">{draft.faces.map((value, index) => <label key={index}>Physical d8 face {index + 1}<input type="text" inputMode="numeric" value={value} onChange={event => update({ ...draft, faces: draft.faces.map((face, i) => i === index ? event.target.value : face) })} /></label>)}</div><button onClick={() => record(true)}>Record physical faces</button></fieldset> : <p>{draft.roll.mode} recorded faces [{draft.roll.faces.join(', ')}] + 5 = {draft.roll.total}. This result is retained; changing target invalidates preparation.</p>}
          {draft.roll && <p role="status">{draft.custody} · recorded draft, no accepted cost or damage.</p>}
          <label><input type="checkbox" checked={draft.adjudicated} disabled={busy} onChange={event => update({ ...draft, adjudicated: event.target.checked })} /> I adjudicate enemy, range, legality, defense and mitigation as GM.</label>
          <label>GM final damage <input type="text" inputMode="decimal" value={draft.finalInput} disabled={busy} onChange={event => update({ ...draft, finalInput: event.target.value })} /></label>
          <label>Adjustment / ruling reason <textarea maxLength={2000} value={draft.reason} disabled={busy} onChange={event => update({ ...draft, reason: event.target.value })} /></label>
        </>}
        {draft.command && <p>Retained command {draft.command.commandId} · {draft.custody}. {draft.phase === 'unknown' ? 'Outcome unknown — no undo. Check this same command.' : draft.phase}</p>}
        {error && <p role="alert">{error}</p>}
        {draft.result?.success && <FeatherSlashResult result={draft.result} />}
      </div>
      <div className="ability-confirm-actions">
        <button className="ability-confirm-btn cancel" disabled={busy} onClick={close}>{draft.command ? 'Close (no undo)' : 'Cancel — no spend'}</button>
        {['refused', 'accepted'].includes(draft.phase) && <button className="ability-confirm-btn confirm" disabled={busy} onClick={() => { update({ raw: draft.raw, mapped: draft.mapped, supported: true, sourceRef: refOf(allTokens().find(item => item.id === tokenId && item.mapId === mapId)), targetRef: null, roll: null, faces: ['', ''], adjudicated: false, finalInput: '', reason: '', phase: 'draft' }); setError(''); }}>Start new preparation</button>}
        {draft.phase !== 'refused' && <button className="ability-confirm-btn confirm" disabled={busy || (!draft.command && !draft.roll)} onClick={confirm}>{busy ? 'Pending acceptance…' : draft.command ? 'Check same Feather Slash command' : 'Confirm adjudicated Feather Slash'}</button>}
      </div>
    </div></div>, document.body) : <CreatureAbilityConfirmDialog isOpen creatureName={token?.state?.customName || creature?.name} ability={draft.mapped} noticeOnly onCancel={close} onConfirm={() => {
      const chat = require('../../store/chatStore').default.getState();
      chat.addNotification('combat', { type: 'combat', content: `${token?.state?.customName || creature?.name}: ${draft.mapped?.name} — manual notice only / no target consequence. Use manual resource controls for adjudicated costs and outcomes.` }); close();
    }} /> : null;
  return { open, dialog: <>{dialog}{!draft && accepted && createPortal(<aside className="feather-result-toast"><FeatherSlashResult result={accepted} /><button onClick={() => { dismissedReceipt.current = receiptKey(accepted); setDisplayed(null); }}>Dismiss result</button></aside>, document.body)}</> };
}
