import { pruneTalentsForChange, removedTalentGrantIds } from '../progressionSlice';
import { TALENT_TREES } from '../../../data/talentTreeData';
import useCharacterStore from '../../characterStore';

const RETAINED_POLICY_CLASSES = [
    'Arcanoneer',
    'Minstrel',
    'Chronarch',
    'Berserker',
    'Martyr',
    'Warden',
    'Crusader',
    'Inquisitor',
    'Spellguard',
    'Toxicologist'
];

const flattenNodes = (className) =>
    Object.values(TALENT_TREES[className] || {}).flat();

describe('retained policy class level-down pruning', () => {
    test.each(RETAINED_POLICY_CLASSES)('%s prunes a legal level-10 tree to the level-1 budget', className => {
        const nodes = flattenNodes(className);
        const firstTree = Object.values(TALENT_TREES[className] || {})[0] || [];
        const levelTenBuild = Object.fromEntries(
            firstTree.map(node => [node.id, node.maxRanks])
        );
        const levelTenPoints = Object.values(levelTenBuild)
            .reduce((total, rank) => total + rank, 0);
        expect(levelTenPoints).toBe(50);

        const pruned = pruneTalentsForChange(levelTenBuild, {
            previousClass: className,
            nextClass: className,
            level: 1
        });

        const retainedPoints = Object.values(pruned).reduce((total, rank) => total + rank, 0);
        expect(retainedPoints).toBeLessThanOrEqual(5);
        expect(retainedPoints).toBeGreaterThan(0);
        expect(Object.keys(pruned).some(id => id.startsWith('cw1_'))).toBe(false);

        const byId = new Map(nodes.map(node => [node.id, node]));
        Object.entries(pruned).forEach(([nodeId, rank]) => {
            const node = byId.get(nodeId);
            expect(node).toBeTruthy();
            expect(rank).toBeGreaterThan(0);
            expect(rank).toBeLessThanOrEqual(node.maxRanks);
            const requires = node.requires == null
                ? []
                : (Array.isArray(node.requires) ? node.requires : [node.requires]);
            requires.forEach(requiredId => {
                expect(pruned[requiredId] || 0).toBe(byId.get(requiredId)?.maxRanks);
            });
        });
    });
});

describe('retained policy class dependent talent grants', () => {
    const grantIdFor = (node) =>
        node.grantId || node.passiveSpellId || (node.spell ? `talent-spell-${node.id}` : null);
    const grantCases = RETAINED_POLICY_CLASSES.flatMap(className => {
        const nodes = flattenNodes(className);
        const grantNode = nodes.find(node => {
            if (!grantIdFor(node)) return false;
            const requires = node.requires == null
                ? []
                : (Array.isArray(node.requires) ? node.requires : [node.requires]);
            const tier = Number.isFinite(node.position?.y) ? node.position.y + 1 : 1;
            return node.minLevel > 1 || node.requiresPoints > 0 || requires.length > 0 || tier >= 3;
        });
        return grantNode ? [{ className, grantNode }] : [];
    });

    test.each(grantCases)('$className removes the $grantNode.id dependent grant at level 1', ({ className, grantNode }) => {
        const before = { [grantNode.id]: grantNode.maxRanks };
        const after = pruneTalentsForChange(before, {
            previousClass: className,
            nextClass: className,
            level: 1
        });

        expect(after[grantNode.id]).toBeUndefined();
        expect(removedTalentGrantIds(before, after, className))
            .toContain(grantIdFor(grantNode));
    });
});

describe('retained policy class level-down production path', () => {
    test('updateCharacterInfo level-down prunes the class allocation using its own nodes', () => {
        const className = 'Inquisitor';
        const firstTree = Object.values(TALENT_TREES[className])[0];
        const maxed = Object.fromEntries(firstTree.map(node => [node.id, node.maxRanks]));
        useCharacterStore.setState({
            class: className,
            characterClass: className,
            level: 10,
            currentCharacterId: null,
            characters: [],
            talents: maxed,
            syncWithMultiplayer: jest.fn(),
            debouncedSave: jest.fn(),
            recordCharacterChange: jest.fn()
        });

        useCharacterStore.getState().updateCharacterInfo('level', 1);

        const state = useCharacterStore.getState();
        expect(state.level).toBe(1);
        expect(Object.values(state.talents).reduce((total, rank) => total + rank, 0)).toBeLessThanOrEqual(5);
        expect(Object.keys(state.talents).some(id => id.startsWith('cw1_'))).toBe(false);
    });
});
