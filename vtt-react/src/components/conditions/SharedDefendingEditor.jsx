import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useGameStore from '../../store/gameStore';
import useCreatureStore from '../../store/creatureStore';
import { getBootstrapGateState, isPrivateProjectionIsolated, subscribeBootstrapGate } from '../../persistence/bootstrapPrivacyGate';
import { findActor, refOf } from '../../services/actorConsequenceService';
import { DEFENDING, STUNNED, ATTRIBUTE, DAMAGE_REDUCTION, STRUCTURED_TIMINGS, EFFECT_PREFIX, isPeriodicTick, periodicOf, canonical, recordsFor, stunnedRecordsFor, movementRecordsFor, attributeRecordsFor, attributeModifierOf, attributeName, attributeModifierTotals, damageReductionRecordsFor, damageReductionModifierOf, damageReductionTotal, expiryLabel, sameRef } from '../../services/sharedConditionProfile';
import { useSharedConditionStore, conditionPrincipal, conditionKey, resolveConditionActor, refreshConditionActor,
  editDefending, editSharedCondition, checkConditionCommand, bindSharedConditions, refreshEffectLifecycle, submitTurnBoundary, checkTurnBoundary,
  resolvePeriodicTick, checkPeriodicTick, tickRef, retainedTickCommands, clearRetainedPeriodicTick, clearConfirmedPeriodicHistory } from '../../services/sharedConditionService';
