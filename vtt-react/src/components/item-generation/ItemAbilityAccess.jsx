import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { itemAbilitySupport, matchingItemVersions } from '../../services/itemAuthoredAbility';
import { actionId } from '../../services/authoredAbility';
import { refreshAuthoredAbilities, routeSpellCast, useSpellConsequenceStore } from '../../services/spellConsequenceService';
import AuthoredAdmission from '../spellcrafting-wizard/components/library/AuthoredAdmission';
import './ItemAbility.css';

/** Saved snapshot only; opens the incumbent P9 panel. No item-based authorization. */
export default function ItemAbilityAccess({ item }) {
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const entries = useSpellConsequenceStore(s => s.authoredRoomId === roomId ? s.authoredEntries : null) || [];
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [selected, setSelected] = useState('');
  const association = item.authoredAbility;
  if (!association) return null;
  const support = itemAbilitySupport(association), matches = matchingItemVersions(association, entries, roomId);
  return <details className="item-ability"><summary>{item.customName || item.name} — {association.record?.name || 'preserved ability'}</summary>
    <section aria-label={`Item ability for ${item.name}`}>
      <p>{support.ok ? `Supported immediate ${support.definition.effect.kind} · ${support.definition.effect.formula} · ${support.definition.resourceCost.actionPoints} AP / ${support.definition.resourceCost.mana} mana · ${support.definition.targeting.rangeFeet} ft · ${support.definition.targeting.restriction}` : `Unsupported/manual — ${support.reason}`}</p>
      <p>Item association only. The GM checks requirements, range and legality. No equipment, charges, consumption or automatic item effects are applied. Admission and owner approval spend nothing; accepted execution pays and applies HP once.</p>
      {association.librarySpellId && <p>Preserved library snapshot; later library edits or deletion do not replace this content.</p>}
      {support.ok && <AuthoredAdmission spell={association.record} />}
      <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { const r = await refreshAuthoredAbilities(); setMessage(r.success ? 'Admission refreshed. Select an exact saved version below.' : `Admission unavailable (${r.code}).`); } catch (e) { setMessage(e.message); } finally { setBusy(false); } }}>Refresh item ability admission</button>
      {!matches.length && <p>Not loaded or changed since admission. Refresh; the GM must admit this exact saved definition before use.</p>}
      {!!matches.length && <><label>Saved ability version<select value={selected} onChange={e => setSelected(e.target.value)}><option value="">Choose version and class binding</option>{matches.map(e => <option key={actionId(e.definitionRef)} value={actionId(e.definitionRef)} disabled={e.revoked}>Version {e.definitionRef.definitionVersion} · {e.canonicalDefinition.binding.classId} · {e.revoked ? 'Revoked' : 'Admitted'}</option>)}</select></label>
        <button type="button" disabled={busy || !matches.some(e => !e.revoked && actionId(e.definitionRef) === selected)} onClick={() => {
          if (!routeSpellCast({ id: selected }, { producer: `item: ${item.customName || item.name}` })) setMessage('Unavailable for your current owner PC/class binding. Select your primary attachment and check admission. Nothing was spent.');
        }}>Use item ability</button></>}
      {message && <p role="status">{message}</p>}
      <p>Pending, accepted, failed and unknown results appear in the shared ability panel. Closing this item does not discard the original roll or attempt. Check the original request when its outcome is unknown.</p>
    </section>
  </details>;
}
