import { refOf } from './actorConsequenceService';
import { actionId } from './authoredAbility';
import { installedEntries } from './authoredAbilityRegistry';
import { key as cooldownKey } from './authoredCooldown';
import { isPeriodicTick, isChanneledTick, isCasterAnchored, sameRef, structuredBoundary } from './sharedConditionProfile';
import { clock as readClock, dueTicks as readDueTicks, remaining as countRemaining, scheduleFor } from './sharedEffectTiming';

const isHiddenToken = token => Boolean(
  token?.state?.hiddenFromPlayers ||
  token?.hiddenFromPlayers ||
  token?.state?.isHidden ||
  token?.isHidden
);

const findCombatantToken = (entry, allTokens) => {
  if (entry?.actorRef) {
    const byRef = allTokens.find(token => {
      const ref = refOf(token);
      return ref && sameRef(ref, entry.actorRef);
    });
    if (byRef) return byRef;
  }
  if (entry?.tokenId) {
    return allTokens.find(token => token?.id === entry.tokenId) || null;
  }
  return null;
};

const resolveAbilityNames = (actorRef, definitions) => {
  const byKey = new Map();
  if (!actorRef || !Array.isArray(definitions)) return byKey;
  for (const entry of definitions) {
    const defId = entry?.canonicalDefinition?.definitionId || (entry?.definitionRef ? actionId(entry.definitionRef) : null);
    const name = entry?.canonicalDefinition?.name;
    if (!defId || !name) continue;
    byKey.set(cooldownKey(actorRef, defId), name);
  }
  return byKey;
};

const isManualCondition = record => (
  record?.clockBoundary === 'manual' ||
  record?.sharedTiming === 'manual' ||
  record?.durationType === 'manual'
) && !structuredBoundary(record);

