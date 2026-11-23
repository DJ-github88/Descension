import React, { useEffect, useMemo, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useMapStore from '../../store/mapStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import {
  FAMILIES,
  usePlacedEffectStore,
  refreshPlacedEffects,
  registerPlacedEffectHandlers,
  startMapPlacement,
  cancelMapPlacement,
  removePlacedEffect,
  primaryPcOwners
} from '../../services/placedEffectService';
import {
  useSpellConsequenceStore,
  refreshAuthoredAbilities
} from '../../services/spellConsequenceService';
import './TriggerOfferPanel.css';

const FAMILY_LABELS = {
  placed: 'Placed (unassigned)',
  trap: 'Trap (Wizard)',
  inscription: 'Inscription (Runic)',
  totem: 'Totem (Conduit)'
};

const RADIUS_CHOICES = [5, 10, 15, 20, 25, 30, 40, 50, 60];

export default function PlacedEffectPanel() {
  const roomId = useGameStore(state => state.multiplayerRoom?.id);
  const socket = useGameStore(state => state.multiplayerSocket);
  const isGM = useGameStore(state => state.isGMMode === true);
  const mapStoreId = useMapStore(state => state.currentMapId);
  const gameMapId = useGameStore(state => state.currentMapId);
  const currentMapId = mapStoreId || gameMapId || 'default';
  const projection = usePlacedEffectStore(state => state.projection);
  const loading = usePlacedEffectStore(state => state.loading);
  const error = usePlacedEffectStore(state => state.error);
  const message = usePlacedEffectStore(state => state.message);
  const placementDraft = usePlacedEffectStore(state => state.placementDraft);
  const authoredRoomId = useSpellConsequenceStore(state => state.authoredRoomId);
  const authoredEntries = useSpellConsequenceStore(state => state.authoredEntries) || [];
  const characterTokens = useCharacterTokenStore(state => state.characterTokens) || [];

  const [ownerKey, setOwnerKey] = useState('0');
  const [abilityKey, setAbilityKey] = useState('0');
  const [family, setFamily] = useState('trap');
  const [radiusFeet, setRadiusFeet] = useState(10);
  const [localMessage, setLocalMessage] = useState('');
  const [busyId, setBusyId] = useState(null);

  const owners = useMemo(() => {
    const items = primaryPcOwners();
    return Array.isArray(items) ? items : [];
  }, [characterTokens, roomId]);

  const admittedAbilities = useMemo(() => {
    if (authoredRoomId !== roomId) return [];
    return authoredEntries.filter(entry => entry && !entry.revoked && !entry.creatureOnly);
  }, [authoredEntries, authoredRoomId, roomId]);

  const placements = useMemo(
    () => (Array.isArray(projection?.placements) ? projection.placements : []),
    [projection]
  );

  useEffect(() => {
    if (!socket || !roomId) return undefined;
    const off = registerPlacedEffectHandlers({ socket });
    refreshPlacedEffects();
    if (isGM && authoredRoomId !== roomId) {
      refreshAuthoredAbilities();
    }
    return off;
  }, [socket, roomId, isGM, authoredRoomId]);

  useEffect(() => {
    if (ownerKey !== '0' && !owners[Number(ownerKey)]) setOwnerKey('0');
  }, [owners, ownerKey]);

  useEffect(() => {
    if (abilityKey !== '0' && !admittedAbilities[Number(abilityKey)]) setAbilityKey('0');
  }, [admittedAbilities, abilityKey]);

  const chosenAbility = admittedAbilities[Number(abilityKey)] || null;
  const lockedRadius = Number.isSafeInteger(chosenAbility?.canonicalDefinition?.targeting?.radiusFeet)
    ? chosenAbility.canonicalDefinition.targeting.radiusFeet
    : null;

  useEffect(() => {
    if (lockedRadius !== null) setRadiusFeet(lockedRadius);
  }, [lockedRadius]);

  if (!roomId) return null;
  if (!projection && !loading && !error) return null;
  if (!isGM && placements.length === 0 && !error) return null;

  const chosenOwner = owners[Number(ownerKey)] || null;
  const canStartPlace = Boolean(isGM && chosenOwner && chosenAbility && currentMapId);

  const handleStartPick = () => {
    if (!canStartPlace) return;
    setLocalMessage('');
    startMapPlacement({
      owner: chosenOwner.ref,
      ownerLabel: chosenOwner.label,
      definitionRef: chosenAbility.definitionRef,
      abilityName: chosenAbility.canonicalDefinition?.name || 'Ability',
      family,
      radiusFeet: lockedRadius ?? radiusFeet,
      mapId: currentMapId
    });
  };

  const handleRemove = async placementId => {
    setBusyId(placementId);
    setLocalMessage('');
    try {
      const res = await removePlacedEffect(placementId);
      if (res?.success === false) {
        setLocalMessage(res.error || res.code || 'Could not remove placement.');
      } else {
        setLocalMessage('Placement removed.');
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="sc-panel" data-testid="placed-effect-panel" aria-label="Placed map effects">
      <div className="sc-panel-header">
        <span>Placed effects</span>
        <span className="sc-subtle">
          {projection?.armingApproved ? 'Armed rules active' : 'Unarmed GM custody'}
        </span>
        <button
          type="button"
          aria-label="Refresh placed effects"
          onClick={() => {
            refreshPlacedEffects();
            if (isGM) refreshAuthoredAbilities();
          }}
        >
          Refresh
        </button>
      </div>

      {isGM && projection?.armingApproved === false && (
        <div className="sc-note" role="note">
          Placements stay unarmed map markers until creator rulings (PE1–PE4) are approved.
        </div>
      )}

      {isGM && (
        <div className="sc-form" style={{ display: 'grid', gap: 6, marginTop: 6 }}>
          <label className="sc-row">
            <span>Owner PC</span>
            <select
              aria-label="Placed effect owner"
              value={ownerKey}
              onChange={e => setOwnerKey(e.target.value)}
            >
              {owners.length === 0 && <option value="0">No bound primary PC</option>}
              {owners.map((item, idx) => (
                <option key={`${item.ref.tokenId}-${idx}`} value={String(idx)}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="sc-row">
            <span>Ability</span>
            <select
              aria-label="Placed effect ability"
              value={abilityKey}
              onChange={e => setAbilityKey(e.target.value)}
            >
              {admittedAbilities.length === 0 && <option value="0">No admitted PC ability</option>}
              {admittedAbilities.map((entry, idx) => (
                <option key={entry.definitionRef?.definitionHash || idx} value={String(idx)}>
                  {entry.canonicalDefinition?.name || 'Ability'}
                </option>
              ))}
            </select>
          </label>

          <label className="sc-row">
            <span>Domain</span>
            <select
              aria-label="Placed effect domain"
              value={family}
              onChange={e => setFamily(e.target.value)}
            >
              {FAMILIES.map(f => (
                <option key={f} value={f}>{FAMILY_LABELS[f] || f}</option>
              ))}
            </select>
          </label>

          <label className="sc-row">
            <span>Radius (ft)</span>
            <select
              aria-label="Placed effect radius"
              value={String(lockedRadius ?? radiusFeet)}
              disabled={lockedRadius !== null}
              onChange={e => setRadiusFeet(Number(e.target.value))}
            >
              {(lockedRadius !== null && !RADIUS_CHOICES.includes(lockedRadius)
                ? [lockedRadius, ...RADIUS_CHOICES]
                : RADIUS_CHOICES
              ).map(r => (
                <option key={r} value={String(r)}>{`${r} ft`}</option>
              ))}
            </select>
          </label>

          <div className="sc-row" style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              disabled={!canStartPlace || Boolean(placementDraft)}
              onClick={handleStartPick}
            >
              Place on map
            </button>
            {placementDraft && (
              <button type="button" onClick={cancelMapPlacement}>
                Cancel map pick
              </button>
            )}
          </div>
        </div>
      )}

      {(localMessage || message) && (
        <div className="sc-status" role="status">{localMessage || message}</div>
      )}

      {placements.length > 0 && (
        <ul className="sc-list" style={{ marginTop: 8, paddingLeft: 14 }}>
          {placements.map(item => (
            <li key={item.placementId} data-testid={`placed-hud-item-${item.placementId}`} style={{ marginBottom: 6 }}>
              <div>
                <strong>{`${FAMILY_LABELS[item.family] || item.family}: ${item.abilityName}`}</strong>
              </div>
              <div className="sc-subtle">
                {`${item.displayStatus || item.state} · map ${item.location?.mapId || 'default'}`}
              </div>
              {isGM && (
                <button
                  type="button"
                  data-testid={`placed-remove-hud-${item.placementId}`}
                  disabled={busyId === item.placementId}
                  onClick={() => handleRemove(item.placementId)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
