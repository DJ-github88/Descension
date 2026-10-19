import React from 'react';
import useSpellAoEStore from '../../store/spellAoEStore';
import useGameStore from '../../store/gameStore';
import useCreatureStore, { getCreatureSizeMapping } from '../../store/creatureStore';
import { currentActorDelivery } from '../../services/actorProjectionOrder';
import { isPrivateProjectionIsolated } from '../../persistence/bootstrapPrivacyGate';
import { visibleAreaCandidates } from '../../services/areaPreview';
import { refOfToken } from '../../services/targetPick';

/** Lives inside the actual token render gate: removal from FOV removes all B2 output in that commit,
 * without waiting for passive cleanup of the advisory rendered-registry subscription. */
export default function TokenAreaCandidate({ token }) {
  const session = useSpellAoEStore(s => s.actionPreview);
  const game = useGameStore();
  const creatures = useCreatureStore(s => s.creatures);
  const ref = refOfToken(token);
  if (!session?.origin || !ref || ref.mapId !== session.sourceRef.mapId || game.gridType !== 'square' ||
      !currentActorDelivery(session.context, session.context.roomId) || !session.context.socket?.connected ||
      isPrivateProjectionIsolated() || game.actorRecoverySnapshot) return null;
  const gridSize = game.gridSize, feetPerTile = game.feetPerTile;
  if (![gridSize, feetPerTile].every(n => Number.isFinite(n) && n > 0)) return null;
  const creature = creatures.find(c => c.id === token.creatureId);
  const size = creature?.size;
  const entry = { token, name: () => token.character?.name || token.state?.customName || creature?.name || 'Token',
    footprint: () => ref.kind === 'character' ? { width: 1, height: 1 } :
      typeof size === 'string' && ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal'].includes(size.toLowerCase())
        ? getCreatureSizeMapping(size) : null };
  const result = visibleAreaCandidates([entry], { visible: () => true, origin: session.origin,
    radius: session.profile.radiusFeet / feetPerTile * gridSize, gridSize,
    offsetX: game.gridOffsetX ?? 0, offsetY: game.gridOffsetY ?? 0, mapId: ref.mapId })[0];
  if (!result) return null;
  const label = result.status === 'candidate' ? 'Geometric overlap only — recipient eligibility GM-decided' :
    result.status === 'edge' ? 'Edge/contact only — not included; near-edge uncertainty GM-decided' : 'Unknown footprint — GM decides';
  return <span className={`b2-token-marker b2-token-${result.status}`} role="note" aria-label={`${result.name}: ${label}`}>
    <span className="b2-token-label">{result.status === 'candidate' ? 'Overlap only' : result.status === 'edge' ? 'Edge — GM decides' : 'Footprint unknown'}</span>
  </span>;
}
