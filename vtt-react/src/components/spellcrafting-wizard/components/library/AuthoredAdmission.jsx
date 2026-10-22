import React, { useState } from 'react';
import useGameStore from '../../../../store/gameStore';
import { CLASS_IDS, definitionFromWizard } from '../../../../services/authoredAbility';
import { changeAuthoredAdmission, checkAuthoredAdmission, authoredRegistryWork, refreshAuthoredAbilities, useSpellConsequenceStore } from '../../../../services/spellConsequenceService';
import { canonical } from '../../../../services/featherSlash';

/** Normal saved-library action. Saving alone never installs executable mechanics. */
export default function AuthoredAdmission({ spell }) {
  const shared = useGameStore(s => s.isInMultiplayer), gm = useGameStore(s => s.isGMMode);
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const entries = useSpellConsequenceStore(s => s.authoredRoomId === roomId ? s.authoredEntries : null) || [];
  const [classId, setClassId] = useState('arcanoneer'), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  if (!spell.authoredDraft) return null;
  const support = definitionFromWizard(spell, { roomId, classId, definitionVersion: 1 });
  const installed = entries.filter(e => e.definitionRef.definitionId === spell.authoredDefinitionId).sort((a, b) => b.definitionRef.definitionVersion - a.definitionRef.definitionVersion)[0];
  const current = installed && definitionFromWizard(spell, { roomId, classId: installed.canonicalDefinition.binding.classId, definitionVersion: installed.definitionRef.definitionVersion });
  const admissionLabel = !installed ? message || 'Saved locally — refresh room admission to check its current status.' : installed.revoked ? 'Revoked — this version cannot be accepted. History is retained.' : current.ok && canonical(current.definition) === canonical(installed.canonicalDefinition)
    ? `Admitted for immediate damage/healing · version ${installed.definitionRef.definitionVersion}. The installed version is immutable.`
    : `Changed since admitted version ${installed.definitionRef.definitionVersion}. The installed version remains unchanged; admit this changed copy explicitly.`;
  const perform = async check => {
    setBusy(true); setMessage('Awaiting admission confirmation…');
    try {
      const result = await (check ? checkAuthoredAdmission() : changeAuthoredAdmission('admit', spell, classId));
      setMessage(result?.success ? `Admission accepted · ${result.status || 'accepted live'}. Editing this library copy needs explicit new admission.` : `Admission ${authoredRegistryWork()?.phase || 'failed'}: ${result?.error || result?.code || 'unavailable'}. Check the original request if its outcome is unknown.`);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  return <section className="p9-admission" aria-label={`Room admission for ${spell.name}`} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} draggable={false}>
    <p role="status">{support.ok ? admissionLabel : `Unsupported/manual — ${support.reason}`}</p>
    {installed && message && <p role="status">{message}</p>}
    {shared && gm && <><label>Existing class binding <select value={classId} disabled={busy} onChange={e => setClassId(e.target.value)}>{CLASS_IDS.map(id => <option key={id}>{id}</option>)}</select></label>
      <button type="button" disabled={busy || !support.ok} onClick={() => perform(false)}>Admit this saved version</button>
      <button type="button" disabled={busy} onClick={() => perform(true)}>Check original admission</button></>}
    {shared && <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { const r = await refreshAuthoredAbilities(); if (!r.success) setMessage(`Admission unavailable (${r.code}).`); } finally { setBusy(false); } }}>Refresh room admission</button>}
    {!gm && <p>The GM admits supported versions. Open Admitted abilities to refresh this room's actions.</p>}
  </section>;
}
