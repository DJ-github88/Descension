// Harness-only adapter: run Flash's released witness after the production-loaded deterministic fixture.
const fs = require('fs'), path = require('path'), Module = require('module'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.TIMING_APP_OUTPUT;
assert(out && process.env.APP_BUILD_DIR);
process.env.SELF_HEAL_APP_OUTPUT = out;
function load(file, transform) {
  const filename = path.join(__dirname, file), m = new Module(filename, module);
  m.filename = filename; m.paths = Module._nodeModulePaths(__dirname);
  m._compile(transform(fs.readFileSync(filename, 'utf8')), filename); return m.exports;
}
const helper = load('owner-pc-self-heal-app-browser.cjs', s => s + '\nmodule.exports = { setup };\n');
const witness = load('spell-timing-app-browser.cjs', s => {
  s = s.replace('await page.goto(`${hostUrl}/game`);', '// Already booted and hydrated through production loadCharacter.');
  s = s.replace("name: 'Character', exact: true", 'name: /^Character(?: \\(\\d+\\))?$/');
  s = s.replace("const libraryText = await libraryCard.innerText();", `const libraryText = await libraryCard.innerText();
  for (const [stage, text] of [['review', previewText], ['library', libraryText]]) {
    assert(/2d8\\s*\\+\\s*Intelligence\\s*\\/\\s*3/i.test(text), stage + ': exact immediate formula uses attribute score');
    assert(/1d6/i.test(text) && /per tick/i.test(text), stage + ': independent tick formula');
    assert(/3 ticks/i.test(text) && /target turn start/i.test(text), stage + ': explicit tick count and boundary');
    assert(/strictly upcoming caster-turn starts until reuse/i.test(text), stage + ': independent cooldown');
    assert(/GM resolves|GM resolution|GM.*resolv/i.test(text), stage + ': GM tick resolution explained');
    assert(!/Intelligence Mod/i.test(text), stage + ': score is not mislabeled modifier');
  }
  assert.equal(saved.authoredDraft.damageConfig.formula, immFormula);
  assert.equal(saved.authoredDraft.controlConfig.authoredCondition.periodicFormula, periodicFormula);`);
  return s;
});
(async () => {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  try {
    const hydration = await helper.setup(page, host.url, 'app-gm');
    fs.writeFileSync(path.join(out, 'hydration.json'), JSON.stringify(hydration, null, 2));
    await witness.runWitness(page, host.url);
    assert.deepEqual(errors, []);
  } catch (e) {
    fs.writeFileSync(path.join(out, 'failure.aria.yml'), await page.locator('body').ariaSnapshot().catch(() => 'unavailable'));
    fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify({ passed: false, errors, failure: e.stack }, null, 2));
    process.exitCode = 1;
  } finally { await browser.close(); await host.stop(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
