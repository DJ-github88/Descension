const fs = require('fs');
const { execSync } = require('child_process');

const files = [
  'vtt-react/src/data/zoneData.js',
  'vtt-react/src/data/locationCoordinates.js',
  'vtt-react/src/data/subregions.js',
];
let ok = true;
for (const f of files) {
  const tmp = '.lore-audit-work/_chk_' + f.split('/').pop().replace('.js', '.mjs');
  let src = fs.readFileSync(f, 'utf8');
  // strip import/export lines so --check validates pure syntax without resolving modules
  src = src.replace(/^\s*import .*$/gm, '').replace(/^\s*export\s+default\s+/gm, '').replace(/^\s*export\s+/gm, '');
  fs.writeFileSync(tmp, src);
  try {
    execSync(`node --check "${tmp}"`, { stdio: 'pipe' });
    console.log('OK   ', f);
  } catch (e) {
    ok = false;
    const msg = (e.stderr && e.stderr.toString()) || e.message;
    console.log('FAIL ', f, '->', msg.split('\n').slice(0, 3).join(' | '));
  }
}
console.log(ok ? '\nALL FILES SYNTACTICALLY VALID' : '\nSYNTAX ERRORS FOUND');
process.exit(ok ? 0 : 1);
