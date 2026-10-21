import fs from 'fs';
import path from 'path';
import {
  FATE_WEAVER_DATA, FATE_WEAVER_MANIFEST, FATE_WEAVER_AUTHORED_RECORDS,
  FATE_WEAVER_OPTIONAL_RECORDS, FATE_WEAVER_CORE_RECORDS, FATE_WEAVER_TALENT_ACTIVES,
  FATE_WEAVER_PROJECTED_SPELLS_BY_ID, FATE_WEAVER_RESOURCE_RULES,
  validateFateWeaverState, projectFateWeaverResource
} from '../fateWeaverData';
import { FATE_WEAVER_TREES, FATE_WEAVER_TALENT_NODES } from '../../talentTrees/fateWeaver';
import { ALL_CLASSES_DATA } from '..';
import { CLASS_PROVENANCE, getClassNativeHeritageIds } from '../../classHeritageRegistry';
import { AUGUR_DISPOSITIONS } from '../classReconstructionCompatibility';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { fateWeaverResourceGuide } from '../../resourceSystems/fateWeaverResourceGuide';

describe('Fate Weaver Phase 2B package', () => {
  test('has the locked record and node shape', () => {
    expect(FATE_WEAVER_CORE_RECORDS.map(record => record.id)).toEqual([
      'cr1_fate_weaver_tie_thread', 'cr1_fate_weaver_cut_clean'
    ]);
    expect(FATE_WEAVER_OPTIONAL_RECORDS).toHaveLength(40);
    expect(FATE_WEAVER_TALENT_ACTIVES).toHaveLength(6);
    expect(FATE_WEAVER_AUTHORED_RECORDS).toHaveLength(96);
    expect(new Set(FATE_WEAVER_AUTHORED_RECORDS.map(record => record.id)).size).toBe(96);
    expect(FATE_WEAVER_AUTHORED_RECORDS.filter(record => record.spellType === 'ACTION')).toHaveLength(48);
    expect(FATE_WEAVER_AUTHORED_RECORDS.filter(record => record.spellType === 'PASSIVE')).toHaveLength(48);
    expect(FATE_WEAVER_TREES).toHaveLength(3);
    expect(FATE_WEAVER_TALENT_NODES).toHaveLength(54);
    FATE_WEAVER_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    });
    expect(FATE_WEAVER_MANIFEST).toMatchObject({ uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, nativeAccess: [] });
    expect(FATE_WEAVER_DATA.spells).toHaveLength(96);
  });

  test('keeps four optional picks per level and no duplicate grant IDs', () => {
    for (let level = 1; level <= 10; level++) {
      const records = FATE_WEAVER_OPTIONAL_RECORDS.filter(record => record.level === level);
      expect(records).toHaveLength(4);
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
      expect(FATE_WEAVER_DATA.spellPools[level]).toEqual(records.map(record => record.id));
    }
    const grantIds = FATE_WEAVER_TALENT_NODES.filter(node => node.grantId).map(node => node.grantId);
    expect(grantIds).toHaveLength(6);
    expect(new Set(grantIds).size).toBe(6);
  });

  test('preserves the approved R1 identifiers and node IDs', () => {
    expect(FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_read_bond).toBeTruthy();
    expect(FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_read_the_bond).toBeUndefined();
    expect(FATE_WEAVER_TALENT_NODES.find(node => node.id === 'cr1_fate_weaver_covenant_weaver_signature')?.grantId).toBe('cr1_fate_weaver_witnessed_covenant');
    expect(FATE_WEAVER_TALENT_NODES.find(node => node.id === 'cr1_fate_weaver_severer_signature')?.grantId).toBe('cr1_fate_weaver_sever_borrowed_crown');
    expect(FATE_WEAVER_TALENT_NODES.find(node => node.id === 'cr1_fate_weaver_tapestry_keeper_signature')?.grantId).toBe('cr1_fate_weaver_reanchor_tapestry');
  });

  test('marks every record and node manual-only and keeps Augur banks out', () => {
    [...FATE_WEAVER_AUTHORED_RECORDS, ...FATE_WEAVER_TALENT_NODES].forEach(entry => {
      expect(entry).toMatchObject({ rulesetVersion: 'cr-review-r1', authoredOnly: true, executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [] });
    });
    expect(FATE_WEAVER_RESOURCE_RULES).toMatchObject({ tokenCount: 3, maxLinks: 3, transferAmountMax: 3, recursiveTransfer: false, refreshOnReconnect: false, refreshOnInitiative: false });
    expect(FATE_WEAVER_DATA.resourceSystem.id).toBe('fate-links');
    expect(FATE_WEAVER_DATA.resource).toBe('Fate Links');
  });

  test('registers the class in ordinary catalogue, generator, tree, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA['Fate Weaver']).toMatchObject({ id: 'fate-weaver', name: 'Fate Weaver', isCompatibilityAlias: false });
    expect(ALL_CLASS_SPELLS['Fate Weaver']).toHaveLength(114);
    expect(ALL_CLASS_SPELLS['Fate Weaver'].filter(spell => spell.source !== 'general')).toHaveLength(96);
    expect(new Set(ALL_CLASS_SPELLS['Fate Weaver'].map(spell => spell.id)).size).toBe(114);
    expect(TALENT_TREES['Fate Weaver']).toBeTruthy();
    expect(CLASS_SPECIALIZATIONS['Fate Weaver'].specializations.map(spec => spec.id)).toEqual(['covenant', 'severance', 'tapestry']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Fate Weaver')).toMatchObject({ role: 'Support / Control' });
    expect(fateWeaverResourceGuide).toMatchObject({ version: 2, archetype: 'Finite Consented Links' });
  });

  test('resource guide and tracker copy preserve bearer, 30/60 range and next-own-turn recovery', () => {
    expect(fateWeaverResourceGuide.loop.spend.text).toContain('to the chosen bearer');
    expect(fateWeaverResourceGuide.loop.spend.text).not.toContain('to the caster');
    expect(fateWeaverResourceGuide.quickStart.rows[0][2]).toContain('second subsequent caster turn');
    expect(fateWeaverResourceGuide.quickStart.rows[1][2]).toContain('owning caster next own turn');
    expect(fateWeaverResourceGuide.playingInPerson.materials).toContain('A next-own-turn recovery marker');
    expect(fateWeaverResourceGuide.playingInPerson.keepSections).toEqual(['tracking', 'consent', 'recovery label']);
    const copy = JSON.stringify(fateWeaverResourceGuide);
    ['free immediately', 'next turn start', 'completed-rest marker', 'to the caster'].forEach(stale => {
      expect(copy).not.toContain(stale);
    });
  });

  test('all signature and capstone gates accept only the authored same-tree path', () => {
    const points = (treeId, talents) => FATE_WEAVER_TALENT_NODES
      .filter(node => node.treeId === treeId)
      .reduce((total, node) => total + (talents[node.id] || 0), 0);
    const canUnlock = (node, talents, level) => level >= node.minLevel
      && points(node.treeId, talents) >= node.requiresPoints
      && node.requires.every(id => (talents[id] || 0) >= node.maxRanks);

    FATE_WEAVER_TREES.forEach(tree => {
      const signature = tree.nodes.find(node => node.id === tree.meta.signatureNode);
      const capstone = tree.nodes.find(node => node.id === tree.meta.capstoneNode);
      const justShort = { [tree.nodes[0].id]: 3, [tree.nodes[1].id]: 3, [tree.nodes[2].id]: 3 };
      const atThreshold = { ...justShort, [tree.nodes[3].id]: 1 };
      const fullTree = Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));
      const otherTree = Object.fromEntries(FATE_WEAVER_TALENT_NODES.filter(node => node.treeId !== tree.id).map(node => [node.id, node.maxRanks]));

      expect(signature).toMatchObject({ minLevel: 3, requiresPoints: 10, requiresAll: true, maxRanks: 1 });
      expect(capstone).toMatchObject({ minLevel: 10, requiresPoints: 45, requiresAll: true, maxRanks: 1 });
      expect(canUnlock(signature, justShort, 3)).toBe(false);
      expect(canUnlock(signature, otherTree, 10)).toBe(false);
      expect(canUnlock(signature, { ...atThreshold, [tree.nodes[0].id]: 0 }, 3)).toBe(false);
      expect(canUnlock(signature, justShort, 2)).toBe(false);
      expect(canUnlock(signature, atThreshold, 3)).toBe(true);
      expect(canUnlock(capstone, { ...fullTree, [signature.id]: 0 }, 10)).toBe(false);
      expect(canUnlock(capstone, fullTree, 9)).toBe(false);
      expect(canUnlock(capstone, fullTree, 10)).toBe(true);
    });
  });

  test('validates tokens, links and the read-only projection', () => {
    const state = {
      tokens: [{ id: 't1', state: 'reserved' }, { id: 't2', state: 'free' }, { id: 't3', state: 'recovering' }],
      links: [{
        id: 'link-1', sourceId: 'actor-a', targetId: 'actor-b', sourceName: 'A', targetName: 'B',
        purpose: 'guard the gate', consent: 'both', tokenIds: ['t1'], tokenState: 'reserved',
        uses: 1, usesRemaining: 1, amountMax: 2, expiresAt: 'end-second-subsequent-caster-turn'
      }]
    };
    expect(validateFateWeaverState(state)).toEqual({ valid: true, errors: [] });
    expect(validateFateWeaverState({
      tokens: [{ id: 't1', state: 'free' }],
      links: [{ id: 'bad', sourceId: 'a', targetId: 'a', tokenState: 'free', amountMax: 4, uses: 3, recursive: true }]
    }).valid).toBe(false);
    expect(projectFateWeaverResource({ state }).tokens).toEqual({ free: 1, reserved: 1, recovering: 1 });
    expect(projectFateWeaverResource({ state }, true).links[0]).toMatchObject({ sourceName: 'A', targetName: 'B', purpose: 'guard the gate', tokenState: 'reserved' });
    expect(projectFateWeaverResource({ state }, false).links[0].sourceName).toBe('Endpoint hidden');
    expect(projectFateWeaverResource(null)).toMatchObject({ initialized: false, links: [] });
  });

  test('keeps R1 targeting, price and expiry terms in projected records', () => {
    const tie = FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_tie_thread;
    expect(tie.targetingConfig).toMatchObject({ targetingType: 'multi', maxTargets: 2, rangeDistance: 30 });
    expect(tie.durationConfig).toMatchObject({ durationType: 'own_turns', durationValue: 2, durationUnit: 'subsequent_caster_turn_end' });
    expect(tie.specialMechanics.fateWeaver.priceSummary).toContain('reserve 1 thread token');
    const covenant = FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_witnessed_covenant;
    expect(covenant.targetingConfig).toMatchObject({ targetingType: 'multi', maxTargets: 2 });
    expect(covenant.specialMechanics.fateWeaver.priceSummary).toContain('reserve 2 thread token(s)');
    const sever = FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_sever_borrowed_crown;
    expect(sever.specialMechanics.fateWeaver.priceSummary).toContain('pay 1 thread token(s) to recovering');
    expect(sever.durationConfig.durationType).toBe('instant');
    expect(FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_reanchor_tapestry.durationConfig.durationType).toBe('instant');
  });

  test('distinguishes valid consent/alias pairs from conflicting or one-sided aliases', () => {
    const base = {
      tokens: [{ id: 't1', state: 'reserved' }, { id: 't2', state: 'free' }, { id: 't3', state: 'free' }],
      links: [{
        id: 'l1', sourceId: 'a', targetId: 'b', consent: 'both', tokenIds: ['t1'],
        uses: 1, usesRemaining: 1, expiresAt: 'end-of-turn'
      }]
    };
    const link = base.links[0];
    const valid = [
      { ...base, links: [{ ...link, consent: { source: true, target: true } }] },
      { ...base, links: [{ ...link, tokenIds: ['t1'], tokenId: 't1' }] },
      { ...base, links: [{ ...link, usesRemaining: 1, remainingUses: 1 }] },
      { ...base, tokens: base.tokens.map(token => token.id === 't1' ? { ...token, linkId: 'l1' } : token) }
    ];
    valid.forEach(candidate => expect(validateFateWeaverState(candidate)).toEqual({ valid: true, errors: [] }));

    const malformed = [
      { ...base, links: [{ ...link, consent: { source: true, sourceId: true } }] },
      { ...base, links: [{ ...link, usesRemaining: 0, remainingUses: 1 }] },
      { ...base, links: [{ ...link, tokenIds: ['t1'], tokenId: 't2' }] },
      { ...base, tokens: base.tokens.map(token => token.id === 't1' ? { ...token, linkId: 'other' } : token) }
    ];
    malformed.forEach(candidate => expect(validateFateWeaverState(candidate).valid).toBe(false));
  });

  test('projects malformed containers as invalid without throwing or inventing threads', () => {
    const raw = { tokens: {}, links: [{}] };
    const view = projectFateWeaverResource({ state: raw });
    expect(view.valid).toBe(false);
    expect(view.tokens).toEqual({ free: 0, reserved: 0, recovering: 0 });
    expect(view.links).toHaveLength(1);
    expect(projectFateWeaverResource({ state: { tokens: 'oops', links: [] } }).valid).toBe(false);
  });

  test('rejects duplicate, missing and mismatched reservations without repairing them', () => {
    const base = {
      tokens: [{ id: 't1', state: 'reserved' }, { id: 't2', state: 'free' }, { id: 't3', state: 'free' }],
      links: [{
        id: 'l1', sourceId: 'a', targetId: 'b', consent: 'both', tokenIds: ['t1'],
        uses: 1, usesRemaining: 1, expiresAt: 'end-of-turn'
      }]
    };
    const invalid = [
      { ...base, tokens: [{ id: 't1', state: 'reserved' }, { id: 't1', state: 'free' }, { id: 't3', state: 'free' }] },
      { ...base, links: [{ ...base.links[0], consent: undefined }] },
      { ...base, links: [{ ...base.links[0], tokenIds: [] }] },
      { ...base, links: [{ ...base.links[0], tokenIds: ['t2'] }] },
      { ...base, links: [{ ...base.links[0], threadReservation: 2 }] },
      { ...base, links: [{ ...base.links[0], uses: 2, usesRemaining: 3 }] },
      { ...base, links: [{ ...base.links[0], expiresAt: '' }] },
      { ...base, links: [{ ...base.links[0], id: 'l1' }, { ...base.links[0], sourceId: 'c', targetId: 'd' }] }
    ];
    expect(validateFateWeaverState(base).valid).toBe(true);
    invalid.forEach(candidate => expect(validateFateWeaverState(candidate).valid).toBe(false));
  });

  test('authors the R1 payload contract and no legacy suppression fields', () => {
    const byId = Object.fromEntries(FATE_WEAVER_AUTHORED_RECORDS.map(record => [record.id, record]));
    expect(byId.cr1_fate_weaver_tie_thread.classResourceProgram.args).toMatchObject({
      threadReservation: 1, fromSlot: 0, toSlot: 1, distinctEndpoints: true, consent: 'both',
      formationRangeEach: 30, maintenanceSeparation: 60, uses: 1, transferMax: 3,
      expiry: 'end-second-subsequent-caster-turn', event: 'original-assigned-damage', derivedEvents: false
    });
    expect(byId.cr1_fate_weaver_cut_clean.classResourceProgram.args).toMatchObject({
      threadDestination: 'recovering', recoverAt: 'next-caster-own-turn', undoAcceptedConsequences: false
    });
    expect(byId.cr1_fate_weaver_read_bond.classResourceProgram.args).toMatchObject({
      range: 30, targetKind: 'perceptible-bond', hiddenKnowledge: false, createLink: false
    });
    expect(byId.cr1_fate_weaver_witnessed_covenant.classResourceProgram.args).toMatchObject({ threadReservation: 2, uses: 2, releaseOnlyWhenUsesZero: true });
    expect(byId.cr1_fate_weaver_sever_borrowed_crown.classResourceProgram.args).toMatchObject({ threadPrice: 1, priceDestination: 'recovering', range: 30 });
    expect(byId.cr1_fate_weaver_reanchor_tapestry.classResourceProgram.args).toMatchObject({ replaceEndpointsMax: 1, resetUses: false, extendExpiry: false });
    expect(byId.cr1_fate_weaver_sever_borrowed_crown.classResourceProgram.args?.suppress).toBeUndefined();
    expect(byId.cr1_fate_weaver_read_bond.classResourceProgram.args?.suppress).toBeUndefined();
  });
});


