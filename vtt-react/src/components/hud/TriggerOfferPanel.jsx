import React, { useEffect, useMemo, useRef, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { useSpellConsequenceStore, refreshAuthoredAbilities, routeSpellCast, ownerSource } from '../../services/spellConsequenceService';
import { sameExactRef } from '../../services/featherSlash';
import { actionId, FOLLOWUP_TRIGGER, FOLLOWUP_HEALING_TRIGGER } from '../../services/authoredAbility';
import { useTriggerOfferStore, refreshTriggerLedger, registerTriggerOfferHandlers, registerFollowUp, registerComponentWatch, revokeTriggerListener, dismissTriggerOffer, declineTriggerOffer, clearTriggerRegistrationSetup, primaryPcSources, FOLLOWUP_PREDICATE, HEALING_FOLLOWUP_PREDICATE } from '../../services/triggerOfferService';
import { useReactionWindowStore, reactionPrincipal } from '../../services/reactionWindowService';
import { onRoomRejoined } from '../../services/roomRejoinBus';
import './TriggerOfferPanel.css';

const sourceLabel = ref => ref ? `${ref.kind === 'character' ? 'PC' : 'Creature'} ${ref.tokenId}/${ref.instanceId || '—'}` : 'unknown source';
const lapseText = offer => offer?.lapse === 'expired' ? 'Expired at the source\'s next turn start.'
  : offer?.lapse === 'invalid' ? 'This offer has no authenticated lapse and cannot be used.'
  : offer?.lapse === 'clock-unavailable' ? 'Authenticated turn clock changed; this offer cannot be used.'
  : offer?.lapse === 'unavailable' ? 'Unavailable (listener or policy changed).'
  : offer?.expiresAtSequence !== undefined ? `Available until authenticated source turn boundary ${offer.expiresAtSequence}.`
  : 'Offer state unavailable; this offer cannot be used.';

function nameOf(entry) {
  return entry?.canonicalDefinition?.name || entry?.definitionRef?.definitionId || 'admitted ability';
}
/** Truthful label for a projection item whose admitted entry may be absent or whose ref may be missing/redacted. */
function refName(entry, ref, unavailable = 'unavailable ability') {
  if (entry) return nameOf(entry);
  return ref?.definitionId || unavailable;
}

const authoredFollowUp = entry => entry?.canonicalDefinition?.followUp === FOLLOWUP_TRIGGER || entry?.descriptor?.followUp === FOLLOWUP_TRIGGER;
/** True only for an ability whose own authored trigger is the approved follow-up after healing. The authored trigger
 * chooses the event; nothing in this panel can change it, and such an ability is never registered as a damage follow-up. */
const healingFollowUp = entry => typeof FOLLOWUP_HEALING_TRIGGER === 'string' &&
  (entry?.canonicalDefinition?.followUp === FOLLOWUP_HEALING_TRIGGER || entry?.descriptor?.followUp === FOLLOWUP_HEALING_TRIGGER);

const offerDefinition = offer => offer?.definitionRef || offer?.listener?.definitionRef;
/** Executable pairing modes the GM list shows: whole-spell follow-ups and (engineering slice, unapproved) watched parts. */
const PAIRING_MODES = ['follow-up', 'component-follow-up'];
/** A definition admitted with a watched part (D1 = a). It is an ORIGINATING spell: never offered as a follow-up. */
const watchOf = entry => entry?.canonicalDefinition?.componentWatch || entry?.descriptor?.componentWatch || null;
// The watched part's structural id names the definition shape: a bundle's direct part, or a one-part spell's only (Direct Damage) part.
const PART_WORDS = { 'effects:direct': 'Direct Damage part', effect: 'Direct Damage part (its only part)' };
const partName = componentId => PART_WORDS[componentId] || 'watched part';
const sameRef = (a, b) => Boolean(a && b && sameExactRef(a, b));
/** Lookup key for an exact ref, or '' when the ref is absent. Member projections redact listener definition refs, so the
 * key must never be derived from a missing ref (the panel would crash for an owner whose character has a pairing). */
const refKey = ref => ref && ref.definitionId ? actionId(ref) : '';
const exactEntryMatch = (entry, ref) => Boolean(entry && ref && refKey(entry.definitionRef) && refKey(entry.definitionRef) === refKey(ref) && sameRef(entry.definitionRef, ref));

function GmOfferRow({ offer, name, disabled, onDismiss }) {
  const [reason, setReason] = useState('Resolved at the table');
  return <div className="first-playable-trigger-row">
    <p><strong>{name}</strong> — {sourceLabel(offer.listener?.source)} — listener {offer.listener?.listenerId?.slice(0, 8) || '—'}
      {offer.lapse ? (Number.isSafeInteger(offer.lapse.dueSequence) ? ` — expires at boundary ${offer.lapse.dueSequence}` : ' — lapse unavailable') : ' — no authenticated lapse; evidence only'}
      {offer.listenerRegistered === false ? ' — listener revoked; evidence only' : ''}</p>
    <div className="first-playable-trigger-actions">
      <input aria-label={`Private GM reason for ${name}`} maxLength={500} value={reason} onChange={event => setReason(event.target.value)} />
      <button type="button" disabled={disabled || !reason.trim()} onClick={() => onDismiss(offer.obligationId, reason)}>Dismiss evidence</button>
    </div>
  </div>;
}

export default function TriggerOfferPanel() {
  const roomId = useGameStore(state => state.multiplayerRoom?.id);
  const socket = useGameStore(state => state.multiplayerSocket);
  const isGM = useGameStore(state => state.isGMMode);
  const projection = useTriggerOfferStore(state => state.projection);
  const declined = useTriggerOfferStore(state => state.declined);
  const loading = useTriggerOfferStore(state => state.loading);
  const error = useTriggerOfferStore(state => state.error);
  const message = useTriggerOfferStore(state => state.message);
  const setupRequest = useTriggerOfferStore(state => state.setupRequest) || null;
  const rawEntries = useSpellConsequenceStore(state => (!state.authoredRoomId || state.authoredRoomId === roomId) ? state.authoredEntries : null);
  const entries = useMemo(() => Array.isArray(rawEntries) ? rawEntries : [], [rawEntries]);
  const characterTokens = useCharacterTokenStore(state => state.characterTokens) || [];
  const [sourceKey, setSourceKey] = useState('0');
  const [selectedSourceRef, setSelectedSourceRef] = useState(null);
  const [definitionKey, setDefinitionKey] = useState('');
  const [watchSourceKey, setWatchSourceKey] = useState('0');
  const [selectedWatchSourceRef, setSelectedWatchSourceRef] = useState(null);
  const [watchKey, setWatchKey] = useState('');
  const [watchFollowKey, setWatchFollowKey] = useState('');
  const [regOpen, setRegOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [connected, setConnected] = useState(() => socket?.connected !== false);
  const [localMessage, setLocalMessage] = useState('');
  const [staleNotice, setStaleNotice] = useState('');
  const lastSetupNonceRef = useRef(null);
  const appliedSetupNonceRef = useRef(null);
  const wholeSectionRef = useRef(null);
  const watchSectionRef = useRef(null);

  const clearSetup = () => {
    if (typeof clearTriggerRegistrationSetup === 'function') clearTriggerRegistrationSetup();
    else useTriggerOfferStore.setState({ setupRequest: null });
  };

  const primaries = useMemo(() => {
    const sources = primaryPcSources();
    return Array.isArray(sources) ? sources : [];
  }, [characterTokens, roomId]);
  const admitted = useMemo(() => entries.filter(entry => entry && !entry.revoked && !entry.creatureOnly && refKey(entry.definitionRef) && (!entry.definitionRef?.roomId || entry.definitionRef.roomId === roomId)), [entries, roomId]);
  const byAction = useMemo(() => Object.fromEntries(admitted.map(entry => [actionId(entry.definitionRef), entry])), [admitted]);
  // Whole-spell (bearer-owned) pairing: the follow-up's own trigger or an unmarked ability. A watched spell is an origin, never B.
  const pairable = useMemo(() => admitted.filter(entry => !watchOf(entry)), [admitted]);
  const watched = useMemo(() => admitted.filter(entry => watchOf(entry)), [admitted]);
  // Component watch B: an existing damage follow-up (damage-authored or unmarked), never a healing follow-up or another origin.
  const watchFollowUps = useMemo(() => admitted.filter(entry => !watchOf(entry) && !healingFollowUp(entry) && actionId(entry.definitionRef) !== watchKey), [admitted, watchKey]);
  const activeProjection = projection && (!projection.roomId || projection.roomId === roomId) ? projection : null;
  const viewerRole = activeProjection?.viewerRole;
  // GM controls require both client GM mode and an authoritative server projection with viewerRole === 'gm'.
  const hasGmAuthority = Boolean(isGM && viewerRole === 'gm');
  const listeners = Array.isArray(activeProjection?.listeners) ? activeProjection.listeners.filter(Boolean) : [];
  const offers = (Array.isArray(activeProjection?.obligations) ? activeProjection.obligations : []).filter(offer => offer && offer.mode === 'follow-up');
  const ownOffers = viewerRole === 'member' ? offers.filter(offer => offer.obligationId && !declined.includes(offer.obligationId)) : [];
  const registrationConflicts = Array.isArray(activeProjection?.registrationConflicts) ? activeProjection.registrationConflicts.filter(Boolean) : [];
  const reactionState = useReactionWindowStore(state => state) || {};
  const currentPrincipal = typeof reactionPrincipal === 'function' ? reactionPrincipal() : null;
  const scopedWindows = Array.isArray(reactionState.windows) && (!reactionState.principal || !currentPrincipal || reactionState.principal === currentPrincipal)
    ? reactionState.windows
    : [];
  const hasOpenReactionWindow = scopedWindows.some(w => w.status === 'open');
  const hasClosedReactionWindow = !hasOpenReactionWindow && scopedWindows.some(w => w.status === 'closed' || w.status === 'interrupted');

  useEffect(() => {
    if (!socket) { setConnected(false); return undefined; }
    setConnected(socket.connected !== false);
    if (typeof socket.on !== 'function' || typeof socket.off !== 'function') return undefined;
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !roomId) return undefined;
    const off = registerTriggerOfferHandlers({ socket });
    const offRejoin = typeof onRoomRejoined === 'function'
      ? onRoomRejoined(event => { if (!event?.socket || event.socket === socket) refreshTriggerLedger(); })
      : () => {};
    refreshTriggerLedger();
    if (!useSpellConsequenceStore.getState().authoredEntries) refreshAuthoredAbilities();
    return () => {
      if (typeof off === 'function') off();
      if (typeof offRejoin === 'function') offRejoin();
    };
  }, [socket, roomId]);

  useEffect(() => {
    setLocalMessage('');
    setStaleNotice('');
  }, [roomId, hasGmAuthority]);

  // Guided Spellbook-to-registration setup: open panel and preselect exact admitted spell/version.
  useEffect(() => {
    if (!setupRequest) {
      appliedSetupNonceRef.current = null;
      return;
    }
    if (!hasGmAuthority) return;
    const reqNonce = setupRequest.nonce ?? refKey(setupRequest.definitionRef);
    const isNewRequest = reqNonce !== lastSetupNonceRef.current;
    if (isNewRequest) {
      lastSetupNonceRef.current = reqNonce;
      setRegOpen(true);
      setLocalMessage('');
      setStaleNotice('');
    }
    const entriesLoaded = Array.isArray(rawEntries);
    if (!entriesLoaded) return;
    const targetRef = setupRequest.definitionRef;
    const targetActionId = refKey(targetRef);
    const matchingAdmitted = admitted.find(entry => exactEntryMatch(entry, targetRef));
    const validForMode = Boolean(
      matchingAdmitted &&
      (setupRequest.mode === 'component-watch'
        ? watched.some(entry => exactEntryMatch(entry, targetRef))
        : pairable.some(entry => exactEntryMatch(entry, targetRef)))
    );
    if (!validForMode) {
      clearSetup();
      appliedSetupNonceRef.current = null;
      if (setupRequest.mode === 'component-watch') setWatchKey(curr => (curr === targetActionId ? '' : curr));
      if (setupRequest.mode === 'follow-up') setDefinitionKey(curr => (curr === targetActionId ? '' : curr));
      setStaleNotice('The selected admitted spell version was revoked or replaced. Refreshing room data; choose a current admitted version.');
      refreshAuthoredAbilities();
      refreshTriggerLedger();
      return;
    }
    if (appliedSetupNonceRef.current !== reqNonce) {
      appliedSetupNonceRef.current = reqNonce;
      if (setupRequest.mode === 'component-watch') {
        setWatchKey(targetActionId);
        watchSectionRef.current?.scrollIntoView?.({ block: 'nearest' });
      } else if (setupRequest.mode === 'follow-up') {
        setDefinitionKey(targetActionId);
        wholeSectionRef.current?.scrollIntoView?.({ block: 'nearest' });
      }
    }
  }, [hasGmAuthority, setupRequest, rawEntries, admitted, pairable, watched]);

  // Detect stale actor incarnations when primaries update.
  useEffect(() => {
    if (!hasGmAuthority) return;
    let staleActor = false;
    if (selectedSourceRef) {
      const idx = primaries.findIndex(p => sameRef(p.ref, selectedSourceRef));
      if (idx < 0) {
        setSelectedSourceRef(null);
        setSourceKey('');
        staleActor = true;
      } else if (String(idx) !== sourceKey) {
        setSourceKey(String(idx));
      }
    } else if (sourceKey !== '' && primaries[Number(sourceKey)]?.ref) {
      setSelectedSourceRef(primaries[Number(sourceKey)].ref);
    } else if (sourceKey !== '' && !primaries[Number(sourceKey)]) {
      setSourceKey('');
    }

    if (selectedWatchSourceRef) {
      const idx = primaries.findIndex(p => sameRef(p.ref, selectedWatchSourceRef));
      if (idx < 0) {
        setSelectedWatchSourceRef(null);
        setWatchSourceKey('');
        staleActor = true;
      } else if (String(idx) !== watchSourceKey) {
        setWatchSourceKey(String(idx));
      }
    } else if (watchSourceKey !== '' && primaries[Number(watchSourceKey)]?.ref) {
      setSelectedWatchSourceRef(primaries[Number(watchSourceKey)].ref);
    } else if (watchSourceKey !== '' && !primaries[Number(watchSourceKey)]) {
      setWatchSourceKey('');
    }

    if (staleActor) {
      setStaleNotice('The selected primary PC incarnation changed or is no longer available. Refreshing room data; select the current primary PC.');
      refreshTriggerLedger();
      refreshAuthoredAbilities();
    }
  }, [hasGmAuthority, primaries, selectedSourceRef, selectedWatchSourceRef, sourceKey, watchSourceKey]);

  // Detect stale manual definition selections when admitted entries change (revoked/replaced).
  useEffect(() => {
    if (!hasGmAuthority || !Array.isArray(rawEntries)) return;
    let staleDef = false;
    if (definitionKey && !pairable.some(entry => actionId(entry.definitionRef) === definitionKey)) {
      setDefinitionKey('');
      staleDef = true;
    } else if (!definitionKey && !staleNotice && setupRequest?.mode !== 'follow-up' && pairable.length) {
      setDefinitionKey(actionId(pairable[0].definitionRef));
    }

    if (watchKey && !watched.some(entry => actionId(entry.definitionRef) === watchKey)) {
      setWatchKey('');
      staleDef = true;
    } else if (!watchKey && !staleNotice && setupRequest?.mode !== 'component-watch' && watched.length) {
      setWatchKey(actionId(watched[0].definitionRef));
    }

    if (watchFollowKey && !watchFollowUps.some(entry => actionId(entry.definitionRef) === watchFollowKey)) {
      setWatchFollowKey('');
      staleDef = true;
    } else if (!watchFollowKey && !staleNotice && watchFollowUps.length) {
      setWatchFollowKey(actionId(watchFollowUps[0].definitionRef));
    }

    if (staleDef) {
      setStaleNotice('A selected admitted spell version was revoked or replaced. Refreshing room data; choose a current admitted version.');
      refreshAuthoredAbilities();
      refreshTriggerLedger();
    }
  }, [hasGmAuthority, rawEntries, pairable, watched, watchFollowUps, definitionKey, watchKey, watchFollowKey, staleNotice, setupRequest]);

  if (!roomId) return null;
  if (!activeProjection && !loading && !error) return null;
  if (!ownOffers.length && !hasGmAuthority && viewerRole !== 'member' && !error && !localMessage && !message) return null;

  const perform = async (action, { clearGuidedOnSuccess = false } = {}) => {
    setBusy(true); setLocalMessage(''); setStaleNotice('');
    try {
      const result = await action();
      if (result?.success === false) setLocalMessage(result.error || result.code || 'Refused.');
      else if (result?.success) {
        if (clearGuidedOnSuccess) clearSetup();
        setLocalMessage(result.mode === 'component-follow-up' ? 'Recorded: component watch registered.' : result.mode === 'follow-up' ? 'Recorded: follow-up pairing registered.' : 'Recorded.');
      }
    } catch (caught) { setLocalMessage(caught.message); }
    finally { setBusy(false); }
  };

  const currentSource = ownerSource();
  const selectOffer = offer => {
    const offerSource = listeners.find(item => item.listenerId === offer.listenerId)?.source;
    if (!offerSource || currentSource.error || !sameExactRef(currentSource.ref, offerSource)) {
      setLocalMessage('This offer belongs to another of your characters. Select that exact primary character before using it.');
      return;
    }
    const definitionRef = offerDefinition(offer);
    const entry = byAction[refKey(definitionRef)];
    const definitionId = entry ? actionId(entry.definitionRef) : definitionRef?.definitionId;
    if (!definitionId) { setLocalMessage('The offered ability is not currently admitted.'); return; }
    if (!routeSpellCast({ id: definitionId }, { producer: 'trigger-offer', triggerOfferId: offer.obligationId })) {
      setLocalMessage('The offered ability is unavailable to your current owner attachment.');
    }
  };

  const chosenSource = sourceKey !== '' ? primaries[Number(sourceKey)]?.ref : undefined;
  const chosenEntry = pairable.find(entry => actionId(entry.definitionRef) === definitionKey);
  // Conflict explanations are GM-only: only the GM projection carries listener definition refs.
  const pairingsFor = ref => hasGmAuthority ? listeners.filter(listener => PAIRING_MODES.includes(listener.mode) && sameRef(listener.source, ref)) : [];
  const describePairing = listener => {
    const offered = refName(byAction[refKey(listener.definitionRef)], listener.definitionRef, 'an unavailable ability');
    const offeredVersion = listener.definitionRef?.definitionVersion;
    const offeredLabel = offeredVersion ? `${offered} (v${offeredVersion})` : offered;
    if (listener.mode === 'component-follow-up') {
      const origin = refName(byAction[refKey(listener.watch?.definitionRef)], listener.watch?.definitionRef, 'an unavailable watched ability');
      const originVersion = listener.watch?.definitionRef?.definitionVersion;
      const originPart = listener.watch?.componentId ? partName(listener.watch.componentId) : '';
      const originMeta = [originVersion ? `v${originVersion}` : '', originPart].filter(Boolean).join(' · ');
      return `a component watch offering ${offeredLabel} after ${origin}${originMeta ? ` (${originMeta})` : ''}`;
    }
    return `a whole-spell pairing of ${offeredLabel}`;
  };
  const conflictText = ref => {
    const existing = pairingsFor(ref);
    return existing.length ? `This character already has ${existing.map(describePairing).join(' and ')}. In this first slice a character has at most one pairing of either kind; revoke it before registering another.` : '';
  };
  const watchSource = watchSourceKey !== '' ? primaries[Number(watchSourceKey)]?.ref : undefined;
  const watchEntry = watched.find(entry => actionId(entry.definitionRef) === watchKey);
  const watchFollow = watchFollowUps.find(entry => actionId(entry.definitionRef) === watchFollowKey);
  const watchConflict = watchSource ? conflictText(watchSource) : '';
  const wholeConflict = chosenSource ? conflictText(chosenSource) : '';
  const setupEntry = setupRequest?.definitionRef
    ? admitted.find(entry => exactEntryMatch(entry, setupRequest.definitionRef)) || null
    : null;
  const setupName = setupRequest?.spellName || (setupEntry ? nameOf(setupEntry) : setupRequest?.definitionRef?.definitionId || '');
  const setupVersion = setupEntry?.definitionRef?.definitionVersion ?? setupRequest?.definitionRef?.definitionVersion ?? 1;
  const setupWatch = watchOf(setupEntry) || (setupRequest?.componentId ? { componentId: setupRequest.componentId } : null);
  const offerStates = ownOffers.map(offer => {
    const defRef = offerDefinition(offer);
    const entry = byAction[refKey(defRef)];
    const name = refName(entry, defRef, 'offered ability (unavailable)');
    const offerSource = listeners.find(item => item.listenerId === offer.listenerId)?.source;
    const sourceMatches = !!offerSource && !currentSource.error && sameExactRef(currentSource.ref, offerSource);
    const serverUsable = Boolean(refKey(defRef)) && offer.available === true && offer.lapse !== 'expired' && offer.lapse !== 'invalid' && offer.lapse !== 'conflict';
    const usable = connected && serverUsable && sourceMatches;
    return { offer, name, offerSource, sourceMatches, serverUsable, usable };
  });
  const usableOffers = offerStates.filter(item => item.serverUsable && item.sourceMatches);
  const otherCharOffers = offerStates.filter(item => item.serverUsable && item.offerSource && !item.sourceMatches);

  return <section className="first-playable-trigger" aria-label="Follow-up trigger offers">
    {(ownOffers.length > 0 || viewerRole === 'member' || error || localMessage || message) && <details className="first-playable-trigger-box" open>
      <summary>
        Follow-up offers ({ownOffers.length})
        {!connected
          ? <span className="p9-info-badge">Disconnected</span>
          : ownOffers.length > 0
            ? <span className="p9-action-badge">Needs your action</span>
            : <span className="p9-info-badge">No action needed</span>}
      </summary>
      {error && <p role="alert" className="first-playable-trigger-error">{error}</p>}
      {(localMessage || message) && <p role="status">{localMessage || message}</p>}
      {ownOffers.length === 0 && viewerRole === 'member' && (
        <div className={`fpt-choice-banner fpt-empty-member${!connected ? ' is-disconnected' : ''}`}>
          <p
            className="fpt-instruction"
            role="status"
            data-followup-state={!connected ? 'disconnected' : hasOpenReactionWindow ? 'empty-open-window' : hasClosedReactionWindow ? 'empty-closed-window' : 'ineligible'}
          >
            {!connected
              ? 'Connection lost — reconnect to check whether a follow-up offer is available.'
              : hasOpenReactionWindow
                ? 'No follow-up offer is available; use the 8-second reaction window or wait for the GM.'
                : hasClosedReactionWindow
                  ? 'The 8-second reaction window is closed and no follow-up is available; wait for the GM.'
                  : 'No reaction or follow-up is available for you right now; wait for the GM or active player.'}
          </p>
        </div>
      )}
      {ownOffers.length > 0 && (
        <div
          className={`fpt-choice-banner${!connected ? ' is-disconnected' : hasClosedReactionWindow && usableOffers.length > 0 ? ' is-after-close' : ''}`}
          data-followup-state={!connected ? 'disconnected' : hasClosedReactionWindow && usableOffers.length > 0 ? 'after-close-available' : hasOpenReactionWindow && usableOffers.length > 0 ? 'open-window-available' : usableOffers.length > 0 ? 'available' : 'unavailable'}
        >
          <p className="fpt-choice-row">
            <span className={`fpt-choice-pill${usableOffers.length > 0 && connected ? ' is-ready' : ''}`}>Ordinary follow-up · No 8s timer</span>
            {connected && hasClosedReactionWindow && usableOffers.length > 0 && (
              <span className="fpt-choice-pill is-ready">Still available after 8s window</span>
            )}
          </p>
          <p className="fpt-instruction">
            {!connected
              ? 'Connection lost — reconnect to confirm this follow-up is still available.'
              : usableOffers.length > 0 && hasOpenReactionWindow
                ? 'Available now or after the 8-second reaction window closes — click Use this offer when ready.'
                : usableOffers.length > 0 && hasClosedReactionWindow
                  ? 'The 8-second reaction window closed, but this follow-up is still available — click Use this offer or Decline.'
                  : usableOffers.length > 0
                    ? 'Optional follow-up ready — click Use this offer to cast, or Decline.'
                    : otherCharOffers.length > 0
                      ? 'Select that primary character before clicking Use this offer.'
                      : 'This follow-up is no longer available; wait for the GM.'}
          </p>
        </div>
      )}
      {offerStates.map(({ offer, name, offerSource, sourceMatches, usable }) => {
        return <div key={offer.obligationId} className="first-playable-trigger-row">
          <p><strong>{name}</strong> — optional. {lapseText(offer)}</p>
          {offerSource && !sourceMatches && <p className="first-playable-trigger-error" role="alert">This offer belongs to another of your characters. Select that exact primary character before using it.</p>}
          <div className="first-playable-trigger-actions">
            <button type="button" disabled={busy || !usable} onClick={() => selectOffer(offer)}>Use this offer</button>
            <button type="button" disabled={busy || !connected} onClick={() => declineTriggerOffer(offer.obligationId)}>Decline</button>
          </div>
        </div>;
      })}
      {ownOffers.length > 0 && <details className="p9-tech-disclosure">
        <summary>Offer &amp; cost rules</summary>
        <p className="first-playable-trigger-note">Using an offer opens the ordinary cast panel. It pays its normal listed AP/mana/class price, starts its own cooldown, and uses its own targeting, range and consent. Ignoring or declining it spends nothing.</p>
      </details>}
    </details>}
    {hasGmAuthority && <details className="first-playable-trigger-box" open={regOpen} onToggle={event => setRegOpen(event.currentTarget.open)}>
      <summary>
        Follow-up trigger registration
        <span className="p9-info-badge">Setup</span>
      </summary>
      {setupRequest && <div
        className="first-playable-trigger-row"
        data-guided-trigger-setup={setupRequest.mode}
        {...(setupRequest.mode === 'component-watch' ? {
          'data-guided-watch-version': String(setupVersion),
          'data-guided-watch-component': setupWatch?.componentId || ''
        } : {})}
      >
        <p>
          <strong>{setupRequest.mode === 'component-watch' ? 'Guided setup: Component watch' : 'Guided setup: Whole-spell follow-up'}</strong>
          {' '}— {setupName} (v{setupVersion})
          {setupRequest.mode === 'component-watch' && setupWatch?.componentId ? ` — ${partName(setupWatch.componentId)}` : ''}
        </p>
        <p className="first-playable-trigger-note">
          {setupRequest.mode === 'component-watch'
            ? 'Component-watch bearer: this spell is the originating watched spell (never offered as its own follow-up). Select the watching primary PC and the separate follow-up spell B below.'
            : 'Whole-spell trigger bearer: this admitted spell is itself the offered follow-up when the chosen primary PC\'s qualifying cast succeeds.'}
        </p>
        <div className="first-playable-trigger-actions">
          <button type="button" disabled={busy} onClick={() => { clearSetup(); setStaleNotice(''); setLocalMessage(''); }}>Cancel setup</button>
        </div>
      </div>}
      {staleNotice && <p role="alert" className="first-playable-trigger-error" data-stale-notice="true">{staleNotice}</p>}
      {error && <p role="alert" className="first-playable-trigger-error">{error}</p>}
      {(localMessage || message) && <p role="status" data-registration-status="true">{localMessage || message}</p>}
      <details className="p9-tech-disclosure">
        <summary>Qualifying cast &amp; predicate rules</summary>
        <p>Registers one existing admitted ability as the optional follow-up for the primary owner PC's next qualifying cast. A qualifying cast is an ordinary single-target immediate-damage cast that removes at least 1 base HP from a creature; temporary-HP absorption alone does not qualify. For an ability authored as a follow-up after healing, a qualifying cast is instead an ordinary single-target immediate-healing cast that actually restores at least 1 HP to a creature or to another primary player character; healing yourself, or healing that restores nothing, does not qualify. Registration is allowed at any time. An executable offer is created only when that cast occurs during authenticated turn tracking with the source in the exact roster; otherwise the cast completes normally and no offer is created. There is no manual-lapse fallback.</p>
        <p className="first-playable-trigger-note">Parent predicate fixed by creator approval: {FOLLOWUP_PREDICATE.occurrence} / {FOLLOWUP_PREDICATE.role} / {FOLLOWUP_PREDICATE.evidence}. For an ability authored as a follow-up after healing the fixed predicate is immediate-healing / source / hpRestored; the ability's own authored trigger chooses which. This registers an existing admitted ability. A Wizard-authored follow-up trigger is marked below; saving or admitting that spell alone never registers a pairing or creates an offer.</p>
      </details>
      {registrationConflicts.map((conflict, idx) => {
        const ids = Array.isArray(conflict.listenerIds) ? conflict.listenerIds.map(id => String(id).slice(0, 8)).join(', ') : 'unavailable';
        return <p key={`${conflict.source?.tokenId || 'unknown'}/${conflict.source?.instanceId || idx}`} className="first-playable-trigger-error" role="alert">Multiple follow-up pairings are registered for {sourceLabel(conflict.source)}. Revoke all but one pairing; no new executable offers will be created until resolved. An exact offer created before the conflict remains usable by its offer ID. ({ids})</p>;
      })}
      <h4 ref={wholeSectionRef}>Whole-spell follow-up pairing (the follow-up's own trigger)</h4>
      <div className="first-playable-trigger-form">
        <label>Source primary PC
          <select value={sourceKey} onChange={event => {
            const val = event.target.value;
            setSourceKey(val);
            setSelectedSourceRef(val !== '' ? primaries[Number(val)]?.ref || null : null);
            setStaleNotice('');
          }}>
            {sourceKey === '' && <option value="">Select primary PC…</option>}
            {primaries.map((item, index) => <option key={`${item.ref.mapId}/${item.ref.tokenId}/${item.ref.instanceId}`} value={String(index)}>{item.label} — {sourceLabel(item.ref)}</option>)}
          </select>
        </label>
        <label>Follow-up ability B
          <select value={definitionKey} onChange={event => {
            const nextVal = event.target.value;
            setDefinitionKey(nextVal);
            setStaleNotice('');
            if (setupRequest?.mode === 'follow-up' && nextVal !== refKey(setupRequest.definitionRef)) clearSetup();
          }}>
            {definitionKey === '' && <option value="">Select follow-up ability…</option>}
            {pairable.map(entry => <option key={actionId(entry.definitionRef)} value={actionId(entry.definitionRef)}>{nameOf(entry)} — v{entry.definitionRef.definitionVersion}{authoredFollowUp(entry) ? ' — authored follow-up trigger' : ''}{healingFollowUp(entry) ? ' — authored follow-up trigger (after my healing)' : ''}</option>)}
          </select>
        </label>
        <button type="button" disabled={busy || !chosenSource || !chosenEntry} onClick={() => perform(() => registerFollowUp(healingFollowUp(chosenEntry)
          ? { source: chosenSource, definitionRef: chosenEntry.definitionRef, on: HEALING_FOLLOWUP_PREDICATE }
          : { source: chosenSource, definitionRef: chosenEntry.definitionRef }), { clearGuidedOnSuccess: true })}>Register follow-up pairing</button>
      </div>
      {healingFollowUp(chosenEntry) && <p className="first-playable-trigger-note" data-followup-event="immediate-healing">This pairing will listen for healing: it is offered after the chosen character's healing actually restores HP to a creature or to another primary player character.</p>}
      {wholeConflict && <p className="first-playable-trigger-note" role="status" data-pairing-conflict="whole-spell">{wholeConflict}</p>}
      {!primaries.length && <p className="first-playable-trigger-error">No bound primary player character is available.</p>}
      {!admitted.length && <p className="first-playable-trigger-error">No admitted ability is available. Admit one from Admitted abilities first.</p>}
      <h4 ref={watchSectionRef}>Component watch (a separate follow-up offered after one part of another spell)</h4>
      <div data-component-watch-registration="">
        <details className="p9-tech-disclosure">
          <summary>Component watch rules</summary>
          <p className="first-playable-trigger-note">This is not the follow-up's own trigger. The watched spell carries Follow-up After My Damage on its Direct Damage part, and that part is the origin: only the base HP that part actually removes from a creature counts (at least 1, after temporary HP). Its other parts and its saving throw never count. The follow-up spell chosen here is separate; it is offered once per cast of the watched spell under the ordinary follow-up rules: optional, its full normal price and cooldown, its own targeting, range and consent, GM confirmation, lapsing at the character's next authenticated turn start, never chaining. Nothing is cast partly, and the watched spell is never offered itself.</p>
        </details>
        <div className="first-playable-trigger-form">
          <label>Watching primary PC
            <select value={watchSourceKey} onChange={event => {
              const val = event.target.value;
              setWatchSourceKey(val);
              setSelectedWatchSourceRef(val !== '' ? primaries[Number(val)]?.ref || null : null);
              setStaleNotice('');
            }}>
              {watchSourceKey === '' && <option value="">Select primary PC…</option>}
              {primaries.map((item, index) => <option key={`w-${item.ref.mapId}/${item.ref.tokenId}/${item.ref.instanceId}`} value={String(index)}>{item.label} — {sourceLabel(item.ref)}</option>)}
            </select>
          </label>
          <label>Watched spell part (origin)
            <select value={watchKey} onChange={event => {
              const nextVal = event.target.value;
              setWatchKey(nextVal);
              setStaleNotice('');
              if (setupRequest?.mode === 'component-watch' && nextVal !== refKey(setupRequest.definitionRef)) clearSetup();
            }}>
              {watchKey === '' && <option value="">Select watched spell…</option>}
              {watched.map(entry => <option key={actionId(entry.definitionRef)} value={actionId(entry.definitionRef)}>{nameOf(entry)} — v{entry.definitionRef.definitionVersion} — {partName(watchOf(entry).componentId)}</option>)}
            </select>
          </label>
          <label>Follow-up spell B (offered)
            <select value={watchFollowKey} onChange={event => { setWatchFollowKey(event.target.value); setStaleNotice(''); }}>
              {watchFollowKey === '' && <option value="">Select follow-up spell B…</option>}
              {watchFollowUps.map(entry => <option key={actionId(entry.definitionRef)} value={actionId(entry.definitionRef)}>{nameOf(entry)} — v{entry.definitionRef.definitionVersion} — offered by this watch{authoredFollowUp(entry) ? ' (has its own follow-up trigger)' : ''}</option>)}
            </select>
          </label>
          <button type="button" disabled={busy || !watchSource || !watchEntry || !watchFollow || Boolean(watchConflict)}
            onClick={() => perform(() => registerComponentWatch({ source: watchSource, definitionRef: watchFollow.definitionRef,
              watch: { definitionRef: watchEntry.definitionRef, componentId: watchOf(watchEntry).componentId } }), { clearGuidedOnSuccess: true })}>Register component watch</button>
        </div>
        {watchEntry && watchOf(watchEntry) && (
          <p
            className="first-playable-trigger-note"
            data-selected-component-watch={`${watchEntry.definitionRef.definitionVersion}:${watchOf(watchEntry).componentId}`}
          >
            Watching exact version <strong>{nameOf(watchEntry)} (v{watchEntry.definitionRef.definitionVersion})</strong> — <strong>{partName(watchOf(watchEntry).componentId)}</strong>. Other versions of this spell are not watched unless registered separately.
          </p>
        )}
        {watchConflict && <p className="first-playable-trigger-error" role="alert" data-pairing-conflict="component-watch">{watchConflict}</p>}
        {!watched.length && <p className="first-playable-trigger-note">No admitted spell has a watched part. Attach Follow-up After My Damage to a spell's Direct Damage part in the Wizard, save it, and admit it first.</p>}
        {watched.length > 0 && !watchFollowUps.length && <p className="first-playable-trigger-note">No separate damage follow-up spell is admitted. Admit the follow-up spell B first.</p>}
      </div>
      <h4>Registered pairings</h4>
      {listeners.filter(listener => PAIRING_MODES.includes(listener.mode)).map((listener, idx) => {
        // refKey, never actionId: a projection without the ref (redacted or missing) must not crash this list (r2 review hardening).
        const entry = byAction[refKey(listener.definitionRef)];
        const offeredName = refName(entry, listener.definitionRef, 'Unavailable ability (missing reference)');
        // A watched-part pairing is shown, never registered, here: say what it watches.
        const watchedEntry = listener.mode === 'component-follow-up' && listener.watch ? byAction[refKey(listener.watch.definitionRef)] : null;
        const watchedName = listener.mode === 'component-follow-up'
          ? refName(watchedEntry, listener.watch?.definitionRef, 'unavailable watched ability')
          : '';
        const watchedVersion = listener.watch?.definitionRef?.definitionVersion;
        const watchedPart = listener.watch?.componentId ? partName(listener.watch.componentId) : '';
        const watchedMeta = [watchedVersion ? `v${watchedVersion}` : '', watchedPart].filter(Boolean).join(' · ');
        const eligibilityText = listener.eligibility ? (listener.eligibility.ok ? 'eligible' : listener.eligibility.code || 'ineligible') : 'eligibility unavailable';
        return <div key={listener.listenerId || `missing-${idx}`} className="first-playable-trigger-row" {...(listener.mode === 'component-follow-up' ? { 'data-watch-pairing': listener.watch?.componentId || '', ...(watchedVersion ? { 'data-watch-version': String(watchedVersion) } : {}) } : {})}>
          <p><strong>{offeredName}</strong>{authoredFollowUp(entry) ? ' (authored follow-up trigger)' : ''}{healingFollowUp(entry) ? ' (authored follow-up trigger)' : ''}{listener.on?.occurrence === 'immediate-healing' ? ' — after healing' : ''}{listener.mode === 'component-follow-up' ? ` — offered only after the direct damage part of ${watchedName} removes base HP${watchedMeta ? ` (${watchedMeta})` : ''}` : ''} — {sourceLabel(listener.source)} — {eligibilityText}</p>
          <button type="button" disabled={busy || !listener.listenerId} onClick={() => perform(() => revokeTriggerListener(listener.listenerId))}>Revoke pairing</button>
        </div>;
      })}
      {!listeners.some(listener => PAIRING_MODES.includes(listener.mode)) && <p>No follow-up pairing is registered.</p>}
      <h4>Open offers and evidence</h4>
      {offers.map((offer, idx) => {
        const defRef = offerDefinition(offer);
        const offerName = refName(byAction[refKey(defRef)], defRef, 'Unavailable offer');
        return <GmOfferRow key={offer.obligationId || `offer-${idx}`} offer={offer} name={offerName} disabled={busy || !offer.obligationId} onDismiss={(id, reason) => perform(() => dismissTriggerOffer(id, reason))} />;
      })}
      {!offers.length && <p>No follow-up offer is open.</p>}
      <button type="button" disabled={busy || loading} onClick={() => perform(refreshTriggerLedger)}>Refresh trigger evidence</button>
    </details>}
  </section>;
}