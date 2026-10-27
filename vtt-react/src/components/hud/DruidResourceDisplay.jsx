import React from 'react';
import { projectDruidResource, DRUID_MANUAL_NOTICE } from '../../data/classes/druidData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

export default function DruidResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectDruidResource(resource, isOwner);
  const frame = {
    color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4,
    padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box',
    overflowWrap: 'anywhere', fontSize: '0.85rem'
  };

  if (!view.initialized) {
    return (
      <div data-druid-uninitialized="true" role="note" style={frame}>
        <strong>Anatomical Loadout</strong> - not initialized. Prepare the three loadouts and record the first change by hand; opening this display never transforms, recovers or prevents anything.
      </div>
    );
  }

  if (!view.valid) {
    return (
      <div role="note" style={{ ...frame, color: BRICK }}>
        <strong>Druid state needs review.</strong> {view.errors.join('; ')} No slot, transition, recovery or prevention was applied.
      </div>
    );
  }

  return (
    <section aria-label="Druid Anatomical Loadout" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>Body {view.activeLoadout || 'default'}</strong>
        <span>Transitions {view.transitions}/3</span>
      </div>
      <div style={{ display: 'grid', gap: 4, marginTop: 8 }}>
        <strong>Active slots ({view.activeCount}/2)</strong>
        {view.activeCount === 0 ? (
          <p style={{ margin: '2px 0', color: MUTED }}>Default body; no adaptation active.</p>
        ) : view.activeTraits.map(trait => (
          <div key={`${trait.slot}:${trait.id}`} style={{ color: view.suspendedTraits.includes(trait.id) ? MUTED : INK }}>
            {trait.slot}: {trait.id}{view.suspendedTraits.includes(trait.id) ? ' (suspended until next turn)' : ''}
          </div>
        ))}
        {view.brace?.active && <p style={{ margin: '2px 0' }}>Bracing: prevent {view.brace.prevention || 4} once; movement 0.</p>}
        {view.mimicPattern && <p style={{ margin: '2px 0', color: MUTED }}>Outline: {view.mimicPattern.label}</p>}
      </div>
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect anatomy rules</summary>
        <p>Four slots, at most two active traits and one trait per slot. Adopt costs 1 AP and adds one transition; at three, adoption is refused until Recover the Self suspends a real trait.</p>
        <p>Plating prevents 2 from the first eligible event each own-turn window; Living Brace prevents 4 once and pins movement to 0. A suspended trait grants nothing.</p>
        <p>{DRUID_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
