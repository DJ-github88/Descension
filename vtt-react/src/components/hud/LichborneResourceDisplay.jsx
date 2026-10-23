import React from 'react';
import { projectLichborneResource, LICHBORNE_MANUAL_NOTICE } from '../../data/classes/lichborneData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

const recordLabel = (record, fallback) => {
  if (typeof record === 'string' && record.trim()) return record;
  if (!record || typeof record !== 'object') return fallback;
  return record.name || record.label || record.id || fallback;
};

export default function LichborneResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectLichborneResource(resource, isOwner);
  const frame = { color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4, padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box', overflowWrap: 'anywhere', fontSize: '0.85rem' };

  if (!view.initialized) return <div data-lichborne-uninitialized="true" role="note" style={frame}><strong>Lich Anchor</strong> - not initialized. Record the actual anchor, integrity, stage and traits; opening this display never creates an anchor, repairs integrity or grants a trait.</div>;
  if (!view.valid) return <div role="note" style={{ ...frame, color: BRICK }}><strong>Lich Anchor state needs review.</strong> {view.errors.join('; ')} No repair, trait, stage or life-state change was applied.</div>;

  const prepared = isOwner && Array.isArray(view.preparedTraits) ? view.preparedTraits : [];
  const active = isOwner && Array.isArray(view.activeTraits) ? view.activeTraits : [];

  return (
    <section aria-label="Lichborne anchor and undeath" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>Integrity {view.integrity}/{view.maxIntegrity}</strong>
        <span>Stage {view.undeathStage} | {view.lifeState}</span>
      </div>
      <p style={{ margin: '6px 0' }}>Anchor {view.anchor?.status || 'unknown'} | Prepared traits {view.preparedTraitCount}/2 | Active {view.activeTraitCount}</p>
      {isOwner && (
        <div style={{ display: 'grid', gap: 4, margin: '8px 0' }}>
          <div><strong>Anchor</strong><div>{view.anchor?.id || 'No id recorded'}</div><div style={{ color: MUTED }}>{view.anchor?.location || 'No location recorded'}</div></div>
          <div aria-label={`Prepared traits: ${prepared.length}`}>
            <strong>Prepared traits</strong>
            {prepared.length === 0 ? <p style={{ margin: '2px 0', color: MUTED }}>None recorded.</p> : prepared.map((trait, index) => <div key={trait?.id || trait?.name || index}>{recordLabel(trait, `Trait ${index + 1}`)}</div>)}
          </div>
          <div aria-label={`Active traits: ${active.length}`}>
            <strong>Active traits</strong>
            {active.length === 0 ? <p style={{ margin: '2px 0', color: MUTED }}>None active.</p> : active.map((trait, index) => <div key={trait?.id || trait?.name || index}>{recordLabel(trait, `Trait ${index + 1}`)}</div>)}
          </div>
          {view.suppressedUntilOwnTurn && <p style={{ margin: 0, color: BRICK }}>Traits suppressed until the owner next own turn.</p>}
        </div>
      )}
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect anchor rules</summary>
        <p>Anchor integrity runs 0-12 and the undeath stage 0-2. Exactly two traits are prepared; active traits cannot exceed the stage. The anchor is intact or destroyed, and the life state is active, dormant or dead.</p>
        <p>Repair only through authored records or a completed rest. No class-change, reconnect or initiative refill. Anchor destruction, death saves and trait suppression are explicit table records, not automatic effects.</p>
        <p>{LICHBORNE_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
