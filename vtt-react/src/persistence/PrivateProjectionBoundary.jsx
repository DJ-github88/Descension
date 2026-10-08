/**
 * Project 5 Wave A (S4/G, corrected R7/B4) — private projection UI boundary.
 *
 * While a handoff is retiring/resetting or has failed closed (the gate holds
 * in `loading` with a holdReason and no active scope), private projections
 * such as the party HUD must not be visible, even if a failed reset left the
 * previous owner's data in a runtime store. Children render only when no
 * handoff hold is active.
 */

import React, { useEffect, useState } from 'react';
import { getBootstrapGateState, subscribeBootstrapGate } from './bootstrapPrivacyGate';

/**
 * True while private UI must stay isolated: an explicit fail-closed hold, or
 * an in-progress retirement/loading transition where no private scope is
 * active for the current principal.
 */
export function isHandoffIsolationActive(gateState) {
  if (!gateState) return false;
  if (gateState.holdReason) return true;
  return gateState.phase === 'retiring' || gateState.phase === 'loading';
}

export default function PrivateProjectionBoundary({ children = null, fallback = null }) {
  const [gateState, setGateState] = useState(() => getBootstrapGateState());

  useEffect(() => subscribeBootstrapGate(setGateState), []);

  if (isHandoffIsolationActive(gateState)) {
    return fallback;
  }
  return children;
}
