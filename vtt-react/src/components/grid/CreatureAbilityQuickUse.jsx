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
import { featherContext, loadLatestFeather, retainLatestFeather, consumeFeatherReceipt, unsentFeatherRoll } from '../../services/featherSlashCustody';
import useTargetingStore from '../../store/targetingStore';
import { withDiscarded } from '../../services/targetPick';
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
  const pickingFeather = useTargetingStore(state => state.pickSession?.id === 'p8-feather'), startTargetPick = useTargetingStore(state => state.startTargetPick);
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
    // P12C-B1 §2: closing never discards an unsent recorded roll; reopening restores it.
    if (draftRef.current?.roll && !draftRef.current.command && current()) {
      try { retainLatestFeather(origin.current.context, { ...draftRef.current, phase: 'draft' }); } catch (_) { /* retained memory copy stays authoritative */ }
    }
    useTargetingStore.getState().cancelTargetPickFor('p8-feather');
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
    // While picking on the map the dialog is not rendered; Esc belongs to the pick overlay.
    if (!dialogOpen || pickingFeather) return undefined;
    const previous = document.activeElement;
    panelRef.current?.querySelector('button')?.focus();
    const keys = event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
      if (event.key !== 'Tab') return;
      if (!panelRef.current) return;
      const controls = [...panelRef.current.querySelectorAll('button, input, select, textarea')].filter(element => !element.disabled);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', keys, true);
    return () => { window.removeEventListener('keydown', keys, true); if (previous?.isConnected) previous.focus(); };
  }, [dialogOpen, pickingFeather, close]);
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
    // P12C-B1 §2: an unsent recorded roll (a draft, one closed before this slice, or a refused command) is restored
    // for the same source and authored ability; it never moves to another source or ability.
    const unsent = unsentFeatherRoll(retained);
    if (unsent && sameExactRef(unsent.sourceRef, sourceRef) && canonical(unsent.raw) === origin.current.rawIdentity &&
      supportsFeatherSlash(raw, token?.creatureId)) { update({ ...unsent, supported: true }); return; }
    update({ raw: raw && JSON.parse(JSON.stringify(raw)), mapped, supported: supportsFeatherSlash(raw, token?.creatureId) && context.current(), sourceRef, targetRef: null, roll: null, faces: ['', ''], adjudicated: false, finalInput: '', reason: '', phase: 'draft', elsewhere: unsent || null });
  };
  const select = value => {
    if (!draftRef.current) return;
    const candidate = [...creatures, ...characters].find(item => `${refOf(item)?.kind || (item.character ? 'character' : 'creature')}:${item.id}` === value && item.mapId === mapId);
    const targetRef = refOf(candidate);
    // P12C-B1 §2: a recorded roll is never cleared by a target change; the new target's revision is recorded.
    const kept = draftRef.current.roll ? { targetRevision: candidate?.state?.actorContract?.revision ?? null } : { roll: null, faces: ['', ''] };
    const next = { ...draftRef.current, targetKey: value, targetRef, ...kept, adjudicated: false, finalInput: '', reason: '', command: null, phase: 'draft' };
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
      if (d.elsewhere) throw Error('A recorded roll for another source or ability is retained. Discard it explicitly first.');
      const roll = physical ? recordedFaces('physical', d.faces.map(numericInput)) : digitalFaces();
      update(retainLatestFeather(origin.current.context, { ...d, roll, sourceRevision: source.state.actorContract.revision, targetRevision: target.state.actorContract.revision, finalInput: '', adjudicated: false })); setError('');
    } catch (err) { setError(err.message); }
  };
  /** Explicit discard: the faces stay listed on this device (last five). */
  const discard = () => {
    try {
      if (!current()) throw Error('Owner/room/map changed; open a current action.');
      const d = draftRef.current, gone = d?.elsewhere || d;
      if (!gone?.roll || gone.command) return;
      const prior = loadLatestFeather(origin.current.context);
      const entry = { context: { kind: 'feather' }, label: `Feather Slash · ${gone.sourceRef?.tokenId || 'source'}`, roll: gone.roll };
      retainLatestFeather(origin.current.context, { phase: 'discarded', discardedRolls: withDiscarded(prior?.discardedRolls, entry) });
      update({ ...d, elsewhere: null, ...(d.elsewhere ? {} : { roll: null, faces: ['', ''], sourceRevision: undefined, targetRevision: undefined, adjudicated: false, finalInput: '', reason: '' }) }); setError('');
    } catch (err) { setError(err.message); }
  };
  /** GM ruling after an actor changed: the recorded roll still stands against the current revisions. */
  const restand = () => {
    try {
      if (!current()) throw Error('Owner/room/map changed; open a current action.');
      const d = draftRef.current, tokens = allTokens();
      const source = exactActor(tokens, d.sourceRef, game.multiplayerRoom?.id, mapId), target = exactActor(tokens, d.targetRef, game.multiplayerRoom?.id, mapId);
      update(retainLatestFeather(origin.current.context, { ...d, sourceRevision: source.state.actorContract.revision, targetRevision: target.state.actorContract.revision, adjudicated: false })); setError('');
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
          if (source.state.actorContract.revision !== d.sourceRevision || target.state.actorContract.revision !== d.targetRevision) throw Error('Actor changed after recording. Nothing submitted. Review, then confirm the recorded roll still stands, or discard it explicitly.');
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
  const picking = pickingFeather;
  const pick = () => startTargetPick({ id: 'p8-feather', label: 'Feather Slash', sourceRef: draft.sourceRef, candidates: candidates.map(item => refOf(item)).filter(Boolean).filter(value => !sameExactRef(value, draft.sourceRef)),
    rangeFeet: 10, rangeLabel: 'card range melee 10 ft (authored)', reasonFor: value => sameExactRef(value, draft.sourceRef) ? 'Choose a distinct target.' : 'Not an exact bound token on this map.',
    onPick: value => select(`${value.kind}:${value.tokenId}`), onCancel: () => {} });
  const accepted = draft?.result?.success && current() ? draft.result : displayContext.current?.current() ? displayed : null;
  const dialog = draft && originIsCurrent() && !picking ? draft.supported ? createPortal(<div className="creature-ability-confirm-overlay" onMouseDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()}>
    <div ref={panelRef} className="creature-ability-confirm-dialog feather-dialog" role="dialog" aria-modal="true" aria-label="Feather Slash adjudication">
      <div className="ability-confirm-header"><h3>Feather Slash</h3><button className="ability-confirm-close" disabled={busy} onClick={close} aria-label="Close Feather Slash">Close</button></div>
      <div className="ability-confirm-content">
        <p>Branvig · grimmstalk_feather_slash · {draft.raw?.spellType} / {draft.raw?.typeConfig?.castTimeType}<br />Single enemy · melee 10 ft · somatic · 1 AP / 0 mana · 2d8 + 5 slicing · DICE · cooldown 0</p>
        <p>Source: {identity(draft.sourceRef)}</p>
        {!draft.command && <>
          <label>Feather Slash target <select aria-label="Feather Slash target" value={draft.targetKey || ''} disabled={busy} onChange={event => select(event.target.value)}><option value="">Select one explicit target</option>{candidates.map(item => <option key={`${item.character ? 'character' : 'creature'}:${item.id}`} value={`${refOf(item)?.kind || (item.character ? 'character' : 'creature')}:${item.id}`}>{item.state?.customName || item.character?.name || item.name || item.id} · {item.id}{!refOf(item) ? ' · unbound' : ''}</option>)}</select></label>
          <button type="button" className="ability-confirm-btn" disabled={busy || !draft.sourceRef} onClick={pick}>Pick on map</button>
          <p>Target: {identity(draft.targetRef)}</p><p>{geometry}</p>
          {draft.elsewhere && <section role="alert"><p>An unsent recorded roll [{draft.elsewhere.roll.faces.join(', ')}] is retained for {identity(draft.elsewhere.sourceRef)}. It never moves to another source or ability: open that Feather Slash to use it, or discard it explicitly.</p><button type="button" className="ability-confirm-btn" disabled={busy} onClick={discard}>Discard recorded roll</button></section>}
          {draft.elsewhere ? null : !draft.roll ? <fieldset disabled={busy}><legend>Record one result after selecting the target</legend><button onClick={() => record(false)}>Roll two d8 once</button><div className="feather-faces">{draft.faces.map((value, index) => <label key={index}>Physical d8 face {index + 1}<input type="text" inputMode="numeric" value={value} onChange={event => update({ ...draft, faces: draft.faces.map((face, i) => i === index ? event.target.value : face) })} /></label>)}</div><button onClick={() => record(true)}>Record physical faces</button></fieldset> : <p>{draft.roll.mode} recorded faces [{draft.roll.faces.join(', ')}] + 5 = {draft.roll.total}. This result is retained, also through target changes.</p>}
          {draft.roll && <p role="status">{draft.custody} · recorded draft, no accepted cost or damage.</p>}
          {draft.roll && <div className="feather-roll-actions"><button type="button" className="ability-confirm-btn" disabled={busy || !draft.targetRef} onClick={restand}>Actors changed — recorded roll still stands</button><button type="button" className="ability-confirm-btn" disabled={busy} onClick={discard}>Discard recorded roll</button></div>}
          {!!loadLatestFeather()?.discardedRolls?.length && <details><summary>Discarded unsent rolls on this device ({loadLatestFeather().discardedRolls.length})</summary><ul>{loadLatestFeather().discardedRolls.map((d, i) => <li key={i}>{d.label}: [{d.roll.faces.join(', ')}]</li>)}</ul></details>}
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
        {['refused', 'accepted'].includes(draft.phase) && <button className="ability-confirm-btn confirm" disabled={busy} onClick={() => {
          // P12C-B1 §2: a refused command's recorded roll is kept for the new preparation (no reroll); after acceptance it is a new action.
          const keepRoll = draft.phase === 'refused' && draft.roll ? { roll: draft.roll, targetRef: draft.targetRef, targetKey: draft.targetKey, sourceRevision: draft.sourceRevision, targetRevision: draft.targetRevision } : { targetRef: null, roll: null };
          const next = { raw: draft.raw, mapped: draft.mapped, supported: true, sourceRef: refOf(allTokens().find(item => item.id === tokenId && item.mapId === mapId)), faces: ['', ''], adjudicated: false, finalInput: '', reason: '', phase: 'draft', ...keepRoll };
          try { update(keepRoll.roll ? retainLatestFeather(origin.current.context, next) : next); setError(''); } catch (err) { setError(err.message); } }}>{draft.phase === 'refused' && draft.roll ? 'Prepare again with the recorded roll' : 'Start new preparation'}</button>}
        {draft.phase !== 'refused' && <button className="ability-confirm-btn confirm" disabled={busy || (!draft.command && !draft.roll)} onClick={confirm}>{busy ? 'Pending acceptance…' : draft.command ? 'Check same Feather Slash command' : 'Confirm adjudicated Feather Slash'}</button>}
      </div>
    </div></div>, document.body) : <CreatureAbilityConfirmDialog isOpen creatureName={token?.state?.customName || creature?.name} ability={draft.mapped} noticeOnly onCancel={close} onConfirm={() => {
      const chat = require('../../store/chatStore').default.getState();
      chat.addNotification('combat', { type: 'combat', content: `${token?.state?.customName || creature?.name}: ${draft.mapped?.name} — manual notice only / no target consequence. Use manual resource controls for adjudicated costs and outcomes.` }); close();
    }} /> : null;
  return { open, dialog: <>{dialog}{!draft && accepted && createPortal(<aside className="feather-result-toast"><FeatherSlashResult result={accepted} /><button onClick={() => { dismissedReceipt.current = receiptKey(accepted); setDisplayed(null); }}>Dismiss result</button></aside>, document.body)}</> };
}
