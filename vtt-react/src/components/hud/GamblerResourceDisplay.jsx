import React from 'react';
import { projectGamblerResource, GAMBLER_MANUAL_NOTICE } from '../../data/classes/gamblerData';
import { INK, PAPER, RULE, BRICK, MUTED } from './calmBarPalette';

// All text/attributes come from the allow-listed view, never raw pending choices.
export default function GamblerResourceDisplay({ resource = null, isOwner = false }) {
  const view = projectGamblerResource(resource, isOwner);
  const frame = { color: INK, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 4, padding: 8, width: '100%', maxWidth: 360, boxSizing: 'border-box', overflowWrap: 'anywhere', fontSize: '0.85rem' };
  if (!view.initialized) return <div data-gambler-uninitialized="true" role="note" style={frame}><strong>Hand &amp; Fortune</strong> — not initialized. Record the actual table state; opening this display never deals cards or refills Fortune.</div>;
  if (!view.valid) return <div role="note" style={{ ...frame, color: BRICK }}><strong>Gambler state needs review.</strong> {view.error} No repair or refill was applied.</div>;
  return (
    <section aria-label="Gambler hand and wager" style={frame}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
        <strong>Fortune {view.fortune}/7</strong><span>Escrow {view.escrow}</span>
      </div>
      <div aria-label={`Hand: ${view.handCount} cards, maximum five`} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, margin: '8px 0' }}>
        {Array.from({ length: 5 }, (_, index) => {
          const occupied = index < view.handCount;
          const label = occupied ? isOwner ? view.hand[index] : 'Hidden card' : 'Empty socket';
          return <div key={index} aria-label={`Socket ${index + 1}: ${label}`} title={label} style={{ minHeight: 44, border: `1px solid ${RULE}`, display: 'grid', placeItems: 'center', color: occupied ? INK : MUTED }}>
            {occupied ? isOwner ? view.hand[index] : 'Card back' : 'Empty'}
          </div>;
        })}
      </div>
      <p style={{ margin: '4px 0' }}>Deck {view.deckCount} · Discard {view.discardCount}</p>
      <p role="status" style={{ margin: '4px 0', color: view.pending ? BRICK : INK }}>
        {view.pending ? `Wager locked — ${view.pending.outstandingCards} committed card(s)${view.pending.kind === 'house-compact' ? `, ${view.pending.outstandingLegs} Compact leg(s) pending` : ''}. No new wager or Recut.` : 'No unresolved wager.'}
      </p>
      <details>
        <summary style={{ minHeight: 44, padding: '12px 4px', cursor: 'pointer', boxSizing: 'border-box' }}>Inspect hand and rules</summary>
        <p>{isOwner ? `Actual hand: ${view.hand.length ? view.hand.join(', ') : 'empty'}.` : 'Private hand, deck order and choices are not included in this view.'}</p>
        <p>Twenty actual cards. Five-card hand. Available Fortune plus escrow never exceeds seven. One parent wager; House Compact has exactly two fixed legs.</p>
        <p>Recut: 1 AP, discard 0–2 actual cards, shuffle discard only if deck is empty, draw up to two empty sockets. At Fortune zero, recover one only if a card was actually discarded.</p>
        <p>{GAMBLER_MANUAL_NOTICE}</p>
      </details>
    </section>
  );
}
