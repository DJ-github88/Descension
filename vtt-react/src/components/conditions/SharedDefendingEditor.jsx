import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useGameStore from '../../store/gameStore';
import useCreatureStore from '../../store/creatureStore';
import { getBootstrapGateState, isPrivateProjectionIsolated, subscribeBootstrapGate } from '../../persistence/bootstrapPrivacyGate';
import { findActor, refOf } from '../../services/actorConsequenceService';
import { DEFENDING, STUNNED, STRUCTURED_TIMINGS, EFFECT_PREFIX, canonical, recordsFor, stunnedRecordsFor, movementRecordsFor, expiryLabel } from '../../services/sharedConditionProfile';
import { useSharedConditionStore, conditionPrincipal, conditionKey, resolveConditionActor, refreshConditionActor,
  editDefending, editSharedCondition, checkConditionCommand, bindSharedConditions, refreshEffectLifecycle, submitTurnBoundary, checkTurnBoundary } from '../../services/sharedConditionService';
import { clock as effectClock } from '../../services/sharedEffectTiming';
import { movementSpeedBreakdown, movementBreakdownText, movementBaseSpeed } from '../../utils/conditionUtils';
import './SharedDefendingEditor.css';
import ShieldBashResultForm from './ShieldBashResultForm';

export function SharedDefendingEditor({ targetRef, identity }) {
  const pcTokens = useCharacterTokenStore(s => s.characterTokens);
  const creatureTokens = useCreatureStore(s => s.creatureTokens);
  const state = useSharedConditionStore(), [busy, setBusy] = useState(false), [error, setError] = useState(''), [sourceMode, setSourceMode] = useState('manual');
  const gm = useGameStore(s => s.isGMMode) === true;
  const library = useCreatureStore(s => s.creatures);
  const [sourceOccurrence, setSourceOccurrence] = useState(''), [timing, setTiming] = useState('manual'), [sourceRefText, setSourceRefText] = useState('');
  const ref = resolveConditionActor({ targetRef, identity }), key = ref && conditionKey(ref);
  const identityKey = canonical([targetRef || null, identity || null]);
  useEffect(() => { setError(''); setSourceMode('manual'); setSourceOccurrence(''); setSourceRefText(''); setTiming('manual'); }, [identityKey]);
  useEffect(() => { if (ref && state.principal === conditionPrincipal() && !isPrivateProjectionIsolated()) refreshConditionActor(ref); }, [key, state.principal]); // eslint-disable-line react-hooks/exhaustive-deps
  if (isPrivateProjectionIsolated() || state.principal !== conditionPrincipal()) return <p role="status">Shared conditions unavailable while the room/account is reconciling.</p>;
  if (!ref) return <p role="status">No exact primary room PC for this view. Bind/select that actor; no open-character or first-token fallback.</p>;
  const view = state.views[key], ready = view?.phase === 'ready';
  const records = ready ? recordsFor(findActor(ref)) : [], stuns = ready ? stunnedRecordsFor(findActor(ref)) : [], moves = ready ? movementRecordsFor(findActor(ref)) : [];
  const entry = state.saved?.entries?.[key], unknown = entry?.command && !['accepted', 'failed'].includes(entry.phase);
  const perform = async fn => { setBusy(true); setError(''); try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <section className="sc-editor" aria-label="Shared PC Defending">
    {ref.kind === 'character' && <><h3>{DEFENDING.name} · PC blocking</h3>
    <p>Exact target: {ref.mapId}/{ref.tokenId} · character {ref.characterId}</p>
    <p>{DEFENDING.description}</p><p>Until your next turn. The exact automatic schedule or GM-managed instruction is shown on each instance below.</p>
    <p>Manual state correction only. This does not execute Defend, spend or verify its 1 AP, or run an expiry lifecycle.</p>
    <p role="status">{!ready ? `Current room state: ${view?.phase || 'loading'}. Active state not confirmed.` :
      records.length ? 'Current room state: Active — accepted Defending.' : 'Current room state: Inactive.'}</p>
    {entry && <p>Last command: {entry.phase}{entry.phase === 'unknown' ? ' — not confirmed; check the same retained command.' : ''}</p>}
    {view?.outcome && <p role="status">{view.outcome}</p>}{error && <p role="alert">{error}</p>}
    <label>Source attribution<select value={sourceMode} onChange={e => setSourceMode(e.target.value)} disabled={busy || unknown}>
      <option value="manual">Manual correction — no acting source claimed</option><option value="self-defend">Resolved self Defend — source is this exact PC</option>
    </select></label>
    <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editDefending(ref, 'add', { sourceMode }))}>Apply PC Defending</button>
    {records.map((record, index) => <div key={record.recordId || record.id || index}><p>Condition instance: {record.recordId || record.id || 'missing ID — reconcile manually'}</p><p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
      <button type="button" disabled={busy || unknown || (!record.recordId && !record.id)} onClick={() => perform(() => editDefending(ref, 'remove', { recordId: record.recordId || record.id }))}>Remove Defending instance {record.recordId || record.id}</button></div>)}</>}
    <section aria-label="Shared Stunned">
      <h3>Stunned · shared restrictions</h3><p>Exact target: {ref.mapId}/{ref.tokenId}</p>
      <p>{STUNNED.description}</p><p>{STUNNED.manualLabel}</p>
      <p>The default GM-removal instruction applies only when no automatic schedule is shown below. Existing and unsupported instances remain GM-managed.</p>
      <p>Apply only after the table resolves the source, price and any initial save. This editor does not execute Shield Bash or critical effects.</p>
      <p role="status">{!ready ? 'Stunned state unconfirmed — refresh accepted room state.' : stuns.length ? 'Stunned active: supported actions/reactions and player voluntary movement refused.' : 'Stunned inactive.'}</p>
      {entry && <p>Condition command: {entry.phase}</p>}{view?.outcome && <p role="status">{view.outcome}</p>}{error && <p role="alert">{error}</p>}
      <label>Source occurrence reference<input maxLength={160} value={sourceOccurrence} onChange={e => setSourceOccurrence(e.target.value)} disabled={busy || unknown} placeholder="e.g. exchange 4 / hammer critical 1" /></label>
      <label>Known source actor<select value={sourceRefText} onChange={e => setSourceRefText(e.target.value)} disabled={busy || unknown}>
        <option value="">Unknown — GM-adjudicated attribution</option>
        {[...(pcTokens || []), ...(creatureTokens || [])].filter(token => refOf(token)?.roomId === ref.roomId).map(token => {
          const sourceRef = refOf(token); return <option key={canonical(sourceRef)} value={JSON.stringify(sourceRef)}>{sourceRef.kind}: {sourceRef.mapId}/{sourceRef.tokenId}</option>;
        })}
      </select></label>
      <label>Source-specific duration<select value={timing} onChange={e => setTiming(e.target.value)} disabled={busy || unknown}>
        {Object.entries(STUNNED.timings).filter(([key]) => !STRUCTURED_TIMINGS.includes(key)).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></label>
      <button type="button" disabled={busy || unknown || !ready || !sourceOccurrence.trim()} onClick={() => perform(() => editSharedCondition(ref, 'add', {
        sourceOccurrence: sourceOccurrence.trim(), timing, ...(sourceRefText.trim() ? { sourceActor: JSON.parse(sourceRefText) } : {})
      }))}>Apply Stunned source</button>
      {stuns.map(record => <div key={record.recordId}><p>Stunned instance: {record.recordId}</p><p>Source occurrence: {record.sourceEntityId}. Source actor: {record.sourceActor ? `${record.sourceActor.mapId}/${record.sourceActor.tokenId} (${record.sourceActor.instanceId})` : 'Unknown — GM-adjudicated attribution'}</p><p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
        <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'remove', { recordId: record.recordId }))}>Remove Stunned instance {record.recordId}</button>
        {!String(record.sourceEntityId).startsWith(EFFECT_PREFIX) && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'update', { recordId: record.recordId, timing }))}>Set selected duration for Stunned instance {record.recordId}</button>}
      </div>)}
      {ready && moves.length > 0 && <section aria-label="Active movement effects" className="sc-movement">
        <h4>Movement effects</h4>
        <p>Different named effects add together; the same effect again from the same source refreshes its duration instead of stacking. Speed never goes below 0 ft.</p>
        <p role="status">Resulting speed: {movementBreakdownText(movementSpeedBreakdown(movementBaseSpeed(findActor(ref), library), findActor(ref)?.state?.conditions || []))}</p>
        {moves.map(record => <div key={record.recordId}><p>{record.name} · movement {record.effects.movementSpeed > 0 ? '+' : '−'}{Math.abs(record.effects.movementSpeed)} ft · instance {record.recordId}{record.effectDefinition ? '' : ' · applied before effect identity: never combined; GM removes'}</p><p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
          {gm && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'remove', { recordId: record.recordId, profile: 'movement' }))}>Remove {record.name} instance {record.recordId}</button>}
        </div>)}
      </section>}
      <p>Other legacy/custom Stunned records remain manual markers; names alone do not activate these restrictions.</p>
    </section>
    <button type="button" disabled={busy} onClick={() => perform(() => refreshConditionActor(ref))}>Refresh accepted condition state</button>
    {entry?.command && <button type="button" disabled={busy} onClick={() => perform(() => checkConditionCommand(ref))}>Check same condition command</button>}
  </section>;
}
function SharedTurnExpiryControls() {
  const state = useSharedConditionStore(), gm = useGameStore(s => s.isGMMode), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => { refreshEffectLifecycle(); }, [state.principal]);
  if (!gm || isPrivateProjectionIsolated() || state.principal !== conditionPrincipal()) return <p role="status">Current GM and hydrated shared room required.</p>;
  const clock = effectClock(state.combat), actor = state.combat?.turnOrder?.[state.combat.currentTurnIndex]?.actorRef;
  const entry = state.saved?.entries?.[conditionKey(['turn-lifecycle', useGameStore.getState().multiplayerRoom?.id])];
  const unknown = entry?.command && !['accepted', 'failed'].includes(entry.phase);
  const perform = async fn => { setBusy(true); setError(''); try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <section className="sc-editor" aria-label="Authenticated turn expiry">
    <h3>Shared turn-boundary expiry</h3><p>GM validates the server's exact roster and advances one occurrence at a time. No AP restoration, regeneration, payment, recurring tick or wall-clock expiry.</p>
    <p>New canonical PC Defending during its own turn: next turn start. New named Shield Bash: end of target's strictly next turn. Existing instances, one-round criticals and other durations stay GM-managed.</p>
    <p>Authored counted durations (the 2nd to 10th upcoming start or end of one target's turn) are counted once per accepted advance here; each effect lists what is left in the shared condition editor.</p>
    <p role="status">Server view: {state.clockPhase}. {clock ? `Authenticated combat ${clock.id} · turn occurrence ${clock.sequence}` : 'Automatic expiry not enabled for this current roster/occurrence.'}</p>
    {actor && <p>Current exact actor: {actor.kind} {actor.mapId}/{actor.tokenId} · {actor.instanceId}</p>}
    {entry && <p role="status">Turn command: {entry.phase} · {entry.command.commandId}{entry.result?.code ? ` · ${entry.result.code}` : ''}</p>}
    {unknown && <p role="status">Outcome unknown. Keep the original command; do not advance again or infer expiry.</p>}
    {error && <p role="alert">{error}</p>}
    <button type="button" disabled={busy || unknown || !!clock || !state.combat?.isActive || state.clockPhase !== 'ready'} onClick={() => perform(() => submitTurnBoundary('adopt'))}>Enable authenticated turn expiry</button>
    <button type="button" disabled={busy || unknown || !clock || state.clockPhase !== 'ready'} onClick={() => perform(() => submitTurnBoundary('advance'))}>Advance authenticated turn</button>
    {entry && <button type="button" disabled={busy} onClick={() => perform(checkTurnBoundary)}>Check original turn command</button>}
    <button type="button" disabled={busy} onClick={() => perform(refreshEffectLifecycle)}>Refresh server turn state</button>
    <p>Roster edit, end/reset/restart or actor recreation retires or blocks the old schedule; effects are retained for GM correction/removal. Re-adoption never retroactively arms existing effects.</p>
  </section>;
}
export function SharedConditionEntry({ targetRef, identity, ownCharacter = false, mode, label = 'Shared conditions: Defending / Stunned' }) {
  const [open, setOpen] = useState(false), opener = useRef(null);
  const uid = useAuthStore(s => s.user?.uid), selected = useCharacterStore(s => s.currentCharacterId), shared = useGameStore(s => s.isInMultiplayer), gm = useGameStore(s => s.isGMMode);
  if (!shared || (['shield-bash', 'turn-expiry'].includes(mode) && !gm)) return null;
  const exactIdentity = ownCharacter ? { ownerUid: uid, characterId: selected, kind: 'owner' } : identity;
  return <><button className="sc-entry" type="button" ref={opener} onClick={e => { e.stopPropagation(); setOpen(true); }}>{label}</button>
    {open && createPortal(<div className="sc-dialog" role="dialog" aria-modal="false" aria-label={`${label} editor`}>
      <button type="button" onClick={() => { setOpen(false); requestAnimationFrame(() => opener.current?.focus()); }}>Close shared condition editor</button>
      {mode === 'turn-expiry' ? <SharedTurnExpiryControls /> : mode === 'shield-bash' ? <ShieldBashResultForm renderTargetEditor={ref => <SharedConditionEntry targetRef={ref} label="Edit Shield Bash target conditions" />} /> :
        <SharedDefendingEditor key={canonical([targetRef || null, exactIdentity || null])} targetRef={targetRef} identity={exactIdentity} />}
    </div>, document.body)}</>;
}
export function SharedConditionHost() {
  const socket = useGameStore(s => s.multiplayerSocket), roomId = useGameStore(s => s.multiplayerRoom?.id), gm = useGameStore(s => s.isGMMode);
  const uid = useAuthStore(s => s.user?.uid), selected = useCharacterStore(s => s.currentCharacterId), [gate, setGate] = useState(0);
  useEffect(() => subscribeBootstrapGate(() => setGate(v => v + 1)), []);
  const generation = getBootstrapGateState().accountGeneration;
  useEffect(() => { if (socket && roomId && uid && !isPrivateProjectionIsolated()) return bindSharedConditions(socket); }, [socket, roomId, uid, selected, gm, generation, gate]);
  return null;
}