import { clock as effectClock, dueTicks, tickLabel } from '../../services/sharedEffectTiming';
import { readFormula } from '../../services/authoredAbility';
import { movementSpeedBreakdown, movementBreakdownText, movementBaseSpeed } from '../../utils/conditionUtils';
import { sha256Hex } from '../../services/canonicalHash';
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
  if (!ref) {
    const isCreature = targetRef?.kind === 'creature';
    return <p role="status">{isCreature ? 'No exact room creature for this view. Bind/select that actor; no fallback.' : 'No exact primary room PC for this view. Bind/select that actor; no open-character or first-token fallback.'}</p>;
  }
  const view = state.views[key], ready = view?.phase === 'ready';
  const records = ready ? recordsFor(findActor(ref)) : [], stuns = ready ? stunnedRecordsFor(findActor(ref)) : [], moves = ready ? movementRecordsFor(findActor(ref)) : [], attrs = ready ? attributeRecordsFor(findActor(ref)) : [], drs = ready ? damageReductionRecordsFor(findActor(ref)) : [];
  const ticking = ready ? (findActor(ref)?.state?.conditions || []).filter(r => isPeriodicTick(r) && (r.targetId === ref.tokenId || sameRef(r.target, ref))) : [];
  const targetTicks = ready && state.combat ? dueTicks(state.combat).filter(t => sameRef(t.ref, ref)) : [];
  const entry = state.saved?.entries?.[key], unknown = entry?.command && !['accepted', 'failed'].includes(entry.phase);
  const perform = async fn => { setBusy(true); setError(''); try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <section className="sc-editor" aria-label={ref.kind === 'character' ? 'Shared PC Defending' : 'Shared creature conditions'}>
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
      {gm && <>
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
      </>}
      {stuns.map(record => <div key={record.recordId}><p>Stunned instance: {record.recordId}</p>
        <p>Source occurrence: {record.sourceEntityId}.{gm && record.sourceActor ? ` Source actor: ${record.sourceActor.mapId}/${record.sourceActor.tokenId} (${record.sourceActor.instanceId})` : ''}</p>
        <p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
        {gm && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'remove', { recordId: record.recordId }))}>Remove Stunned instance {record.recordId}</button>}
        {gm && !String(record.sourceEntityId).startsWith(EFFECT_PREFIX) && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'update', { recordId: record.recordId, timing }))}>Set selected duration for Stunned instance {record.recordId}</button>}
      </div>)}
      <p>Other legacy/custom Stunned records remain manual markers; names alone do not activate these restrictions.</p>
    </section>
    {ready && moves.length > 0 && <section aria-label="Active movement effects" className="sc-movement">
      <h4>Movement effects</h4>
      <p>Different named effects add together; the same effect again from the same source refreshes its duration instead of stacking. Speed never goes below 0 ft.</p>
      <p role="status">Resulting speed: {movementBreakdownText(movementSpeedBreakdown(movementBaseSpeed(findActor(ref), library), findActor(ref)?.state?.conditions || []))}</p>
      {moves.map(record => <div key={record.recordId}><p>{record.name} · movement {record.effects.movementSpeed > 0 ? '+' : '−'}{Math.abs(record.effects.movementSpeed)} ft · instance {record.recordId}{record.effectDefinition ? '' : ' · applied before effect identity: never combined; GM removes'}</p><p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
        {gm && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'remove', { recordId: record.recordId, profile: 'movement' }))}>Remove {record.name} instance {record.recordId}</button>}
      </div>)}
    </section>}
    {ready && attrs.length > 0 && <section aria-label="Active attribute changes" className="sc-movement">
      <h4>Attribute changes</h4>
      <p>{ATTRIBUTE.combinationPolicy} Each change is added once on top of the character's own sheet score; base, level-up, heritage, origin and equipment values are not edited.</p>
      <p role="status">Total authored change: {Object.entries(attributeModifierTotals(findActor(ref)?.state?.conditions || [])).map(([id, n]) => `${attributeName(id)} ${n > 0 ? '+' : '−'}${Math.abs(n)}`).join(', ')}</p>
      {attrs.map(record => { const value = attributeModifierOf(record); return <div key={record.recordId}><p>{record.name} · {attributeName(value.attribute)} {value.amount > 0 ? '+' : '−'}{Math.abs(value.amount)} · instance {record.recordId}</p><p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
        {gm && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'remove', { recordId: record.recordId, profile: 'attribute' }))}>Remove {record.name} instance {record.recordId}</button>}
      </div>; })}
      <p>{ATTRIBUTE.notAutomated}</p>
    </section>}
    {ready && drs.length > 0 && <section aria-label="Active flat damage reduction" className="sc-movement">
      <h4>Flat damage reduction</h4>
      <p>{DAMAGE_REDUCTION.combinationPolicy} Added once to effective flat DR; base stats, equipment durability and armor dice are not edited.</p>
      <p role="status">Total authored flat DR: +{damageReductionTotal(findActor(ref)?.state?.conditions || [])}</p>
      {drs.map(record => { const value = damageReductionModifierOf(record); return <div key={record.recordId}><p>{record.name} · Flat DR +{value.amount} · instance {record.recordId}</p><p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
        {gm && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'remove', { recordId: record.recordId, profile: 'damageReduction' }))}>Remove {record.name} instance {record.recordId}</button>}
      </div>; })}
      <p>{DAMAGE_REDUCTION.notAutomated}</p>
    </section>}
    {ready && (ticking.length > 0 || targetTicks.length > 0) && <section aria-label="Active periodic effects" className="sc-movement">
      <h4>Periodic effects</h4>
      <p>Each listed boundary records one due tick on the GM's turn controls; HP changes only when the GM resolves it. Removing the effect stops later ticks; a tick already recorded then has to be resolved by hand.</p>
      {ticking.length === 0 && targetTicks.length > 0 && (() => {
        const actor = findActor(ref);
        if (!actor) {
          return <p role="status" className="sc-expired-note">Target actor absent. Due tick awaiting GM resolution:</p>;
        }
        const anyRetired = targetTicks.some(t => !t.live);
        if (anyRetired) {
          return <p role="status" className="sc-expired-note">Turn clock inactive. Due tick awaiting GM resolution:</p>;
        }
        const endedPeriodic = state.combat?.effectLifecycle?.endedPeriodic;
        const hasLifecycleFacts = Array.isArray(endedPeriodic);
        const allExpired = targetTicks.every(t => t.final || (hasLifecycleFacts && endedPeriodic.includes(t.recordId)));
        const hasRemoved = targetTicks.some(t => !t.final && hasLifecycleFacts && !endedPeriodic.includes(t.recordId));
        if (allExpired) {
          return <p role="status" className="sc-expired-note">Periodic effect naturally expired. Final due tick awaiting GM resolution:</p>;
        }
        if (hasRemoved) {
          return <p role="status" className="sc-expired-note">Periodic effect removed while due tick remains. Resolve it by hand and dismiss it:</p>;
        }
        return <p role="status" className="sc-expired-note">Periodic effect record absent. Due tick awaiting GM resolution:</p>;
      })()}
      {ticking.map(record => {
        const p = periodicOf(record);
        const effectTicks = targetTicks.filter(t => t.recordId === record.recordId);
        return <div key={record.recordId}><p>{record.name} · {p.kind === 'damage' ? `${p.damageType} damage` : 'healing'} {p.formula} per tick · instance {record.recordId}</p><p className="sc-expiry">{expiryLabel(record, state.combat)}</p>
          <p role="status">{effectTicks.length > 0 ? (effectTicks.some(t => t.live) ? 'Periodic tick awaiting GM resolution.' : 'Retired tick awaiting manual GM resolution.') : 'Active — no tick currently awaiting resolution.'}</p>
          {gm && <button type="button" disabled={busy || unknown || !ready} onClick={() => perform(() => editSharedCondition(ref, 'remove', { recordId: record.recordId, profile: 'periodic' }))}>Remove {record.name} instance {record.recordId}</button>}
        </div>;
      })}
      {targetTicks.length > 0 && <div className="sc-target-ticks">
        <h5>Due periodic ticks ({targetTicks.length})</h5>
        {targetTicks.map(tick => {
          if (gm) {
            return <PeriodicTickRow key={tick.tickId} tick={tick} saved={state.saved} busy={busy} perform={perform} />;
          }
          const actor = findActor(tick.ref);
          const record = (actor?.state?.conditions || []).find(r => r?.recordId === tick.recordId);
          const hasRecord = Boolean(record);
          const endedPeriodic = state.combat?.effectLifecycle?.endedPeriodic;
          const hasLifecycleFacts = Array.isArray(endedPeriodic);
          const endedByLastTick = hasLifecycleFacts && endedPeriodic.includes(tick.recordId);
          const naturallyExpired = Boolean(tick.final || endedByLastTick);
          const isChanged = Boolean(record && tick.recordHash && sha256Hex(canonical(record)) !== tick.recordHash);
          const isFinalLingering = Boolean(record && tick.final);
          const isStale = isChanged || isFinalLingering;
          const isRemoved = Boolean(actor && !hasRecord && !naturallyExpired && hasLifecycleFacts);
          let statusText = 'Awaiting GM resolution';
          if (!tick.live) {
            statusText = 'Retired tick — clock inactive; GM resolves by hand';
          } else if (!actor) {
            statusText = 'Target actor absent — GM resolves by hand';
          } else if (isRemoved) {
            statusText = 'Effect removed — GM resolves by hand';
          } else if (isStale) {
            statusText = 'Effect changed — GM resolves by hand';
          } else if (!hasRecord && naturallyExpired) {
            statusText = 'Effect naturally expired — awaiting GM resolution';
          }
          return (
            <div key={tick.tickId} className="sc-tick-readonly" role="status">
              <p>{tickLabel(tick)}</p>
              <p>{statusText}</p>
            </div>
          );
        })}
      </div>}
    </section>}
    <button type="button" disabled={busy} onClick={() => perform(() => refreshConditionActor(ref))}>Refresh accepted condition state</button>
    {entry?.command && <button type="button" disabled={busy} onClick={() => perform(() => checkConditionCommand(ref))}>Check same condition command</button>}
  </section>;
}
const randomFace = sides => { const a = new Uint32Array(1); crypto.getRandomValues(a); return 1 + (a[0] % sides); };
/** M5: one due tick — the GM enters (or rolls in the app) the dice for this tick, sets the final amount and resolves or dismisses it. */
function PeriodicTickRow({ tick, saved, busy, perform }) {
  const reading = (() => { try { return readFormula(tick.tick.formula); } catch (_) { return null; } })();
  const sides = reading?.dice[0].sides, count = reading?.dice[0].count || 0;
  const [mode, setMode] = useState('physical'), [faces, setFaces] = useState(() => Array(count).fill('')), [amount, setAmount] = useState(''), [reason, setReason] = useState('');
  const entry = saved?.entries?.[conditionKey(tickRef(tick.tickId))], unknown = entry?.command && !['accepted', 'failed'].includes(entry.phase);
  const numbers = faces.map(Number), complete = reading && faces.every(f => Number.isInteger(Number(f)) && Number(f) >= 1 && Number(f) <= sides && f !== '');
  const total = complete ? numbers.reduce((a, b) => a + b, reading.constant) : null;
  const final = amount === '' ? total : Number(amount);
  const roll = complete ? { mode, dice: [{ sides, faces: numbers }], constant: reading.constant, reading: reading.reading, total } : null;
  const combat = useSharedConditionStore(s => s.combat);
  const actor = findActor(tick.ref);
  const record = (actor?.state?.conditions || []).find(r => r?.recordId === tick.recordId);
  const endedPeriodic = combat?.effectLifecycle?.endedPeriodic;
  const hasLifecycleFacts = Array.isArray(endedPeriodic);
  const endedByLastTick = hasLifecycleFacts && endedPeriodic.includes(tick.recordId);
  const naturallyExpired = Boolean(tick.final || endedByLastTick);
  const isStaleActor = Boolean(!actor);
  const isChanged = Boolean(record && tick.recordHash && sha256Hex(canonical(record)) !== tick.recordHash);
  const isFinalLingering = Boolean(record && tick.final);
  const isStale = isChanged || isFinalLingering;
  const isRemoved = Boolean(actor && !record && !naturallyExpired && hasLifecycleFacts);
  const isUnknownAbsent = Boolean(isStaleActor || (!record && !naturallyExpired && !hasLifecycleFacts));
  const canApply = tick.live && !isStaleActor && !isRemoved && !isUnknownAbsent && !isStale;
  return <div className="sc-tick" role="group" aria-label={`Due tick ${tick.occurrence} of ${tick.of} — ${tick.label}`}>
    <p>{tickLabel(tick)} · target {tick.ref.mapId}/{tick.ref.tokenId}</p>
    {!tick.live && <p role="status">Recorded by a turn clock that is no longer active: it cannot be applied automatically. Resolve it by hand, then dismiss it.</p>}
    {tick.live && isStaleActor && <p role="status">Target actor absent: it cannot be applied automatically. Resolve it by hand, then dismiss it.</p>}
    {tick.live && !isStaleActor && isRemoved && <p role="status">The periodic effect behind this tick was removed before it was resolved: it cannot be applied automatically. Resolve it by hand, then dismiss it.</p>}
    {tick.live && !isStaleActor && !isRemoved && isStale && <p role="status">The periodic effect behind this tick was changed or replaced before it was resolved: it cannot be applied automatically. Resolve it by hand, then dismiss it.</p>}
    {tick.live && !isStaleActor && !isRemoved && !isStale && isUnknownAbsent && <p role="status">Periodic effect record absent: it cannot be applied automatically. Resolve it by hand, then dismiss it.</p>}
    {entry && <p role="status">Tick command: {entry.phase}{entry.result?.code ? ` · ${entry.result.code}` : ''}{unknown ? ' — outcome unknown; check the same command, do not resolve again.' : ''}</p>}
    {canApply && <>
      <label>Roll<select value={mode} onChange={e => setMode(e.target.value)} disabled={busy || unknown}><option value="physical">Physical dice — enter the faces</option><option value="digital">Digital — rolled in this GM's app (not a server roll)</option></select></label>
      <div>{faces.map((f, i) => <label key={i}>d{sides} #{i + 1}<input type="number" min={1} max={sides} value={f} disabled={busy || unknown || mode === 'digital'}
        onChange={e => setFaces(faces.map((x, j) => j === i ? e.target.value : x))} /></label>)}</div>
      {mode === 'digital' && <button type="button" disabled={busy || unknown} onClick={() => setFaces(faces.map(() => String(randomFace(sides))))}>Roll {tick.tick.formula} in the app</button>}
      <p>Roll total: {total ?? '—'}{reading?.constant ? ` (includes ${reading.constant > 0 ? '+' : ''}${reading.constant})` : ''}</p>
      <label>Final {tick.tick.kind === 'damage' ? 'damage' : 'healing'} (GM)<input type="number" min={0} value={amount} placeholder={total ?? ''} disabled={busy || unknown} onChange={e => setAmount(e.target.value)} /></label>
      <label>Reason (required when the final amount differs from the roll)<input maxLength={2000} value={reason} disabled={busy || unknown} onChange={e => setReason(e.target.value)} /></label>
      <button type="button" disabled={busy || unknown || !roll || !Number.isInteger(final) || final < 0 || (final !== total && !reason.trim())}
        onClick={() => perform(() => resolvePeriodicTick(tick, { mode: 'apply', roll, finalAmount: final, adjustmentReason: reason }))}>Apply tick {tick.occurrence} of {tick.of}</button>
    </>}
    <button type="button" disabled={busy || unknown} onClick={() => perform(() => resolvePeriodicTick(tick, { mode: 'dismiss', adjustmentReason: reason.trim() || 'GM resolved this tick by hand' }))}>Dismiss tick (resolved by hand, no HP change)</button>
    {entry?.command && <button type="button" disabled={busy} onClick={() => perform(() => checkPeriodicTick(tick.tickId))}>Check same tick command</button>}
  </div>;
}
const OUTCOME_TEXT = {
  unknown: 'Pending or unknown — the server may already have applied it. Check the same command; do not resolve this tick again.',
  consumed: 'Unconfirmed — the server no longer has this tick open; it may have been resolved by this very command. Do not resolve it again; check the same command again or compare the target\'s HP with the receipt log.',
  applied: 'Accepted: the tick was applied once by this command (original receipt).',
  dismissed: 'Accepted: the tick was dismissed by this command; no HP change.',
  refused: 'Refused: nothing was applied by this command.'
};
/**
 * M5 recovery: this GM's retained tick commands, kept on this device independently of the due-tick rows. Checking resends the
 * exact original command (same commandId and bytes); it never creates a replacement command or a new roll.
 */
