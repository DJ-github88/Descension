const fs = require('fs'), cp = require('child_process'), path = require('path'), crypto = require('crypto'), zlib = require('zlib'), assert = require('assert/strict');
const root = 'D:/VTT', sol = path.dirname(__dirname), out = __dirname;
const read = p => fs.readFileSync(path.resolve(root, p)), sha = b => crypto.createHash('sha256').update(b).digest('hex'), lf = b => b.toString().replace(/\r\n/g,'\n');
const archive = 'vtt-react/verification/p9/evidence/independent-review/independent-cycle1-and-cycle2.tar.gz';
const manifest = cp.execFileSync('tar', ['-xOf', path.join(root, archive), 'review2/p9-identity-lf-sha256.txt']);
assert.equal(sha(manifest), sha(fs.readFileSync(path.join(sol, 'accepted-p9-identity-lf-sha256.txt'))));
const expected = Object.fromEntries(manifest.toString().trim().split(/\r?\n/).map(l => { const m=l.match(/^([a-f0-9]{64})\s+(.+)$/); assert(m); return [m[2].replace(/^\.\//,''),m[1]]; }));
const seal = JSON.parse(read('vtt-react/verification/p9/evidence/repair-cycle1-20261015/seal-1792059273601/source.json'));
const acceptedSnapshots = Object.fromEntries(['PartyHUD.jsx','ActionBar.jsx','SpellConsequencePanel.css'].map(name => {
  const p = `vtt-react/src/components/${name==='ActionBar.jsx'?'ui':'hud'}/${name}`, copy=fs.readFileSync(path.join(sol,'accepted-'+name));
  assert.equal(sha(lf(copy)), expected[p]); assert.equal(sha(lf(Buffer.from(seal.files[p],'base64'))), expected[p]);
  return [p,{expectedLF:expected[p],copyLF:sha(lf(copy)),sealLF:sha(lf(Buffer.from(seal.files[p],'base64')))}];
}));
const focal = Object.keys(JSON.parse(fs.readFileSync(path.join(out,'start-focal-hashes.json'))));
const supplemental = {};
for (const mode of ['focused','p8','p9','rejoin','lifecycle','build','lint']) {
  const p = path.join(sol,mode,'command.json'); if (!fs.existsSync(p)) continue;
  const c = JSON.parse(fs.readFileSync(p));
  supplemental[mode] = { commandSha256:sha(fs.readFileSync(p)),command:c.command,started:c.startedAt,ended:c.endedAt,exit:c.exit,signal:c.signal,reportedDrift:c.drift,
    focalCurrentMismatch:Object.fromEntries(focal.filter(p=>c.after[p]&&sha(read(p))!==c.after[p]).map(p=>[p,{recorded:c.after[p],current:sha(read(p))}])),
    outputSha256:sha(fs.readFileSync(path.join(sol,mode,'output.log'))) };
}
const layout = JSON.parse(fs.readFileSync(path.join(out,'layout-probe-v3.json')));
const result = { checkedAt:new Date().toISOString(),command:process.argv,cwd:process.cwd(),archive,archiveSha256:sha(read(archive)),copiedManifestIdentical:true,manifestSha256:sha(manifest),acceptedSnapshots,
  acceptedReportSha256:sha(read('docs/MYTHRILL_P9_SOURCE_INDEPENDENT_ACCEPTANCE_20261015.md')),startingSourceSha256:sha(fs.readFileSync(path.join(sol,'starting-source.json'))),beforeIdentitySha256:sha(fs.readFileSync(path.join(sol,'before-identity.json'))),
  supplemental, layoutSummary:layout.observations.map(o=>({viewport:[o.width,o.height],layer:o.initial.layer,overlapsDefaultFrame:o.initial.overlapsFrame,acceptClicked:o.acceptClicked,outsideCanvasClicked:o.outsideCanvasClicked})),offlineEmptyHost:layout.offlineEmptyHost,acceptedBaseline:layout.acceptedBaseline,
  incomingProductionAppArtifacts:fs.readdirSync(sol).filter(name=>/app|production/i.test(name)) };
fs.writeFileSync(path.join(out,'evidence-check.json'),JSON.stringify(result,null,2),{flag:'wx'});
console.log(JSON.stringify({copiedManifestIdentical:true,manifestSha256:result.manifestSha256,supplemental:Object.fromEntries(Object.entries(supplemental).map(([k,v])=>[k,{exit:v.exit,focalCurrentMismatch:v.focalCurrentMismatch}])),layoutSummary:result.layoutSummary,offlineEmptyHost:layout.offlineEmptyHost.layer,incomingProductionAppArtifacts:result.incomingProductionAppArtifacts},null,2));