export function projectOngoingEffects({
  combat = null,
  turnOrder = [],
  currentTurnIndex = 0,
  round = 1,
  isInCombat = false,
  isInMultiplayer = false,
  clockPhase = 'ready',
  characterTokens = [],
  creatureTokens = [],
  isGMMode = false,
  roomId = null,
  installedDefinitions = null
} = {}) {
  const authoritativeCombat = combat || (isInCombat ? {
    isActive: true,
    turnOrder,
    currentTurnIndex,
    round,
    effectLifecycle: null,
    retiredPeriodicTicks: null
  } : null);

  const rawClock = authoritativeCombat ? readClock(authoritativeCombat) : null;
  const clockReady = !isInMultiplayer || clockPhase !== 'unavailable';
  const liveClock = clockReady ? rawClock : null;
  const effectiveCombat = liveClock ? authoritativeCombat : (authoritativeCombat ? { ...authoritativeCombat, effectLifecycle: null } : null);

  const allTokens = [...(characterTokens || []), ...(creatureTokens || [])];
  const definitions = Array.isArray(installedDefinitions)
    ? installedDefinitions
    : (roomId ? installedEntries(roomId) : []);

  const effects = [];
  const cooldowns = [];
  const actorNamesByRef = [];

  for (const entry of (authoritativeCombat?.turnOrder || turnOrder || [])) {
    const token = findCombatantToken(entry, allTokens);
    if (!token) continue;
    if (!isGMMode && (isHiddenToken(token) || isHiddenToken(entry))) continue;

    const actorName = token?.state?.customName || entry?.name || token?.name || token?.character?.name || 'Combatant';
    const actorRef = entry?.actorRef || refOf(token);
    if (actorRef) {
      actorNamesByRef.push({ ref: actorRef, name: actorName });
    }

    const conditions = Array.isArray(token?.state?.conditions) ? token.state.conditions : [];
    for (let i = 0; i < conditions.length; i += 1) {
      const record = conditions[i];
      if (!record || typeof record !== 'object') continue;
      const effectName = record.name || record.originalName || record.conditionKey || 'Effect';
      const id = record.recordId || record.id || `${actorName}-${effectName}-${i}`;
      const schedule = liveClock && effectiveCombat ? scheduleFor(record, effectiveCombat) : null;

      if (schedule) {
        const total = schedule.occurrences || 1;
        const left = countRemaining(schedule, liveClock.sequence);
        const nextSequence = left > 0 ? schedule.dueSequence - (left - 1) * (schedule.period || 1) : null;
        const finalSequence = schedule.dueSequence;
        const boundary = schedule.boundary === 'start' ? 'start' : 'end';
        const periodic = isPeriodicTick(record);
        const channeled = isChanneledTick(record);
        const ticking = periodic || channeled;
        const anchorWords = isCasterAnchored(record) ? 'caster-turn' : 'target-turn';
        const anchorBoundaryWords = isCasterAnchored(record) ? 'caster turn' : 'target turn';
        const unit = ticking ? (left === 1 ? 'tick' : 'ticks') : (boundary === 'start' ? (left === 1 ? 'start' : 'starts') : (left === 1 ? 'end' : 'ends'));

        effects.push({
          id,
          effectName,
          actorName,
          timingStatus: 'scheduled',
          kind: channeled ? 'channeled' : periodic ? 'periodic' : (total > 1 ? 'counted' : 'next-turn'),
          boundary,
          totalOccurrences: total,
          remainingOccurrences: left,
          nextSequence,
          finalSequence,
          remainingText: `${left} of ${total} ${anchorWords} ${unit} remaining`,
          nextOccurrenceText: nextSequence !== null
            ? `Next ${ticking ? 'tick' : 'occurrence'}: ${anchorBoundaryWords} ${boundary} (boundary ${nextSequence})`
            : `Next ${ticking ? 'tick' : 'occurrence'}: none remaining`,
          finalExpiryText: nextSequence === finalSequence
            ? `Final expiry: this next occurrence (boundary ${finalSequence})`
            : `Final expiry: ${anchorBoundaryWords} ${boundary} (boundary ${finalSequence})`
        });
      } else if (isManualCondition(record)) {
        const safeDuration = typeof record.authoredDuration === 'string' && record.authoredDuration.trim()
          ? `${record.authoredDuration.trim()} — GM manages timing.`
          : 'GM manages timing.';
        effects.push({
          id,
          effectName,
          actorName,
          timingStatus: 'manual',
          timingLabel: 'Manual duration',
          detailText: safeDuration
        });
      } else {
        effects.push({
          id,
          effectName,
          actorName,
          timingStatus: 'unavailable',
          timingLabel: 'Timing unavailable',
          detailText: 'Not tracked by the current turn clock.'
        });
      }
    }

    const tokenCooldowns = token?.state?.authoredCooldowns;
    if (tokenCooldowns && typeof tokenCooldowns === 'object' && !Array.isArray(tokenCooldowns)) {
      const namesByKey = resolveAbilityNames(actorRef, definitions);
      for (const [cdKey, item] of Object.entries(tokenCooldowns)) {
        if (!item || typeof item !== 'object') continue;
        const abilityName = namesByKey.get(cdKey) || 'Ability cooldown';
        const orderLength = (authoritativeCombat?.turnOrder || []).length;
        const tracked = Boolean(
          liveClock &&
          item.combatId === liveClock.id &&
          Number.isSafeInteger(item.period) &&
          item.period === orderLength &&
          Number.isSafeInteger(item.dueSequence)
        );

        if (tracked) {
          const total = item.occurrences || 1;
          const left = countRemaining(item, liveClock.sequence);
          const nextSequence = left > 0 ? item.dueSequence - (left - 1) * item.period : null;
          const finalSequence = item.dueSequence;
          cooldowns.push({
            id: cdKey,
            abilityName,
            actorName,
            timingStatus: 'scheduled',
            totalOccurrences: total,
            remainingOccurrences: left,
            nextSequence,
            finalSequence,
            remainingText: `${left} of ${total} caster-turn ${left === 1 ? 'start' : 'starts'} remaining`,
            nextOccurrenceText: nextSequence !== null
              ? `Next caster-turn start: boundary ${nextSequence}`
              : 'Next caster-turn start: none remaining',
            releaseText: nextSequence === finalSequence
              ? `Releases: this next occurrence (boundary ${finalSequence})`
              : `Releases: caster-turn start (boundary ${finalSequence})`
          });
        } else {
          cooldowns.push({
            id: cdKey,
            abilityName,
            actorName,
            timingStatus: 'unavailable',
            timingLabel: 'Timing unavailable',
            detailText: 'Turn clock retired or unavailable; GM manual adjudication required.'
          });
        }
      }
    }
  }

  const rawTicks = authoritativeCombat ? readDueTicks(authoritativeCombat) : [];
  const dueTicks = [];
  for (const tick of rawTicks) {
    const token = tick?.ref ? findCombatantToken({ actorRef: tick.ref, tokenId: tick.ref.tokenId }, allTokens) : null;
    if (!isGMMode && (!token || isHiddenToken(token))) continue;
    const matchedActor = tick?.ref
      ? actorNamesByRef.find(item => sameRef(item.ref, tick.ref))
      : null;
    const actorName = matchedActor?.name || token?.name || token?.character?.name || 'Combatant';
    const isLive = Boolean(tick.live && liveClock && tick.combatId === liveClock.id);
    dueTicks.push({
      tickId: tick.tickId,
      label: tick.label || 'Periodic tick',
      actorName,
      occurrence: tick.occurrence,
      total: tick.of,
      sequence: tick.sequence,
      final: Boolean(tick.final),
      live: isLive,
      occurrenceText: `Tick ${tick.occurrence} of ${tick.of}${tick.final ? ' (last tick; effect ended)' : ''}`,
      boundaryText: `Boundary ${tick.sequence}`,
      statusText: isLive ? 'Awaiting GM resolution' : 'Timing unavailable — retired clock (GM resolves by hand)'
    });
  }

  return {
    clock: liveClock ? { id: liveClock.id, sequence: liveClock.sequence } : null,
    effects,
    dueTicks,
    cooldowns
  };
}
