const actors = require('./actorConsequences');

const presentPlayers = room => {
  const players = new Map();
  for (const player of room?.players?.values?.() || []) {
    if (player && typeof player.userId === 'string' && player.userId) {players.set(player.userId, player);}
  }
  if (room?.gm && typeof room.gm.userId === 'string' && room.gm.userId) {players.set(room.gm.userId, room.gm);}
  return players;
};

const primaryRefs = (room, players, memberUids) => {
  const out = [];
  const seen = new Set();
  for (const map of Object.values(room?.gameState?.maps || {})) {
    for (const token of Object.values(map?.characterTokens || {})) {
      const contract = token?.state?.actorContract;
      if (!contract || contract.version !== 1 || contract.primary !== true) {continue;}
      if (!memberUids.has(contract.ownerUid)) {continue;}
      const player = players.get(contract.ownerUid);
      if (!player) {continue;}
      if (player.character?.id && player.character.id !== contract.characterId) {continue;}
      if (token.ownerUserId !== contract.ownerUid) {continue;}
      const ref = actors.refFor(contract);
      let key;
      try {
        actors.validateRef(ref);
        key = actors.hash(ref);
      } catch (_) {
        continue;
      }
      if (seen.has(key)) {continue;}
      seen.add(key);
      out.push(ref);
    }
  }
  return out;
};

function resolve(room, recipientUid, options = {}) {
  const parties = options.parties;
  const userToParty = options.userToParty;
  if (!(parties instanceof Map) || !(userToParty instanceof Map)) {
    return { ok: false, code: 'party_source_unresolved' };
  }
  const partyId = userToParty.get(recipientUid);
  const party = partyId ? parties.get(partyId) : null;
  if (!party || !party.members || typeof party.members !== 'object' || Array.isArray(party.members)) {
    return { ok: false, code: 'recipient_not_in_party' };
  }
  if (!party.members[recipientUid]) {return { ok: false, code: 'recipient_not_in_party' };}
  const players = presentPlayers(room);
  const memberUids = new Set(Object.keys(party.members).filter(uid => players.has(uid)));
  if (!memberUids.has(recipientUid)) {return { ok: false, code: 'recipient_not_in_party' };}
  const actorRefs = primaryRefs(room, players, memberUids);
  const recipientPlayer = players.get(recipientUid);
  const owned = actorRefs.filter(ref => ref.ownerUid === recipientUid);
  const recipientActorRef = recipientPlayer?.character?.id
    ? owned.find(ref => ref.characterId === recipientPlayer.character.id) || null
    : (owned.length === 1 ? owned[0] : null);
  if (!recipientActorRef) {return { ok: false, code: 'party_actor_missing' };}
  return { ok: true, partyId, revision: null, actorRefs, recipientActorRef };
}

module.exports = { resolve };
