const fs = require('fs');
const cur = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/ri1-supplement-run.json', 'utf8'));
const base = JSON.parse(
  fs.readFileSync(
    'D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/independent-rereview/supplement-results.json',
    'utf8'
  )
);
const keys = [...new Set([...Object.keys(cur), ...Object.keys(base)])];
for (const k of keys) {
  const a = JSON.stringify(cur[k]);
  const b = JSON.stringify(base[k]);
  const status = a === b ? 'SAME' : 'DIFF';
  console.log(`${status} :: ${k}`);
  if (status === 'DIFF') {
    console.log('  new:', (a || 'undefined').slice(0, 1100));
    console.log('  old:', (b || 'undefined').slice(0, 1100));
  }
}