afterAll(() => {
  if (process.env.RI2_EVIDENCE_EXPORT !== '1') return;
  const outputDir = path.resolve(process.cwd(), '../docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/phase-2b-correction');
  fs.mkdirSync(outputDir, { recursive: true });
  const output = path.join(outputDir, 'complete-manifest.json');
  fs.writeFileSync(output, JSON.stringify({
    manifest: FATE_WEAVER_MANIFEST,
    authoredRecords: FATE_WEAVER_AUTHORED_RECORDS,
    projectedSpells: FATE_WEAVER_DATA.spells,
    talentTrees: FATE_WEAVER_TREES,
    progression: FATE_WEAVER_DATA.progression,
    resourceSystem: FATE_WEAVER_DATA.resourceSystem,
    resourceGuide: fateWeaverResourceGuide,
    nativeProvenance: CLASS_PROVENANCE['Fate Weaver'],
    acquisitionRecords: FATE_WEAVER_DATA.restrictions.acquisition.records,
    nativeVariants: FATE_WEAVER_DATA.subraceVariants,
    capabilityStatus: { authored: true, selectableDevelopment: true, manuallyUsable: true, automaticallyAdmitted: false, independentReview: 'pending' },
    nativeAccess: getClassNativeHeritageIds('Fate Weaver'),
    augurDispositions: AUGUR_DISPOSITIONS
  }, null, 2));
});
