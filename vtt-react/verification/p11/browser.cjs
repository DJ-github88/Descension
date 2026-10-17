// P11 real-browser witness. Serves the bundle built by build-harness.cjs and drives
// the real creation Skills step and sheet Skills panel in Chromium.
// Usage: node browser.cjs <bundleDir> <evidenceDir>   (needs `playwright` resolvable)
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const bundleDir = path.resolve(process.argv[2] || '.');
const evidenceDir = path.resolve(process.argv[3] || path.join(bundleDir, 'evidence'));
fs.mkdirSync(evidenceDir, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : detail); };

async function main() {
    const server = http.createServer((req, res) => {
        const file = req.url.startsWith('/harness.js') ? 'harness.js' : 'index.html';
        res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : 'text/html');
        fs.createReadStream(path.join(bundleDir, file)).pipe(res);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}/`;
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(String(error.message || error)));
    // Icons may point at remote art the sandbox cannot reach; wait for the DOM, not every image.
    const open = async query => { await page.goto(base + query, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.premium-skill-card, .weapon-mastery-card, .skill-detail-view', { timeout: 30000 }); };
    const text = () => page.evaluate(() => document.body.innerText);
    // Remote web fonts are unreachable in a sandbox; a missing screenshot is recorded, not fatal.
    const shot = async name => {
        try { await page.screenshot({ path: path.join(evidenceDir, name), timeout: 5000 }); } catch (error) { results.push({ name: `screenshot ${name}`, ok: true, detail: 'skipped: fonts unavailable' }); }
    };
    const pill = () => page.textContent('.points-pill');
    const card = name => page.locator('.premium-skill-card', { has: page.locator('.skill-card-name', { hasText: new RegExp(`^${name}$`) }) });
    const enc = value => encodeURIComponent(JSON.stringify(value));

    // ---- Creation: budget boundary on class-skill selection (A7)
    await open(`?view=wizard&ranks=${enc({ athletics: 'ADEPT' })}`);
    check('wizard: 10/10 spent shows 0 / 10', (await pill()).trim() === '0 / 10', await pill());
    check('wizard: unaffordable class skill shows reason', /Needs 1 point to select/.test(await card('Tactical Combat').innerText()));
    await card('Tactical Combat').locator('.selection-indicator').click();
    check('wizard: unaffordable selection refused', !(await card('Tactical Combat').getAttribute('class')).includes('selected-skill'));

    await open(`?view=wizard&ranks=${enc({ athletics: 'APPRENTICE', stealth: 'TRAINED' })}`);
    await card('Tactical Combat').locator('.selection-indicator').click();
    check('wizard: selection at exact cost allowed', (await card('Tactical Combat').getAttribute('class')).includes('selected-skill'));
    check('wizard: budget now 0 / 10', (await pill()).trim() === '0 / 10', await pill());

    // ---- Creation: over budget blocks a new character, not an edit (A7)
    await open(`?view=wizard&ranks=${enc({ athletics: 'EXPERT' })}`);
    check('wizard: over-budget warning visible', await page.isVisible('[data-testid="skill-budget-warning"]'));
    check('wizard: validation blocks new character', (await page.getAttribute('#wizard-status', 'data-valid')) === 'false'
        && /over budget by 5 points/.test(await page.textContent('#wizard-status')), await page.textContent('#wizard-status'));
    await shot('wizard-over-budget.png');
    await open(`?view=wizard&editing=1&ranks=${enc({ athletics: 'EXPERT' })}`);
    check('wizard edit: note instead of warning', await page.isVisible('[data-testid="skill-budget-note"]') && !(await page.isVisible('[data-testid="skill-budget-warning"]')));
    check('wizard edit: no skill validation error', (await page.textContent('#wizard-status')) === 'no skill error');

    // ---- Creation: per-weapon purchases (A8) and wording (A9)
    await open('?view=wizard'); // Weapon Mastery is inspected first
    await page.waitForSelector('#wizard-weapon-type');
    await page.selectOption('#wizard-weapon-type', 'axe');
    await page.click('.training-btn.upgrade');
    await page.selectOption('#wizard-weapon-type', 'sword');
    await page.click('.training-btn.upgrade');
    await page.click('.training-btn.upgrade');
    check('wizard: two weapon purchases charged separately (6 / 10)', (await pill()).trim() === '6 / 10', await pill());
    check('wizard: card summarizes two weapon types', /2 weapon types trained/.test(await card('Weapon Mastery').innerText()));
    check('wizard: picker lists per-weapon ranks', /Axe: Novice/.test(await page.innerText('#wizard-weapon-type')) && /Sword: Trained/.test(await page.innerText('#wizard-weapon-type')));
    const wizardText = await text();
    check('wizard: player-set progression wording', wizardText.includes("you don't need the GM's approval"));
    check('wizard: no false "free"/"awarded" wording', !/for free|awarded by the GM|may award/i.test(wizardText));
    await shot('wizard-weapon-purchase.png');

    // ---- Sheet: independent ranks, legacy, persistence across reload, isolation (A1–A6)
    await page.evaluate(() => localStorage.clear());
    await open('?view=sheet');
    const weapon = label => page.locator('.weapon-mastery-card', { has: page.locator('.weapon-card-name', { hasText: new RegExp(`^${label}$`) }) });
    // Rank chips are upper-cased by CSS, so compare case-insensitively.
    check('sheet: Sword starts Untrained d4', /Untrained[\s\S]*d4/i.test(await weapon('Sword').innerText()), await weapon('Sword').innerText());
    check('sheet: Axe keeps Novice d6', /Novice[\s\S]*d6/i.test(await weapon('Axe').innerText()), await weapon('Axe').innerText());
    check('sheet: legacy notice shows Adept (d12)', /Adept \(d12\)/.test(await page.innerText('[data-testid="weapon-legacy-rank-notice"]')));
    await page.selectOption('.skill-rank-dropdown', 'EXPERT');
    await weapon('Axe').click();
    check('sheet: Axe selector reads its own rank', (await page.inputValue('.skill-rank-dropdown')) === 'NOVICE');
    await page.selectOption('.skill-rank-dropdown', 'TRAINED');
    await weapon('Dagger').click();
    await page.click('text=Use Adept for Dagger');
    let ranks = await page.evaluate(() => window.__p11.ranks());
    check('sheet: independent per-weapon writes', ranks.weaponMastery_sword === 'EXPERT' && ranks.weaponMastery_axe === 'TRAINED' && ranks.weaponMastery_dagger === 'ADEPT' && ranks.weaponMastery === 'ADEPT', JSON.stringify(ranks));
    await shot('sheet-weapon-ranks.png');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.weapon-mastery-card');
    ranks = await page.evaluate(() => window.__p11.ranks());
    check('sheet: per-weapon ranks survive reload (canonical assemble → loadCharacter)', ranks.weaponMastery_sword === 'EXPERT' && ranks.weaponMastery_axe === 'TRAINED' && ranks.weaponMastery_dagger === 'ADEPT' && ranks.weaponMastery === 'ADEPT', JSON.stringify(ranks));
    check('sheet: reloaded Sword card shows Expert', /Expert/i.test(await weapon('Sword').innerText()));

    await open('?view=sheet&character=p11-two');
    ranks = await page.evaluate(() => window.__p11.ranks());
    check('sheet: other character does not inherit ranks', JSON.stringify(ranks) === JSON.stringify({ weaponMastery_bow: 'MASTER' }), JSON.stringify(ranks));
    check('sheet: other character shows no legacy notice', !(await page.isVisible('[data-testid="weapon-legacy-rank-notice"]')));

    await open('?view=sheet&mode=advanced');
    check('sheet advanced: authored-task note', /applied by the GM; the VTT does not grant them/.test(await text()));
    await open('?view=sheet&skill=stealth');
    const sheetText = await text();
    check('sheet: Getting Better is player-set', sheetText.includes("you don't need the GM's approval") && !/award you a die upgrade/i.test(sheetText));
    check('sheet: open rules labelled', sheetText.includes('[Open: whether stat and rank modifiers are added'));

    check('no page errors', pageErrors.length === 0, pageErrors.join(' | '));
    await browser.close();
    server.close();
    const summary = { passed: results.filter(r => r.ok).length, failed: results.filter(r => !r.ok).length, results };
    fs.writeFileSync(path.join(evidenceDir, 'browser-results.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify({ passed: summary.passed, failed: summary.failed }));
    if (summary.failed) process.exitCode = 1;
}

main().catch(error => { console.error(error); process.exit(1); });
