import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GamblerResourceDisplay from '../GamblerResourceDisplay';
import ClassResourceBar from '../ClassResourceBar';
import { GAMBLER_CARD_IDS, validateGamblerState } from '../../../data/classes/gamblerData';

const state = () => ({ version: 1, type: 'gambler-hand', fortune: 3, escrow: 0, pending: null,
  cards: { hand: ['1C', '2D', '3H', '4S', '5C'], deck: GAMBLER_CARD_IDS.filter(card => !['1C', '2D', '3H', '4S', '5C'].includes(card)), discard: [], 'pending-wager': [] } });

test('integrated ClassResourceBar renders the explicit uninitialized state without inventing a hand', () => {
  render(<ClassResourceBar characterClass="Gambler" classResource={{ type: 'gambler-hand', max: 0, state: null }} isOwner />);
  expect(screen.getByText(/not initialized/)).toBeInTheDocument();
  expect(screen.queryByLabelText(/Socket 1/)).toBeNull();
});

test('owner has five actual sockets and readable focus/touch inspection without mutation', () => {
  const resource = { type: 'gambler-hand', state: state() };
  const before = JSON.stringify(resource);
  const onUpdate = jest.fn();
  render(<ClassResourceBar characterClass="Gambler" classResource={{ ...resource, current: 3, max: 7 }} isOwner onClassResourceUpdate={onUpdate} />);
  expect(screen.getByLabelText('Socket 1: 1C')).toBeInTheDocument();
  expect(screen.getByText('Fortune 3/7')).toBeInTheDocument();
  const inspection = screen.getByText('Inspect hand and rules');
  expect(inspection.tagName).toBe('SUMMARY');
  expect(inspection.style.minHeight).toBe('44px');
  fireEvent.click(inspection);
  fireEvent.keyDown(inspection, { key: 'Enter' });
  expect(onUpdate).not.toHaveBeenCalled();
  expect(JSON.stringify(resource)).toBe(before);
});

test('observer markup, ARIA and titles exclude actual hand, deck order, pending choices/results and actor refs', () => {
  const raw = state();
  raw.cards['pending-wager'] = [raw.cards.hand.shift()];
  raw.fortune = 1; raw.escrow = 2;
  raw.pending = { id: 'PRIVATE-INTENT', kind: 'underwrite', stake: 2, cardIds: [...raw.cards['pending-wager']], targetRef: { actorId: 'PRIVATE-ALLY' }, recordedFaces: [8], privateChoice: 'PRIVATE-CHOICE' };
  expect(validateGamblerState(raw).ok).toBe(true);
  const { container } = render(<ClassResourceBar characterClass="Gambler" classResource={{ type: 'gambler-hand', state: raw, current: 1, max: 7 }} />);
  expect(screen.getAllByText('Card back')).toHaveLength(4);
  expect(screen.getByText(/Wager locked/)).toBeInTheDocument();
  const html = container.innerHTML;
  [...GAMBLER_CARD_IDS, 'PRIVATE-INTENT', 'PRIVATE-ALLY', 'PRIVATE-CHOICE', 'recordedFaces'].forEach(secret => expect(html).not.toContain(secret));
  fireEvent.click(screen.getByText('Inspect hand and rules'));
  expect(container.innerHTML).not.toContain('PRIVATE');
});

test.each(['committed', 'outcome-unknown', 'face-recorded'])('valid %s state renders safely with no fabricated result', phase => {
  const raw = state();
  raw.cards['pending-wager'] = [raw.cards.hand.shift()];
  raw.fortune = 2; raw.escrow = 1;
  raw.pending = { id: 'bet', kind: 'attack', stake: 1, cardIds: [...raw.cards['pending-wager']], phase };
  render(<GamblerResourceDisplay resource={{ state: raw }} isOwner />);
  expect(screen.getByText(/Wager locked/)).toBeInTheDocument();
  expect(screen.queryByText(/state needs review/)).toBeNull();
});

test('partially settled Compact remains one locked parent, with only outstanding card/escrow counts', () => {
  const raw = state();
  const cardIds = raw.cards.hand.splice(0, 2);
  raw.cards.discard = [cardIds[0]]; raw.cards['pending-wager'] = [cardIds[1]];
  raw.fortune = 3; raw.escrow = 1;
  raw.pending = { id: 'parent', kind: 'house-compact', cardIds, legs: [
    { id: 'leg-a', cardId: cardIds[0], stake: 1, status: 'won', targetRef: { actorId: 'a' } },
    { id: 'leg-b', cardId: cardIds[1], stake: 1, status: 'pending', targetRef: { actorId: 'b' } }
  ] };
  expect(validateGamblerState(raw).ok).toBe(true);
  render(<GamblerResourceDisplay resource={{ state: raw }} />);
  expect(screen.getByText(/1 Compact leg\(s\) pending/)).toBeInTheDocument();
  expect(screen.getByText('Escrow 1')).toBeInTheDocument();
});

test('invalid state is reported without leaking malformed private values to observers or repairing it', () => {
  const raw = state(); raw.cards.hand[0] = 'PRIVATE-BAD-CARD';
  const before = JSON.stringify(raw);
  const { container } = render(<GamblerResourceDisplay resource={{ state: raw }} />);
  expect(screen.getByText(/State requires owner review/)).toBeInTheDocument();
  expect(container.innerHTML).not.toContain('PRIVATE-BAD-CARD');
  expect(JSON.stringify(raw)).toBe(before);
});
