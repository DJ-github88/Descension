import React, { useMemo, useState } from 'react';
import useCharacterStore from '../../../../store/characterStore';
import useAuthStore from '../../../../store/authStore';
import useSpellbookStore from '../../../../store/spellbookStore';
import { captureOwnerGuard } from '../../../../persistence/scopedConsumer';
import { CLASS_DATA_MAP } from '../../../../data/classSpellGenerator';
const { catalogueDraft } = require('../../../../services/catalogueAbility.cjs');

const classNameOf = value => String(value || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
const classKey = value => classNameOf(value).toLowerCase().replace(/ /g, '_');
const originalRecord = (spellId, className) => {
  const spells = CLASS_DATA_MAP[classNameOf(className)]?.spells;
  const matches = (Array.isArray(spells) ? spells : []).filter(entry => entry?.id === spellId);
  return matches.length === 1 ? matches[0] : null;
};
const definitionId = () => (typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : '00000000-0000-4000-8000-000000000000');

/** Normal class-card action: prepare the supported projection in the real Wizard.
 * The whole catalogue record is retained in the saved library record; editing an
 * executable field creates an unbound spell instead of changing this source. */
export default function CataloguePreparation({ spell, onLoadSpell }) {
  const className = useCharacterStore(state => state.class);
  const [message, setMessage] = useState('');
  const source = useMemo(() => spell && !spell.authoredDraft && !spell.catalogueSource
    ? originalRecord(spell.id, className)
    : null, [spell, className]);
  const prepared = useMemo(() => source
    ? catalogueDraft(source, classKey(className), { authoredDefinitionId: definitionId(), id: `catalogue-${source.id}` })
    : null, [source, className]);
  if (!prepared?.ok) return null;
  const prepare = () => {
    try {
      const draft = JSON.parse(JSON.stringify(prepared.draft));
      const load = onLoadSpell || (typeof window !== 'undefined' ? window.handleLoadSpell : null);
      if (typeof load === 'function') load(draft, false);
      else {
        const guard = captureOwnerGuard(useAuthStore.getState().user?.uid);
        if (!guard.ok) throw Error('Sign in to prepare this catalogue ability.');
        useSpellbookStore.setState({ wizardEditRequest: { spell: draft, guard, editMode: false }, activeTab: 'wizard' });
      }
      setMessage('Prepared in the Wizard. Save there, then admit the saved library version for this room.');
    } catch (error) { setMessage(error.message); }
  };
  return <section className="p9-admission" aria-label={`Catalogue admission for ${source.name}`} onClick={e => e.stopPropagation()}>
    <p>M4B catalogue source: whole record preserved; supported formula, target and typed class price only.</p>
    <p>{prepared.targetRoute === 'primary-pc-healing' ? 'Primary-PC healing acceptance is required; source payment approval is separate.' : 'One distinct creature target; source payment approval is separate.'}</p>
    <button type="button" onClick={prepare}>Prepare this catalogue ability in the Wizard</button>
    {message && <p role="status">{message}</p>}
  </section>;
}


