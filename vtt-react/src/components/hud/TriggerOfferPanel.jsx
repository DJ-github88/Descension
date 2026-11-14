import React, { useEffect, useMemo, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { useSpellConsequenceStore, refreshAuthoredAbilities, routeSpellCast, ownerSource } from '../../services/spellConsequenceService';
import { sameExactRef } from '../../services/featherSlash';
import { actionId, FOLLOWUP_TRIGGER, FOLLOWUP_HEALING_TRIGGER } from '../../services/authoredAbility';
import { useTriggerOfferStore, refreshTriggerLedger, registerTriggerOfferHandlers, registerFollowUp, registerComponentWatch, revokeTriggerListener, dismissTriggerOffer, declineTriggerOffer, primaryPcSources, FOLLOWUP_PREDICATE, HEALING_FOLLOWUP_PREDICATE } from '../../services/triggerOfferService';
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
const sameRef = (a, b) => !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
/** Lookup key for an exact ref, or '' when the ref is absent. Member projections redact listener definition refs, so the
 * key must never be derived from a missing ref (the panel would crash for an owner whose character has a pairing). */
const refKey = ref => ref && ref.definitionId ? actionId(ref) : '';

function GmOfferRow({ offer, name, disabled, onDismiss }) {
  const [reason, setReason] = useState('Resolved at the table');
  return <div className="first-playable-trigger-row">
    <p><strong>{name}</strong> — {sourceLabel(offer.listener?.source)} — listener {offer.listener?.listenerId?.slice(0, 8) || '—'}
      {offer.lapse ? ` — expires at boundary ${offer.lapse.dueSequence}` : ' — no authenticated lapse; evidence only'}
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
  const entries = useSpellConsequenceStore(state => state.authoredEntries) || [];
  const characterTokens = useCharacterTokenStore(state => state.characterTokens) || [];
  const [sourceKey, setSourceKey] = useState('');
  const [definitionKey, setDefinitionKey] = useState('');
  const [watchSourceKey, setWatchSourceKey] = useState('0');
  const [watchKey, setWatchKey] = useState('');
  const [watchFollowKey, setWatchFollowKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [localMessage, setLocalMessage] = useState('');

  const primaries = useMemo(() => {
    const sources = primaryPcSources();
    return Array.isArray(sources) ? sources : [];
  }, [characterTokens, roomId]);
  const admitted = useMemo(() => entries.filter(entry => !entry.revoked && !entry.creatureOnly), [entries]);
  const byAction = useMemo(() => Object.fromEntries(admitted.map(entry => [actionId(entry.definitionRef), entry])), [admitted]);
  // Whole-spell (bearer-owned) pairing: the follow-up's own trigger or an unmarked ability. A watched spell is an origin, never B.
  const pairable = useMemo(() => admitted.filter(entry => !watchOf(entry)), [admitted]);
  const watched = useMemo(() => admitted.filter(entry => watchOf(entry)), [admitted]);
  // Component watch B: an existing damage follow-up (damage-authored or unmarked), never a healing follow-up or another origin.
  const watchFollowUps = useMemo(() => admitted.filter(entry => !watchOf(entry) && !healingFollowUp(entry) && actionId(entry.definitionRef) !== watchKey), [admitted, watchKey]);
  const offers = (projection?.obligations || []).filter(offer => offer.mode === 'follow-up');
  const ownOffers = projection?.viewerRole === 'member' ? offers.filter(offer => !declined.includes(offer.obligationId)) : [];

  useEffect(() => {
    if (!socket || !roomId) return undefined;
    const off = registerTriggerOfferHandlers({ socket });
    refreshTriggerLedger();
    if (!useSpellConsequenceStore.getState().authoredEntries) refreshAuthoredAbilities();
    return off;
  }, [socket, roomId]);

  useEffect(() => {
    if (!isGM || !admitted.length) return;
    if (pairable.length && !pairable.some(entry => actionId(entry.definitionRef) === definitionKey)) setDefinitionKey(actionId(pairable[0].definitionRef));
    if (!primaries[Number(sourceKey)]) setSourceKey('0');
    if (!primaries[Number(watchSourceKey)]) setWatchSourceKey('0');
    if (watched.length && !watched.some(entry => actionId(entry.definitionRef) === watchKey)) setWatchKey(actionId(watched[0].definitionRef));
    if (watchFollowUps.length && !watchFollowUps.some(entry => actionId(entry.definitionRef) === watchFollowKey)) setWatchFollowKey(actionId(watchFollowUps[0].definitionRef));
  }, [isGM, admitted, pairable, watched, watchFollowUps, primaries, definitionKey, sourceKey, watchSourceKey, watchKey, watchFollowKey]);

  if (!roomId) return null;
  if (!projection && !loading && !error) return null;
  if (!offers.length && !isGM && !error) return null;

  const perform = async action => {
    setBusy(true); setLocalMessage('');
    try {
      const result = await action();
      if (result?.success === false) setLocalMessage(result.error || result.code || 'Refused.');
      else if (result?.success) setLocalMessage('Recorded.');
    } catch (caught) { setLocalMessage(caught.message); }
    finally { setBusy(false); }
  };

  const currentSource = ownerSource();
  const selectOffer = offer => {
    const offerSource = (projection?.listeners || []).find(item => item.listenerId === offer.listenerId)?.source;
    if (!offerSource || currentSource.error || !sameExactRef(currentSource.ref, offerSource)) {
      setLocalMessage('This offer belongs to another of your characters. Select that exact primary character before using it.');
      return;
    }
    const definitionRef = offerDefinition(offer);
    const entry = byAction[definitionRef ? actionId(definitionRef) : ''];
    const definitionId = entry ? actionId(entry.definitionRef) : definitionRef?.definitionId;
    if (!definitionId) { setLocalMessage('The offered ability is not currently admitted.'); return; }
    if (!routeSpellCast({ id: definitionId }, { producer: 'trigger-offer', triggerOfferId: offer.obligationId })) {
      setLocalMessage('The offered ability is unavailable to your current owner attachment.');
    }
  };

  const chosenSource = primaries[Number(sourceKey)]?.ref;
  const chosenEntry = pairable.find(entry => actionId(entry.definitionRef) === definitionKey);
  // Conflict explanations are GM-only: only the GM projection carries listener definition refs.
  const pairingsFor = ref => isGM ? (projection?.listeners || []).filter(listener => PAIRING_MODES.includes(listener.mode) && sameRef(listener.source, ref)) : [];
  const describePairing = listener => listener.mode === 'component-follow-up'
    ? `a component watch offering ${nameOf(byAction[refKey(listener.definitionRef)])} after ${nameOf(byAction[refKey(listener.watch?.definitionRef)])}`
    : `a whole-spell pairing of ${nameOf(byAction[refKey(listener.definitionRef)])}`;
  const conflictText = ref => {
    const existing = pairingsFor(ref);
    return existing.length ? `This character already has ${existing.map(describePairing).join(' and ')}. In this first slice a character has at most one pairing of either kind; revoke it before registering another.` : '';
  };
  const watchSource = primaries[Number(watchSourceKey)]?.ref;
  const watchEntry = watched.find(entry => actionId(entry.definitionRef) === watchKey);
  const watchFollow = watchFollowUps.find(entry => actionId(entry.definitionRef) === watchFollowKey);
  const watchConflict = watchSource ? conflictText(watchSource) : '';
  const wholeConflict = chosenSource ? conflictText(chosenSource) : '';
  const chosenName = nameOf(byAction[definitionKey] || chosenEntry);

  return <section className="first-playable-trigger" aria-label="Follow-up trigger offers">
    {(ownOffers.length > 0 || error || localMessage || message) && <details className="first-playable-trigger-box" open>
      <summary>Follow-up offers ({ownOffers.length})</summary>
      {error && <p role="alert" className="first-playable-trigger-error">{error}</p>}
      {(localMessage || message) && <p role="status">{localMessage || message}</p>}
      {ownOffers.map(offer => {
        const entry = byAction[offerDefinition(offer) ? actionId(offerDefinition(offer)) : ''];
        const name = nameOf(entry) || 'offered ability';
        const offerSource = (projection?.listeners || []).find(item => item.listenerId === offer.listenerId)?.source;
        const sourceMatches = !!offerSource && !currentSource.error && sameExactRef(currentSource.ref, offerSource);
        const usable = offer.available === true && offer.lapse !== 'expired' && offer.lapse !== 'invalid' && offer.lapse !== 'conflict' && sourceMatches;
        return <div key={offer.obligationId} className="first-playable-trigger-row">
          <p><strong>{name}</strong> — optional. {lapseText(offer)}</p>
          {offerSource && !sourceMatches && <p className="first-playable-trigger-error" role="alert">This offer belongs to another of your characters. Select that exact primary character before using it.</p>}
          <p className="first-playable-trigger-note">Using it opens the ordinary cast panel. It pays its normal listed AP/mana/class price, starts its own cooldown, and uses its own targeting, range and consent. Ignoring or declining it spends nothing.</p>
          <div className="first-playable-trigger-actions">
            <button type="button" disabled={busy || !usable} onClick={() => selectOffer(offer)}>Use this offer</button>
            <button type="button" disabled={busy} onClick={() => declineTriggerOffer(offer.obligationId)}>Decline</button>
          </div>
        </div>;
      })}
    </details>}
    {isGM && <details className="first-playable-trigger-box">
      <summary>Follow-up trigger registration</summary>
      <p>Registers one existing admitted ability as the optional follow-up for the primary owner PC's next qualifying cast. A qualifying cast is an ordinary single-target immediate-damage cast that removes at least 1 base HP from a creature; temporary-HP absorption alone does not qualify. For an ability authored as a follow-up after healing, a qualifying cast is instead an ordinary single-target immediate-healing cast that actually restores at least 1 HP to a creature or to another primary player character; healing yourself, or healing that restores nothing, does not qualify. Registration is allowed at any time. An executable offer is created only when that cast occurs during authenticated turn tracking with the source in the exact roster; otherwise the cast completes normally and no offer is created. There is no manual-lapse fallback.</p>
      <p className="first-playable-trigger-note">Parent predicate fixed by creator approval: {FOLLOWUP_PREDICATE.occurrence} / {FOLLOWUP_PREDICATE.role} / {FOLLOWUP_PREDICATE.evidence}. For an ability authored as a follow-up after healing the fixed predicate is immediate-healing / source / hpRestored; the ability's own authored trigger chooses which. This registers an existing admitted ability. A Wizard-authored follow-up trigger is marked below; saving or admitting that spell alone never registers a pairing or creates an offer.</p>
      {(projection?.registrationConflicts || []).map(conflict => <p key={`${conflict.source?.tokenId}/${conflict.source?.instanceId}`} className="first-playable-trigger-error" role="alert">Multiple follow-up pairings are registered for {sourceLabel(conflict.source)}. Revoke all but one pairing; no new executable offers will be created until resolved. An exact offer created before the conflict remains usable by its offer ID. ({conflict.listenerIds.map(id => id.slice(0, 8)).join(', ')})</p>)}
      <h4>Whole-spell follow-up pairing (the follow-up's own trigger)</h4>
      <div className="first-playable-trigger-form">
        <label>Source primary PC
          <select value={sourceKey} onChange={event => setSourceKey(event.target.value)}>
            {primaries.map((item, index) => <option key={`${item.ref.mapId}/${item.ref.tokenId}/${item.ref.instanceId}`} value={String(index)}>{item.label} — {sourceLabel(item.ref)}</option>)}
          </select>
        </label>
        <label>Follow-up ability B
          <select value={definitionKey} onChange={event => setDefinitionKey(event.target.value)}>
            {pairable.map(entry => <option key={actionId(entry.definitionRef)} value={actionId(entry.definitionRef)}>{nameOf(entry)} — v{entry.definitionRef.definitionVersion}{authoredFollowUp(entry) ? ' — authored follow-up trigger' : ''}{healingFollowUp(entry) ? ' — authored follow-up trigger (after my healing)' : ''}</option>)}
          </select>
        </label>
        <button type="button" disabled={busy || !chosenSource || !chosenEntry} onClick={() => perform(() => registerFollowUp(healingFollowUp(chosenEntry)
          ? { source: chosenSource, definitionRef: chosenEntry.definitionRef, on: HEALING_FOLLOWUP_PREDICATE }
          : { source: chosenSource, definitionRef: chosenEntry.definitionRef }))}>Register follow-up pairing</button>
      </div>
      {healingFollowUp(chosenEntry) && <p className="first-playable-trigger-note" data-followup-event="immediate-healing">This pairing will listen for healing: it is offered after the chosen character's healing actually restores HP to a creature or to another primary player character.</p>}
      {wholeConflict && <p className="first-playable-trigger-note" role="status" data-pairing-conflict="whole-spell">{wholeConflict}</p>}
      {!primaries.length && <p className="first-playable-trigger-error">No bound primary player character is available.</p>}
      {!admitted.length && <p className="first-playable-trigger-error">No admitted ability is available. Admit one from Admitted abilities first.</p>}
      <h4>Component watch (a separate follow-up offered after one part of another spell)</h4>
      <div data-component-watch-registration="">
        <p className="first-playable-trigger-note">This is not the follow-up's own trigger. The watched spell carries Follow-up After My Damage on its Direct Damage part, and that part is the origin: only the base HP that part actually removes from a creature counts (at least 1, after temporary HP). Its other parts and its saving throw never count. The follow-up spell chosen here is separate; it is offered once per cast of the watched spell under the ordinary follow-up rules: optional, its full normal price and cooldown, its own targeting, range and consent, GM confirmation, lapsing at the character's next authenticated turn start, never chaining. Nothing is cast partly, and the watched spell is never offered itself.</p>
        <div className="first-playable-trigger-form">
          <label>Watching primary PC
            <select value={watchSourceKey} onChange={event => setWatchSourceKey(event.target.value)}>
              {primaries.map((item, index) => <option key={`w-${item.ref.mapId}/${item.ref.tokenId}/${item.ref.instanceId}`} value={String(index)}>{item.label} — {sourceLabel(item.ref)}</option>)}
            </select>
          </label>
          <label>Watched spell part (origin)
            <select value={watchKey} onChange={event => setWatchKey(event.target.value)}>
              {watched.map(entry => <option key={actionId(entry.definitionRef)} value={actionId(entry.definitionRef)}>{nameOf(entry)} — v{entry.definitionRef.definitionVersion} — {partName(watchOf(entry).componentId)}</option>)}
            </select>
          </label>
          <label>Follow-up spell B (offered)
            <select value={watchFollowKey} onChange={event => setWatchFollowKey(event.target.value)}>
              {watchFollowUps.map(entry => <option key={actionId(entry.definitionRef)} value={actionId(entry.definitionRef)}>{nameOf(entry)} — v{entry.definitionRef.definitionVersion} — offered by this watch{authoredFollowUp(entry) ? ' (has its own follow-up trigger)' : ''}</option>)}
            </select>
          </label>
          <button type="button" disabled={busy || !watchSource || !watchEntry || !watchFollow || Boolean(watchConflict)}
            onClick={() => perform(() => registerComponentWatch({ source: watchSource, definitionRef: watchFollow.definitionRef,
              watch: { definitionRef: watchEntry.definitionRef, componentId: watchOf(watchEntry).componentId } }))}>Register component watch</button>
        </div>
        {watchConflict && <p className="first-playable-trigger-error" role="alert" data-pairing-conflict="component-watch">{watchConflict}</p>}
        {!watched.length && <p className="first-playable-trigger-note">No admitted spell has a watched part. Attach Follow-up After My Damage to a spell's Direct Damage part in the Wizard, save it, and admit it first.</p>}
        {watched.length > 0 && !watchFollowUps.length && <p className="first-playable-trigger-note">No separate damage follow-up spell is admitted. Admit the follow-up spell B first.</p>}
      </div>
      <h4>Registered pairings</h4>
      {(projection?.listeners || []).filter(listener => PAIRING_MODES.includes(listener.mode)).map(listener => {
        // refKey, never actionId: a projection without the ref (redacted or missing) must not crash this list (r2 review hardening).
        const entry = byAction[refKey(listener.definitionRef)];
        // A watched-part pairing is shown, never registered, here: say what it watches.
        const watched = listener.mode === 'component-follow-up' && listener.watch ? byAction[refKey(listener.watch.definitionRef)] : null;
        return <div key={listener.listenerId} className="first-playable-trigger-row" {...(listener.mode === 'component-follow-up' ? { 'data-watch-pairing': listener.watch?.componentId || '' } : {})}>
          <p><strong>{nameOf(entry)}</strong>{authoredFollowUp(entry) ? ' (authored follow-up trigger)' : ''}{healingFollowUp(entry) ? ' (authored follow-up trigger)' : ''}{listener.on?.occurrence === 'immediate-healing' ? ' — after healing' : ''}{listener.mode === 'component-follow-up' ? ` — offered only after the direct damage part of ${nameOf(watched)} removes base HP` : ''} — {sourceLabel(listener.source)} — {listener.eligibility?.ok ? 'eligible' : listener.eligibility?.code || 'ineligible'}</p>
          <button type="button" disabled={busy} onClick={() => perform(() => revokeTriggerListener(listener.listenerId))}>Revoke pairing</button>
        </div>;
      })}
      {!(projection?.listeners || []).some(listener => PAIRING_MODES.includes(listener.mode)) && <p>No follow-up pairing is registered.</p>}
      <h4>Open offers and evidence</h4>
      {offers.map(offer => <GmOfferRow key={offer.obligationId} offer={offer} name={nameOf(byAction[offerDefinition(offer) ? actionId(offerDefinition(offer)) : ''])} disabled={busy} onDismiss={(id, reason) => perform(() => dismissTriggerOffer(id, reason))} />)}
      {!offers.length && <p>No follow-up offer is open.</p>}
      <button type="button" disabled={busy || loading} onClick={() => perform(refreshTriggerLedger)}>Refresh trigger evidence</button>
    </details>}
  </section>;
}


