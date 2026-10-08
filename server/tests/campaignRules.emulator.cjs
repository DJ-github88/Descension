/** B6 deployment gate: execute against a LOCAL Firestore emulator only.
 * firebase emulators:exec --only firestore --project demo-mythrill-p5-campaigns "node server/tests/campaignRules.emulator.cjs"
 * Requires Java and @firebase/rules-unit-testing available to vtt-react.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { createRequire } = require('module');
const frontendRequire = createRequire(path.resolve(__dirname, '../../vtt-react/package.json'));

async function main() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  if (!host || !/^(localhost|127\.0\.0\.1):\d+$/.test(host)) {
    throw new Error('BLOCKED: FIRESTORE_EMULATOR_HOST must specify a running local emulator; no production requests are allowed');
  }
  let testing;
  try { testing = frontendRequire('@firebase/rules-unit-testing'); }
  catch (_error) { throw new Error('BLOCKED: @firebase/rules-unit-testing is not installed for vtt-react'); }
  const { doc, getDoc, setDoc } = frontendRequire('firebase/firestore');
  const { initializeTestEnvironment, assertSucceeds, assertFails } = testing;
  const [hostname, port] = host.split(':');
  const env = await initializeTestEnvironment({
    projectId: 'demo-mythrill-p5-campaigns',
    firestore: { host: hostname, port: Number(port), rules: fs.readFileSync(path.resolve(__dirname, '../../firestore.rules'), 'utf8') }
  });
  const campaignPath = ['users', 'owner-a', 'worldbuilding', 'campaigns'];
  const legacy = { campaigns: [{ id: 'campaign-a', name: 'Private Campaign' }], currentCampaignId: 'campaign-a' };
  const upgraded = { ...legacy, schemaVersion: 1, cloudRevision: 1, cloudEpoch: 'epoch-a', updatedAt: '2026-10-08T00:00:00Z' };
  const ownerRef = () => doc(env.authenticatedContext('owner-a').firestore(), ...campaignPath);
  async function seed(value) {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async context => { await setDoc(doc(context.firestore(), ...campaignPath), value); });
  }
  async function run(name, source, candidate, allowed = false, identity = 'owner-a') {
    await seed(source);
    const db = identity ? env.authenticatedContext(identity).firestore() : env.unauthenticatedContext().firestore();
    const write = setDoc(doc(db, ...campaignPath), candidate);
    if (allowed) await assertSucceeds(write); else await assertFails(write);
    assert.deepEqual((await getDoc(ownerRef())).data(), allowed ? candidate : source);
    console.log(`PASS: ${name}`);
  }
  try {
    await run('valid legacy upgrade preserves campaigns and active selection', legacy, upgraded, true);
    await run('absent legacy selection remains null', { campaigns: [] }, { ...upgraded, campaigns: [], currentCampaignId: null }, true);
    await run('invalid legacy selection refused', { ...legacy, currentCampaignId: 42 }, { ...upgraded, currentCampaignId: null });
    await run('unrecognized legacy work preserved', { ...legacy, privateNotes: 'Only copy' }, upgraded);
    await run('partially versioned legacy refused', { ...legacy, cloudRevision: 20 }, upgraded);
    await run('malformed campaign collection refused', { ...legacy, campaigns: 'invalid' }, upgraded);
    await run('changed campaign source cannot be replaced by stale collection', { ...legacy, campaigns: [{ id: 'newer' }] }, upgraded);
    await run('active selection change cannot be hidden by upgrade', legacy, { ...upgraded, currentCampaignId: null });
    await run('upgrade must start at revision one', legacy, { ...upgraded, cloudRevision: 2 });
    await run('upgrade requires nonempty epoch', legacy, { ...upgraded, cloudEpoch: '' });
    await run('unrelated destination fields refused', legacy, { ...upgraded, blindWrite: true });
    await run('B cannot upgrade A document', legacy, upgraded, false, 'owner-b');
    await run('unauthenticated upgrade refused', legacy, upgraded, false, null);
    await run('ordinary v1 successor accepted', upgraded, { ...upgraded, cloudRevision: 2 }, true);
    await run('ordinary v1 epoch replacement denied', upgraded, { ...upgraded, cloudRevision: 2, cloudEpoch: 'different' });
    await run('ordinary v1 skipped revision denied', upgraded, { ...upgraded, cloudRevision: 3 });
    await run('concurrent v1 winner defeats obsolete legacy upgrade', { ...upgraded, cloudRevision: 2 }, upgraded);
    await run('old blind versionless writer denied', upgraded, legacy);
  } finally {
    await env.cleanup();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 2; });
