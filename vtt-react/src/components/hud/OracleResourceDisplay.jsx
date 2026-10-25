import React from 'react';
import { projectOracleResource, ORACLE_MANUAL_NOTICE } from '../../data/classes/oracleData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

export default function OracleResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectOracleResource(resource, isOwner);
  const frame = {
    color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4,
    padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box',
    overflowWrap: 'anywhere', fontSize: '0.85rem'
  };

  if (!view.initialized) {
    return (
      <div data-oracle-uninitialized="true" role="note" style={frame}>
        <strong>Forecast Slots</strong> - not initialized. Record the exact subject, category, benefit and expiry by hand; opening this display never prepares, fulfills or expires a forecast.
      </div>
    );
  }

  if (!view.valid) {
    return (
      <div role="note" style={{ ...frame, color: BRICK }}>
        <strong>Oracle state needs review.</strong> {view.errors.join('; ')} No forecast, benefit or expiry was applied.
      </div>
    );
  }

  const prepared = view.forecasts.filter(forecast => forecast.status === 'prepared');
  const closed = view.forecasts.filter(forecast => forecast.status !== 'prepared');

  return (
    <section aria-label="Oracle Forecast Slots" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>Forecasts {view.preparedCount}/2</strong>
        <span>No debt</span>
      </div>
      <div style={{ display: 'grid', gap: 4, marginTop: 8 }} aria-label={`Prepared forecasts: ${prepared.length}`}>
        <strong>Prepared slots</strong>
        {prepared.length === 0 ? (
          <p style={{ margin: '2px 0', color: MUTED }}>None recorded.</p>
        ) : prepared.map(forecast => (
          <div key={forecast.id || forecast.subject}>
            <div>{forecast.subject}</div>
            <div style={{ color: MUTED }}>
              Category: {forecast.category} | Expiry: {forecast.expiresInOwnTurns ?? 'unrecorded'} own turns
            </div>
            <div style={{ color: MUTED }}>Benefit: {forecast.benefit}</div>
          </div>
        ))}
      </div>
      {closed.length > 0 && (
        <p style={{ margin: '6px 0 0', color: MUTED }}>
          Closed: {closed.map(forecast => `${forecast.subject} (${forecast.status})`).join(', ')}
        </p>
      )}
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect forecast rules</summary>
        <p>Exactly two forecast slots. Each names one exact subject, one event category, one published benefit and a one-or-two own-turn expiry. Fulfillment applies the benefit once; failure or expiry grants nothing.</p>
        <p>Oracle has no Omen Debt and never replaces, rerolls or banks a die. Reading uses observable evidence or a bounded GM vision only.</p>
        <p>{ORACLE_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
