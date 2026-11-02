import React, { useMemo, useState } from 'react';
import useCharacterStore from '../../../../store/characterStore';
const { catalogueDraft } = require('../../../../services/catalogueAbility.cjs');

const classKey = value => String(value || '').replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase().replace(/ /g, '_');
const definitionId = () => (typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : '00000000-0000-4000-8000-000000000000');

/** Normal class-card action: prepare the supported projection in the real Wizard.
 * The whole catalogue record is retained in the saved library record; editing an
 * executable field creates an unbound spell instead of changing this source. */
export default function CataloguePreparation({ spell, onLoadSpell }) {
  const className = useCharacterStore(state => state.class);
  const [message, setMessage] = useState('');
  const prepared = useMemo(() => spell && !spell.authoredDraft && !spell.catalogueSource
    ? catalogueDraft(spell, classKey(className), { authoredDefinitionId: definitionId(), id: `catalogue-${spell.id}` })
    : null, [spell, className]);
  if (!prepared?.ok) return null;
  const prepare = () => {
    try {
      const load = onLoadSpell || (typeof window !== 'undefined' ? window.handleLoadSpell : null);
      if (typeof load !== 'function') throw Error('Open the Spell Wizard to prepare this catalogue ability.');
      load(JSON.parse(JSON.stringify(prepared.draft)), false);
      setMessage('Prepared in the Wizard. Save there, then admit the saved library version for this room.');
    } catch (error) { setMessage(error.message); }
  };
  return <section className="p9-admission" aria-label={`Catalogue admission for ${spell.name}`} onClick={e => e.stopPropagation()}>
    <p>M4B catalogue source: whole record preserved; supported formula, target and typed class price only.</p>
    <p>{prepared.targetRoute === 'primary-pc-healing' ? 'Primary-PC healing acceptance is required; source payment approval is separate.' : 'One distinct creature target; source payment approval is separate.'}</p>
    <button type="button" onClick={prepare}>Prepare this catalogue ability in the Wizard</button>
    {message && <p role="status">{message}</p>}
  </section>;
}


