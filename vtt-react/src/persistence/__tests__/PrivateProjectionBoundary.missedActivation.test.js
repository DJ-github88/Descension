/**
 * P5-01 focused regression (2026-10-10 mounted-integration correction).
 *
 * Reproduced defect: a valid activation that lands between the boundary's
 * initial render and its passive-effect subscription was missed. The boundary
 * applied the correct DOM state but never reconciled its React fallback, so an
 * ordinary parent rerender kept showing the empty fallback while the
 * destination scope was active and no handoff was pending; only another gate
 * notification restored the UI.
 *
 * Contract under test: the boundary derives its visibility from the live gate
 * snapshot through a synchronous external-store subscription, so no
 * notification can be missed across the subscription lifecycle.
 */
import React from 'react';
import { render, act } from '@testing-library/react/pure';
import PrivateProjectionBoundary from '../PrivateProjectionBoundary';
import {
  activatePrivateScope,
  markHandoffPending,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';

const ownerA = { scopeKind: 'user', scopeId: 'owner-a' };
const ownerB = { scopeKind: 'user', scopeId: 'owner-b' };

const flush = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

function ActivateOnCommit({ children }) {
  React.useLayoutEffect(() => {
    // The valid activation lands after the boundary rendered its fallback for
    // the pending handoff, but before the boundary's passive subscription.
    activatePrivateScope(ownerB);
  }, []);
  return children;
}

beforeEach(() => {
  resetBootstrapGateForTests();
});

test('P5-01 an activation between render and subscription is not missed', async () => {
  activatePrivateScope(ownerA);
  markHandoffPending(true);

  const ui = render(
    React.createElement(
      ActivateOnCommit,
      null,
      React.createElement(
        PrivateProjectionBoundary,
        null,
        React.createElement('div', null, 'B authorized content')
      )
    )
  );

  await flush();
  expect(ui.queryByText('B authorized content')).not.toBeNull();

  // An ordinary parent rerender must keep showing the authorized content
  // without another gate notification.
  ui.rerender(
    React.createElement(
      ActivateOnCommit,
      null,
      React.createElement(
        PrivateProjectionBoundary,
        null,
        React.createElement('div', null, 'B authorized content rerender')
      )
    )
  );
  await flush();
  expect(ui.queryByText('B authorized content rerender')).not.toBeNull();
});

test('P5-01 a superseded activation still reconciles to the live scope', async () => {
  activatePrivateScope(ownerA);
  markHandoffPending(true);

  const ui = render(
    React.createElement(
      ActivateOnCommit,
      null,
      React.createElement(
        PrivateProjectionBoundary,
        null,
        React.createElement('div', null, 'authorized content')
      )
    )
  );
  await flush();

  // A later, unrelated pending mark then release must not lose the content.
  await act(async () => {
    markHandoffPending(true);
  });
  await flush();
  expect(ui.queryByText('authorized content')).toBeNull();
  await act(async () => {
    markHandoffPending(false);
  });
  await flush();
  expect(ui.queryByText('authorized content')).not.toBeNull();
});
