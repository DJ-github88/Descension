import React, { useEffect, useState } from 'react';
import useGameStore from '../../../../store/gameStore';
import { CLASS_IDS, definitionFromWizard, definitionSummary, creatureSourceRefusal } from '../../../../services/authoredAbility';
import { changeAuthoredAdmission, checkAuthoredAdmission, authoredRegistryWork, refreshAuthoredAbilities, useSpellConsequenceStore } from '../../../../services/spellConsequenceService';
import { useTriggerOfferStore, openTriggerRegistrationSetup, refreshTriggerLedger } from '../../../../services/triggerOfferService';
import { canonical } from '../../../../services/featherSlash';
import ExecutionCompatibility from '../common/ExecutionCompatibility';
import { hasStoredTriggers, triggerPlanForRecord, MANUAL_TRIGGER_TEXT } from '../common/spellTriggerPresentation';
import { isCreatureRef, reviewClassId } from '../../utils/executionCompatibility';

/** Normal saved-library action. Saving alone never installs executable mechanics. */
export default function AuthoredAdmission({ spell, sourceRef }) {
  const shared = useGameStore(s => s.isInMultiplayer), gm = useGameStore(s => s.isGMMode);
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const socket = useGameStore(s => s.multiplayerSocket);
  const entries = useSpellConsequenceStore(s => roomId && s.authoredRoomId === roomId ? s.authoredEntries : null) || [];
  const sources = useSpellConsequenceStore(s => roomId && s.authoredRoomId === roomId ? s.creatureSources : null) || [];
  const projection = useTriggerOfferStore(s => s.projection);
  const triggerLoading = useTriggerOfferStore(s => s.loading);
  const triggerError = useTriggerOfferStore(s => s.error);
  const catalogue = spell.catalogueSource;
  const [classId, setClassId] = useState(catalogue?.classId || reviewClassId(spell, {})), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const activeProjection = projection && (!projection.roomId || projection.roomId === roomId) ? projection : null;
  const hasGmAuthority = Boolean(shared && gm && activeProjection?.viewerRole === 'gm');
  const isCreature = isCreatureRef(sourceRef);
  useEffect(() => {
    if (shared && gm && socket && roomId && !activeProjection && !triggerLoading && !triggerError) {
      refreshTriggerLedger();
    }
  }, [shared, gm, socket, roomId, activeProjection, triggerLoading, triggerError]);
  if (!spell.authoredDraft) {
    if (shared && gm && !isCreature && hasStoredTriggers(spell?.triggerConfig)) {
      return <section className="p9-admission" aria-label={`Room admission for ${spell.name}`} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} draggable={false}>
        <p className="p9-note" data-trigger-setup-unavailable="true">Trigger setup unavailable: {MANUAL_TRIGGER_TEXT}</p>
      </section>;
    }
    return null;
  }
  const support = definitionFromWizard(spell, { roomId, classId, definitionVersion: 1 });
  const refusal = (support.ok && isCreature) ? creatureSourceRefusal(support.definition) : null;
  const compileForEntry = entry => definitionFromWizard(spell, {
    roomId,
    classId: entry.canonicalDefinition.binding.classId,
    definitionVersion: entry.definitionRef.definitionVersion
  });
  const matchesDefinition = (entry, compiled) => Boolean(
    entry && compiled?.ok && canonical(compiled.definition) === canonical(entry.canonicalDefinition)
  );
  const grant = isCreature && sources.find(e => canonical(e.source) === canonical(sourceRef))?.admission;
  const creatureEntry = isCreature
    ? entries.find(e => grant && canonical(e.definitionRef) === canonical(grant.definitionRef))
    : null;
  const roomEntries = !isCreature && roomId && spell.authoredDefinitionId
    ? entries
        .filter(e => e?.definitionRef?.definitionId === spell.authoredDefinitionId && e?.definitionRef?.roomId === roomId)
        .sort((a, b) => b.definitionRef.definitionVersion - a.definitionRef.definitionVersion)
    : [];
  const compiledRoomEntries = roomEntries.map(entry => ({ entry, compiled: compileForEntry(entry) }));
  const exactRoomMatches = compiledRoomEntries.filter(({ entry, compiled }) => matchesDefinition(entry, compiled));
  const exactRoomMatch = exactRoomMatches.find(({ entry }) => !entry.revoked && !entry.creatureOnly)
    || exactRoomMatches.find(({ entry }) => !entry.revoked)
    || exactRoomMatches[0]
    || null;
  const latestRoomEntry = compiledRoomEntries[0] || null;
  const installed = isCreature ? creatureEntry : (exactRoomMatch?.entry || latestRoomEntry?.entry || null);
  const current = isCreature ? (creatureEntry && compileForEntry(creatureEntry)) : (exactRoomMatch?.compiled || latestRoomEntry?.compiled || null);
  const matchesInstalled = isCreature ? matchesDefinition(creatureEntry, current) : Boolean(exactRoomMatch);
  const matchedRevoked = Boolean(installed?.revoked && (isCreature || matchesInstalled));
  const exactAdmitted = Boolean(installed && !installed.revoked && !installed.creatureOnly && matchesInstalled);
  const admittedWatch = installed?.canonicalDefinition?.componentWatch || installed?.descriptor?.componentWatch || null;
  const triggerPlan = !support.ok ? triggerPlanForRecord(spell, support) : null;
  const unavailableReason = !support.ok
    ? (triggerPlan?.lines?.[0]?.text || support.reason || 'This spell is manual-only and cannot be registered as an automated trigger.')
    : matchedRevoked
      ? 'This admitted version was revoked. Admit a current version before setting up a trigger.'
      : (installed && !exactAdmitted)
        ? 'This library copy changed since admission. Admit the updated version first; saving alone never registers.'
        : null;
  const admissionLabel = !installed
    ? refusal
      ? `Compatible definition, not executable by this creature source — ${refusal.reason}`
      : message || 'Saved locally — refresh room admission to check its current status.'
    : matchedRevoked
      ? 'Revoked — this version cannot be accepted. History is retained.'
      : matchesInstalled
        ? `Admitted for ${installed.canonicalDefinition.outcomeTable ? definitionSummary(installed.canonicalDefinition) : installed.canonicalDefinition.effects ? definitionSummary(installed.canonicalDefinition) : installed.canonicalDefinition.effect?.kind === 'condition' ? 'canonical Stunned' : 'immediate damage/healing'} · version ${installed.definitionRef.definitionVersion}. The installed version is immutable.`
        : `Changed since admitted version ${installed.definitionRef.definitionVersion}. The installed version remains unchanged; admit this changed copy explicitly.`;
  const perform = async check => {
    if (!check && refusal) return;
    setBusy(true); setMessage('Awaiting admission confirmation…');
    try {
       const result = await (check ? checkAuthoredAdmission() : changeAuthoredAdmission('admit', spell, classId, sourceRef));
      setMessage(result?.success ? `Admission accepted · ${result.status || 'accepted live'}. Editing this library copy needs explicit new admission.` : `Admission ${authoredRegistryWork()?.phase || 'failed'}: ${result?.error || result?.code || 'unavailable'}. Check the original request if its outcome is unknown.`);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  return <section className="p9-admission" aria-label={`Room admission for ${spell.name}`} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} draggable={false}>
    <ExecutionCompatibility record={spell} context={{ roomId, classId, shared, gm, sourceRef }} />
    {(support.ok || (!installed && message)) && <p role="status">{admissionLabel}</p>}
    {installed && message && <p role="status">{message}</p>}
    {sourceRef && isCreature && <p>Exact creature-source admission · {sourceRef.mapId} / {sourceRef.tokenId} · incarnation {sourceRef.instanceId}. No PC owner approval.</p>}
    {support.definition?.effects && !['authored-passive-entry:v1', 'authored-passive-turn:v1'].includes(support.definition?.capability) && !refusal && <p>{definitionSummary(support.definition)}. {!isCreature ? 'Explicit PC admission: one primary owner PC → one distinct creature; the owner approves the exact price, target, effects and duration; the GM confirms success and any final amount.' : 'Exact creature source → one distinct creature; the GM confirms success and any final amount.'} Structured expiry needs active authenticated turn tracking.</p>}
    {support.definition?.effect?.kind === 'condition' && !isCreature && <p>Explicit PC admission for this existing binding: one primary owner PC → distinct creature, owner-approved price/duration, GM-confirmed success, manual removal. Creature Inspect admission alone does not authorize PC use.</p>}
    {support.definition?.capability === 'authored-area:v1' && !isCreature && <p>{definitionSummary(support.definition)}. Explicit PC admission: one primary owner PC → 1..{support.definition.targeting.maxTargets} creature targets in {support.definition.targeting.aoeShape === 'line' ? `placed line (${support.definition.targeting.lengthFeet}×${support.definition.targeting.widthFeet} ft)` : 'placed circle'} (technical limit: 8 creature targets / 9 actors); proposed shared roll per area; GM adjudicates per-target final amounts.</p>}
    {support.definition?.capability === 'authored-outcome:v1' && !isCreature && <p>{definitionSummary(support.definition)}. Explicit PC admission: one primary owner PC → one distinct creature; owner resolves the outcome once via the existing {support.definition.outcomeTable.mechanic === 'coin' ? 'fair coin flip' : 'die roll'} source and approves the selected branch, AP/mana price, and roll; the GM confirms once.</p>}
    {support.definition?.capability === 'authored-passive-entry:v1' && !isCreature && <p>{definitionSummary(support.definition)}. Admitting saves this passive definition in the room; the GM explicitly activates it on a primary PC in Passive ability activation. Teleport, forced movement, and re-entry remain unsettled/open.</p>}
    {support.definition?.capability === 'authored-passive-turn:v1' && !isCreature && <p>{definitionSummary(support.definition)}. Admitting saves this passive definition in the room; the GM explicitly activates it on a primary PC in Passive ability activation.</p>}
    {catalogue && <p>Catalogue source <strong>{catalogue.spellId}</strong> ({catalogue.classId}); the whole record is preserved. {support.definition?.targetRoute === 'primary-pc-healing' ? 'The target owner must accept the exact healing amount; source payment consent remains separate.' : ''}</p>}
    {shared && gm && <>{!isCreature && !catalogue && <label>Existing class binding <select value={classId} disabled={busy} onChange={e => setClassId(e.target.value)}>{CLASS_IDS.map(id => <option key={id}>{id}</option>)}</select></label>}
      <button type="button" disabled={busy || !support.ok || Boolean(refusal)} onClick={() => perform(false)}>{isCreature ? 'Admit for this creature' : 'Admit this saved version'}</button>
      <button type="button" disabled={busy} onClick={() => perform(true)}>Check original admission</button></>}
    {hasGmAuthority && !isCreature && exactAdmitted && !['authored-passive-entry:v1', 'authored-passive-turn:v1'].includes(installed?.descriptor?.capabilityId) && (
      <button
        type="button"
        disabled={busy}
        data-trigger-setup-action={admittedWatch ? 'component-watch' : 'follow-up'}
        onClick={() => openTriggerRegistrationSetup({
          mode: admittedWatch ? 'component-watch' : 'follow-up',
          definitionRef: installed.definitionRef,
          spellName: installed.canonicalDefinition?.name || spell.name,
          ...(admittedWatch?.componentId ? { componentId: admittedWatch.componentId } : {})
        })}
      >
        {admittedWatch ? 'Set up component watch' : 'Set up follow-up'}
      </button>
    )}
    {hasGmAuthority && !isCreature && !installed && support.ok && (support.definition?.followUp || support.definition?.componentWatch) && (
      <p className="p9-note">Admit this saved version first to set up trigger registration (saving or admitting never registers automatically).</p>
    )}
    {shared && gm && !isCreature && unavailableReason && (
      <p className="p9-note" data-trigger-setup-unavailable="true">Trigger setup unavailable: {unavailableReason}</p>
    )}
    {isCreature && shared && gm && installed && !installed.revoked && <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { await changeAuthoredAdmission('revoke', installed.definitionRef); } finally { setBusy(false); } }}>Revoke this version</button>}
    {shared && <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { const r = await refreshAuthoredAbilities(); if (!r.success) setMessage(`Admission unavailable (${r.code}).`); } finally { setBusy(false); } }}>Refresh room admission</button>}
    {!gm && <p>The GM admits supported versions. Open Admitted abilities to refresh this room's actions.</p>}
  </section>;
}