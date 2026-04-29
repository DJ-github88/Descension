const { getFirestore } = require('firebase-admin/firestore');
const logger = require('./logger');

const TIER_LIMITS = {
  guest: { roomLimit: 0, characterLimit: 1, maxPlayersPerRoom: 0 },
  free: { roomLimit: 1, characterLimit: 3, maxPlayersPerRoom: 3 },
  dev_preview: { roomLimit: 25, characterLimit: -1, maxPlayersPerRoom: 12 },
  pro: { roomLimit: 5, characterLimit: 15, maxPlayersPerRoom: 6 },
  ultimate: { roomLimit: 25, characterLimit: -1, maxPlayersPerRoom: 12 }
};

const LEGACY_MAP = {
  subscriber: 'pro',
  premium: 'ultimate'
};

const tierCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function resolveTierId(rawTier) {
  if (!rawTier) return 'free';
  const lower = rawTier.toLowerCase();
  if (LEGACY_MAP[lower]) return LEGACY_MAP[lower];
  if (TIER_LIMITS[lower]) return lower;
  return 'free';
}

async function getUserTier(userId) {
  if (!userId) return { tierId: 'guest', limits: TIER_LIMITS.guest };

  const cached = tierCache.get(userId);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return cached.data;
  }

  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(userId).get();

    let tierId = 'free';

    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData.isGuest) {
        tierId = 'guest';
      } else {
        tierId = resolveTierId(userData.subscriptionTier);
      }
    }

    const result = { tierId, limits: TIER_LIMITS[tierId] };
    tierCache.set(userId, { data: result, cachedAt: Date.now() });
    return result;
  } catch (error) {
    logger.error('Error fetching user tier:', { userId, error: error.message });
    return { tierId: 'free', limits: TIER_LIMITS.free };
  }
}

async function canCreateRoom(userId, currentRoomCount) {
  const { tierId, limits } = await getUserTier(userId);

  if (tierId === 'guest') {
    return { allowed: false, reason: 'Guest accounts cannot create rooms' };
  }

  if (limits.roomLimit <= 0) {
    return { allowed: false, reason: 'Your plan does not allow room creation' };
  }

  if (currentRoomCount >= limits.roomLimit) {
    return { allowed: false, reason: `Room limit reached (${limits.roomLimit}). Your plan: ${tierId}` };
  }

  return { allowed: true, limits };
}

async function canJoinRoom(userId, currentPlayers, maxPlayers) {
  const { limits } = await getUserTier(userId);
  const effectiveMax = Math.min(maxPlayers || 6, limits.maxPlayersPerRoom);

  if (currentPlayers >= effectiveMax) {
    return { allowed: false, reason: `Room is full (max ${effectiveMax} players for your tier)` };
  }

  return { allowed: true, effectiveMax };
}

function clearTierCache(userId) {
  if (userId) {
    tierCache.delete(userId);
  } else {
    tierCache.clear();
  }
}

module.exports = {
  getUserTier,
  canCreateRoom,
  canJoinRoom,
  clearTierCache,
  TIER_LIMITS,
  resolveTierId
};
