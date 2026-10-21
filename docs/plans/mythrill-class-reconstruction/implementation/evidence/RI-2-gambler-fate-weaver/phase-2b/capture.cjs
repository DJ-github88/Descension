// Evidence only: entry/current SHA-256 ledger, including dirty protected controls.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const root = path.resolve(__dirname, '../../../../../../..');
const src = 'vtt-react/src/';
const writable = [
  'data/classes/fateWeaverData.js', 'data/talentTrees/fateWeaver.js',
  'data/resourceSystems/fateWeaverResourceGuide.js', 'components/hud/FateWeaverResourceDisplay.jsx',
  'data/classes/__tests__/fateWeaverIntegration.test.js', 'data/classes/__tests__/fateWeaverDisposition.test.js',
  'components/hud/__tests__/FateWeaverResourceDisplay.test.jsx',
  'data/classes/index.js', 'data/classes/classDisplayData.js', 'data/classes/classReconstructionCompatibility.js',
  'data/classSpellGenerator.js', 'data/classSpellCategories.js', 'data/talentTreeData.js',
  'data/classResources.js', 'data/classResourceContracts.js', 'data/classResourceAliases.js',
  'data/resourceSystems/index.js', 'data/classHeritageRegistry.js',
  'components/rules/ClassesDisplay.jsx', 'components/rules/ClassDetailDisplay.jsx', 'components/rules/ClassDetailDisplay.css',
  'components/hud/ClassResourceBar.jsx', 'components/talent-tree/TalentTreeContent.jsx', 'components/talent-tree/TalentTreeContent.css',
  'components/character-creation-wizard/steps/Step1CoreDraft.jsx', 'components/character-creation-wizard/steps/Step9CharacterSummary.jsx',
  'components/modals/LevelUpChoiceModal.jsx', 'store/characterSlices/infoSlice.js', 'store/characterSlices/progressionSlice.js',
  'hooks/useClassSpellLibrary.js', 'components/spellcrafting-wizard/components/library/SpellLibrary.jsx',
  'data/resourceSystems/__tests__/allGuides.test.js', 'data/__tests__/classHeritageRegistry.test.js',
  'data/__tests__/heritageEdgeContract.test.js', 'data/__tests__/heritageRosterCoverage.test.js',
  'utils/__tests__/classIconUtils.test.js', 'components/rules/__tests__/ClassesDisplay.test.jsx',
  'components/rules/__tests__/ClassDetailDisplaySpells.test.jsx', 'components/talent-tree/__tests__/TalentTreeContent.test.jsx'
].map(p => src + p);
const protectedPaths = [
  'data/classes/gambitData.js', 'data/classes/augurData.js', 'data/classes/gamblerData.js',
  'data/talentTrees/gambit.js', 'data/talentTrees/gambler.js', 'data/talentTrees/augur.js',
  'data/talentTrees/augurAuspice.js', 'data/talentTrees/augurHarbinger.js', 'data/talentTrees/augurHierophant.js',
  'data/augurResourceContract.js', 'data/resourceSystems/gambitResourceGuide.js', 'data/resourceSystems/gamblerResourceGuide.js',
  'data/heritageEdgeContract.js', 'data/classes/chaosWeaverData.js', 'data/classes/chaosWeaverIntegration.js',
  'data/classes/chaosWeaverRules.js', 'data/talentTrees/chaosWeaver.js', 'store/characterSlices/coreSlice.js',
  'store/characterSlices/resourceSlice.js', 'components/hud/PartyHUD.jsx', 'components/hud/GamblerResourceDisplay.jsx'
].map(p => src + p);
// Observed concurrent-only edit in an allowed seam; RI-2 never edits it.
const concurrentOnlyWritable = [src + 'components/character-creation-wizard/steps/Step9CharacterSummary.jsx'];
const status = execFileSync('git', ['status', '--porcelain', '-uall'], { cwd: root, encoding: 'utf8' });
const dirty = status.trimEnd().split('\n').filter(Boolean).map(line => line.slice(3).replace(/\\/g, '/'));
const entryPath = path.join(__dirname, 'entry-hashes.json');
const entry = fs.existsSync(entryPath) ? JSON.parse(fs.readFileSync(entryPath, 'utf8')) : null;
const files = [...new Set([...writable, ...protectedPaths, ...(entry ? Object.keys(entry.files) : dirty)])];
const hash = p => fs.existsSync(path.join(root, p)) && fs.statSync(path.join(root, p)).isFile()
  ? crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex') : 'absent';
