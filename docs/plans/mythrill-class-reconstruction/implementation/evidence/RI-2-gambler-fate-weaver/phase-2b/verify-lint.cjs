// Evidence-only scoped ESLint CLI, comparing diagnostic identities to HEAD.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '../../../../../../..');
const app = path.join(root, 'vtt-react');
const changes = JSON.parse(fs.readFileSync(path.join(__dirname, 'task-changes.json'), 'utf8'));
const files = changes.applicationChanges
  .map(row => row.path)
  .filter(p => /\.(js|jsx)$/.test(p) && fs.existsSync(path.join(root, p)));
const cli = path.join(app, 'node_modules/eslint/bin/eslint.js');
const run = (args, input) => spawnSync(process.execPath, [cli, ...args, '--format', 'json'], { cwd: app, encoding: 'utf8', input, maxBuffer: 16 * 1024 * 1024 });
const result = run(files.map(p => path.join(root, p)));
if (!result.stdout || result.status > 1) throw new Error(result.stderr || 'ESLint did not return diagnostics.');
const reports = JSON.parse(result.stdout);
const fingerprint = m => JSON.stringify([m.ruleId, m.severity, m.message.replace(/\(at line \d+\)/g, '(at line N)')]);
const comparisons = reports.filter(report => report.messages.length).map(report => {
  const relative = path.relative(root, report.filePath).replace(/\\/g, '/');
  const base = spawnSync('git', ['show', `HEAD:${relative}`], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const baseline = base.status === 0 ? JSON.parse(run(['--stdin', '--stdin-filename', report.filePath], base.stdout).stdout)[0].messages : [];
  const remaining = baseline.map(fingerprint);
  const introduced = report.messages.filter(message => {
    const index = remaining.indexOf(fingerprint(message));
    if (index < 0) return true;
    remaining.splice(index, 1);
    return false;
  });
  return { path: relative, baseline: 'HEAD (not a claim that concurrent changes are ours)', baselineMessages: baseline, currentMessages: report.messages, introducedRelativeToHead: introduced };
});
const summary = {
  files: files.length,
  errors: reports.reduce((total, report) => total + report.errorCount, 0),
  warnings: reports.reduce((total, report) => total + report.warningCount, 0),
  introducedRelativeToHead: comparisons.flatMap(row => row.introducedRelativeToHead.map(message => ({ path: row.path, ...message }))),
  comparisons,
  reports
};
fs.writeFileSync(path.join(__dirname, 'eslint-results.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ files: summary.files, errors: summary.errors, warnings: summary.warnings, introducedRelativeToHead: summary.introducedRelativeToHead }, null, 2));
process.exitCode = summary.errors || summary.introducedRelativeToHead.length ? 1 : 0;
