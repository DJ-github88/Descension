import React, { useEffect, useMemo, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { sameExactRef } from '../../services/featherSlash';
import {
  HEIGHTENED_SENSES_PASSIVE,
  approved,
  stackingMode,
  evaluatePassiveEligibility,
  describePassiveStatus
} from '../../services/passiveActivationPolicy';
import {
  usePassiveActivationStore,
  refreshPassiveLedger,
  registerPassiveHandlers,
  activatePassive,
  revokePassive,
  primaryPcTargets
} from '../../services/passiveActivationService';
import {
  useSpellConsequenceStore,
  refreshAuthoredAbilities
} from '../../services/spellConsequenceService';
import './TriggerOfferPanel.css';

const AUTHORED_PASSIVE_CAPABILITIES = ['authored-passive-entry:v1', 'authored-passive-turn:v1'];
const targetLabel = ref => ref ? `${ref.kind === 'character' ? 'PC' : 'Creature'} ${ref.tokenId}/${ref.instanceId || '—'}` : 'unknown target';

export default function PassiveActivationPanel() {
  const roomId = useGameStore(state => state.multiplayerRoom?.id);
  const socket = useGameStore(state => state.multiplayerSocket);
  const isGM = useGameStore(state => state.isGMMode);
  const projection = usePassiveActivationStore(state => state.projection);
  const loading = usePassiveActivationStore(state => state.loading);
  const error = usePassiveActivationStore(state => state.error);
  const message = usePassiveActivationStore(state => state.message);
  const authoredRoomId = useSpellConsequenceStore(state => state.authoredRoomId);
  const authoredEntries = useSpellConsequenceStore(state => state.authoredEntries) || [];
  const characterTokens = useCharacterTokenStore(state => state.characterTokens) || [];
  const [targetKey, setTargetKey] = useState('0');
  const [admittedKey, setAdmittedKey] = useState('0');
  const [busy, setBusy] = useState(false);
  const [localMessage, setLocalMessage] = useState('');

  const policyApproved = approved();
  const mode = stackingMode();

  const primaries = useMemo(() => {
    const items = primaryPcTargets();
    return Array.isArray(items) ? items : [];
  }, [characterTokens, roomId]);

  const admittedPassives = useMemo(() => {
    if (authoredRoomId !== roomId) return [];
    return authoredEntries.filter(entry =>
      entry &&
      !entry.revoked &&
      !entry.creatureOnly &&
      AUTHORED_PASSIVE_CAPABILITIES.includes(entry.descriptor?.capabilityId)
    );
  }, [authoredEntries, authoredRoomId, roomId]);

  const activations = useMemo(() => Array.isArray(projection?.activations) ? projection.activations : [], [projection]);

  useEffect(() => {
    if (!socket || !roomId) return undefined;
    const off = registerPassiveHandlers({ socket });
    refreshPassiveLedger();
    if (isGM && authoredRoomId !== roomId) {
      refreshAuthoredAbilities();
    }
    return off;
  }, [socket, roomId, isGM, authoredRoomId]);

  useEffect(() => {
    if (!primaries[Number(targetKey)]) setTargetKey('0');
  }, [primaries, targetKey]);

  useEffect(() => {
    if (!admittedPassives[Number(admittedKey)]) setAdmittedKey('0');
  }, [admittedPassives, admittedKey]);

  if (!roomId) return null;
  if (!projection && !loading && !error) return null;
  if (!isGM && !activations.length && !primaries.length && !error) return null;

  const perform = async action => {
    setBusy(true);
    setLocalMessage('');
    try {
      const result = await action();
      if (result?.success === false) setLocalMessage(result.error || result.code || 'Refused.');
      else if (result?.success) setLocalMessage('Recorded.');
    } catch (caught) {
      setLocalMessage(caught.message);
    } finally {
      setBusy(false);
    }
  };

  const chosenItem = primaries[Number(targetKey)] || null;
  const chosenRef = chosenItem?.ref || null;
  const chosenEligibility = chosenItem
    ? chosenItem.eligibility
    : { ok: false, code: 'target_missing', reason: 'select a bound primary player character' };

  const targetActivations = chosenRef
    ? activations.filter(act => sameExactRef(act.target, chosenRef))
    : [];
  const heightActivations = targetActivations.filter(act => !act.passiveKind && act.passiveId === HEIGHTENED_SENSES_PASSIVE.passiveId);
  const activeForTarget = heightActivations.filter(act => act.state === 'active');
  const staleForTarget = heightActivations.find(act => act.state === 'stale') || null;
  const primaryActivationRecord = activeForTarget[0] || staleForTarget || null;

  const statusSummary = chosenItem
    ? describePassiveStatus({ activation: primaryActivationRecord, eligibility: chosenEligibility, policyApproved })
    : { status: 'stored', effectText: null, reason: null, displayText: 'Stored — not active' };

  const alreadyAtCopyCap = mode !== 'both-copies' && activeForTarget.length >= 1;
  const canActivate = Boolean(
    isGM &&
    policyApproved &&
    chosenRef &&
    chosenEligibility.ok &&
    !staleForTarget &&
    !alreadyAtCopyCap
  );

  const chosenAdmitted = admittedPassives[Number(admittedKey)] || null;
  const chosenAdmittedId = chosenAdmitted?.definitionRef?.definitionId || null;
  const matchingAdmittedOnTarget = chosenRef && chosenAdmittedId
    ? targetActivations.filter(act => AUTHORED_PASSIVE_CAPABILITIES.includes(act.passiveKind) && act.definitionRef?.definitionId === chosenAdmittedId)
    : [];
  const canActivateAdmitted = Boolean(isGM && chosenRef && chosenAdmitted && matchingAdmittedOnTarget.length === 0);

  const activeCount = activations.filter(a => a.state === 'active').length;
  const staleCount = activations.filter(a => a.state === 'stale').length;

  return (
    <section className="first-playable-trigger" aria-label="Passive ability activation">
      {!isGM && (activations.length > 0 || primaries.length > 0 || error || localMessage || message) && (
        <details className="first-playable-trigger-box" data-passive-member-panel="">
          <summary>
            Passive abilities ({activeCount} active{staleCount > 0 ? ` · ${staleCount} stale` : ''})
            <span className="p9-info-badge">Informational</span>
          </summary>
          {error && <p role="alert" className="first-playable-trigger-error">{error}</p>}
          {(localMessage || message) && <p role="status">{localMessage || message}</p>}
          <details className="p9-tech-disclosure">
            <summary>Passive rules &amp; eligibility</summary>
            <p className="first-playable-trigger-note">
              Static library and saved passive records are <strong>Stored — not active</strong>. Only an explicit GM activation on your exact bound primary character applies <strong>+2 initiative</strong> on authoritative initiative rolls.
            </p>
          </details>
          {primaries.map(item => {
            const matching = activations.filter(act => sameExactRef(act.target, item.ref) && !act.passiveKind);
            const authoredMatching = activations.filter(act => sameExactRef(act.target, item.ref) && AUTHORED_PASSIVE_CAPABILITIES.includes(act.passiveKind));
            const record = matching.find(act => act.state === 'active') || matching.find(act => act.state === 'stale') || null;
            const info = describePassiveStatus({ activation: record, eligibility: item.eligibility, policyApproved });
            return (
              <React.Fragment key={`${item.ref.mapId}/${item.ref.tokenId}/${item.ref.instanceId}`}>
                <div className="first-playable-trigger-row" data-passive-status={info.status}>
                  <p>
                    <strong>{HEIGHTENED_SENSES_PASSIVE.name}</strong> ({HEIGHTENED_SENSES_PASSIVE.sourceRecordId}) — {item.label} ({targetLabel(item.ref)}) — <span data-passive-display-status="">{info.displayText}</span>
                  </p>
                </div>
                {authoredMatching.map(act => (
                  <div key={act.activationId} className="first-playable-trigger-row" data-passive-status={act.state}>
                    <p>
                      <strong>{act.name || act.passiveId}</strong> — {item.label} ({targetLabel(item.ref)}) — <span data-passive-display-status="">{act.displayStatus}</span>
                    </p>
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </details>
      )}
      {isGM && (
        <details className="first-playable-trigger-box" data-passive-activation-panel="">
          <summary>
            Passive ability activation ({HEIGHTENED_SENSES_PASSIVE.name} · {activeCount} active{staleCount > 0 ? ` · ${staleCount} stale` : ''})
            <span className="p9-info-badge">Setup</span>
          </summary>
          <details className="p9-tech-disclosure">
            <summary>Passive rules &amp; eligibility</summary>
            <p className="first-playable-trigger-note">
              Canonical passive: <strong>{HEIGHTENED_SENSES_PASSIVE.name}</strong> (<code>{HEIGHTENED_SENSES_PASSIVE.sourceRecordId}</code> · Perception NOVICE · +2 flat initiative · no authored trigger). Saving or admitting a passive record alone leaves it <strong>Stored — not active</strong> and grants no active modifier.
            </p>
          </details>
          {!policyApproved && (
            <p className="first-playable-trigger-note" role="status" data-passive-unapproved="">
              Inactive — creator approval pending (P1–P5): production passive activation is fail-closed. Static and admitted records remain <strong>Stored — not active</strong>.
            </p>
          )}
          {error && <p role="alert" className="first-playable-trigger-error">{error}</p>}
          {(localMessage || message) && <p role="status">{localMessage || message}</p>}
          <div className="first-playable-trigger-form">
            <label>Target primary PC
              <select aria-label="Target primary PC" value={targetKey} onChange={event => setTargetKey(event.target.value)}>
                {primaries.map((item, index) => (
                  <option key={`${item.ref.mapId}/${item.ref.tokenId}/${item.ref.instanceId}`} value={String(index)}>
                    {item.label} — {targetLabel(item.ref)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={busy || !canActivate}
              onClick={() => perform(() => activatePassive({
                target: chosenRef,
                passiveId: HEIGHTENED_SENSES_PASSIVE.passiveId,
                sourceRecordId: HEIGHTENED_SENSES_PASSIVE.sourceRecordId
              }))}
            >
              Activate Heightened Senses (+2 initiative)
            </button>
          </div>
          {admittedPassives.length > 0 && (
            <div className="first-playable-trigger-form" data-authored-passive-controls="">
              <label>Admitted passive ability
                <select aria-label="Admitted passive ability" value={admittedKey} onChange={event => setAdmittedKey(event.target.value)}>
                  {admittedPassives.map((entry, index) => (
                    <option key={`${entry.definitionRef.definitionId}:${entry.definitionRef.definitionVersion}`} value={String(index)}>
                      {entry.canonicalDefinition.name} (v{entry.definitionRef.definitionVersion} · {entry.descriptor?.capabilityId === 'authored-passive-turn:v1' ? `${entry.canonicalDefinition.trigger.kind === 'turn_start' ? 'Turn Start' : 'Turn End'} (${entry.canonicalDefinition.trigger.whoseTurn})` : `${entry.canonicalDefinition.targeting.radiusFeet} ft`})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={busy || !canActivateAdmitted}
                onClick={() => perform(() => activatePassive({
                  target: chosenRef,
                  definitionRef: chosenAdmitted.definitionRef
                }))}
              >
                Activate admitted passive
              </button>
              <p className="first-playable-trigger-note">
                {chosenAdmitted?.descriptor?.capabilityId === 'authored-passive-turn:v1'
                  ? 'Fires automatically when an authenticated combat turn advance reaches the matching turn boundary (no 8-second reaction window; does not stack while active).'
                  : 'Fires when a matching actor moves from outside into the saved radius. Teleport, forced movement, and re-entry remain unsettled/open.'}
              </p>
            </div>
          )}
          {chosenItem && (
            <p role="status" data-passive-status={statusSummary.status} data-passive-display-status="">
              Selected character status ({chosenItem.label} — {targetLabel(chosenRef)}): <strong>{statusSummary.displayText}</strong>
            </p>
          )}
          {!primaries.length && <p className="first-playable-trigger-error">No bound primary player character is available.</p>}
          <h4>Recorded passive activations</h4>
          {activations.map(act => (
            <div key={act.activationId} className="first-playable-trigger-row" data-passive-activation-row={act.state}>
              <p>
                <strong>{act.name || HEIGHTENED_SENSES_PASSIVE.name}</strong> — {targetLabel(act.target)} — <span data-passive-row-status="">{act.displayStatus || (act.state === 'active' ? 'Active — +2 initiative' : `Inactive — ${act.reason || 'disabled'}`)}</span>
              </p>
              <button type="button" disabled={busy} onClick={() => perform(() => revokePassive(act.activationId))}>
                Revoke passive
              </button>
            </div>
          ))}
          {!activations.length && <p data-passive-empty="">Stored — not active (no active passive records).</p>}
          <button type="button" disabled={busy || loading} onClick={() => perform(refreshPassiveLedger)}>
            Refresh passive ledger
          </button>
        </details>
      )}
    </section>
  );
}
