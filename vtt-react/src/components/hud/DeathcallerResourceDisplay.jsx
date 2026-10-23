import React from 'react';
import { projectDeathcallerResource, DEATHCALLER_MANUAL_NOTICE } from '../../data/classes/deathcallerData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

const recordLabel = (record, fallback) => {
  if (typeof record === 'string' && record.trim()) return record;
  if (!record || typeof record !== 'object') return fallback;
  return record.name || record.label || record.patternName || record.id || fallback;
};

export default function DeathcallerResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectDeathcallerResource(resource, isOwner);
  const frame = { color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4, padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box', overflowWrap: 'anywhere', fontSize: '0.85rem' };

  if (!view.initialized) return <div data-deathcaller-uninitialized="true" role="note" style={frame}><strong>Dead Muster</strong> - not initialized. Record the actual prepared patterns, manifestations and orders; opening this display never creates, commands or recovers a manifestation.</div>;
  if (!view.valid) return <div role="note" style={{ ...frame, color: BRICK }}><strong>Dead Muster state needs review.</strong> {view.errors.join('; ')} No summon, order, vitality or recovery was applied.</div>;

  const details = view.details || {};
  const prepared = isOwner && Array.isArray(details.preparedPatterns) ? details.preparedPatterns : [];
  const manifestations = isOwner && Array.isArray(details.manifestations) ? details.manifestations : [];
  const exhausted = isOwner && Array.isArray(details.exhaustedUntilRest) ? details.exhaustedUntilRest : [];

  return (
    <section aria-label="Deathcaller Dead Muster" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>Manifestations {view.manifestationCount}/2</strong>
        <span>Prepared {view.preparedCount}/3 | Orders {view.ordersUsed}/2</span>
      </div>
      <p style={{ margin: '6px 0' }}>Capacity {view.capacity} | Questions {view.questionsUsed}/2</p>
      {isOwner && (
        <div style={{ display: 'grid', gap: 4, margin: '8px 0' }}>
          <div aria-label={`Prepared patterns: ${prepared.length}`}>
            <strong>Prepared patterns</strong>
            {prepared.length === 0 ? <p style={{ margin: '2px 0', color: MUTED }}>None recorded.</p> : prepared.map((pattern, index) => <div key={pattern?.id || pattern?.name || index}>{recordLabel(pattern, `Pattern ${index + 1}`)}</div>)}
          </div>
          <div aria-label={`Active manifestations: ${manifestations.length}`}>
            <strong>Active manifestations</strong>
            {manifestations.length === 0 ? <p style={{ margin: '2px 0', color: MUTED }}>None recorded.</p> : manifestations.map((manifestation, index) => <div key={manifestation?.id || manifestation?.name || index}>{recordLabel(manifestation, `Manifestation ${index + 1}`)}</div>)}
          </div>
          {exhausted.length > 0 && <p style={{ margin: 0, color: MUTED }}>Exhausted until rest: {exhausted.map((entry, index) => recordLabel(entry, `Pattern ${index + 1}`)).join(', ')}</p>}
        </div>
      )}
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect muster rules</summary>
        <p>Up to three prepared patterns, two active manifestations and two orders per own turn. Each manifestation may take one actor action per caster own turn. Pattern vitality runs 0-10 and is recorded by the table.</p>
        <p>Exhausted patterns recover only at a completed rest or through an authored effect. No reconnect, initiative or class-change refill; no manifestation is created, moved, healed or expired automatically.</p>
        <p>{DEATHCALLER_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
