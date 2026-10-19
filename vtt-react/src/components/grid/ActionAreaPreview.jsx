import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useSpellAoEStore from '../../store/spellAoEStore';
import { useCombatFeedStore, actorKey } from '../../services/acceptedResultFeed';
import { ownerSource } from '../../services/spellConsequenceService';
import { currentActorDelivery } from '../../services/actorProjectionOrder';
import { subscribeBootstrapGate, isPrivateProjectionIsolated } from '../../persistence/bootstrapPrivacyGate';
import { radiantPreviewProfile } from '../../services/areaPreview';
import { sameRef, planarFeet, formatFeet, refOfToken, pickKey } from '../../services/targetPick';
import { createCirclePolygon } from '../../utils/AoETemplates';
import './ActionAreaPreview.css';

/** B2 is a mode of the existing AoE mount/store. It never invokes the legacy affected/chat path. */
export default function ActionAreaPreview({ gridSystem, gridSize, feetPerTile, gridOffsetX, gridOffsetY, currentMapId }) {
  const session = useSpellAoEStore(s => s.actionPreview);
  const update = useSpellAoEStore(s => s.updateActionPreview), end = useSpellAoEStore(s => s.endActionPreview);
  const game = useGameStore(); // Camera/scope changes must reproject or invalidate immediately.
  const uid = useAuthStore(s => s.user?.uid);
  const characterId = useCharacterStore(s => s.currentCharacterId);
  useCombatFeedStore(s => s.rendered);
  const catcher = useRef(null);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const source = ownerSource();
  const profile = radiantPreviewProfile(session?.action, session?.profile.effect);
  const gridType = gridSystem?.getGridState().gridType;
  const visible = (ref, token) => game.isGMMode === true ||
    (!token?.state?.hiddenFromPlayers && !token?.hiddenFromPlayers && (useCombatFeedStore.getState().rendered[actorKey(ref)] || 0) > 0);
  const valid = !!session && currentActorDelivery(session.context, session.context.roomId) && game.multiplayerSocket?.connected === true &&
    !isPrivateProjectionIsolated() && !game.actorRecoverySnapshot && uid === session.context.uid && characterId === session.sourceRef.characterId &&
    [source.token?.position?.x, source.token?.position?.y].every(Number.isFinite) &&
    currentMapId === session.sourceRef.mapId && sameRef(source.ref, session.sourceRef) && visible(source.ref, source.token) &&
    !profile.error && profile.fingerprint === session.profile.fingerprint;
  const scale = [gridSize, feetPerTile].every(n => Number.isFinite(n) && n > 0) &&
    [gridOffsetX, gridOffsetY].every(Number.isFinite) && gridType === 'square';
  const gridKey = JSON.stringify([gridType, gridSize, feetPerTile, gridOffsetX, gridOffsetY]);
  const initialGrid = useRef(gridKey);
  useEffect(() => { if (!valid || initialGrid.current !== gridKey) end(); }, [valid, gridKey, end]);
  useEffect(() => subscribeBootstrapGate(() => end()), [end]);
  useEffect(() => {
    const socket = session?.context.socket;
    socket?.on?.('disconnect', end);
    return () => socket?.off?.('disconnect', end);
  }, [session?.context.socket, end]);
  useLayoutEffect(() => {
    // A confirmation is a latch, not a saved list of actors/names. Compare only current/previous
    // entitled facts supplied by each store notification; retain nothing about recipients afterward.
    const invalidate = () => {
      if (useSpellAoEStore.getState().actionPreview?.confirmed) update({ confirmed: false });
    };
    const facts = (state, field) => (state[field] || []).filter(token => {
      const ref = refOfToken(token);
      return ref?.mapId === currentMapId && visible(ref, token);
    }).map(token => [pickKey(refOfToken(token)), token.position, token.character?.name,
      token.creatureId, (state.creatures || []).find(c => c.id === token.creatureId)?.size,
      (state.creatures || []).find(c => c.id === token.creatureId)?.name]);
    const off = [
      useCombatFeedStore.subscribe((next, prev) => { if (next.rendered !== prev.rendered) invalidate(); }),
      useCreatureStore.subscribe((next, prev) => { if (JSON.stringify(facts(next, 'creatureTokens')) !== JSON.stringify(facts(prev, 'creatureTokens'))) invalidate(); }),
      useCharacterTokenStore.subscribe((next, prev) => { if (JSON.stringify(facts(next, 'characterTokens')) !== JSON.stringify(facts(prev, 'characterTokens'))) invalidate(); })
    ];
    return () => off.forEach(unsubscribe => unsubscribe());
    // The callbacks read the live visibility registry; only viewer/map changes replace subscriptions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.isGMMode, currentMapId, update]);
  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => { if (session?.placing) catcher.current?.focus(); }, [session?.placing]);
  useEffect(() => {
    const key = event => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopImmediatePropagation(); end();
    };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, [end]);
  if (!valid || initialGrid.current !== gridKey) return null;
  const toScreen = p => gridSystem.worldToScreen(p.x, p.y, viewport.width, viewport.height);
  const origin = session.origin;
  const distance = scale && origin ? planarFeet(source.token.position, origin, gridSize, feetPerTile) : null;
  const inRange = distance !== null && distance <= profile.rangeFeet + 1e-8;
  const polygon = (centre, feet) => createCirclePolygon(centre.x, centre.y, feet / feetPerTile * gridSize, 96)
    .map(p => { const s = toScreen(p); return `${s.x},${s.y}`; }).join(' ');
  const move = event => {
    if (session.placing) update({ origin: gridSystem.screenToWorld(event.clientX, event.clientY, viewport.width, viewport.height) });
  };
  const keep = () => {
    if (!scale || !inRange) return;
    update({ placing: false, confirmed: true });
    session.onReturn?.();
  };
  const keyboard = event => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const d = directions[event.key];
    if (!d) return;
    event.preventDefault(); event.stopPropagation();
    const p = origin || source.token.position, step = gridSize / (event.shiftKey ? 100 : 10);
    update({ origin: { x: p.x + d[0] * step, y: p.y + d[1] * step } });
  };
  return createPortal(<div className="b2-preview">
    {session.placing && <div ref={catcher} className="b2-catcher" role="application" tabIndex={0}
      aria-label="Place Radiant Burst origin. Arrow keys move by half a foot at standard scale; Shift moves more finely. Tab to Keep preview or Cancel."
      onKeyDown={keyboard} onPointerMove={e => e.pointerType !== 'touch' && move(e)} onPointerDown={move}
      onContextMenu={e => { e.preventDefault(); end(); }} />}
    {scale && <svg className="b2-svg" width={viewport.width} height={viewport.height} aria-hidden="true">
      <polygon className="b2-range" points={polygon(source.token.position, profile.rangeFeet)} />
      <circle className="b2-source" cx={toScreen(source.token.position).x} cy={toScreen(source.token.position).y} r="16" />
      {origin && <>
        <line className="b2-origin" x1={toScreen(source.token.position).x} y1={toScreen(source.token.position).y}
          x2={toScreen(origin).x} y2={toScreen(origin).y} />
        <polygon className={`b2-area ${inRange ? '' : 'b2-outside'}`} points={polygon(origin, profile.radiusFeet)} />
        <path className="b2-origin" d={`M${toScreen(origin).x - 10},${toScreen(origin).y}h20 M${toScreen(origin).x},${toScreen(origin).y - 10}v20`} />
      </>}
    </svg>}
    <section className="b2-panel" aria-label="Radiant Burst area preview">
      <strong>Radiant Burst · {profile.effect} channel · geometry only</strong>
      <span>10-ft radius · 20-ft origin range · free point</span>
      <p role="status">{!scale ? 'Manual geometry — square grid and a known positive map scale required.' :
        !origin ? 'Choose an origin on the map, or use the arrow keys.' :
        `${formatFeet(distance)} ft to origin — ${inRange ? 'within' : 'outside'} 20-ft placement range.`}
        {!session.placing && (session.confirmed ? ' Preview kept locally.' : ' Changed since confirmation — review and keep again.')}</p>
      <p>Overlap is not recipient eligibility or an applied effect. Walls, line of effect and elevation: GM decides.</p>
      <details><summary>Recipient conflict — GM decides</summary>
        <p>Card prose: damages undead and heals the living. Authored {profile.effect} channel: {profile.effect === 'damage' ? 'enemies' : 'allies'}. No eligibility is inferred.</p>
      </details>
      <p>Visible map tokens carry geometric-only markers. Unknown footprints stay GM-decided. No affected count.</p>
      <p>Nothing rolled, reserved, spent, posted or applied.</p>
      <div className="b2-controls">
        {session.placing ? <button type="button" disabled={!scale || !inRange} onClick={keep}>Keep preview — GM decides effects</button> :
          <button type="button" onClick={() => update({ placing: true })}>Review placement</button>}
        <button type="button" onClick={end}>{session.placing ? 'Cancel area preview' : 'Clear area preview'}</button>
      </div>
    </section>
  </div>, document.body);
}