if (entry) {
  const added = writable.filter(p => !(p in entry.files));
  if (added.length) {
    added.forEach(p => { entry.files[p] = hash(p); });
    entry.scopeAmendments = [...(entry.scopeAmendments || []), { at: new Date().toISOString(), paths: added, reason: 'Phase 2B scope captured before edit.' }];
    fs.writeFileSync(entryPath, JSON.stringify(entry, null, 2));
  }
}
const ledger = {
  capturedAt: new Date().toISOString(),
  head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  status, writable, protectedPaths,
  files: Object.fromEntries(files.map(p => [p, hash(p)]))
};
if (!entry) {
  fs.writeFileSync(entryPath, JSON.stringify(ledger, null, 2));
  console.log(`Entry captured: ${files.length} files, ${protectedPaths.length} named controls.`);
} else {
  const changed = files.filter(p => entry.files[p] !== ledger.files[p]);
  const violations = changed.filter(p => !writable.includes(p) && !p.startsWith('docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/') && p !== 'docs/plans/mythrill-class-reconstruction/implementation/RI-2-GAMBLER-FATE-WEAVER.md');
  ledger.changed = changed.map(p => ({ path: p, entry: entry.files[p], current: ledger.files[p] }));
  ledger.protectedChangesSinceEntry = violations;
  const taskPaths = ledger.changed.filter(row => writable.includes(row.path) && !concurrentOnlyWritable.includes(row.path)).map(row => row.path);
  const diffCheck = spawnSync('git', ['diff', '--check', '--', ...taskPaths], { cwd: root, encoding: 'utf8' });
  ledger.whitespaceCheck = { exitCode: diffCheck.status, stdout: diffCheck.stdout, stderr: diffCheck.stderr };
  ledger.artifactHashes = Object.fromEntries([
    'CONTENT-LOCK.md', 'AUGUR-DISPOSITION.md', 'augur-disposition.json', 'complete-manifest.json',
    'jest-results.json', 'eslint-results.json', 'browser-results.json', 'resource-1280.png', 'resource-360.png',
    'REPORT.md', 'capture.cjs', 'verify-lint.cjs'
  ].filter(name => fs.existsSync(path.join(__dirname, name))).map(name => [name,
    crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, name))).digest('hex')]));
  fs.writeFileSync(path.join(__dirname, 'task-changes.json'), JSON.stringify({
    capturedAt: ledger.capturedAt, head: ledger.head,
    applicationChanges: ledger.changed.filter(row => writable.includes(row.path) && !concurrentOnlyWritable.includes(row.path)),
    concurrentOnlyWritableChanges: ledger.changed.filter(row => concurrentOnlyWritable.includes(row.path)),
    plan: ledger.changed.find(row => row.path === 'docs/plans/mythrill-class-reconstruction/implementation/RI-2-GAMBLER-FATE-WEAVER.md'),
    concurrentProtectedChangesObserved: violations,
    note: 'Whole-working-file hashes. Existing/concurrent hunks in writable seams are retained; not every working-tree hunk belongs to RI-2.'
  }, null, 2));
  fs.writeFileSync(path.join(__dirname, 'current-hashes.json'), JSON.stringify(ledger, null, 2));
  console.log(JSON.stringify({ taskApplicationFiles: taskPaths.length, changed: changed.length, whitespaceCheckExitCode: diffCheck.status, protectedChangesSinceEntry: violations }, null, 2));
}
