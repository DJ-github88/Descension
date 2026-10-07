import { getStore } from '../store/storeRegistry';
import { getInquisitorAssistanceDecision } from '../data/inquisitorResourceContract';

export function resolveAssistanceRecipient(targetId = 'player') {
  const character = getStore('characterStore')?.getState();
  const game = getStore('gameStore')?.getState();
  const tokens = getStore('characterTokenStore')?.getState().characterTokens || [];
  const playerTokens = tokens.filter(token => token.isPlayerToken).map(token => token.id);
  const localIds = ['player', 'current-player', character?.id, character?.currentCharacterId, game?.currentPlayer?.id, ...playerTokens].filter(Boolean);
  if (character && localIds.includes(targetId)) return { ...character, assistanceIdentityIds: localIds };
  const member = getStore('partyStore')?.getState().partyMembers?.find(candidate => candidate.id === targetId);
  if (member?.character) return { ...member.character, assistanceIdentityIds: [member.id] };
  const creature = getStore('creatureStore')?.getState();
  const token = (creature?.creatureTokens || creature?.tokens || []).find(candidate => candidate.id === targetId);
  return token ? { ...token, class: token.class ?? token.state?.class,
    classResource: token.state?.classResource ?? token.classResource, assistanceIdentityIds: [token.id] } : null;
}

export function getAssistanceDecisionForTarget(effect, targetId = effect?.targetId || 'player') {
  return getInquisitorAssistanceDecision(resolveAssistanceRecipient(targetId), effect);
}