export function RetainedTickCommands({ saved, busy, perform }) {
  const items = retainedTickCommands(saved);
  const eligibleItems = items.filter(item => item.eligible);
  return <section aria-label="Retained tick commands">
    <h4>Retained tick commands ({items.length})</h4>
    <p>Local recovery shortcuts on this device. Clearing removes the shortcut from local history; server receipts, combat state, and HP remain unchanged.</p>
    {!items.length && <p>No tick command is retained on this device.</p>}
    {eligibleItems.length > 0 && <div className="sc-history-actions">
      <button type="button" disabled={busy} onClick={() => perform(() => clearConfirmedPeriodicHistory())}>
        Clear confirmed entries ({eligibleItems.length})
      </button>
    </div>}
    {items.map(item => {
      const name = item.tick ? `tick ${item.tick.occurrence} of ${item.tick.of} — ${item.tick.label}` : `tick ${item.tickId}`;
      return <div key={item.tickId} className="sc-tick" role="group" aria-label={`Retained tick command — ${name}`}>
        <p>{item.tick ? `${item.tick.label}: ${name.split(' — ')[0]} · ${item.tick.kind} ${item.tick.formula} · target ${item.tick.target?.mapId}/${item.tick.target?.tokenId}` : name}</p>
        <p>Command {item.commandId} · {item.mode === 'dismiss' ? 'dismiss (no HP change)' : `apply ${item.finalAmount}${item.roll ? ` · ${item.roll.mode} roll ${item.roll.dice?.map(d => d.faces.join('+')).join(' ')} = ${item.roll.total}` : ''}`}</p>
        <p role="status" data-outcome={item.outcome}>{OUTCOME_TEXT[item.outcome]}{item.code ? ` (${item.code})` : ''}</p>
        <button type="button" disabled={busy} onClick={() => perform(() => checkPeriodicTick(item.tickId))}>Check same tick command</button>
        {item.eligible && <button type="button" disabled={busy} onClick={() => perform(() => clearRetainedPeriodicTick(item.tickId))}>Clear retained entry</button>}
      </div>;
    })}
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
    <h3>Shared turn-boundary expiry</h3><p>GM validates the server's exact roster and advances one occurrence at a time. No AP restoration, regeneration, payment or wall-clock expiry. Periodic effects record their due ticks here; HP changes only when you resolve each tick.</p>
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
    <section aria-label="Due periodic ticks">
      <h4>Due periodic ticks ({dueTicks(state.combat).length})</h4>
      {!dueTicks(state.combat).length && <p>No tick is waiting.</p>}
      {dueTicks(state.combat).map(tick => <PeriodicTickRow key={tick.tickId} tick={tick} saved={state.saved} busy={busy} perform={perform} />)}
    </section>
    <RetainedTickCommands saved={state.saved} busy={busy} perform={perform} />
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
