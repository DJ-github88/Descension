import React from 'react';
import { projectHunterResource, HUNTER_MANUAL_NOTICE } from '../../data/classes/hunterData';
import { projectHunterFlowResource, FLOW_MIN, FLOW_MAX } from '../../services/hunterFlow';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

export default function HunterResourceDisplay({ resource = null, isOwner = false }) {
  const frame = {
    color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4,
    padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box',
    overflowWrap: 'anywhere', fontSize: '0.85rem'
  };

  if (resource?.type === 'hunter-flow' || resource?.type === 'hunter_flow') {
    const flowView = projectHunterFlowResource(resource, isOwner);
    if (!flowView.valid) {
      return (
        <div role="note" style={{ ...frame, color: BRICK }}>
          <strong>Hunter Flow needs review.</strong> {flowView.errors.join('; ')} No Flow state was changed.
        </div>
      );
    }
    return (
      <section aria-label="Hunter Shared Flow" data-hunter-flow={flowView.flow} style={frame}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
          <strong>Hunter &amp; Companion Flow</strong>
          <span>{flowView.flow} / {FLOW_MAX}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }} aria-label="Flow scale 1 to 4">
          {[1, 2, 3, 4].map(step => (
            <span
              key={step}
              data-flow-pip={step}
              data-flow-active={step <= flowView.flow ? 'true' : 'false'}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '2px 0',
                borderRadius: 3,
                border: `1px solid ${RULE}`,
                fontWeight: step === flowView.flow ? 700 : 400,
                background: step <= flowView.flow ? '#dfd1b4' : 'transparent'
              }}
            >
              {step}
            </span>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 4, marginTop: 8 }}>
          <p style={{ margin: 0 }}>
            Shared state: {flowView.companion
              ? `Hunter + ${flowView.companion.label}${flowView.companion.bonded ? ' (bonded)' : ' (unverified bond)'}`
              : 'Hunter (no companion linked yet; scale 1–4 shared when bonded)'}
          </p>
          {flowView.hasLegacyEvidence && (
            <p style={{ margin: 0, color: MUTED }}>
              Legacy Quarry &amp; Evidence snapshot preserved (reversible v1 migration).
            </p>
          )}
        </div>
        <details>
          <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect Flow rules</summary>
          <p>Flow starts at {FLOW_MIN} and resets to {FLOW_MIN} when the encounter ends. It is shared by the Hunter and a bonded companion.</p>
          <p>Quick Draw rolls 2d6 once per committed action, including a miss. Natural doubles raise Flow +1; otherwise a difference within the pre-roll Flow maintains it; outside that range lowers Flow −1. Flow stays between {FLOW_MIN} and {FLOW_MAX}.</p>
          <p>A qualifying roll adds +2 stabbing damage on a hit; it never makes a miss deal damage. Normal hit, save and critical rules still apply.</p>
          <p>Only Quick Draw is executable. Preparation, companion actions and other Hunter abilities remain manual. Damage taken, stun and movement never lower or reset Flow.</p>
        </details>
      </section>
    );
  }

  const view = projectHunterResource(resource, isOwner);

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
