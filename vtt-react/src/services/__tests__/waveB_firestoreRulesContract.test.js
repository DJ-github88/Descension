/**
 * Project 5 Wave B (S6.7) — Firestore rules contract (static assertions).
 *
 * The Firebase emulator / rules-unit-testing is not installed in this
 * workspace, so this test pins the rules file contents that implement the
 * campaign singleton revision contract and the worldbuilding exclusion.
 * Emulator execution of these rules remains a separate verification gate.
 */

const fs = require('fs');
const path = require('path');

describe('Wave B S6.7 — effective Firestore rules contract', () => {
  const rulesPath = path.resolve(__dirname, '../../../../firestore.rules');
  const rules = fs.readFileSync(rulesPath, 'utf8');

  it('the worldbuilding blanket rule explicitly excludes the campaign singleton', () => {
    expect(rules).toContain('match /users/{userId}/worldbuilding/{document} {');
    expect(rules).toContain('document != \'campaigns\'');
    // The old `{document=**}` blanket must be gone: it would match the
    // campaign singleton and its unconditional write would bypass the CAS.
    expect(rules).not.toContain('match /users/{userId}/worldbuilding/{document=**}');
  });

  it('the campaign singleton rule enforces the frozen envelope and revision contract', () => {
    expect(rules).toContain('match /users/{userId}/worldbuilding/campaigns {');
    expect(rules).toContain('function validCampaignEnvelope(data)');
    expect(rules).toContain('data.schemaVersion == 1');
    expect(rules).toContain('data.cloudRevision is int');
    expect(rules).toContain('data.cloudEpoch is string');
    // create: revision must start at 1
    expect(rules).toContain('request.resource.data.cloudRevision == 1');
    // update: immutable epoch and exact revision successor
    expect(rules).toContain('request.resource.data.cloudEpoch == resource.data.cloudEpoch');
    expect(rules).toContain('request.resource.data.cloudRevision == resource.data.cloudRevision + 1');
    // no client delete
    expect(rules).toContain('allow delete: if false;');
  });

  it('P3/P4 /rooms rules remain server/Admin only (unchanged)', () => {
    expect(rules).toContain('match /rooms/{roomId} {');
    expect(rules).toContain('allow read, write: if false;');
  });

  it('the legacy per-campaign owner path remains intact', () => {
    expect(rules).toContain('match /users/{userId}/campaigns/{campaignId=**}');
  });
});
