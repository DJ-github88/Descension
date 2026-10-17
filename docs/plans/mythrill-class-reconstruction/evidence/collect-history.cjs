/* Read-only Git archaeology; writes only planning evidence, never restores files. */
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..');
const parser = require(path.join(root, 'vtt-react/node_modules/@babel/parser'));
const babel = require(path.join(root, 'vtt-react/node_modules/@babel/core'));
const vm = require('node:vm');
const plugin = require.resolve('@babel/plugin-transform-modules-commonjs', { paths: [path.join(root,'vtt-react')] });
const git = (...args) => {
  const output = cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return args[0] === 'show' && args.length === 2 && args[1].includes(':') ? output : output.trim();
};
const consolidation = 'fc096627';
const before = `${consolidation}^`;
const oldTree = new Set(git('ls-tree','-r','--name-only',before,'--','vtt-react/src').split('\n'));
const oldCache = new Map(), oldSources = {};
function loadOld(file) {
  file = path.posix.normalize(file);
  file = [file, `${file}.js`, `${file}/index.js`].find(candidate => oldTree.has(candidate));
  if (!file) throw new Error('Historical import not found');
  if (oldCache.has(file)) return oldCache.get(file).exports;
  const text = git('show',`${before}:${file}`);
  oldSources[file] = crypto.createHash('sha256').update(text).digest('hex');
  const code = babel.transformSync(text,{ filename: file, babelrc: false, configFile: false, plugins: [plugin] }).code;
  const module = { exports: {} }; oldCache.set(file,module);
  const requireOld = name => { if (!name.startsWith('.')) throw new Error(`Historical external import refused: ${name}`); return loadOld(path.posix.join(path.posix.dirname(file),name)); };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{}, { filename: `${before}:${file}`, timeout: 5000 })(requireOld,module,module.exports);
  return module.exports;
}
const oldPaths = git('ls-tree','-r','--name-only',before,'--','vtt-react/src/data/classes').split('\n').filter(file => /Data\.js$/.test(file));
const currentPaths = git('ls-tree','-r','--name-only','HEAD','--','vtt-react/src/data/classes').split('\n').filter(file => /Data\.js$/.test(file));
const files = [...new Set([...oldPaths,...currentPaths])].filter(file => !/backup|classDisplay|classFlavor/.test(file));
const rows = [];
const keyOf = prop => prop.key?.name || prop.key?.value;
const property = (object,key) => object?.properties?.find(prop => keyOf(prop) === key)?.value;
const literal = node => node?.value ?? (node?.type === 'TemplateLiteral' && !node.expressions.length ? node.quasis[0].value.cooked : undefined);
const walk = (node,visit) => { if (!node || typeof node !== 'object') return; visit(node); for (const [key,value] of Object.entries(node)) if (!['loc','start','end','extra'].includes(key)) Array.isArray(value) ? value.forEach(n => walk(n,visit)) : walk(value,visit); };
for (const file of files) {
  const events = git('log','--all','--follow','--date=short','--format=%H|%ad|%s','--',file).split('\n').filter(Boolean);
  if (!events.length) continue;
  const existsAtHead = currentPaths.includes(file);
  const ref = existsAtHead ? 'HEAD' : before;
  let text;
  try { text = git('show',`${ref}:${file}`); } catch { continue; }
  const row = { file, snapshot: ref, historical: !existsAtHead, earliestPathHistory: events.at(-1), latestPathHistory: events[0], sourceSha256: crypto.createHash('sha256').update(text).digest('hex') };
  try {
    const ast = parser.parse(text, { sourceType: 'module', plugins: ['jsx'], errorRecovery: true });
    row.parseErrors = ast.errors.map(error => error.message);
    let data;
    walk(ast, node => { if (node.type === 'VariableDeclarator' && /_DATA$/.test(node.id?.name) && node.init?.type === 'ObjectExpression') data ||= node.init; });
    row.name = literal(property(data,'name'));
    row.id = literal(property(data,'id'));
    const spells = property(data,'spells');
    row.inlineSpellCount = spells?.type === 'ArrayExpression' ? spells.elements.length : null;
    row.spellIds = spells?.type === 'ArrayExpression' ? spells.elements.map(s => literal(property(s,'id'))).filter(Boolean) : [];
    row.resourceSource = property(data,'classResource') ? text.slice(property(data,'classResource').start,property(data,'classResource').end) : null;
    row.restrictionSource = property(data,'restrictions') ? text.slice(property(data,'restrictions').start,property(data,'restrictions').end) : null;
    row.specializationSource = property(data,'specializations') ? text.slice(property(data,'specializations').start,property(data,'specializations').end) : null;
    row.originSource = property(property(data,'overview'),'originStory') ? text.slice(property(property(data,'overview'),'originStory').start,property(property(data,'overview'),'originStory').end) : null;
    row.imports = ast.program.body.filter(n => n.type === 'ImportDeclaration').map(n => n.source.value);
  } catch (error) { row.parseFailure = error.message; }
  rows.push(row);
}
const assetsAt = ref => git('ls-tree','-r','--name-only',ref,'--','vtt-react/public/assets/icons/classes').split('\n').filter(Boolean);
const assets = { historicalSnapshot: before, historical: assetsAt(before), head: assetsAt('HEAD') };
const oldIndex = git('show',`${before}:vtt-react/src/data/classes/index.js`);
const historicalDefinitions = {}, historicalLoadFailures = [];
for (const file of oldPaths) {
  try {
    const exported = loadOld(file);
    for (const [key,data] of Object.entries(exported)) if (/_DATA$/.test(key) && data?.name) historicalDefinitions[data.name] = data;
  } catch (error) { historicalLoadFailures.push({ file, error: error.message }); }
}
let historicalTalentTrees = null;
try { historicalTalentTrees = loadOld('vtt-react/src/data/talentTreeData.js').TALENT_TREES; } catch(error) { historicalLoadFailures.push({file:'talentTreeData.js',error:error.message}); }
const deleted = git('show','--format=fuller','--stat',consolidation,'--','vtt-react/src/data/classes');
const result = { collectedAt: new Date().toISOString(), head: git('rev-parse','HEAD'), consolidation, before: git('rev-parse',before), scope: 'Available local --all Git refs, path-follow history, and pre-consolidation snapshot; earliest path commit is not proof of original concept invention. Imported spell arrays are not counted as empty.', classes: rows, assets, historicalLoadFailures, historicalSourceHashes:oldSources };
const spells = JSON.parse(fs.readFileSync(path.join(__dirname,'authored-spells.json'),'utf8'));
for (const row of rows) row.survivingCurrentSpellIds = spells.filter(s => row.spellIds?.includes(s.id)).map(s => ({ className: s.className, id: s.id }));
for (const row of rows) {
  const data = historicalDefinitions[row.name];
  if (!data) continue;
  row.preConsolidationSpellCount = Array.isArray(data.spells) ? data.spells.length : null;
  row.preConsolidationExampleCount = Array.isArray(data.exampleSpells) ? data.exampleSpells.length : null;
  row.preConsolidationTreeIds = Object.keys(historicalTalentTrees?.[row.name] || {});
  row.preConsolidationResource = data.classResource || null;
  row.preConsolidationRestrictions = data.restrictions || null;
  row.preConsolidationSurvivors = spells.filter(s => data.spells?.some(old => old.id === s.id)).map(s => ({className:s.className,id:s.id}));
  row.preConsolidationExampleSurvivors = spells.filter(s => data.exampleSpells?.some(old => old.id === s.id)).map(s => ({className:s.className,id:s.id}));
}
assert(rows.some(row => row.name === 'Deathcaller'));
assert(rows.some(row => row.name === 'Lichborne'));
fs.writeFileSync(path.join(__dirname,'historical-census.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'historical-definitions.json'),JSON.stringify({classes:historicalDefinitions,trees:historicalTalentTrees},null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'pre-consolidation-index.txt'),oldIndex+'\n');
fs.writeFileSync(path.join(__dirname,'consolidation-stat.txt'),deleted+'\n');
console.log(JSON.stringify({ classes: rows.map(row => ({ name: row.name, earliest: row.earliestPathHistory, preConsolidationSpells: row.preConsolidationSpellCount, trees:row.preConsolidationTreeIds, survivors: row.preConsolidationSurvivors?.length, parseFailure: row.parseFailure })), historicalLoadFailures, icons: { historicalFiles: assets.historical.length, historicalTopLevel: assets.historical.filter(file => file.split('/').length === 6).length, headFiles: assets.head.length } },null,2));
