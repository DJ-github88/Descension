import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FateWeaverResourceDisplay from '../FateWeaverResourceDisplay';
import ClassResourceBar from '../ClassResourceBar';

const state = () => ({
  tokens: [{ id: 't1', state: 'free' }, { id: 't2', state: 'reserved' }, { id: 't3', state: 'recovering' }],
  links: [{
    id: 'link-1',
    sourceId: 'actor-a',
    targetId: 'actor-b',
    sourceName: 'A',
    targetName: 'B',
    purpose: 'guard the gate',
    consent: 'both',
    tokenIds: ['t2'],
    tokenState: 'reserved',
    usesRemaining: 1,
    amountMax: 2,
    uses: 1,
    expiresAt: 'end of next turn'
  }]
});

test('integrated ClassResourceBar renders the explicit uninitialized state without inventing a thread', () => {
  render(<ClassResourceBar characterClass="Fate Weaver" classResource={{ type: 'fate-links', max: 3, state: null }} isOwner />);
  expect(screen.getByText(/not initialized/)).toBeInTheDocument();
  expect(screen.getByText(/never creates or recovers a thread/)).toBeInTheDocument();
});

test('owner sees actual token counts and link terms without mutation', () => {
  const resource = { type: 'fate-links', state: state() };
  const before = JSON.stringify(resource);
  const onUpdate = jest.fn();
  const { container } = render(<ClassResourceBar characterClass="Fate Weaver" classResource={{ ...resource, current: 1, max: 3 }} isOwner onClassResourceUpdate={onUpdate} />);
  expect(screen.getByText('Free 1/3')).toBeInTheDocument();
  expect(screen.getByText('Reserved 1 | Recovering 1')).toBeInTheDocument();
  expect(screen.getByText('A to B')).toBeInTheDocument();
  expect(screen.getByText('guard the gate')).toBeInTheDocument();
  expect(screen.getByText(/1 use\(s\) left/)).toBeInTheDocument();
  const inspection = screen.getByText('Inspect link rules');
  expect(inspection.tagName).toBe('SUMMARY');
  expect(inspection.style.minHeight).toBe('44px');
  fireEvent.click(inspection);
  fireEvent.keyDown(inspection, { key: 'Enter' });
  expect(onUpdate).not.toHaveBeenCalled();
  expect(JSON.stringify(resource)).toBe(before);
  const rules = container.textContent;
  expect(rules).toMatch(/30 ft each with 60 ft maintenance separation/);
  expect(rules).toMatch(/No long rest, reconnect, initiative or scene-change refill/);
  expect(rules).toMatch(/owning caster next own turn/);
});

test('observer sees public terms but no endpoint identities or actor refs', () => {
  const raw = state();
  raw.links[0].sourceName = 'PRIVATE-SOURCE';
  raw.links[0].targetName = 'PRIVATE-TARGET';
  const { container } = render(<ClassResourceBar characterClass="Fate Weaver" classResource={{ type: 'fate-links', state: raw, current: 1, max: 3 }} />);
  expect(screen.getByText('Endpoint hidden to Endpoint hidden')).toBeInTheDocument();
  expect(screen.getByText('guard the gate')).toBeInTheDocument();
  const html = container.innerHTML;
  ['PRIVATE-SOURCE', 'PRIVATE-TARGET', 'actor-a', 'actor-b'].forEach(secret => expect(html).not.toContain(secret));
});

test.each([
  ['object token container', { tokens: {}, links: [{}] }],
  ['string token container', { tokens: 'three', links: [{}] }]
])('malformed %s mounts as a review state without inventing threads', (_label, raw) => {
  const { container } = render(<FateWeaverResourceDisplay resource={{ state: raw }} />);
  expect(screen.getByText(/Fate Link state needs review/)).toBeInTheDocument();
  expect(container.textContent).not.toMatch(/Free 3\/3/);
});

test('invalid state is reported without repairing or leaking malformed values', () => {
  const raw = state();
  raw.links[0].recursive = true;
  raw.links[0].amountMax = 4;
  const before = JSON.stringify(raw);
  const { container } = render(<FateWeaverResourceDisplay resource={{ state: raw }} />);
  expect(screen.getByText(/Fate Link state needs review/)).toBeInTheDocument();
  expect(container.innerHTML).not.toContain('actor-a');
  expect(JSON.stringify(raw)).toBe(before);
});
