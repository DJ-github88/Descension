import subscriptionService, {
  canUseFeature,
  getRequiredTierForFeature,
  isCustomMapsTier,
  isCampaignManagerTier,
  SUBSCRIPTION_TIERS,
  TIER_ORDER
} from '../subscriptionService';

describe('Subscription Service & Feature Gating', () => {
  describe('custom map entitlement', () => {
    it.each([
      ['GUEST', false],
      ['FREE', false],
      ['PRO', false],
      ['ULTIMATE', true],
      ['MYTHIC', true],
      ['DEV_PREVIEW', true]
    ])('%s access is %s', (tierKey, expected) => {
      expect(canUseFeature('customMaps', tierKey)).toBe(expected);
      expect(isCustomMapsTier(tierKey)).toBe(expected);
    });

    it('requires the Archmage/Ultimate tier', () => {
      expect(getRequiredTierForFeature('customMaps')).toBe('ULTIMATE');
    });
  });

  describe('Campaign Manager entitlement', () => {
    it.each([
      ['GUEST', false],
      ['FREE', false],
      ['PRO', true],
      ['ULTIMATE', true],
      ['MYTHIC', true],
      ['DEV_PREVIEW', true],
      ['subscriber', true],
      ['premium', true],
      ['demiurge', true],
      ['sovereign', true]
    ])('%s campaign manager access is %s', (tierKey, expected) => {
      expect(isCampaignManagerTier(tierKey)).toBe(expected);
    });

    it('requires the Pro/Dungeon Master tier', () => {
      expect(getRequiredTierForFeature('campaignManagerFull')).toBe('PRO');
    });
  });

  describe('Atmospheric & Environmental Effects entitlement', () => {
    it.each([
      ['GUEST', false],
      ['FREE', false],
      ['PRO', true],
      ['ULTIMATE', true],
      ['MYTHIC', true],
      ['DEV_PREVIEW', true]
    ])('%s atmosphericEffects access is %s', (tierKey, expected) => {
      expect(canUseFeature('atmosphericEffects', tierKey)).toBe(expected);
    });

    it('requires the PRO tier', () => {
      expect(getRequiredTierForFeature('atmosphericEffects')).toBe('PRO');
    });
  });

  describe('Core Gameplay & Guest Access', () => {
    it('allows guest to join rooms, roll dice, participate in combat, and chat', () => {
      expect(canUseFeature('joinRooms', 'GUEST')).toBe(true);
      expect(canUseFeature('diceRolling', 'GUEST')).toBe(true);
      expect(canUseFeature('combatSystem', 'GUEST')).toBe(true);
      expect(canUseFeature('roomChat', 'GUEST')).toBe(true);
    });

    it('denies guest from creating rooms, cloud saving, or accessing GM tools', () => {
      expect(canUseFeature('roomCreation', 'GUEST')).toBe(false);
      expect(canUseFeature('cloudSave', 'GUEST')).toBe(false);
      expect(canUseFeature('gmTools', 'GUEST')).toBe(false);
    });

    it('allows free adventurer to create rooms, craft spells, items, creatures, and use basic editor', () => {
      expect(canUseFeature('roomCreation', 'FREE')).toBe(true);
      expect(canUseFeature('spellCrafting', 'FREE')).toBe(true);
      expect(canUseFeature('creatureCreation', 'FREE')).toBe(true);
      expect(canUseFeature('itemGeneration', 'FREE')).toBe(true);
      expect(canUseFeature('basicMapEditor', 'FREE')).toBe(true);
      expect(canUseFeature('dynamicFog', 'FREE')).toBe(true);
      expect(canUseFeature('dynamicLighting', 'FREE')).toBe(true);
    });
  });

  describe('Character & Room Limits', () => {
    it('defines correct limits per tier', () => {
      expect(SUBSCRIPTION_TIERS.GUEST.characterLimit).toBe(1);
      expect(SUBSCRIPTION_TIERS.GUEST.roomLimit).toBe(0);

      expect(SUBSCRIPTION_TIERS.FREE.characterLimit).toBe(3);
      expect(SUBSCRIPTION_TIERS.FREE.roomLimit).toBe(1);
      expect(SUBSCRIPTION_TIERS.FREE.maxPlayersPerRoom).toBe(3);

      expect(SUBSCRIPTION_TIERS.PRO.characterLimit).toBe(15);
      expect(SUBSCRIPTION_TIERS.PRO.roomLimit).toBe(5);
      expect(SUBSCRIPTION_TIERS.PRO.maxPlayersPerRoom).toBe(6);

      expect(SUBSCRIPTION_TIERS.ULTIMATE.characterLimit).toBe(-1);
      expect(SUBSCRIPTION_TIERS.ULTIMATE.roomLimit).toBe(25);
      expect(SUBSCRIPTION_TIERS.ULTIMATE.maxPlayersPerRoom).toBe(12);

      expect(SUBSCRIPTION_TIERS.MYTHIC.characterLimit).toBe(-1);
      expect(SUBSCRIPTION_TIERS.MYTHIC.roomLimit).toBe(100);
      expect(SUBSCRIPTION_TIERS.MYTHIC.maxPlayersPerRoom).toBe(24);
    });

    it('evaluates canUpgrade correctly', () => {
      expect(subscriptionService.canUpgrade('GUEST')).toBe(true);
      expect(subscriptionService.canUpgrade('FREE')).toBe(true);
      expect(subscriptionService.canUpgrade('PRO')).toBe(true);
      expect(subscriptionService.canUpgrade('ULTIMATE')).toBe(true);
      expect(subscriptionService.canUpgrade('MYTHIC')).toBe(false);
    });
  });
});

