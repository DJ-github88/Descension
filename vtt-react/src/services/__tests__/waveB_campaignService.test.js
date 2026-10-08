/**
 * Project 5 Wave B (S5.1) — scoped campaign service regressions.
 */

import campaignService, { resetCampaignServiceForTests } from '../campaignService';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests
} from '../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../persistence/scopeModel';
import { readScopedRecord, READ_STATUS } from '../../persistence/safeRead';
import { findQuarantineReceipt } from '../../persistence/scopedConsumer';
import { fingerprintRawString } from '../../persistence/preservation';

jest.mock('../../config/firebase', () => ({
  db: null,
  isFirebaseConfigured: false,
  auth: { currentUser: null }
}));

const A = createUserScope('user-a');
const B = createUserScope('user-b');

function installFakeLocks(manager) {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'locks');
  Object.defineProperty(navigator, 'locks', { configurable: true, value: manager });
  return () => {
    if (descriptor) {
      Object.defineProperty(navigator, 'locks', descriptor);
    } else {
      delete navigator.locks;
    }
  };
}

function serializingLockManager() {
  const tails = new Map();
  return {
    request(name, optionsOrCallback, maybeCallback) {
      const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
      const prior = tails.get(name) || Promise.resolve();
      const run = prior.then(() => callback({ name }));
      tails.set(name, run.catch(() => {}));
      return run;
    }
  };
}

describe('Wave B S5.1 — scoped campaign consumers', () => {
  let restoreLocks;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetBootstrapGateForTests();
    resetCampaignServiceForTests();
    restoreLocks = installFakeLocks(serializingLockManager());
  });

  afterEach(() => {
    restoreLocks();
    resetCampaignServiceForTests();
  });

  it('A→B isolation: B never sees A campaigns; returning A recovers authored work', async () => {
    activatePrivateScope(A);
    const created = campaignService.createCampaign({ name: 'A Campaign' });
    await campaignService.flushPersistence();

    expect(campaignService.getCampaign(created.id)).toBeTruthy();
    const recordA = readScopedRecord({ familyId: 'campaign.collection', scope: A });
    expect(recordA.status).toBe(READ_STATUS.PRESENT_VALID);

    // Switch to B.
    clearToSignedOut();
    activatePrivateScope(B);
    campaignService.loadCampaigns();
    expect(campaignService.getCampaigns()).toEqual([]);
    expect(campaignService.getCampaign(created.id)).toBeFalsy();

    // Returning A recovers the work.
    clearToSignedOut();
    activatePrivateScope(A);
    campaignService.loadCampaigns();
    expect(campaignService.getCampaign(created.id)).toBeTruthy();
    expect(campaignService.getCampaign(created.id).name).toBe('A Campaign');
  });

  it('same-UID relogin invalidates a stale queued save: no write, no capture of newer work', async () => {
    activatePrivateScope(A);
    const created = campaignService.createCampaign({ name: 'A Campaign' });

    // Same-UID logout/login happens before the queued async save resumes.
    clearToSignedOut();
    activatePrivateScope(A);

    const result = await campaignService.flushPersistence();
    expect(result.status).toBe('CONTEXT_REFUSED');
    const leaked = Object.keys(localStorage).filter((key) => key.includes('campaign.collection'));
    expect(leaked).toEqual([]);
    expect(created.id).toBeTruthy();
  });

  it('legacy global campaigns are quarantined, never adopted', () => {
    const legacyRaw = JSON.stringify([{ id: 'campaign_legacy', name: 'Legacy' }]);
    localStorage.setItem('mythrill-campaigns', legacyRaw);

    activatePrivateScope(A);
    campaignService.loadCampaigns();

    expect(campaignService.getCampaigns()).toEqual([]);
    expect(localStorage.getItem('mythrill-campaigns')).toBe(legacyRaw);

    const fingerprint = fingerprintRawString(legacyRaw).value;
    const receipt = findQuarantineReceipt({
      scope: A,
      sourceKey: 'mythrill-campaigns',
      fingerprintValue: fingerprint
    });
    expect(receipt).not.toBeNull();
  });

  it('active selection is ownership-validated and stays account-local', async () => {
    activatePrivateScope(A);
    const created = campaignService.createCampaign({ name: 'A Campaign' });
    await campaignService.flushPersistence();

    expect(campaignService.setCurrentCampaign('campaign_unknown')).toEqual({ status: 'UNKNOWN_CAMPAIGN' });
    expect(campaignService.setCurrentCampaign(created.id).status).toBe('OK');
    expect(campaignService.getCurrentCampaignId()).toBe(created.id);
    expect(campaignService.getCurrentCampaign().id).toBe(created.id);

    // Under B the retained selection does not resolve to A's campaign.
    clearToSignedOut();
    activatePrivateScope(B);
    campaignService.loadCampaigns();
    expect(campaignService.getCurrentCampaignId()).toBeNull();
    expect(campaignService.getCurrentCampaign()).toBeNull();
  });

  it('updates and deletions advance the collection revision coherently', async () => {
    activatePrivateScope(A);
    const created = campaignService.createCampaign({ name: 'A Campaign' });
    await campaignService.flushPersistence();
    const afterCreate = campaignService.collectionRevision;

    campaignService.updateCampaign(created.id, { description: 'edited' });
    await campaignService.flushPersistence();
    const afterUpdate = campaignService.collectionRevision;
    expect(afterUpdate).toBeGreaterThan(afterCreate);

    campaignService.deleteCampaign(created.id);
    await campaignService.flushPersistence();
    expect(campaignService.collectionRevision).toBeGreaterThan(afterUpdate);

    const record = readScopedRecord({ familyId: 'campaign.collection', scope: A });
    expect(record.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(record.value.payload).toEqual([]);
  });
});
