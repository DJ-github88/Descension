'use strict';

/**
 * Test Suite for Added Spell Compatibility & Next-Batch Tooling
 * Tests only the added tooling under vtt-react/verification/spell-compatibility-batch/
 *
 * Run with:
 *   node --test vtt-react/verification/spell-compatibility-batch/spellCompatibilityBatch.test.cjs
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const {
  RUNTIME_CONTRACT_FILES,
  REPRESENTATIVE_SPELL_SPECS,
  getRuntimeContractIdentities,
  inspectCatalogueMechanics,
  verifyRepresentativeBatch,
} = require('./spellCompatibilityBatch.cjs');

test('1. getRuntimeContractIdentities returns valid SHA-256 hashes for all 14 contract files', () => {
  const identities = getRuntimeContractIdentities();
  assert.equal(Object.keys(identities).length, 14);
  for (const relPath of RUNTIME_CONTRACT_FILES) {
    const hash = identities[relPath];
    assert.ok(hash, `Hash exists for ${relPath}`);
    assert.match(hash, /^[0-9a-f]{64}$/, `Hash is valid 64-char hex for ${relPath}`);
  }
});

test('2. inspectCatalogueMechanics scans catalogue reporting total entries, unique IDs, and duplicates', () => {
  const result = inspectCatalogueMechanics();
  assert.equal(result.totalMapEntries, 41);
  assert.equal(result.totalEntriesScanned, 2760);
  assert.equal(result.uniqueStableIdsCount, 2516);
  assert.equal(result.duplicateEntriesCount, 244);
  assert.equal(result.aliasBreakdown.witchDoctorAliasDuplicates, 96);
  assert.equal(result.aliasBreakdown.nereidMyrathilVariantDuplicates, 148);

  // Verify unique ID counts are less than or equal to raw occurrences
  assert.ok(result.uniqueStableIdCounts.attributeBuffDebuff <= result.rawOccurrenceCounts.attributeBuffDebuff);
  assert.ok(result.uniqueStableIdCounts.spellPowerBonuses <= result.rawOccurrenceCounts.spellPowerBonuses);
  assert.ok(result.uniqueStableIdCounts.resistanceVulnImmune <= result.rawOccurrenceCounts.resistanceVulnImmune);
  assert.ok(result.uniqueStableIdCounts.conditionalFormulas <= result.rawOccurrenceCounts.conditionalFormulas);
  assert.ok(result.uniqueStableIdCounts.conditionsBeyond <= result.rawOccurrenceCounts.conditionsBeyond);
});

test('3. verifyRepresentativeBatch evaluates exactly 12 representative abilities across 6 classes', () => {
  assert.equal(REPRESENTATIVE_SPELL_SPECS.length, 12);
  const results = verifyRepresentativeBatch();
  assert.equal(results.length, 12);

  const classes = new Set(results.map(r => r.className));
  assert.ok(classes.has('Arcanoneer'));
  assert.ok(classes.has('Minstrel'));
  assert.ok(classes.has('Martyr'));
  assert.ok(classes.has('Berserker'));
  assert.ok(classes.has('Chronarch'));
  assert.ok(classes.has('Toxicologist'));
  assert.equal(classes.size, 6);
});

test('4. Minstrel: Resolving Strike is compatible, while Harmony Strike captures 2-turn cooldown and role conflict', () => {
  const results = verifyRepresentativeBatch();

  // (a) minstrel_resolving_strike is compatible via approved resolver allowlist in P9
  const resolving = results.find(r => r.id === 'minstrel_resolving_strike');
  assert.equal(resolving.classification, 'compatible');
  assert.equal(resolving.compatibleProfile, 'p9-spell:v1');

  // (b) minstrel_harmony_strike is ambiguous_or_conflicting with a 2-turn cooldown
  const harmony = results.find(r => r.id === 'minstrel_harmony_strike');
  assert.equal(harmony.classification, 'ambiguous_or_conflicting');
  assert.deepEqual(harmony.cooldown, { type: 'turn_based', value: 2 });
  assert.ok(harmony.conflicts.some(c => c.includes('Authored role conflict')));
  assert.ok(harmony.conflicts.some(c => c.includes('disagrees with explicit musicalCombo.requires note count')));
});

test('5. Defending profile: doubled equipment reduction and wear prevention (no generic half damage)', () => {
  const data = require(path.join(__dirname, '..', '..', '..', 'server', 'shared', 'data', 'sharedConditionProfiles.json'));
  assert.ok(data.defending);
  assert.equal(data.defending.blockingMultiplier, 2);
  assert.equal(data.defending.preventsBlockingWear, true);
  assert.equal(data.defending.conditionKey, 'defending');
  assert.match(data.defending.description, /blocking piece's DR rolls count double and never wear it/);
});
