import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import NarrationPresenter from './NarrationPresenter';
import { emptyNarration, narrationReducer, publicAnnouncement, QUEUE_LIMIT } from './narrationQueue';

const routine = index => ({ id: `routine-${index}`, phase: 'response', text: `Watchkeeper ${index} responds.` });
const outcome = index => ({ id: `outcome-${index}`, phase: 'outcome', accepted: true, text: `Confirmed result ${index}.` });
const publish = (state, events) => narrationReducer(state, { type: 'publish', events });

test('routine bursts collapse, the queue stays bounded, and priority outcomes survive saturation in history', () => {
  let state = publish(emptyNarration(), Array.from({ length: 50 }, (_, index) => routine(index)));
  expect(state.waiting).toHaveLength(QUEUE_LIMIT);
  expect(state.grouped).toBe(45);
  state = publish(state, Array.from({ length: 8 }, (_, index) => outcome(index)));
  expect(state.waiting).toHaveLength(QUEUE_LIMIT);
  expect(state.waiting.every(item => item.important)).toBe(true);
  expect(state.archived).toBe(4);
  expect(state.history.filter(item => item.phase === 'outcome')).toHaveLength(8);
  for (let index = 0; index < 5; index++) state = narrationReducer(state, { type: 'advance' });
  expect(state.current.text).toBe('49 routine announcements grouped. 4 priority announcements saved directly to history.');
  expect(state.history).toHaveLength(58);
});

test('unknown never becomes accepted by advancing, elapsed time, or an invalid result', () => {
  const unknown = { id: 'unknown', phase: 'unresolved', certainty: 'unknown', text: 'The outcome is unknown.' };
  let state = publish(emptyNarration(), [unknown,
    { ...outcome(1), accepted: undefined },
    { ...outcome(2), certainty: 'unknown' },
    { ...outcome(3), certainty: 'pending' }
  ]);
  expect(state.history).toHaveLength(1);
  state = narrationReducer(state, { type: 'advance' });
  expect(state.current).toBeNull();
  expect(state.history[0].certainty).toBe('unknown');
  state = publish(state, [outcome(1)]);
  expect(state.current.phase).toBe('outcome');
  expect(state.history[0].certainty).toBe('unknown');
});

test('only public display fields are copied; hidden payloads are never inspected; duplicates are idempotent', () => {
  const input = { ...outcome(1), get actor() { throw Error('Hidden actor accessed'); }, get sealedDeclaration() { throw Error('Seal accessed'); } };
  expect(publicAnnouncement(input)).not.toHaveProperty('actor');
  const state = publish(emptyNarration(), [input, input, { text: 'No ID', phase: 'response' }]);
  expect(state.history).toHaveLength(1);
  expect(state.waiting).toHaveLength(0);
});

test('one polite banner, literal public text, optional details and explicit next-banner control', () => {
  const state = publish(emptyNarration(), [
    { ...routine(1), text: '<img src=x onerror=alert(1)>', arithmetic: '8 − 2 = 6', source: 'Public fixture' }, outcome(1)
  ]);
  const advance = jest.fn();
  const view = render(<NarrationPresenter state={state} onAdvance={advance} />);
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
  expect(view.container.querySelector('img')).toBeNull();
  expect(screen.getByText('8 − 2 = 6')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Next banner' }));
  expect(advance).toHaveBeenCalledTimes(1);
});

test('auto-reading pauses for focus and details, and unmount clears presentation timers', () => {
  jest.useFakeTimers();
  const advance = jest.fn();
  const state = publish(emptyNarration(), [{ ...routine(1), source: 'Public fixture' }]);
  const view = render(<NarrationPresenter state={state} onAdvance={advance} autoAdvance />);
  const banner = screen.getByRole('article');
  fireEvent.focus(banner);
  act(() => jest.advanceTimersByTime(20000));
  expect(advance).not.toHaveBeenCalled();
  fireEvent.blur(banner);
  const details = view.container.querySelector('details');
  details.open = true;
  fireEvent(details, new Event('toggle'));
  act(() => jest.advanceTimersByTime(20000));
  expect(advance).not.toHaveBeenCalled();
  view.unmount();
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});
