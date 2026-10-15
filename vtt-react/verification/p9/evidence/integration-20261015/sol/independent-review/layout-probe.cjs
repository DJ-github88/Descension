// CSS integration fixture only. This deliberately does not launch or replay App.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('D:/VTT/vtt-react/node_modules/playwright');
const app = 'D:/VTT/vtt-react', sol = path.dirname(__dirname), sha = b => crypto.createHash('sha256').update(b).digest('hex');
const cssPaths = ['src/styles/party-hud.css', 'src/components/hud/SpellConsequencePanel.css'];
const css = cssPaths.map(p => fs.readFileSync(path.join(app, p), 'utf8'));
const save = (file, value) => fs.writeFileSync(path.join(__dirname, file), typeof value === 'string' ? value : JSON.stringify(value, null, 2), { flag: 'wx' });
const actor = '<section aria-label="Actor attachment and consequences"><p>Shared conditions: manual timing · overtime paused.</p><label>Exact room attachment <select><option>Select a token</option><option>Ilse · ilse</option></select></label><button>Bind primary attachment</button></section>';
const gm = '<section class="p9-gm" aria-label="Spell adjudication"><article class="p9-gm-card"><h4>Ilse → Branvig: Marrow-Piercing Slug</h4><p>slicing damage · physical [6] + 4 = 10</p><p class="p9-meta">1d8 + intelligence/4 → 1d8 + 4</p><p>Owner-approved price: 1 AP · 4 mana (temporary first) · class arcane, arcane, ember (3/12) → ember (1/12)</p><p class="p9-advisory">Advisory planar distance 15.0 ft; authored range. Line of effect and reach are GM rulings.</p><label><input type="checkbox"> I adjudicated legality, range, defense and mitigation</label><label>Final damage <input type="number" min="0"></label><label>Reason (required if different from 10) <input type="text"></label><div class="p9-actions"><button onclick="window.accepted=(window.accepted||0)+1">Accept one consequence</button><button>Decline</button></div></article></section>';
function html(styles, contents) {
  return `<!doctype html><meta charset="utf-8"><script>window.accepted=0;window.canvasClicked=false;</script><style>body{margin:0}*{box-sizing:border-box}</style><style>${styles.join('\n')}</style><div class="party-hud-frames"><div class="actor-consequence-layer">${contents}</div><div class="react-draggable" style="transform:translate(20px,20px)"><div class="party-member-frame" style="width:300px;height:180px;background:#ccc"><button>Party frame control</button></div></div></div><button id="canvas" style="position:fixed;left:10px;bottom:10px" onclick="window.canvasClicked=true">Canvas control</button>`;
}
async function metrics(page) {
  return page.evaluate(() => {
    const layer = document.querySelector('.actor-consequence-layer'), r = layer.getBoundingClientRect(), frame = document.querySelector('.party-member-frame').getBoundingClientRect(), s = getComputedStyle(layer);
    const controls = [...layer.querySelectorAll('select,button,input')].map(el => { const a = el.getBoundingClientRect(), hit = document.elementFromPoint(a.x+a.width/2, a.y+a.height/2); return { text: el.textContent || el.type, rect: a.toJSON(), hit: hit === el || el.contains(hit) }; });
    return { viewport: { width: innerWidth, height: innerHeight }, layer: r.toJSON(), frame: frame.toJSON(), position: s.position, maxHeight: s.maxHeight, zIndex: s.zIndex, pointerEvents: s.pointerEvents, scrollHeight: layer.scrollHeight, clientHeight: layer.clientHeight, overlapsFrame: r.left < frame.right && r.right > frame.left && r.top < frame.bottom && r.bottom > frame.top, controls };
  });
}
(async () => {
  const result = { kind: 'independent-css-integration-fixture', command: process.argv, cwd: process.cwd(), started: new Date().toISOString(), fixtureLimits: ['Source-equivalent host/controls markup with real complete party-hud.css and SpellConsequencePanel.css. No React mount, stores, App/router, backend or real receipt in this probe.', 'The production-App replay is owned by the implementer; evidence will be reviewed separately.'], cssHashes: Object.fromEntries(cssPaths.map((p,i) => [p, sha(Buffer.from(css[i]))])), observations: [], errors: [] };
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true }); result.browser = browser.version();
    const page = await browser.newPage(); page.on('pageerror', e => result.errors.push(e.message));
    for (const [width, height] of [[1365,900], [1280,720], [390,844], [844,390]]) {
      await page.setViewportSize({ width, height }); await page.setContent(html(css, actor + gm));
      const initial = await metrics(page); assert.equal(initial.position, 'fixed'); assert.equal(initial.layer.top, 84); assert(initial.layer.right <= width); assert(initial.layer.left >= 0);
      if (width >= 1000) assert.equal(initial.overlapsFrame, false);
      await page.getByRole('button', { name: 'Accept one consequence', exact: true }).click({ timeout: 5000 });
      assert.equal(await page.evaluate(() => window.accepted), 1);
      await page.getByRole('button', { name: 'Canvas control', exact: true }).click();
      assert.equal(await page.evaluate(() => window.canvasClicked), true);
      result.observations.push({ width, height, initial, afterScroll: await metrics(page), acceptClicked: true, outsideCanvasClicked: true, snapshot: await page.locator('body').ariaSnapshot() });
    }
    await page.setViewportSize({ width:1365,height:900 });
    const acceptedCss = fs.readFileSync(path.join(sol, 'accepted-SpellConsequencePanel.css'), 'utf8');
    await page.setContent(html([css[0], acceptedCss], actor + gm)); result.acceptedBaseline = await metrics(page);
    await page.setContent(html(css, '')); result.offlineEmptyHost = await metrics(page);
    result.passed = true;
  } catch (e) { result.failure = e.stack; process.exitCode = 1; }
  finally { if (browser) await browser.close(); result.ended = new Date().toISOString(); save('layout-probe-v3.json', result); console.log(JSON.stringify({ passed: result.passed, observations: result.observations.length, failure: result.failure, errors: result.errors })); }
})();
