import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { isPrivateProjectionIsolated, subscribeBootstrapGate } from '../../persistence/bootstrapPrivacyGate';
import useTargetingStore from '../../store/targetingStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import { AIM_MANUAL, queryAimObstruction } from '../../services/aimObstruction';
import { PROFESSIONAL_OBJECTS } from '../level-editor/objects/ObjectSystem';
import { useCombatFeedStore, actorKey } from '../../services/acceptedResultFeed';
import { refOfToken, sameRef, pickKey, planarFeet, ringPoints, tokenAt, rangeText, formatFeet } from '../../services/targetPick';
import './TargetPickOverlay.css';

/**
 * P12C-B1 map picking (MYTHRILL_PROJECT_12C_B1_CONTRACT.md §1). Preview and selection only: the chosen
 * exact ref goes back to the controller's own field; validation and execution stay with the controller
 * and the GM. For players, only tokens rendered for them (P13A registry) can be hovered or picked.
 */
const TargetPickOverlay = ({ gridSystem, feetPerTile = 5, gridSize = 50, currentMapId = 'default' }) => {
  const session = useTargetingStore(s => s.pickSession);
  const uid = useAuthStore(s => s.user?.uid);
  const completeTargetPick = useTargetingStore(s => s.completeTargetPick);
  const cancelTargetPick = useTargetingStore(s => s.cancelTargetPick);
  const creatureTokens = useCreatureStore(s => s.creatureTokens);
  const creatures = useCreatureStore(s => s.creatures);
  const characterTokens = useCharacterTokenStore(s => s?.characterTokens);
  const rendered = useCombatFeedStore(s => s.rendered);
  const viewingFromToken = useLevelEditorStore(s => s.viewingFromToken);
  const unrestrictedGM = useGameStore(s => s.isGMMode) === true && !viewingFromToken;
  // No geometry subscription/result cache for players or the GM's restricted token view.
  const geometry = useLevelEditorStore(useShallow(s => unrestrictedGM ? {
    wallData: s.wallData, environmentalObjects: s.environmentalObjects, windowOverlays: s.windowOverlays
  } : {}));
  const mapReady = useGameStore(s => !s.actorRecoverySnapshot && (!s.multiplayerRoom || s.multiplayerSocket?.connected === true));
  useGameStore(useShallow(s => [s.gridType, s.gridOffsetX, s.gridOffsetY, s.gridSize]));
  const { cameraX, cameraY, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt } = useGameStore(useShallow(s => ({
    cameraX: s.cameraX, cameraY: s.cameraY, zoomLevel: s.zoomLevel, playerZoom: s.playerZoom, viewMode: s.viewMode, viewRotation: s.viewRotation, viewTilt: s.viewTilt })));
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [cursor, setCursor] = useState(null), [notice, setNotice] = useState('');
  const [selected, setSelected] = useState('');
  const targetControl = useRef(null);
  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useEffect(() => { setCursor(null); setNotice(''); setSelected(''); }, [session?.id]);
  useEffect(() => {
    if (!session) return undefined;
    const entry = document.activeElement;
    targetControl.current?.focus();
    return () => { if (entry?.isConnected) entry.focus?.(); };
  }, [session?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // A map or room change ends picking: the session's refs belong to the map it started on.
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const scope = useRef(null);
  const scopeKey = `${uid || ''}|${roomId || ''}|${currentMapId}`;
  useEffect(() => {
    if (scope.current !== null && scope.current !== scopeKey) cancelTargetPick();
    scope.current = scopeKey;
  }, [scopeKey, cancelTargetPick]);
  useEffect(() => subscribeBootstrapGate(() => cancelTargetPick()), [cancelTargetPick]);
  useEffect(() => {
    if (!session) return undefined;
    // Capture phase, consumed: Esc while picking only cancels the pick. It must not also reach the app's
    // own Escape handlers (closing windows or the "return to the realm gate" confirmation).
    const onKey = event => { if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); cancelTargetPick(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [session, cancelTargetPick]);
  const toScreen = useCallback((x, y) => gridSystem.worldToScreen(x, y, viewport.width, viewport.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridSystem, viewport.width, viewport.height, cameraX, cameraY, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt]);
  const toWorld = useCallback((x, y) => gridSystem.screenToWorld(x, y, viewport.width, viewport.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridSystem, viewport.width, viewport.height, cameraX, cameraY, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt]);
  // Every token on this map with an exact binding; visibility decides what this viewer may see.
  const entries = useMemo(() => [
    ...(creatureTokens || []).map(token => ({ token, name: token.state?.customName || creatures?.find(c => c.id === token.creatureId)?.name || 'Creature' })),
    ...(characterTokens || []).map(token => ({ token, name: token.character?.name || token.name || 'Character' }))
   ].filter(({ token }) => unrestrictedGM || (!token.state?.hiddenFromPlayers && !token.hiddenFromPlayers))
    .map(({ token, name }) => ({ ref: refOfToken(token), position: token.position, name, mapId: token.mapId || 'default' }))
    .filter(entry => entry.ref && entry.ref.mapId === currentMapId && entry.mapId === currentMapId), [creatureTokens, characterTokens, creatures, currentMapId, unrestrictedGM]);
  const visible = useCallback(ref => (rendered[actorKey(ref)] || 0) > 0 || (unrestrictedGM && !!ref), [rendered, unrestrictedGM]);
  if (!session || !gridSystem || isPrivateProjectionIsolated() || (scope.current !== null && scope.current !== scopeKey)) return null;
  const source = entries.find(entry => sameRef(entry.ref, session.sourceRef) && visible(entry.ref));
  const hitRadius = gridSize * 0.55;
  const chosen = entries.find(entry => pickKey(entry.ref) === selected && visible(entry.ref) && session.candidates?.some(ref => sameRef(ref, entry.ref)));
  const hover = chosen ? { entry: chosen, candidate: true } : cursor ? tokenAt(entries, cursor, { visible, candidates: session.candidates || [], reasonFor: session.reasonFor, hitRadius }) : null;
  const obstruction = queryAimObstruction({ source, target: hover?.entry, mapId: currentMapId, unrestrictedGM,
    gridSystem, wallTypes: WALL_TYPES, objectTypes: PROFESSIONAL_OBJECTS, ...geometry, ready: mapReady });
  const aimEnd = hover?.entry.position || cursor;
  const feet = source && aimEnd ? planarFeet(source.position, aimEnd, gridSize, feetPerTile) : null;
  const rangeWorld = Number.isFinite(session.rangeFeet) && session.rangeFeet > 0 ? session.rangeFeet / feetPerTile * gridSize : 0;
  const ring = [source?.position?.x, source?.position?.y].every(Number.isFinite) ? ringPoints(source.position, rangeWorld).map(p => toScreen(p.x, p.y)) : [];
  const hasPosition = entry => [entry?.position?.x, entry?.position?.y].every(Number.isFinite);
  const screenOf = entry => toScreen(entry.position.x, entry.position.y);
  const radiusPx = (() => { const a = toScreen(0, 0), b = toScreen(gridSize * 0.5, 0); return Math.max(14, Math.hypot(b.x - a.x, b.y - a.y)); })();
  const onMove = event => { if (!selected) setCursor(toWorld(event.clientX, event.clientY)); };
  const onClick = event => {
    event.preventDefault(); event.stopPropagation();
    const point = toWorld(event.clientX, event.clientY);
    const hit = tokenAt(entries, point, { visible, candidates: session.candidates || [], reasonFor: session.reasonFor, hitRadius });
    if (!hit) { setNotice('No token here. Pick a highlighted target, or press Esc to cancel.'); return; }
    if (!hit.candidate) { setNotice(hit.reason); return; }
    setSelected(pickKey(hit.entry.ref)); setCursor(null); setNotice('');
  };
  const onContext = event => { event.preventDefault(); cancelTargetPick(); };
  const status = hover ? (hover.candidate ? `${hover.entry.name}: ${rangeText(feet, session.rangeFeet, session.rangeLabel)}` : `${hover.entry.name}: ${hover.reason}`)
    : notice || `Pick a target for ${session.label}. Esc or right-click cancels.`;
  const candidateEntries = entries.filter(entry => visible(entry.ref) && (session.candidates || []).some(ref => sameRef(ref, entry.ref)));
  const drawableSource = hasPosition(source) ? source : null;
  const drawableEnd = [aimEnd?.x, aimEnd?.y].every(Number.isFinite) ? aimEnd : null;
  return ReactDOM.createPortal(
    <div className="tpo-root">
      <div className="tpo-catcher" role="application" aria-label={`Pick a target for ${session.label}`} onMouseMove={onMove} onClick={onClick} onContextMenu={onContext} />
      <svg className="tpo-svg" width={viewport.width} height={viewport.height} aria-hidden="true">
        {ring.length > 2 && <polygon className="tpo-range" points={ring.map(p => `${p.x},${p.y}`).join(' ')} />}
        {candidateEntries.filter(hasPosition).map(entry => { const s = screenOf(entry); return <circle key={`c-${entry.ref.tokenId}`} className="tpo-candidate" cx={s.x} cy={s.y} r={radiusPx + 3} />; })}
        {drawableSource && drawableEnd && (() => { const a = screenOf(source), b = toScreen(aimEnd.x, aimEnd.y); return <line className={`tpo-aim tpo-aim-${obstruction.status}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />; })()}
        {drawableSource && (() => { const s = screenOf(source); return <circle className="tpo-source" cx={s.x} cy={s.y} r={radiusPx + 6} />; })()}
        {hover && hasPosition(hover.entry) && (() => { const s = screenOf(hover.entry); return <circle className={hover.candidate ? 'tpo-target' : 'tpo-invalid'} cx={s.x} cy={s.y} r={radiusPx + 6} />; })()}
        {drawableSource && drawableEnd && feet !== null && (() => { const b = toScreen(aimEnd.x, aimEnd.y); return <text className="tpo-label" x={b.x + 14} y={b.y - 14}>{formatFeet(feet)} ft</text>; })()}
      </svg>
      <div className="tpo-bar" role="region" aria-label="Target aiming advisory">
        <label className="tpo-picker">Preview target
          <select ref={targetControl} value={chosen ? selected : ''} onKeyDown={event => event.stopPropagation()} onChange={event => { setSelected(event.target.value); setCursor(null); setNotice(''); }}>
            <option value="">Choose a target or tap its token</option>
            {candidateEntries.map(entry => <option key={pickKey(entry.ref)} value={pickKey(entry.ref)}>{entry.name}</option>)}
          </select>
        </label>
        <div role="status" aria-live="polite" className="tpo-feedback">
          <span>{status}</span>
          <strong>{obstruction.reason}</strong>
        </div>
        <span className="tpo-meta">{AIM_MANUAL} Centre ray only, including Large tokens; no footprint or partial-cover ruling.</span>
        <span className="tpo-meta">{session.rangeLabel ? `${session.rangeLabel} — advisory` : 'No card range — GM adjudicates'}</span>
        <button type="button" disabled={!chosen} onClick={() => chosen && completeTargetPick(chosen.ref)}>Use target</button>
        <button type="button" onClick={cancelTargetPick}>Cancel</button>
      </div>
    </div>,
    document.body
  );
};
export default TargetPickOverlay;
