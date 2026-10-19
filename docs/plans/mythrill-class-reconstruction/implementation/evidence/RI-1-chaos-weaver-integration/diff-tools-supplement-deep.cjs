const fs = require('fs');
const cur = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/ri1-supplement-run.json', 'utf8'));
const base = JSON.parse(
  fs.readFileSync(
    'D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/independent-rereview/supplement-results.json',
    'utf8'
  )
);

const walk = (a, b, path, out) => {
  if (a === b) return;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') {
    out.push({ path, an: JSON.stringify(a), bn: JSON.stringify(b) });
    return;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      out.push({ path, an: JSON.stringify(a).slice(0, 200), bn: JSON.stringify(b).slice(0, 200) });
      return;
    }
    a.forEach((v, i) => walk(v, b[i], `${path}[${i}]`, out));
    return;
  }
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  for (const k of keys) walk(a[k], b[k], `${path}.${k}`, out);
};

for (const key of ['anomalyCompleteWitness', 'retainedProbeChecks', 'correctionComparison']) {
  const out = [];
  walk(cur[key], base[key], key, out);
  console.log(`### ${key}: ${out.length} leaf diffs`);
  out.slice(0, 30).forEach((d) => {
    console.log(`  ${d.path}`);
    console.log(`    new: ${(d.an || 'undefined').slice(0, 300)}`);
    console.log(`    old: ${(d.bn || 'undefined').slice(0, 300)}`);
  });
}
