/**
 * Race Data Schema Validation Tests
 *
 * Validates all race/trait data against the SPELL_DATA_REFERENCE schema.
 * Uses regex-based scanning since race files use ES module exports.
 * Run: npm test -- --testPathPattern="races.test"
 */

const fs = require('fs');
const path = require('path');

const RACES_DIR = path.join(__dirname, '..', 'races');

const VALID_SPELL_TYPES = ['ACTION', 'PASSIVE', 'REACTION', 'CHANNELED', 'TRAP', 'STATE'];
const VALID_EFFECT_CONFIG_MAP = {
    damage: 'damageConfig',
    heal: 'healConfig',
    healing: 'healConfig',
    buff: 'buffConfig',
    debuff: 'debuffConfig',
    utility: 'utilityConfig',
    control: 'controlConfig',
    summoning: 'summoningConfig',
    transformation: 'transformationConfig',
    purification: 'purificationConfig',
    restoration: 'restorationConfig',
};

function extractTraitArrays(content) {
    const sections = [];
    const patterns = [/\btraits:\s*\[/g, /\bbasePassives:\s*\[/g, /\bsharedTraits:\s*\[/g];
    for (const pat of patterns) {
        let match;
        while ((match = pat.exec(content)) !== null) {
            const arrayStart = match.index + match[0].length;
            let depth = 1;
            let pos = arrayStart;
            while (pos < content.length && depth > 0) {
                if (content[pos] === '[') depth++;
                else if (content[pos] === ']') depth--;
                pos++;
            }
            sections.push(content.substring(arrayStart, pos - 1));
        }
    }
    return sections;
}

function extractTraitBlocks(content) {
    const traits = [];
    const arrays = extractTraitArrays(content);
    for (const arrContent of arrays) {
        let searchStart = 0;
        while (true) {
            const idIdx = arrContent.indexOf("id: '", searchStart);
            if (idIdx === -1) break;
            const idMatch = arrContent.substring(idIdx).match(/^id:\s*'([^']+)'/);
            if (!idMatch) { searchStart = idIdx + 4; continue; }
            const traitId = idMatch[1];
            const traitStart = arrContent.lastIndexOf('{', idIdx);
            if (traitStart === -1 || traitStart < idIdx - 200) { searchStart = idIdx + 4; continue; }
            let depth = 0;
            let pos = traitStart;
            let found = false;
            while (pos < arrContent.length) {
                if (arrContent[pos] === '{') depth++;
                else if (arrContent[pos] === '}') depth--;
                if (depth === 0) { found = true; break; }
                pos++;
            }
            if (!found) { searchStart = idIdx + 4; continue; }
            const block = arrContent.substring(traitStart, pos + 1);
            if (block.length > 50000) { searchStart = idIdx + 4; continue; }
            traits.push({ id: traitId, block });
            searchStart = pos + 1;
        }
    }
    return traits;
}

function extractResourceCostBlock(block) {
    const rcIdx = block.indexOf('resourceCost:');
    if (rcIdx === -1) return null;
    const braceStart = block.indexOf('{', rcIdx);
    if (braceStart === -1) return null;
    let depth = 0;
    let pos = braceStart;
    while (pos < block.length) {
        if (block[pos] === '{') depth++;
        else if (block[pos] === '}') depth--;
        if (depth === 0) break;
        pos++;
    }
    return block.substring(braceStart, pos + 1);
}

function validateTrait(traitId, block) {
    const errors = [];

    if (!/\bname:\s*['"]/.test(block)) errors.push('Missing name field');
    if (!/\bdescription:\s*['"]/.test(block)) errors.push('Missing description field');
    if (!/\blevel:\s*\d/.test(block)) errors.push('Missing level field');
    if (!/\bspellType:\s*'[^']+'/.test(block)) errors.push('Missing spellType');

    const spellTypeMatch = block.match(/spellType:\s*'([^']+)'/);
    const spellType = spellTypeMatch ? spellTypeMatch[1] : '';

    if (spellType && spellType !== spellType.toUpperCase()) {
        errors.push(`spellType '${spellType}' is not UPPERCASE`);
    }
    if (spellType && !VALID_SPELL_TYPES.includes(spellType)) {
        errors.push(`Invalid spellType '${spellType}'`);
    }

    const effectTypesMatch = block.match(/effectTypes:\s*\[([^\]]*)\]/);
    if (!effectTypesMatch) {
        errors.push('Missing effectTypes array');
    } else {
        const types = effectTypesMatch[1].match(/'([^']+)'/g);
        if (types) {
            types.forEach(t => {
                const clean = t.replace(/'/g, '');
                const expectedConfig = VALID_EFFECT_CONFIG_MAP[clean];
                if (expectedConfig && !block.includes(`${expectedConfig}:`)) {
                    errors.push(`effectTypes has '${clean}' but no ${expectedConfig}`);
                }
            });
        }
    }

    if (block.match(/damageType:\s*'[^[]/)) {
        errors.push("damageType is a string, must be damageTypes: ['type'] array");
    }

    const formulaMatch = block.match(/formula:\s*'([^']*)'/);
    if (formulaMatch && formulaMatch[1] === 'SPECIAL') {
        errors.push("formula must not be 'SPECIAL'");
    }

    if (spellType === 'ACTION' || spellType === 'REACTION') {
        if (!block.includes('resourceCost:')) {
            errors.push(`${spellType} missing resourceCost block`);
        } else {
            const rcBlock = extractResourceCostBlock(block);
            if (rcBlock && !rcBlock.includes('actionPoints')) {
                errors.push('resourceCost missing actionPoints');
            }
        }
    }

    return errors;
}

function getAllRaceTraits() {
    const raceFiles = fs.readdirSync(RACES_DIR)
        .filter(f => f.endsWith('.js') && !f.includes('.test'));

    const results = [];
    for (const file of raceFiles) {
        const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
        const traits = extractTraitBlocks(content);
        for (const t of traits) {
            results.push({ ...t, fileName: file });
        }
    }
    return results;
}

describe('Race Data Schema Validation', () => {
    const allTraits = getAllRaceTraits();

    test('race files exist and contain traits', () => {
        expect(allTraits.length).toBeGreaterThan(0);
    });

    test('no duplicate trait IDs within a single race file', () => {
        const fileIds = {};
        for (const t of allTraits) {
            if (!fileIds[t.fileName]) fileIds[t.fileName] = new Set();
            expect(fileIds[t.fileName].has(t.id)).toBe(false);
            fileIds[t.fileName].add(t.id);
        }
    });

    describe.each(allTraits.map(t => [t.fileName, t.id, t.block]))(
        '%s > %s',
        (fileName, traitId, block) => {
            const errors = validateTrait(traitId, block);

            test('has required fields (name, description, level, spellType)', () => {
                const requiredErrors = errors.filter(e =>
                    e.includes('Missing') && !e.includes('effectTypes')
                );
                expect(requiredErrors).toEqual([]);
            });

            test('has valid spellType (UPPERCASE)', () => {
                const spellErrors = errors.filter(e => e.includes('spellType'));
                expect(spellErrors).toEqual([]);
            });

            test('effectTypes match their config blocks', () => {
                const effectErrors = errors.filter(e => e.includes('effectTypes'));
                expect(effectErrors).toEqual([]);
            });

            test('damageTypes is array not string', () => {
                const dmgErrors = errors.filter(e => e.includes('damageType'));
                expect(dmgErrors).toEqual([]);
            });

            test('no SPECIAL formulas', () => {
                const formulaErrors = errors.filter(e => e.includes('formula'));
                expect(formulaErrors).toEqual([]);
            });

            test('resourceCost has actionPoints for ACTION/REACTION types', () => {
                const rcErrors = errors.filter(e => e.includes('resourceCost') || e.includes('actionPoints'));
                expect(rcErrors).toEqual([]);
            });
        }
    );
});
