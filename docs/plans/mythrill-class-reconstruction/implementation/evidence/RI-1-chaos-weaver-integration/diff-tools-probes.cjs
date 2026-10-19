const fs = require('fs');
const a = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/ri1-probe-summary.json', 'utf8'));
const b = JSON.parse(fs.readFileSync('D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/correction/probe-summary.json', 'utf8'));
const names = [...new Set([...a.checks.map((c) => c.name), ...b.checks.map((c) => c.name)])];
for (const n of names) {
  const ca = a.checks.find((c) => c.name === n);
  const cb = b.checks.find((c) => c.name === n);
  const sa = JSON.stringify(ca ? (ca.defects !== undefined ? ca.defects : ca) : null);
  const sb = JSON.stringify(cb ? (cb.defects !== undefined ? cb.defects : cb) : null);
  if (sa !== sb) {
    console.log('DIFF:', n);
    console.log('  new:', (sa || 'null').slice(0, 900));
    console.log('  old:', (sb || 'null').slice(0, 900));
  }
}
console.log('checks new count', a.checks.length, 'old', b.checks.length);
console.log('witnesses equal:', JSON.stringify(a.witnesses) === JSON.stringify(b.witnesses));
console.log('witnesses new:', JSON.stringify(a.witnesses));
console.log('preservation equal:', JSON.stringify(a.preservation) === JSON.stringify(b.preservation));
if (JSON.stringify(a.preservation) !== JSON.stringify(b.preservation)) {
  console.log('  new:', JSON.stringify(a.preservation).slice(0, 1200));
  console.log('  old:', JSON.stringify(b.preservation).slice(0, 1200));
}
