/**
 * Project 5 Wave A (S4/G, corrected R7/B4) — private projection UI boundary.
 *
 * While a handoff is retiring/resetting or has failed closed (the gate holds
 * in `loading` with a holdReason and no active scope), private projections
 * such as the party HUD must not be visible, even if a failed reset left the
 * previous owner's data in a runtime store. Children render only when no
 * handoff hold is active.
 *
 * P5-01 final correction (2026-10-10): the isolation must cover the interval
 * before React's asynchronous re-render commits. A gate notification hides
 * the rendered projection synchronously (inline display/aria-hidden) in the
 * same call that marks the handoff pending; the React fallback still replaces
 * the children on commit.
 *
 * P5-01 mounted-integration correction (2026-10-10, second bounded run): the
 * gate snapshot is now consumed through `useSyncExternalStore`, so a valid
 * activation that lands between the initial render and the passive-effect
 * subscription can no longer leave the boundary stuck on its fallback: React
 * re-checks the snapshot after subscribing and re-renders. Portal-mounted
 * private windows use `usePrivateWindowIsolation` so private content rendered
 * outside this DOM subtree is hidden with the same synchronous guarantee.
 */

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getBootstrapGateState, subscribeBootstrapGate } from './bootstrapPrivacyGate';

/**
 * True while private UI must stay isolated: an explicit fail-closed hold, or
 * an in-progress retirement/loading transition where no private scope is
 * active for the current principal.
 */
export function isHandoffIsolationActive(gateState) {
  if (!gateState) return false;
  if (gateState.holdReason) return true;
  if (gateState.handoffPending === true) return true;
  return gateState.phase === 'retiring' || gateState.phase === 'loading';
}

/**
 * Synchronous DOM isolation for the rendered host: applied on the notifying
 * gate call, before any React commit. The visible state restores the exact
 * inline style the boundary renders with so React's prop diff stays stable.
 */
export function applySynchronousIsolation(node, gateState) {
  if (!node || typeof node.style === 'undefined') return false;
  const isolating = isHandoffIsolationActive(gateState);
  node.style.display = isolating ? 'none' : 'contents';
  if (isolating) {
    node.setAttribute('aria-hidden', 'true');
  } else {
    node.removeAttribute('aria-hidden');
  }
  return isolating;
}

/**
 * Isolation hook for private windows that render through a portal outside the
 * boundary host (document.body). Returns true while the window must not be
 * rendered; also hides `nodeRef.current` synchronously on the gate
 * notification so the previous owner's content cannot paint for a frame
 * before React's commit. Only windows that opt in are affected.
 */
export function usePrivateWindowIsolation(nodeRef, enabled = true) {
  const [isolated, setIsolated] = useState(
    () => enabled === true && isHandoffIsolationActive(getBootstrapGateState())
  );

  useEffect(() => {
    if (enabled !== true) return undefined;
    const apply = (state) => {
      const isolating = isHandoffIsolationActive(state);
      const node = nodeRef.current;
      if (node && typeof node.style !== 'undefined') {
        node.style.display = isolating ? 'none' : '';
        if (isolating) {
          node.setAttribute('aria-hidden', 'true');
        } else {
          node.removeAttribute('aria-hidden');
        }
      }
      setIsolated(isolating);
    };
    apply(getBootstrapGateState());
    return subscribeBootstrapGate(apply);
  }, [enabled, nodeRef]);

  return enabled === true && isolated;
}

export default function PrivateProjectionBoundary({ children = null, fallback = null }) {
  const gateState = useSyncExternalStore(
    subscribeBootstrapGate,
    getBootstrapGateState,
    getBootstrapGateState
  );
  const hostRef = useRef(null);

  useEffect(() => {
    // Keep the synchronous pre-commit isolation for rendered hosts: the gate
    // notification hides the live node in the same call, before React commits
    // the fallback replacement.
    const unsubscribe = subscribeBootstrapGate((state) => {
      applySynchronousIsolation(hostRef.current, state);
    });
    applySynchronousIsolation(hostRef.current, getBootstrapGateState());
    return unsubscribe;
  }, []);

  if (isHandoffIsolationActive(gateState)) {
    return fallback;
  }
  return (
    <div
      ref={hostRef}
      data-p5-private-projection="true"
      style={{ display: 'contents' }}
    >
      {children}
    </div>
  );
}
