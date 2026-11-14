import React, { useMemo, useRef, useState } from 'react';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useGameStore from '../../store/gameStore';
import { refreshActorSnapshot, requestActorEvent } from '../../services/actorConsequenceService';
import { applyRoomSnapshot } from '../../services/silentRoomHydration';
import {
  buildJoinCommand, buildLeaveCommand, refOfContract, rosterRefKey, rosterRefusalText, sameRosterRef
} from '../../services/combatRosterCommand';

const REFRESH_CODES = new Set([
  'stale_combat_state', 'stale_turn_clock', 'stale_actor_revision', 'target_incarnation_missing',
  'actor_not_in_combat', 'actor_already_in_combat', 'placement_invalid', 'turn_roster_unbound'
]);
const EMPTY_TOKENS = [];

const tokensNow = () => [
  ...(useCreatureStore.getState().creatureTokens || []),
  ...(useCharacterTokenStore.getState().characterTokens || [])
];
const findTokenByRef = ref => tokensNow().find(token => sameRosterRef(refOfContract(token?.state?.actorContract), ref)) || null;
const tokenLabel = token => token?.name || token?.character?.name || token?.id || 'Combatant';

function expectedClock(combat) {
  const raw = combat?.effectLifecycle;
  if (!raw) { return { ok: true, clock: null }; }
  if (typeof raw.id !== 'string' || !Number.isSafeInteger(raw.sequence)) {
    return { ok: false, code: 'stale_turn_clock' };
  }
  return { ok: true, clock: { id: raw.id, sequence: raw.sequence } };
}

