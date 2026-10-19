import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import useGameStore from '../../store/gameStore';
import useTargetingStore from '../../store/targetingStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { useCombatFeedStore, actorKey } from '../../services/acceptedResultFeed';
import { refOfToken, sameRef, planarFeet, ringPoints, tokenAt, rangeText, formatFeet } from '../../services/targetPick';
import './TargetPickOverlay.css';

/**
 * P12C-B1 map picking (MYTHRILL_PROJECT_12C_B1_CONTRACT.md §1). Preview and selection only: the chosen
 * exact ref goes back to the controller's own field; validation and execution stay with the controller
 * and the GM. For players, only tokens rendered for them (P13A registry) can be hovered or picked.
 */
const TargetPickOverlay = ({ gridSystem, feetPerTile = 5, gridSize = 50, currentMapId = 'default' }) => {
  const session = useTargetingStore(s => s.pickSession);
  const completeTargetPick = useTargetingStore(s => s.completeTargetPick);
  const cancelTargetPick = useTargetingStore(s => s.cancelTargetPick);
  const creatureTokens = useCreatureStore(s => s.creatureTokens);
  const creatures = useCreatureStore(s => s.creatures);
  const characterTokens = useCharacterTokenStore(s => s?.characterTokens);
  const rendered = useCombatFeedStore(s => s.rendered);
  const { isGMMode, cameraX, cameraY, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt } = useGameStore(useShallow(s => ({
    isGMMode: s.isGMMode, cameraX: s.cameraX, cameraY: s.cameraY, zoomLevel: s.zoomLevel, playerZoom: s.playerZoom, viewMode: s.viewMode, viewRotation: s.viewRotation, viewTilt: s.viewTilt })));
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [cursor, setCursor] = useState(null), [notice, setNotice] = useState('');
  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useEffect(() => { setCursor(null); setNotice(''); }, [session?.id]);
  // A map or room change ends picking: the session's refs belong to the map it started on.
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const scope = useRef(null);
  useEffect(() => {
    const key = `${roomId || ''}|${currentMapId}`;
    if (scope.current !== null && scope.current !== key) cancelTargetPick();
    scope.current = key;
  }, [roomId, currentMapId, cancelTargetPick]);
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
  ].map(({ token, name }) => ({ ref: refOfToken(token), position: token.position, name, mapId: token.mapId || 'default' }))
    .filter(entry => entry.ref && entry.mapId === currentMapId), [creatureTokens, characterTokens, creatures, currentMapId]);
  const visible = useCallback(ref => (rendered[actorKey(ref)] || 0) > 0 || (isGMMode && !!ref), [rendered, isGMMode]);
  if (!session || !gridSystem) return null;
  const source = entries.find(entry => sameRef(entry.ref, session.sourceRef));
  const hitRadius = gridSize * 0.55;
  const hover = cursor ? tokenAt(entries, cursor, { visible, candidates: session.candidates || [], reasonFor: session.reasonFor, hitRadius }) : null;
  const aimEnd = hover?.entry.position || cursor;
  const feet = source && aimEnd ? planarFeet(source.position, aimEnd, gridSize, feetPerTile) : null;
  const rangeWorld = Number.isFinite(session.rangeFeet) && session.rangeFeet > 0 ? session.rangeFeet / feetPerTile * gridSize : 0;
  const ring = source ? ringPoints(source.position, rangeWorld).map(p => toScreen(p.x, p.y)) : [];
  const screenOf = entry => toScreen(entry.position.x, entry.position.y);
  const radiusPx = (() => { const a = toScreen(0, 0), b = toScreen(gridSize * 0.5, 0); return Math.max(14, Math.hypot(b.x - a.x, b.y - a.y)); })();
  const onMove = event => setCursor(toWorld(event.clientX, event.clientY));
  const onClick = event => {
    event.preventDefault(); event.stopPropagation();
    const point = toWorld(event.clientX, event.clientY);
    const hit = tokenAt(entries, point, { visible, candidates: session.candidates || [], reasonFor: session.reasonFor, hitRadius });
    if (!hit) { setNotice('No token here. Pick a highlighted target, or press Esc to cancel.'); return; }
    if (!hit.candidate) { setNotice(hit.reason); return; }
    completeTargetPick(hit.entry.ref);
  };
  const onContext = event => { event.preventDefault(); cancelTargetPick(); };
  const status = hover ? (hover.candidate ? `${hover.entry.name}: ${rangeText(feet, session.rangeFeet, session.rangeLabel)}` : `${hover.entry.name}: ${hover.reason}`)
    : notice || `Pick a target for ${session.label}. Esc or right-click cancels.`;
  const candidateEntries = entries.filter(entry => visible(entry.ref) && (session.candidates || []).some(ref => sameRef(ref, entry.ref)));
  return ReactDOM.createPortal(
    <div className="tpo-root">
      <div className="tpo-catcher" role="application" aria-label={`Pick a target for ${session.label}`} onMouseMove={onMove} onClick={onClick} onContextMenu={onContext} />
      <svg className="tpo-svg" width={viewport.width} height={viewport.height} aria-hidden="true">
        {ring.length > 2 && <polygon className="tpo-range" points={ring.map(p => `${p.x},${p.y}`).join(' ')} />}
        {candidateEntries.map(entry => { const s = screenOf(entry); return <circle key={`c-${entry.ref.tokenId}`} className="tpo-candidate" cx={s.x} cy={s.y} r={radiusPx + 3} />; })}
        {source && aimEnd && (() => { const a = screenOf(source), b = toScreen(aimEnd.x, aimEnd.y); return <line className={`tpo-aim ${hover?.candidate && session.rangeFeet && feet > session.rangeFeet ? 'tpo-far' : ''}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />; })()}
        {source && (() => { const s = screenOf(source); return <circle className="tpo-source" cx={s.x} cy={s.y} r={radiusPx + 6} />; })()}
        {hover && (() => { const s = screenOf(hover.entry); return <circle className={hover.candidate ? 'tpo-target' : 'tpo-invalid'} cx={s.x} cy={s.y} r={radiusPx + 6} />; })()}
        {source && aimEnd && feet !== null && (() => { const b = toScreen(aimEnd.x, aimEnd.y); return <text className="tpo-label" x={b.x + 14} y={b.y - 14}>{formatFeet(feet)} ft</text>; })()}
      </svg>
      <div className="tpo-bar" role="status" aria-live="polite">
        <span>{status}</span>
        <span className="tpo-meta">{session.rangeLabel ? `${session.rangeLabel} — advisory` : 'No card range — GM adjudicates'}</span>
        <button type="button" onClick={cancelTargetPick}>Cancel</button>
      </div>
    </div>,
    document.body
  );
};
export default TargetPickOverlay;
