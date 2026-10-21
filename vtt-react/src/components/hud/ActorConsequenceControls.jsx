import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import useMapStore from '../../store/mapStore';
import useCombatStore from '../../store/combatStore';
import { SharedConditionEntry } from '../conditions/SharedDefendingEditor';
import { bindActor, refOf, selectOwnerAttachment, approvePendingActorProposal, retryActorCommand, acceptRecoveredActorSnapshot } from '../../services/actorConsequenceService';

/** Explicit attachment selection and truthful authorization/retry status. */
export default function ActorConsequenceControls() {
  const shared = useGameStore(value => value.isInMultiplayer);
  const outcome = useGameStore(value => value.actorConsequenceStatus);
  const proposal = useGameStore(value => value.pendingActorProposal);
  const recovery = useGameStore(value => value.actorRecoverySnapshot);
  const characters = useCharacterTokenStore(value => value.characterTokens);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const mapId = useMapStore(value => value.currentMapId);
  const manualRegen = useCombatStore(value => value.turnOrder[value.currentTurnIndex]?.manualRegen === true);
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false);
  if (!shared) return null;
  const candidates = [...characters.map(token => ({ token, kind: 'character' })), ...creatures.map(token => ({ token, kind: 'creature' }))]
    .filter(({ token }) => (token.mapId || mapId) === mapId);
  const candidate = candidates.find(({ token, kind }) => `${kind}:${token.id}` === selected);
  const primary = candidate?.kind === 'character' && characters.find(token => token.state?.actorContract?.primary &&
    token.ownerUserId === candidate.token.ownerUserId && token.character?.id === candidate.token.character?.id);
  const perform = async action => {setBusy(true); try {await action();} finally {setBusy(false);} };
  return <section aria-label="Actor attachment and consequences" style={{ pointerEvents: 'auto' }}>
    <p>Shared conditions: manual timing · overtime paused.</p>
    {manualRegen && <p>PC regeneration needs manual final values; its owning projection does not supply them.</p>}
    <label>Exact room attachment <select value={selected} onChange={event => setSelected(event.target.value)}>
      <option value="">Select a token</option>
      {candidates.map(({ token, kind }) => <option key={`${kind}:${token.id}`} value={`${kind}:${token.id}`}>{token.name || token.character?.name || token.id} · {token.id}</option>)}
    </select></label>
    {candidate && !refOf(candidate.token) && <button disabled={busy} onClick={() => perform(() => bindActor(candidate.token.id, candidate.kind))}>Bind primary attachment</button>}
    {candidate && !refOf(candidate.token) && primary && <button disabled={busy} onClick={() => perform(() => bindActor(candidate.token.id, candidate.kind, { replacePrimaryRef: refOf(primary) }))}>Replace this character's primary attachment</button>}
    {candidate && !refOf(candidate.token) && outcome?.code === 'legacy_reconciliation_required' && <div>
      <button disabled={busy} onClick={() => perform(() => bindActor(candidate.token.id, candidate.kind, { selection: 'nested' }))}>Bind nested legacy values</button>
      <button disabled={busy} onClick={() => perform(() => bindActor(candidate.token.id, candidate.kind, { selection: 'root' }))}>Bind root legacy values</button>
    </div>}
    {candidate?.kind === 'character' && refOf(candidate.token) && <button disabled={busy} onClick={() => selectOwnerAttachment(refOf(candidate.token))}>Use this owner attachment</button>}
    {candidate && refOf(candidate.token) && <SharedConditionEntry targetRef={refOf(candidate.token)} label="Edit selected shared conditions" />}
    <SharedConditionEntry mode="shield-bash" label="Record Shield Bash result" />
    <SharedConditionEntry mode="turn-expiry" label="Shared turn expiry" />
    {outcome && <p role="status">{outcome.success ? outcome.status || outcome.code || 'Accepted live' : outcome.error || outcome.code?.replace(/_/g, ' ')}</p>}
    {outcome?.durability === 'live-only' && <p>Temporary room: live-only, nonpersistent. No checkpoint confirmation or crash durability.</p>}
    {outcome?.commandId && !outcome.success && <button disabled={busy} onClick={() => perform(() => retryActorCommand(outcome.commandId))}>Check same command</button>}
    {recovery && <div><p>{recovery.readOnly ? 'Unbound snapshot retained as recovery data. Refresh or explicitly reconcile its binding; protected values are unchanged.' : 'Room projection changed. The previous owner projection requires reconciliation.'}</p>
      {!recovery.readOnly && <button disabled={busy} onClick={acceptRecoveredActorSnapshot}>Use server projection; retain current candidate</button>}</div>}
    {proposal && <div><p>Actor consequence awaiting GM authorization · {proposal.proposalId}</p>
      <pre>{JSON.stringify(proposal.command?.actors, null, 2)}</pre>
      <button disabled={busy} onClick={() => perform(() => approvePendingActorProposal(proposal))}>Authorize this immutable result</button></div>}
  </section>;
}
