import {
  canUseFeature,
  getRequiredTierForFeature,
  isCustomMapsTier
} from '../subscriptionService';

describe('custom map entitlement', () => {
  it.each([
    ['GUEST', false],
    ['FREE', false],
    ['PRO', false],
    ['ULTIMATE', true],
    ['DEV_PREVIEW', true]
  ])('%s access is %s', (tierKey, expected) => {
    expect(canUseFeature('customMaps', tierKey)).toBe(expected);
    expect(isCustomMapsTier(tierKey)).toBe(expected);
  });

  it('requires the Archmage/Ultimate tier', () => {
    expect(getRequiredTierForFeature('customMaps')).toBe('ULTIMATE');
  });
});
