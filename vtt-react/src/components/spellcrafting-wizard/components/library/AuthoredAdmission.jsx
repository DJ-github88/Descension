import React, { useState } from 'react';
import useGameStore from '../../../../store/gameStore';
import { CLASS_IDS, definitionFromWizard, definitionSummary } from '../../../../services/authoredAbility';
import { changeAuthoredAdmission, checkAuthoredAdmission, authoredRegistryWork, refreshAuthoredAbilities, useSpellConsequenceStore } from '../../../../services/spellConsequenceService';
import { canonical } from '../../../../services/featherSlash';

/** Normal saved-library action. Saving alone never installs executable mechanics. */
export default function AuthoredAdmission({ spell, sourceRef }) {
  const shared = useGameStore(s => s.isInMultiplayer), gm = useGameStore(s => s.isGMMode);
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const entries = useSpellConsequenceStore(s => s.authoredRoomId === roomId ? s.authoredEntries : null) || [];
  const sources = useSpellConsequenceStore(s => s.creatureSources) || [];
  const [classId, setClassId] = useState('arcanoneer'), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  if (!spell.authoredDraft) return null;
  const support = definitionFromWizard(spell, { roomId, classId, definitionVersion: 1 });
  const grant = sourceRef && sources.find(e => canonical(e.source) === canonical(sourceRef))?.admission;
  const installed = sourceRef ? entries.find(e => grant && canonical(e.definitionRef) === canonical(grant.definitionRef)) : entries.filter(e => e.definitionRef.definitionId === spell.authoredDefinitionId).sort((a, b) => b.definitionRef.definitionVersion - a.definitionRef.definitionVersion)[0];
  const current = installed && definitionFromWizard(spell, { roomId, classId: installed.canonicalDefinition.binding.classId, definitionVersion: installed.definitionRef.definitionVersion });
  const admissionLabel = !installed ? message || 'Saved locally — refresh room admission to check its current status.' : installed.revoked ? 'Revoked — this version cannot be accepted. History is retained.' : current.ok && canonical(current.definition) === canonical(installed.canonicalDefinition)
    ? `Admitted for ${installed.canonicalDefinition.effects ? definitionSummary(installed.canonicalDefinition) : installed.canonicalDefinition.effect.kind === 'condition' ? 'canonical Stunned' : 'immediate damage/healing'} · version ${installed.definitionRef.definitionVersion}. The installed version is immutable.`
    : `Changed since admitted version ${installed.definitionRef.definitionVersion}. The installed version remains unchanged; admit this changed copy explicitly.`;
  const perform = async check => {
    setBusy(true); setMessage('Awaiting admission confirmation…');
    try {
       const result = await (check ? checkAuthoredAdmission() : changeAuthoredAdmission('admit', spell, classId, sourceRef));
      setMessage(result?.success ? `Admission accepted · ${result.status || 'accepted live'}. Editing this library copy needs explicit new admission.` : `Admission ${authoredRegistryWork()?.phase || 'failed'}: ${result?.error || result?.code || 'unavailable'}. Check the original request if its outcome is unknown.`);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  return <section className="p9-admission" aria-label={`Room admission for ${spell.name}`} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} draggable={false}>
    <p role="status">{support.ok ? admissionLabel : `Unsupported/manual — ${support.reason}`}</p>
    {installed && message && <p role="status">{message}</p>}
    {sourceRef && <p>Exact creature-source admission · {sourceRef.mapId} / {sourceRef.tokenId} · incarnation {sourceRef.instanceId}. No PC owner approval.</p>}
    {support.definition?.effects && <p>{definitionSummary(support.definition)}. {!sourceRef ? 'Explicit PC admission: one primary owner PC → one distinct creature; the owner approves the exact price, target, effects and duration; the GM confirms success and any final amount.' : 'Exact creature source → one distinct creature; the GM confirms success and any final amount.'} Structured expiry needs active authenticated turn tracking.</p>}
    {support.definition?.effect?.kind === 'condition' && !sourceRef && <p>Explicit PC admission for this existing binding: one primary owner PC → distinct creature, owner-approved price/duration, GM-confirmed success, manual removal. Creature Inspect admission alone does not authorize PC use.</p>}
    {shared && gm && <>{!sourceRef && <label>Existing class binding <select value={classId} disabled={busy} onChange={e => setClassId(e.target.value)}>{CLASS_IDS.map(id => <option key={id}>{id}</option>)}</select></label>}
      <button type="button" disabled={busy || !support.ok} onClick={() => perform(false)}>{sourceRef ? 'Admit for this creature' : 'Admit this saved version'}</button>
      <button type="button" disabled={busy} onClick={() => perform(true)}>Check original admission</button></>}
    {sourceRef && shared && gm && installed && !installed.revoked && <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { await changeAuthoredAdmission('revoke', installed.definitionRef); } finally { setBusy(false); } }}>Revoke this version</button>}
    {shared && <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { const r = await refreshAuthoredAbilities(); if (!r.success) setMessage(`Admission unavailable (${r.code}).`); } finally { setBusy(false); } }}>Refresh room admission</button>}
    {!gm && <p>The GM admits supported versions. Open Admitted abilities to refresh this room's actions.</p>}
  </section>;
}
