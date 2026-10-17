// Compare diagnostics on the exact changed paths with HEAD, without copying source trees.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { ESLint } = require('eslint');
const root = path.resolve(__dirname, '../../..'), frontend = path.join(root, 'vtt-react');
const out = process.env.P10_OUTPUT || 'D:/AppData/Temp/opencode/p10-integration-20261016';
async function main() {
  const current = JSON.parse(fs.readFileSync(path.join(out, 'lint.log'))), eslint = new ESLint({ cwd: frontend });
  const results = [];
  const signature = m => [m.ruleId, m.severity, m.message].join('|');
  for (const item of current) {
    const relative = path.relative(root, item.filePath).replace(/\\/g, '/');
    const original = cp.spawnSync('git', ['show', 'HEAD:' + relative], { cwd: root, encoding: 'utf8' });
    const baseline = original.status === 0 ? (await eslint.lintText(original.stdout, { filePath: item.filePath }))[0].messages : [];
    const remaining = baseline.map(signature), added = [];
    for (const m of item.messages) {
      const i = remaining.indexOf(signature(m));
      if (i === -1) added.push(m); else remaining.splice(i, 1);
    }
    results.push({ file: relative, errors: item.errorCount, warnings: item.warningCount, baselineErrors: baseline.filter(m => m.severity === 2).length,
      baselineWarnings: baseline.filter(m => m.severity === 1).length, added, removedDiagnosticCount: remaining.length });
  }
  const record = { errors: results.reduce((n, r) => n + r.errors, 0), warnings: results.reduce((n, r) => n + r.warnings, 0),
    baselineErrors: results.reduce((n, r) => n + r.baselineErrors, 0), baselineWarnings: results.reduce((n, r) => n + r.baselineWarnings, 0),
    added: results.flatMap(r => r.added.map(m => ({ file: r.file, ...m }))), results };
  fs.writeFileSync(path.join(out, 'lint-baseline.json'), JSON.stringify(record, null, 2));
  console.log(JSON.stringify(record, null, 2));
  process.exitCode = record.added.length ? 1 : 0;
}
main().catch(e => { console.error(e); process.exitCode = 1; });
