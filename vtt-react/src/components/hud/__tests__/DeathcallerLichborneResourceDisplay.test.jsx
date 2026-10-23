import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeathcallerResourceDisplay from '../DeathcallerResourceDisplay';
import LichborneResourceDisplay from '../LichborneResourceDisplay';
import ClassResourceBar from '../ClassResourceBar';

const deathcallerState = () => ({
  initialized: true,
  capacityMax: 2,
  preparedPatterns: [{ id: 'pattern-1', name: 'Bone Watch' }],
  manifestations: [{ id: 'manifestation-1', name: 'Bone Watch' }],
  ordersUsed: 1,
  questionsUsed: 0,
  questionRestId: null,
  exhaustedUntilRest: []
});

const lichborneState = () => ({
  initialized: true,
  anchor: { id: 'vessel-1', status: 'intact', location: 'Cinder Vault', ward: { kind: 'rime' } },
  integrity: 7,
  undeathStage: 1,
  preparedTraits: [{ id: 'trait-1', name: 'Rime Step' }, { id: 'trait-2', name: 'Cold Ledger' }],
  activeTraits: [{ id: 'trait-1', name: 'Rime Step' }],
  lifeState: 'active',
  suppressedUntilOwnTurn: null
});

test('integrated Deathcaller bar shows the explicit uninitialized state', () => {
  render(<ClassResourceBar characterClass="Deathcaller" classResource={{ type: 'dead_muster', max: 2, state: null }} isOwner />);
  expect(screen.getByText(/not initialized/)).toBeInTheDocument();
  expect(screen.getByText(/never creates, commands or recovers a manifestation/)).toBeInTheDocument();
});

test('Deathcaller owner sees recorded counts without mutation', () => {
  const resource = { type: 'dead_muster', initialized: true, current: 1, max: 2, state: deathcallerState() };
  const before = JSON.stringify(resource);
  const { container } = render(<ClassResourceBar characterClass="Deathcaller" classResource={resource} isOwner />);
  expect(screen.getByText('Manifestations 1/2')).toBeInTheDocument();
  expect(screen.getByText('Prepared 1/3 | Orders 1/2')).toBeInTheDocument();
  expect(screen.getAllByText('Bone Watch')).toHaveLength(2);
  const inspection = screen.getByText('Inspect muster rules');
  expect(inspection.tagName).toBe('SUMMARY');
  expect(inspection.style.minHeight).toBe('44px');
  fireEvent.click(inspection);
  expect(container.textContent).toMatch(/No reconnect, initiative or class-change refill/);
  expect(JSON.stringify(resource)).toBe(before);
});

test('invalid Deathcaller state is a review state without a fabricated muster', () => {
  const state = { ...deathcallerState(), preparedPatterns: [{}, {}, {}, {}] };
  render(<DeathcallerResourceDisplay resource={{ type: 'dead_muster', initialized: true, state }} isOwner />);
  expect(screen.getByText(/Dead Muster state needs review/)).toBeInTheDocument();
  expect(screen.queryByText('Manifestations 1/2')).not.toBeInTheDocument();
});

test('integrated Lichborne bar shows the explicit uninitialized anchor state', () => {
  render(<ClassResourceBar characterClass="Lichborne" classResource={{ type: 'lich_anchor', max: 12, state: null }} isOwner />);
  expect(screen.getByText(/not initialized/)).toBeInTheDocument();
  expect(screen.getByText(/never creates an anchor, repairs integrity or grants a trait/)).toBeInTheDocument();
});

test('Lichborne owner sees integrity and records while observer hides the anchor location', () => {
  const state = lichborneState();
  const { rerender } = render(<LichborneResourceDisplay resource={{ type: 'lich_anchor', initialized: true, state }} isOwner />);
  expect(screen.getByText('Integrity 7/12')).toBeInTheDocument();
  expect(screen.getByText('Cinder Vault')).toBeInTheDocument();
  expect(screen.getAllByText('Rime Step')).toHaveLength(2);
  const inspection = screen.getByText('Inspect anchor rules');
  expect(inspection.style.minHeight).toBe('44px');
  rerender(<LichborneResourceDisplay resource={{ type: 'lich_anchor', initialized: true, state }} />);
  expect(screen.getByText('Integrity 7/12')).toBeInTheDocument();
  expect(screen.queryByText('Cinder Vault')).not.toBeInTheDocument();
  expect(screen.queryAllByText('Rime Step')).toHaveLength(0);
});

test('invalid Lichborne state is a review state without repair', () => {
  const state = { ...lichborneState(), undeathStage: 0 };
  render(<LichborneResourceDisplay resource={{ type: 'lich_anchor', initialized: true, state }} isOwner />);
  expect(screen.getByText(/Lich Anchor state needs review/)).toBeInTheDocument();
  expect(screen.getByText(/No repair, trait, stage or life-state change was applied/)).toBeInTheDocument();
  expect(screen.queryByText('Integrity 7/12')).not.toBeInTheDocument();
});


