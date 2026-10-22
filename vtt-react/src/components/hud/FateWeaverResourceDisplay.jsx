import React from 'react';
import { projectFateWeaverResource, FATE_WEAVER_MANUAL_NOTICE } from '../../data/classes/fateWeaverData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

export default function FateWeaverResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectFateWeaverResource(resource, isOwner);
  const frame = { color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4, padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box', overflowWrap: 'anywhere', fontSize: '0.85rem' };
  if (!view.initialized) return <div data-fate-weaver-uninitialized="true" role="note" style={frame}><strong>Fate Links</strong> - not initialized. Record the actual tokens and links; opening this display never creates or recovers a thread.</div>;
  if (!view.valid) return <div role="note" style={{ ...frame, color: BRICK }}><strong>Fate Link state needs review.</strong> {view.errors.join('; ')} No repair, recovery or relabel was applied.</div>;
  return (
    <section aria-label="Fate Weaver links and threads" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>Free {view.tokens.free}/3</strong><span>Reserved {view.tokens.reserved} | Recovering {view.tokens.recovering}</span>
      </div>
      <div aria-label={`Links: ${view.links.length} of maximum three`} style={{ display: 'grid', gap: 4, margin: '8px 0' }}>
        {view.links.length === 0 ? <p style={{ margin: 0, color: MUTED }}>No recorded links.</p> : view.links.map((link, index) => (
          <div key={link.id || index} style={{ border: `1px solid ${RULE}`, padding: '4px 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
              <strong>{link.sourceName} to {link.targetName}</strong><span>{link.tokenState}</span>
            </div>
            <div>{link.purpose}</div>
            <div style={{ color: MUTED }}>{link.usesRemaining == null ? 'Uses not recorded' : `${link.usesRemaining} use(s) left`}{link.expiresAt ? ` | expires ${link.expiresAt}` : ''}</div>
          </div>
        ))}
      </div>
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect link rules</summary>
        <p>Three tokens: free, reserved or recovering. A link reserves one token, except an authored covenant that reserves two; at most three links. Formation range is 30 ft each with 60 ft maintenance separation unless a record says otherwise. Original assigned damage only, at most 3 points per transfer; no recursion.</p>
        <p>Recovery begins only after the link is closed and its uses are exhausted; the reserved token then returns at the start of the owning caster next own turn. No long rest, reconnect, initiative or scene-change refill; Eternal Tapestry is the sole authored immediate-recovery exception. Consent is recorded and can be withdrawn; withdrawal ends the link immediately.</p>
        <p>{FATE_WEAVER_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
