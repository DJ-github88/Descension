import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ChaosWeaverResourceDisplay from '../ChaosWeaverResourceDisplay';
import { createTileState } from '../../../data/classes/chaosWeaverRules';

const tileState = (overrides = {}) => ({ ...createTileState(), ...overrides });

const pending = {
  actionId: 'action-1',
  spellId: 'cr1_chaos_weaver_second_possibility',
  sourceLabel: 'T1 Second',
  targetLabel: 'goblin',
  primaryTileIds: ['S1', 'F1'],
  continuationTileId: 'M1',
  mapping: {
    order: ['S1', 'F1'],
    dice: 'd6',
    rule: 'two-ids-d6-1-3-4-6',
    entries: [
      { tileId: 'S1', faces: [1, 2, 3] },
      { tileId: 'F1', faces: [4, 5, 6] }
    ]
  },
  selectedTileId: 'S1',
  recordedFaces: [2],
  phase: 'continuation-pending'
};

const anomaly = {
  actionId: 'action-1',
  spellId: 'cr1_chaos_weaver_unsteady_ground',
  sourceLabel: 'Unsteady Ground',
  tileIds: ['M1', 'F1'],
  centerLabel: 'doorway',
  radiusFeet: 5,
  placementRangeFeet: 30,
  trigger: 'first-enemy-original-voluntary-entry',
  createdOwnTurn: 1,
  expiresEndOwnTurn: 3,
  profile: null
};

const mixedTiles = () =>
  tileState({ available: ['S1', 'S2', 'M1', 'M2'], committed: ['F1'], bound: [], spent: ['F2'] });

test('renders six tokens in four zone lanes with counts and summary text', () => {
  render(<ChaosWeaverResourceDisplay tiles={mixedTiles()} />);
  const group = screen.getByRole('group', { name: /Chaos Weaver tiles/ });
  expect(group).toHaveAttribute('data-cw-resource-display', 'true');
  expect(group.getAttribute('aria-label')).toContain('Six tiles: 4 available, 1 committed, 0 bound, 1 spent');
  ['S1', 'S2', 'M1', 'M2', 'F1', 'F2'].forEach((tileId) => {
    expect(document.querySelector(`[data-tile-id="${tileId}"]`)).toBeTruthy();
  });
  expect(document.querySelector('[data-tile-id="F1"]')).toHaveAttribute('data-zone', 'committed');
  expect(document.querySelector('[data-tile-id="F2"]')).toHaveAttribute('data-zone', 'spent');
  ['Available', 'Committed', 'Bound', 'Spent'].forEach((label) => {
    expect(group.textContent).toContain(label);
  });
});

test('without a handler tokens are images and inspect buttons are disabled', () => {
  render(<ChaosWeaverResourceDisplay tiles={mixedTiles()} />);
  expect(document.querySelector('[data-tile-id="S1"]')).toHaveAttribute('role', 'img');
  expect(screen.getByRole('button', { name: 'Inspect tiles' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Inspect draw' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Inspect anomaly' })).toBeDisabled();
});

test('tokens are keyboard buttons and root Escape clears the inspection', () => {
  const onInspect = jest.fn();
  render(<ChaosWeaverResourceDisplay tiles={mixedTiles()} onInspect={onInspect} />);
  const token = screen.getByRole('button', { name: /^S1/ });
  fireEvent.click(token);
  expect(onInspect).toHaveBeenCalledWith('S1');
  fireEvent.keyDown(token, { key: 'Enter' });
  expect(onInspect).toHaveBeenCalledTimes(2);
  fireEvent.keyDown(screen.getByRole('group'), { key: 'Escape' });
  expect(onInspect).toHaveBeenLastCalledWith(null);
});

test('pending continuation and anomaly lines render with both inspect targets enabled', () => {
  const onInspect = jest.fn();
  render(
    <ChaosWeaverResourceDisplay
      tiles={tileState({ available: ['S2', 'M2', 'F2'], committed: ['S1', 'F1', 'M1'], bound: [], spent: [] })}
      pending={pending}
      anomaly={anomaly}
      onInspect={onInspect}
    />
  );
  expect(screen.getByText(/Face 2 . S1 recorded; M1 reserved/)).toBeTruthy();
  expect(screen.getByText(/Anomaly: M1\+F1 bound/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Inspect draw' }));
  expect(onInspect).toHaveBeenCalledWith('pending');
  fireEvent.click(screen.getByRole('button', { name: 'Inspect anomaly' }));
  expect(onInspect).toHaveBeenCalledWith('anomaly');
});

test('a deterministic face-recorded pending with no recorded faces renders without inventing a face', () => {
  const deterministic = {
    ...pending,
    continuationTileId: null,
    selectedTileId: null,
    recordedFaces: null,
    phase: 'face-recorded',
    mapping: { order: ['S1', 'F1'], dice: null, rule: 'deterministic-no-sample', entries: [] }
  };
  render(
    <ChaosWeaverResourceDisplay
      tiles={tileState({ available: ['S2', 'M2', 'F2'], committed: ['S1', 'F1', 'M1'], bound: [], spent: [] })}
      pending={deterministic}
    />
  );
  expect(screen.getByText(/Deterministic result S1\+F1 recorded/)).toBeTruthy();
  expect(screen.queryByText(/Face \d/)).toBeNull();
});

test('an invalid tile state renders the brick fallback note instead of tokens', () => {
  const invalid = tileState({ available: ['S1', 'S1', 'M1', 'M2', 'F1', 'F2'] });
  render(<ChaosWeaverResourceDisplay tiles={invalid} />);
  const note = screen.getByRole('note');
  expect(note).toHaveAttribute('data-cw-invalid', 'true');
  expect(note.textContent).toMatch(/Tile state invalid/);
  expect(document.querySelector('[data-tile-id]')).toBeNull();
});

test('a locked reason renders as a status note', () => {
  render(
    <ChaosWeaverResourceDisplay
      tiles={mixedTiles()}
      disabledReason="A draw is locked: no Fold, rest or native exchange until it settles or is voided."
    />
  );
  expect(screen.getByRole('status')).toHaveTextContent('A draw is locked');
});
