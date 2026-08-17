const { expect } = require('chai');
const {
  getUserTier,
  canCreateRoom,
  canJoinRoom,
  resolveTierId,
  clearTierCache,
  TIER_LIMITS
} = require('../services/tierService');

describe('TierService', () => {
  beforeEach(() => {
    clearTierCache();
  });

  describe('resolveTierId', () => {
    it('should default to free for null, undefined, or empty tier', () => {
      expect(resolveTierId(null)).to.equal('free');
      expect(resolveTierId(undefined)).to.equal('free');
      expect(resolveTierId('')).to.equal('free');
    });

    it('should map legacy tier names correctly', () => {
      expect(resolveTierId('subscriber')).to.equal('pro');
      expect(resolveTierId('SUBSCRIBER')).to.equal('pro');
      expect(resolveTierId('premium')).to.equal('ultimate');
      expect(resolveTierId('PREMIUM')).to.equal('ultimate');
      expect(resolveTierId('sovereign')).to.equal('mythic');
      expect(resolveTierId('SOVEREIGN')).to.equal('mythic');
      expect(resolveTierId('demiurge')).to.equal('mythic');
      expect(resolveTierId('DEMIURGE')).to.equal('mythic');
    });

    it('should accept valid modern tiers', () => {
      expect(resolveTierId('guest')).to.equal('guest');
      expect(resolveTierId('free')).to.equal('free');
      expect(resolveTierId('pro')).to.equal('pro');
      expect(resolveTierId('ultimate')).to.equal('ultimate');
      expect(resolveTierId('mythic')).to.equal('mythic');
      expect(resolveTierId('dev_preview')).to.equal('dev_preview');
    });

    it('should fallback to free for unknown tier strings', () => {
      expect(resolveTierId('unknown_tier_xyz')).to.equal('free');
    });
  });

  describe('getUserTier for guest / unauthenticated', () => {
    it('should return guest tier if userId is null or empty', async () => {
      const result = await getUserTier(null);
      expect(result.tierId).to.equal('guest');
      expect(result.limits.roomLimit).to.equal(0);
      expect(result.limits.characterLimit).to.equal(1);
    });
  });

  describe('canCreateRoom', () => {
    it('should deny guest accounts from creating rooms', async () => {
      const result = await canCreateRoom(null, 0);
      expect(result.allowed).to.be.false;
      expect(result.reason).to.include('Guest');
    });
  });

  describe('canJoinRoom', () => {
    it('should allow any player to join if room is below max capacity', async () => {
      const guestResult = await canJoinRoom(null, 2, 6);
      expect(guestResult.allowed).to.be.true;
      expect(guestResult.effectiveMax).to.equal(6);

      const freeResult = await canJoinRoom('free-user-1', 4, 6);
      expect(freeResult.allowed).to.be.true;
    });

    it('should deny players when room is at or exceeds max capacity', async () => {
      const fullResult = await canJoinRoom('guest-123', 6, 6);
      expect(fullResult.allowed).to.be.false;
      expect(fullResult.reason).to.include('Room is full');

      const overfullResult = await canJoinRoom('user-456', 8, 6);
      expect(overfullResult.allowed).to.be.false;
      expect(overfullResult.reason).to.include('Room is full');
    });

    it('should default to max capacity 6 if maxPlayers is not provided', async () => {
      const result = await canJoinRoom('user-789', 5, undefined);
      expect(result.allowed).to.be.true;
      expect(result.effectiveMax).to.equal(6);

      const fullResult = await canJoinRoom('user-789', 6, undefined);
      expect(fullResult.allowed).to.be.false;
    });

    it('should respect larger room capacities for high tier GM rooms (e.g. 12 or 24)', async () => {
      const mythicRoomResult = await canJoinRoom('guest-user', 15, 24);
      expect(mythicRoomResult.allowed).to.be.true;
      expect(mythicRoomResult.effectiveMax).to.equal(24);
    });
  });
});
