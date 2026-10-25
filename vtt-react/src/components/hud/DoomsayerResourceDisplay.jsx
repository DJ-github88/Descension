import React from 'react';
import { projectDoomsayerResource, DOOMSAYER_MANUAL_NOTICE } from '../../data/classes/doomsayerData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

export default function DoomsayerResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectDoomsayerResource(resource, isOwner);
  const frame = {
    color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4,
    padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box',
    overflowWrap: 'anywhere', fontSize: '0.85rem'
  };

  if (!view.initialized) {
    return (
      <div data-doomsayer-uninitialized="true" role="note" style={frame}>
        <strong>Calamities &amp; Havoc</strong> - not initialized. Record the public calamity terms and Havoc by hand; opening this display never plants, advances or resolves a calamity.
      </div>
    );
  }

  if (!view.valid) {
    return (
      <div role="note" style={{ ...frame, color: BRICK }}>
        <strong>Doomsayer state needs review.</strong> {view.errors.join('; ')} No clock, resolution or Havoc was applied.
      </div>
    );
  }

  const active = view.calamities.filter(calamity => calamity.status === 'active');
  const closed = view.calamities.filter(calamity => calamity.status !== 'active');

  return (
    <section aria-label="Doomsayer Calamities and Havoc" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>Calamities {view.activeCount}/2</strong>
        <span>Havoc {view.havoc}/15</span>
      </div>
      <div style={{ display: 'grid', gap: 4, marginTop: 8 }} aria-label={`Active calamities: ${active.length}`}>
        <strong>Active records</strong>
        {active.length === 0 ? (
          <p style={{ margin: '2px 0', color: MUTED }}>None recorded.</p>
        ) : active.map(calamity => (
          <div key={calamity.id || calamity.subject}>
            <div>{calamity.subject}</div>
            <div style={{ color: MUTED }}>
              Trigger: {calamity.trigger} | Clock: {calamity.clock ?? 'unrecorded'} | Disruption: {calamity.disruption}
            </div>
          </div>
        ))}
      </div>
      {closed.length > 0 && (
        <p style={{ margin: '6px 0 0', color: MUTED }}>
          Closed: {closed.map(calamity => `${calamity.subject} (${calamity.status})`).join(', ')}
        </p>
      )}
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect calamity rules</summary>
        <p>At most two active calamities. Each records an exact subject or visible area, a declared trigger, a one-to-three own-turn clock, a published effect and a visible disruption method.</p>
        <p>Trigger resolution grants 3 Havoc; expiry grants 1; dismantle grants 0. Havoc runs 0-15 and resets only on a completed long rest. A third declaration is rejected.</p>
        <p>{DOOMSAYER_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