const commandId = () => (typeof window !== 'undefined' && window.crypto?.randomUUID
  ? window.crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const CombatRosterControls = () => {
  const isGMMode = useGameStore(state => state.isGMMode);
  const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
  const isInCombat = useCombatStore(state => state.isInCombat);
  const turnOrder = useCombatStore(state => state.turnOrder) || EMPTY_TOKENS;
  const currentTurnIndex = useCombatStore(state => state.currentTurnIndex);
  const creatureTokens = useCreatureStore(state => state.creatureTokens) || EMPTY_TOKENS;
  const characterTokens = useCharacterTokenStore(state => state.characterTokens) || EMPTY_TOKENS;

  const [joinKey, setJoinKey] = useState('');
  const [placementKind, setPlacementKind] = useState('after');
  const [placementIndex, setPlacementIndex] = useState('1');
  const [leaveKey, setLeaveKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const pending = useRef(false);

  const tokens = useMemo(() => [...creatureTokens, ...characterTokens], [creatureTokens, characterTokens]);
  const joinOptions = useMemo(() => tokens.flatMap(token => {
    const ref = refOfContract(token?.state?.actorContract);
    if (!ref) { return []; }
    if (turnOrder.some(entry => (entry.actorRef && sameRosterRef(entry.actorRef, ref)) || entry.tokenId === token.id)) { return []; }
    return [{ key: rosterRefKey(ref), token, ref }];
  }), [tokens, turnOrder]);
  const leaveOptions = useMemo(() => turnOrder.map((entry, index) => {
    const ref = entry.actorRef || null;
    return {
      key: ref ? rosterRefKey(ref) : `legacy:${index}`,
      entry, index, ref,
      token: ref ? tokens.find(token => sameRosterRef(refOfContract(token?.state?.actorContract), ref)) || null : null,
      current: index === currentTurnIndex
    };
  }), [turnOrder, currentTurnIndex, tokens]);

  const selectedJoin = joinOptions.find(option => option.key === joinKey) || null;
  const selectedLeave = leaveOptions.find(option => option.key === leaveKey) || null;

  const commit = async ({ build, successText }) => {
    if (pending.current) { return; }
    pending.current = true;
    setBusy(true);
    setMessage(null);
    try {
      const snapshot = await refreshActorSnapshot();
      if (!snapshot?.success) {
        setMessage({ kind: 'error', text: rosterRefusalText(snapshot) });
        return;
      }
      if (!snapshot.combat?.isActive) {
        setMessage({ kind: 'error', text: rosterRefusalText('combat_active_required') });
        return;
      }
      const built = build(snapshot);
      if (!built?.success) {
        setMessage({ kind: 'error', text: rosterRefusalText(built) });
        return;
      }
      const result = await requestActorEvent('actor_combat_roster', built.command);
      if (!result?.success) {
        setMessage({ kind: 'error', text: rosterRefusalText(result) });
        if (result?.code && REFRESH_CODES.has(result.code)) { await refreshActorSnapshot(); }
        return;
      }
      if (result.combat !== undefined) {
        try {
          applyRoomSnapshot({ scope: 'section', sections: { combat: result.combat || null } });
        } catch (_) {
          // The command is already accepted; the existing combat_state_sync broadcast remains the fallback.
        }
      }
      setMessage({ kind: 'success', text: successText(result) });
      setJoinKey('');
      setLeaveKey('');
    } catch (error) {
      setMessage({ kind: 'error', text: error?.message || 'The roster change failed.' });
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  const sendJoin = () => {
    if (!selectedJoin) {
      setMessage({ kind: 'error', text: 'Choose a bound token first.' });
      return;
    }
    commit({
      build: snapshot => {
        const token = findTokenByRef(selectedJoin.ref);
        const contract = token?.state?.actorContract;
        if (!token || !contract) { return { success: false, code: 'target_incarnation_missing' }; }
        const order = Array.isArray(snapshot.combat?.turnOrder) ? snapshot.combat.turnOrder : [];
        const cursor = Number.isInteger(snapshot.combat?.currentTurnIndex) ? snapshot.combat.currentTurnIndex : 0;
        let placement;
        if (placementKind === 'end') {
          placement = { kind: 'end' };
        } else if (placementKind === 'index') {
          const position = Number(placementIndex);
          if (!Number.isInteger(position) || position < 1 || position > order.length + 1) {
            return { success: false, code: 'placement_invalid' };
          }
          placement = { kind: 'index', index: position - 1 };
        } else {
          const anchor = order[cursor]?.actorRef;
          if (!anchor) { return { success: false, code: 'placement_invalid' }; }
          placement = { kind: placementKind, ref: anchor };
        }
        const clock = expectedClock(snapshot.combat);
        if (!clock.ok) { return { success: false, code: clock.code }; }
        return buildJoinCommand({
          roomId: snapshot.roomId, commandId: commandId(), actionEpoch: snapshot.actionEpoch,
          baseCommitSequence: snapshot.commitSequence, combatHash: snapshot.combatHash,
          expectedClock: clock.clock, target: selectedJoin.ref, targetRevision: contract.revision, placement
        });
      },
      successText: () => 'Combatant joined the turn order. The clock, round and committed resources were preserved.'
    });
  };

  const sendLeave = () => {
    if (!selectedLeave) {
      setMessage({ kind: 'error', text: 'Choose a combatant to remove.' });
      return;
    }
    if (!selectedLeave.ref) {
      setMessage({ kind: 'error', text: 'That legacy roster entry has no exact actor reference; end or restart combat to repair it.' });
      return;
    }
    commit({
      build: snapshot => {
        const order = Array.isArray(snapshot.combat?.turnOrder) ? snapshot.combat.turnOrder : [];
        if (!order.some(entry => entry.actorRef && sameRosterRef(entry.actorRef, selectedLeave.ref))) {
          return { success: false, code: 'actor_not_in_combat' };
        }
        const token = findTokenByRef(selectedLeave.ref);
        const contract = token?.state?.actorContract;
        const bound = !!contract && sameRosterRef(refOfContract(contract), selectedLeave.ref);
        const clock = expectedClock(snapshot.combat);
        if (!clock.ok) { return { success: false, code: clock.code }; }
        return buildLeaveCommand({
          roomId: snapshot.roomId, commandId: commandId(), actionEpoch: snapshot.actionEpoch,
          baseCommitSequence: snapshot.commitSequence, combatHash: snapshot.combatHash,
          expectedClock: clock.clock, target: selectedLeave.ref,
          targetRevision: bound ? contract.revision : null, targetState: bound ? 'bound' : 'missing',
          reason: bound ? undefined : 'GM roster repair: the exact token incarnation no longer exists.'
        });
      },
      successText: result => (result?.rosterChange?.targetState === 'missing'
        ? 'Stale roster entry repaired and removed from the turn order.'
        : 'Combatant removed from the turn order. The clock, round and current actor were preserved.')
    });
  };

  if (!isGMMode || !isInMultiplayer || !isInCombat) { return null; }

  const current = turnOrder[currentTurnIndex] || null;
  return (
    <div className="combat-roster-controls" data-testid="combat-roster-controls" aria-busy={busy}
      style={{ marginTop: '16px', borderTop: '1px solid #4a5568', paddingTop: '12px' }}>
      <h4 style={{ margin: '0 0 6px 0' }}>Combat Roster (GM)</h4>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#a0aec0' }}>
        Roster edits preserve the clock, round, current actor and committed resources. They do not tick,
        expire or refill HP, mana or action points.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
        <select data-testid="combat-roster-join-select" value={joinKey} disabled={busy}
          onChange={event => setJoinKey(event.target.value)} style={{ flex: '1 1 160px' }}>
          <option value="">{joinOptions.length ? 'Add bound combatant…' : 'No un-joined bound tokens'}</option>
          {joinOptions.map(option => <option key={option.key} value={option.key}>{tokenLabel(option.token)}</option>)}
        </select>
        <select data-testid="combat-roster-placement-select" value={placementKind} disabled={busy}
          onChange={event => setPlacementKind(event.target.value)}>
          <option value="after">After current actor</option>
          <option value="before">Before current actor</option>
          <option value="end">End of round</option>
          <option value="index">Specific position</option>
        </select>
        {placementKind === 'index' && (
          <input data-testid="combat-roster-placement-index" type="number" min="1" max={turnOrder.length + 1}
            value={placementIndex} disabled={busy} onChange={event => setPlacementIndex(event.target.value)}
            aria-label="One-based insertion position" style={{ width: '86px' }} />
        )}
        <button type="button" className="gm-btn gm-btn-secondary" data-testid="combat-roster-join-button"
          onClick={sendJoin} disabled={busy || !joinKey}>
          Join
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        <select data-testid="combat-roster-leave-select" value={leaveKey} disabled={busy}
          onChange={event => setLeaveKey(event.target.value)} style={{ flex: '1 1 160px' }}>
          <option value="">Remove combatant…</option>
          {leaveOptions.map(option => (
            <option key={option.key} value={option.key}>
              #{option.index + 1} {tokenLabel(option.token || option.entry)}
              {option.current ? ' (current — advance first)' : ''}
              {!option.ref ? ' — legacy entry' : option.token ? '' : ' — stale, repair'}
            </option>
          ))}
        </select>
        <button type="button" className="gm-btn gm-btn-danger" data-testid="combat-roster-leave-button"
          onClick={sendLeave} disabled={busy || !leaveKey}>
          Leave
        </button>
      </div>

      {current && (
        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#a0aec0' }}>
          Current actor: {current.name || current.tokenId}. The current actor cannot leave until the turn advances.
        </p>
      )}

      {message && (
        <div data-testid="combat-roster-message" data-kind={message.kind} role="status"
          style={{ marginTop: '8px', fontSize: '12px', color: message.kind === 'success' ? '#68d391' : '#feb2b2' }}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default CombatRosterControls;
