import React, { useState } from 'react';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import { grantGmInventoryShare, revokeGmInventoryShare } from '../../services/inventoryShareService';

/**
 * Project 4 H14 owner control: deliberately grant or revoke a read-only,
 * session-scoped GM inventory share for the active character. Consent never
 * returns automatically after departure/rejoin.
 */
export default function InventoryShareToggle() {
  const characterId = useCharacterStore((state) => state.currentCharacterId);
  const isInMultiplayer = useGameStore((state) => state.isInMultiplayer);
  const roomId = useGameStore((state) => state.multiplayerRoom?.id || null);
  const [state, setState] = useState({ active: false, busy: false, error: null });

  if (!isInMultiplayer || !roomId || !characterId) {return null;}

  const grant = async() => {
    setState((s) => ({ ...s, busy: true, error: null }));
    try {
      await grantGmInventoryShare(roomId, characterId);
      setState({ active: true, busy: false, error: null });
    } catch (error) {
      setState({ active: false, busy: false, error: error.message });
    }
  };

  const revoke = async() => {
    setState((s) => ({ ...s, busy: true, error: null }));
    try {
      await revokeGmInventoryShare(roomId, characterId);
      setState({ active: false, busy: false, error: null });
    } catch (error) {
      setState((s) => ({ ...s, busy: false, error: error.message }));
    }
  };

  return (
    <div className="inventory-share-toggle" data-testid="inventory-share-toggle">
      <button type="button" disabled={state.busy} onClick={state.active ? revoke : grant}>
        {state.active ? 'Revoke GM inventory view' : 'Share inventory with GM (read-only)'}
      </button>
      {state.error ? <span role="alert">{state.error}</span> : null}
    </div>
  );
}
