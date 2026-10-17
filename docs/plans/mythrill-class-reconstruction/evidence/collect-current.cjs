/* Planning-only census. Reads application data; writes only this evidence directory. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..');
const src = path.join(root, 'vtt-react/src');
const babel = require(path.join(root, 'vtt-react/node_modules/@babel/core'));
const plugin = require.resolve('@babel/plugin-transform-modules-commonjs', { paths: [path.join(root, 'vtt-react')] });
const cache = new Map(), inputs = new Map();
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
function load(file) {
  file = path.resolve(file);
  if (!fs.existsSync(file)) file += '.js';
  if (!file.startsWith(src + path.sep)) throw new Error(`Outside source: ${file}`);
  if (cache.has(file)) return cache.get(file).exports;
  const bytes = fs.readFileSync(file), text = bytes.toString('utf8');
  inputs.set(relative(file), sha(bytes));
  const module = { exports: {} };
  cache.set(file, module);
  const code = babel.transformSync(text, { filename: file, babelrc: false, configFile: false, plugins: [plugin] }).code;
  const localRequire = name => {
    if (!name.startsWith('.')) throw new Error(`External import refused: ${name} in ${file}`);
    return load(path.resolve(path.dirname(file), name));
  };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {}, { filename: file, timeout: 5000 })(localRequire, module, module.exports);
  return module.exports;
}
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
const startStatus = git('status', '--porcelain=v1');
const { BASE_CLASSES_DATA, ALL_CLASSES_DATA } = load(path.join(src, 'data/classes/index.js'));
const { HERITAGE_TRADITIONS, CLASS_PROVENANCE } = load(path.join(src, 'data/classHeritageRegistry.js'));
const { HERITAGE_EDGES } = load(path.join(src, 'data/heritageEdgeContract.js'));
const { TALENT_TREES } = load(path.join(src, 'data/talentTreeData.js'));
const { getManagedResourceId, normalizeManagedClassResource } = load(path.join(src, 'data/classResourceContracts.js'));
const { normalizeDamageType } = load(path.join(src, 'data/damageTypes.js'));
const { initializeClassResource } = load(path.join(src, 'data/classResources.js'));
const { supportSpell } = load(path.join(src, 'services/spellConsequence.js'));
const races = {};
for (const id of ['human','astril','fexrick','florae','groven','mimir','neth','vreken','solari','myrathil']) {
  races[id] = load(path.join(src, `data/races/${id}.js`))[id];
  assert(races[id], `Missing race export ${id}`);
}
const types = ['arcane','sacred','blight','ember','rime','primal','storm','wyrd','slicing','stabbing','smashing'];
const tally = list => list.reduce((o, key) => (o[key] = (o[key] || 0) + 1, o), {});
const ids = [], classes = [], manifests = [], trees = [], heritage = [];
for (const [name, data] of Object.entries(BASE_CLASSES_DATA)) {
  const spells = data.spells || [];
  const initialized = initializeClassResource(name, { level: 1, strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10 });
  const support = spells.map(spell => ({ id: spell.id, name: spell.name, ...supportSpell({id:spell.id}, {class:name,classResource:initialized,stats:{strength:10,agility:10,constitution:10,intelligence:10,spirit:10}}) }));
  assert(Array.isArray(spells), `${name} spells not array`);
  const distribution = Object.fromEntries(types.map(type => [type, 0]));
  const rawDamage = [], noncanonical = [], poolIssues = [], levelCounts = {};
  for (const spell of spells) {
    ids.push(spell.id);
    const damageTypes = Array.isArray(spell.damageConfig?.damageTypes) ? spell.damageConfig.damageTypes : [];
    const normalizedTypes = [...new Set(damageTypes.map(normalizeDamageType))];
    for (const type of normalizedTypes) if (Object.hasOwn(distribution, type)) distribution[type]++;
    rawDamage.push(...new Set(damageTypes));
    damageTypes.forEach(type => { if (!types.includes(type)) noncanonical.push({ id: spell.id, type, canonical: normalizeDamageType(type) }); });
    const entry = levelCounts[spell.level] ||= { total: 0, noDamageEffect: 0 };
    entry.total++; if (!spell.effectTypes?.includes('damage')) entry.noDamageEffect++;
    manifests.push({ className: name, authored: true, executionVerified: false, ...spell });
  }
  const spellIds = new Set(spells.map(spell => spell.id));
  for (const [level, pool] of Object.entries(data.spellPools || {})) {
    for (const ref of pool) {
      const id = typeof ref === 'string' ? ref : ref?.id;
      const spell = spells.find(spell => spell.id === id);
      if (!spell) poolIssues.push({ level, id, issue: 'missing-spell' });
      else if (Number(spell.level) !== Number(level)) poolIssues.push({ level, id, actualLevel: spell.level, issue: 'level-mismatch' });
    }
  }
  const wired = TALENT_TREES[name] || {};
  for (const [id, nodes] of Object.entries(wired)) {
    const nodeIds = new Set(nodes.map(node => node.id));
    const invalidPrerequisites = nodes.flatMap(node => [node.requires].flat().filter(Boolean).filter(ref => !nodeIds.has(ref)).map(ref => ({ node: node.id, ref })));
    trees.push({ className: name, treeId: id, nodeCount: nodes.length, points: nodes.reduce((n, node) => n + (node.maxRanks || 1), 0), invalidPrerequisites, nodes });
  }
  const { spells: omitted, ...metadata } = data;
  const specs = data.specializations?.specs || [];
  classes.push({ name, id: data.id, metadata, spellCount: spells.length, offensive: spells.filter(s => s.effectTypes?.includes('damage')).length,
    healing: spells.filter(s => s.effectTypes?.includes('healing')).length,
    control: spells.filter(s => s.effectTypes?.includes('control')).length,
    utilityExplicit: spells.filter(s => s.effectTypes?.includes('utility')).length,
    noDamageEffect: spells.filter(s => !s.effectTypes?.includes('damage')).length,
    reaction: spells.filter(s => s.spellType === 'REACTION').length,
    multiMagical: spells.filter(s => new Set((s.damageConfig?.damageTypes || []).map(normalizeDamageType).filter(t => types.slice(0,8).includes(t))).size > 1).length,
    damageDistribution: distribution, rawDamageDistribution: tally(rawDamage), noncanonical, levelCounts, poolIssues,
    treeIds: Object.keys(wired), specIds: specs.map(s => s.id), missingTreeIds: specs.filter(s => !wired[s.id]).map(s => s.id),
    unadvertisedTreeIds: Object.keys(wired).filter(id => !specs.some(s => s.id === id)),
    resourceEngine: getManagedResourceId(data.classResource, name),
    normalizedMetadataResource: normalizeManagedClassResource(data.classResource, name),
    initializedLevel1Resource: initialized,
    p9Supported: support.filter(s=>s.supported).map(s=>({id:s.id,name:s.name,domain:s.payment?.domain,affordable:s.payment?.affordable})),
    p9ManualReasons: tally(support.filter(s=>!s.supported).map(s=>s.reason)),
    nativeHeritages: Object.entries(HERITAGE_TRADITIONS).filter(([,h]) => h.classes.includes(name)).map(([id]) => id),
    variantsWithoutNative: Object.keys(data.subraceVariants || {}).filter(id => !HERITAGE_TRADITIONS[id]?.classes.includes(name)),
    nativeWithoutVariant: Object.entries(HERITAGE_TRADITIONS).filter(([id,h]) => h.classes.includes(name) && !data.subraceVariants?.[id]).map(([id]) => id),
    unpooledSpells: spells.filter(spell => !Object.values(data.spellPools || {}).flat().some(ref => (typeof ref === 'string' ? ref : ref?.id) === spell.id)).map(s => s.id),
    duplicateIds: Object.entries(tally(spells.map(s => s.id))).filter(([,n]) => n > 1) });
}
for (const [id, row] of Object.entries(HERITAGE_TRADITIONS)) heritage.push({ id, ...row, edges: Object.values(HERITAGE_EDGES).filter(edge => edge.heritageId === id), provenance: Object.fromEntries(row.classes.map(name => [name, CLASS_PROVENANCE[name]])) });
const unwiredTrees = [];
for (const entry of fs.readdirSync(path.join(src, 'data/talentTrees'), { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
  const candidate = path.join(src, 'data/talentTrees', entry.name);
  if (!/^export\s/m.test(fs.readFileSync(candidate, 'utf8'))) continue; // Exclude debug/mutation scripts.
  const exported = load(candidate);
  for (const [key, value] of Object.entries(exported)) if (Array.isArray(value) && value.some(node => node?.maxRanks) && !Object.values(TALENT_TREES).some(specs => Object.values(specs).includes(value))) unwiredTrees.push({ file: `vtt-react/src/data/talentTrees/${entry.name}`, export: key, nodes: value.length });
}
const summary = { capturedAt: new Date().toISOString(), branch: git('branch','--show-current'), head: git('rev-parse','HEAD'),
  baseClasses: classes.length, lookupKeys: Object.keys(ALL_CLASSES_DATA).length, heritageCount: heritage.length,
  nativeRelationships: heritage.reduce((n,h) => n+h.classes.length,0), authoredSpells: manifests.length,
  uniqueSpellIds: new Set(ids).size, duplicateSpellIds: Object.entries(tally(ids)).filter(([,n]) => n > 1),
  wiredTrees: trees.length, wiredNodes: trees.reduce((n,t) => n+t.nodeCount,0), unwiredTrees,
  p9Supported: classes.flatMap(c=>c.p9Supported.map(s=>({className:c.name,...s}))),
  methodology: 'Counts use BASE_CLASSES_DATA once, excluding three compatibility aliases. Damage counts use only damageConfig.damageTypes, once per spell/type after canonical normalization; exact raw labels retained. Categories overlap. noDamageEffect is a proxy, not proven utility. No effect execution inferred. Metadata normalization is not character initial-state verification.',
  sourceHashes: Object.fromEntries(inputs), classes, heritage, trees, races };
const drift = [...inputs].filter(([file, hash]) => sha(fs.readFileSync(path.join(root,file))) !== hash).map(([file]) => file);
assert.equal(drift.length, 0, `Concurrent input drift: ${drift}`);
assert.equal(summary.baseClasses, 21);
assert.equal(summary.heritageCount, 25);
assert.equal(summary.authoredSpells, Object.values(BASE_CLASSES_DATA).reduce((n,c) => n+c.spells.length,0));
for (const [file, value] of [['current-census.json', summary], ['authored-spells.json', manifests], ['baseline-status.json', { head: summary.head, branch: summary.branch, capturedAt: summary.capturedAt, status: startStatus }]]) {
  if (file !== 'baseline-status.json' || !fs.existsSync(path.join(__dirname,file))) fs.writeFileSync(path.join(__dirname,file), JSON.stringify(value,null,2)+'\n');
}
console.log(JSON.stringify({ ...Object.fromEntries(Object.entries(summary).filter(([key]) => !['classes','heritage','trees','sourceHashes','races'].includes(key))), loadedSourceFiles: inputs.size, sourceDrift: drift,
  counts: classes.map(c => ({ class: c.name, spells: c.spellCount, offense: c.offensive, healing: c.healing, control: c.control, utility: c.utilityExplicit, trees: c.treeIds.length, poolIssues: c.poolIssues.length, missingTrees: c.missingTreeIds })) },null,2));
