// Print/source fidelity, not a claim that a human tabletop playtest occurred.
const fs = require('fs'), path = require('path'), http = require('http'), crypto = require('crypto'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..'), out = process.env.P8_OUTPUT;
if (!out || !fs.existsSync(out)) throw Error('P8_OUTPUT must name a fresh existing external directory');
const deps = require('module').createRequire(path.join(root, 'vtt-react/package.json'));
const documentPath = path.join(root, 'docs/MYTHRILL_P8_FEATHER_SLASH_PHYSICAL_REFERENCE.html');
const authoredPath = path.join(root, 'vtt-react/public/data/abilities.json');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function main() {
  const html = fs.readFileSync(documentPath);
  const data = JSON.parse(fs.readFileSync(authoredPath, 'utf8'));
  const raw = data.grimmstalk.find(ability => ability.id === 'grimmstalk_feather_slash');
  assert(raw, 'Original raw ability required');
  const server = http.createServer((_req, res) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage(), errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const card = page.getByRole('main', { name: 'Feather Slash physical action card' });
    assert.equal(await card.getAttribute('data-ability-id'), raw.id);
    assert.equal(await card.getAttribute('data-definition-id'), 'grimmstalk');
    const text = await card.innerText();
    for (const value of [raw.damageConfig.formula, raw.damageConfig.damageTypes[0], `${raw.resourceCost.actionPoints} AP / ${raw.resourceCost.mana} mana`, `${raw.targetingConfig.rangeType} ${raw.targetingConfig.rangeDistance} ft`, raw.description]) assert(text.includes(value), 'Printed authored field missing: ' + value);
    for (const value of ['Cancel or reject before acceptance: change neither actor', 'GM-confirmed final', 'check the same command ID', 'temporary AP first', 'temporary HP first', 'checkpoint pending', 'live-only', 'performed human/creator tabletop']) assert(text.includes(value), 'Printed owning boundary missing: ' + value);
    await page.emulateMedia({ media: 'print' });
    const accessibilitySnapshot = await page.locator('body').ariaSnapshot();
    const pdf = await page.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: true });
    fs.writeFileSync(path.join(out, 'physical-reference.pdf'), pdf, { flag: 'wx' });
    assert.deepEqual(errors, []);
    const record = { command: process.argv, cwd: process.cwd(), sourceHashes: { [documentPath]: sha(html), [authoredPath]: sha(fs.readFileSync(authoredPath)) },
      abilityId: raw.id, accessibilitySnapshot, pageErrors: errors, pdfSha256: sha(pdf),
      limits: 'Real Chrome print rendering/source fidelity. Physical recorded faces parity is in the mounted P8 action witness; no performed human/creator/tabletop/two-device/deployment claim.' };
    fs.writeFileSync(path.join(out, 'physical-reference.json'), JSON.stringify(record, null, 2), { flag: 'wx' });
    console.log(JSON.stringify({ out, pageErrors: errors, pdfSha256: record.pdfSha256 }));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().then(() => process.exit(0), error => { console.error(error); process.exit(1); });
