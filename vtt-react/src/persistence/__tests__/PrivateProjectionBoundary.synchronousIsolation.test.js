/**
 * P5-01 focused regression (2026-10-10, final source-evidence run).
 *
 * Reproduced defect: the production PrivateProjectionBoundary hides private
 * projections only through an asynchronous React re-render. During the
 * retirement of account A, a real browser painted one frame that still showed
 * A's private draft content (campaign name from a mounted production account
 * component's local state) while the live auth principal was already B and
 * the gate was retiring.
 *
 * Contract under test: once the handoff is marked pending (a synchronous gate
 * mutation), the boundary's rendered private projection must be hidden in the
 * same call — before React's asynchronous re-render to the fallback commits.
 */
import React from 'react';
import { render, act } from '@testing-library/react/pure';
import PrivateProjectionBoundary from '../PrivateProjectionBoundary';
import {
  activatePrivateScope,
  markHandoffPending,
  retirePrivateScope,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';

const ownerA = { scopeKind: 'user', scopeId: 'owner-a' };

const flush = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

function PrivateDraft() {
  return React.createElement('div', null, 'A private campaign draft');
}

beforeEach(() => {
  resetBootstrapGateForTests();
  activatePrivateScope(ownerA);
});

test('P5-01 boundary hides a rendered private projection synchronously when the handoff is marked pending', async () => {
  const ui = render(
    React.createElement(
      PrivateProjectionBoundary,
      null,
      React.createElement(PrivateDraft)
    )
  );
  expect(ui.queryByText('A private campaign draft')).not.toBeNull();

  // The handoff mark runs synchronously with the live principal change. React
  // has not re-rendered yet at this point; the private projection must
  // already be hidden so no frame can paint it under the new principal.
  markHandoffPending(true);
  const host = ui.container.querySelector('[data-p5-private-projection]');
  expect(host).not.toBeNull();
  expect(host.style.display).toBe('none');
  expect(host.getAttribute('aria-hidden')).toBe('true');

  // Still not committed to the fallback at the instant of the mark.
  expect(ui.container.textContent).toContain('A private campaign draft');

  // React's re-render then commits the fallback removal.
  await flush();
  expect(ui.container.textContent).not.toContain('A private campaign draft');
});

test('P5-01 boundary restores the projection synchronously when isolation ends', async () => {
  const ui = render(
    React.createElement(
      PrivateProjectionBoundary,
      null,
      React.createElement(PrivateDraft)
    )
  );
  markHandoffPending(true);
  await flush();
  expect(ui.container.textContent).not.toContain('A private campaign draft');

  // Release: the synchronous show happens on the notifying call, and the
  // committed tree renders the children again.
  await act(async () => {
    markHandoffPending(false);
  });
  expect(ui.queryByText('A private campaign draft')).not.toBeNull();
  const host = ui.container.querySelector('[data-p5-private-projection]');
  expect(host).not.toBeNull();
  expect(host.style.display).toBe('contents');
  expect(host.getAttribute('aria-hidden')).toBeNull();
});

test('P5-01 retiring phase also hides synchronously before the fallback commits', async () => {
  const ui = render(
    React.createElement(
      PrivateProjectionBoundary,
      null,
      React.createElement(PrivateDraft)
    )
  );
  retirePrivateScope();
  const host = ui.container.querySelector('[data-p5-private-projection]');
  expect(host).not.toBeNull();
  expect(host.style.display).toBe('none');
  await flush();
  expect(ui.container.textContent).not.toContain('A private campaign draft');
});
