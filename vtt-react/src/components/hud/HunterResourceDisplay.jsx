import React from 'react';
import { projectHunterResource, HUNTER_MANUAL_NOTICE } from '../../data/classes/hunterData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

export default function HunterResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectHunterResource(resource, isOwner);
  const frame = {
    color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4,
    padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box',
    overflowWrap: 'anywhere', fontSize: '0.85rem'
  };

  if (!view.initialized) {
    return (
      <div data-hunter-uninitialized="true" role="note" style={frame}>
        <strong>Quarry &amp; Evidence</strong> - not initialized. Mark the exact quarry and record the first real evidence by hand; opening this display never generates a tag or moves a companion.
      </div>
    );
  }

  if (!view.valid) {
    return (
      <div role="note" style={{ ...frame, color: BRICK }}>
        <strong>Hunter state needs review.</strong> {view.errors.join('; ')} No quarry, tag, companion or path was changed.
      </div>
    );
  }

  return (
    <section aria-label="Hunter Quarry and Evidence" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>{view.quarry?.label || 'No quarry'}</strong>
        <span>Evidence {view.evidence.length}/3</span>
      </div>
      <div style={{ display: 'grid', gap: 4, marginTop: 8 }}>
        {view.evidence.length === 0 ? (
          <p style={{ margin: '2px 0', color: MUTED }}>No evidence recorded.</p>
        ) : view.evidence.map(tag => (
          <div key={tag.tag}>
            <span style={{ textTransform: 'capitalize' }}>{tag.tag}</span>
            <span style={{ color: MUTED }}> - {tag.source}</span>
          </div>
        ))}
        <p style={{ margin: '4px 0 0', color: MUTED }}>
          Generation: {view.generationUsedOwnTurnId === null ? 'available this own turn' : 'used this own turn'}
        </p>
        {view.companion && (
          <p style={{ margin: 0 }}>
            Companion: {view.companion.label}{view.companion.bonded ? ' (bonded)' : ' (unverified bond)'}
          </p>
        )}
        {view.committedPath && (
          <p style={{ margin: 0, color: MUTED }}>
            Glaive path: {view.committedPath.pathFeet} ft committed{view.committedPath.expiresAtTurn !== null ? `; expires at turn ${view.committedPath.expiresAtTurn}` : ''}
          </p>
        )}
      </div>
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect quarry rules</summary>
        <p>One exact quarry. Read, Angle and Pressure are distinct tags with recorded source events; at most one new tag per own turn across all sources.</p>
        <p>A miss pays AP and grants nothing. Evidence expires after two own turns without contact, and changing quarry clears it. A companion is optional and spends its own action.</p>
        <p>{HUNTER_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
