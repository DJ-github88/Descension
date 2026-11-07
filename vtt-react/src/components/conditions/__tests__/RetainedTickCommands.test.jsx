/** M5 recovery UI: the retained tick command control renders from device custody alone (no due-tick row) and checks the same command. */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RetainedTickCommands } from '../SharedDefendingEditor';
import { checkPeriodicTick } from '../../../services/sharedConditionService';

jest.mock('../../../store/storeRegistry', () => ({ getStore: name => ({ getState: () => name === 'gameStore' ? { multiplayerRoom: { id: 'r' }, isGMMode: true } : {} }) }));
jest.mock('../../../services/sharedConditionService', () => ({ ...jest.requireActual('../../../services/sharedConditionService'), checkPeriodicTick: jest.fn(async() => undefined) }));
jest.mock('../../../services/effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

const entry = (tickId, phase, mode, extra = {}) => ({ kind: 'periodic-tick', ref: ['periodic-tick', 'r', tickId], phase, operation: mode,
  command: { roomId: 'r', commandId: `cmd-${tickId}-0000-0000-0000-000000000000`.slice(0, 36), tickId, mode, finalAmount: mode === 'apply' ? 3 : undefined },
  tick: { tickId, occurrence: 2, of: 3, label: 'Gloomrot', kind: 'damage', formula: '1d6', target: { mapId: 'hall', tokenId: 'B' } }, ...extra });

test('renders every outcome without any due-tick row; the check button replays the retained tick id only', () => {
  const saved = { entries: { a: entry('a', 'unknown', 'apply'), b: entry('b', 'accepted', 'apply'), c: entry('c', 'accepted', 'dismiss'),
    d: entry('d', 'failed', 'apply', { result: { success: false, code: 'periodic_tick_stale' } }), e: entry('e', 'unknown', 'apply', { result: { success: false, code: 'tick_already_resolved' } }) } };
  const perform = jest.fn(fn => fn());
  render(<RetainedTickCommands saved={saved} busy={false} perform={perform} />);
  const text = screen.getByRole('region', { name: 'Retained tick commands' }).textContent;
  for (const phrase of ['Pending or unknown', 'Unconfirmed — the server no longer has this tick open', 'Accepted: the tick was applied once', 'Accepted: the tick was dismissed', 'Refused: nothing was applied']) expect(text).toContain(phrase);
  const buttons = screen.getAllByRole('button', { name: 'Check same tick command' }); expect(buttons).toHaveLength(5);
  fireEvent.click(buttons[0]);
  expect(checkPeriodicTick).toHaveBeenCalledTimes(1); expect(['a', 'e']).toContain(checkPeriodicTick.mock.calls[0][0]);
});
