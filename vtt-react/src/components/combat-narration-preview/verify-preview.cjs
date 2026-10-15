// Run after preview.cjs. Real Chrome checks against only the isolated preview.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

async function main() {
  const evidence = path.join(__dirname, 'evidence');
  if (!fs.existsSync(evidence)) fs.mkdirSync(evidence);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [], connections = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => connections.push(request.url()));
  const results = [];
  const banner = page.getByRole('article', { name: 'Current narration' });
  const history = page.getByRole('region', { name: 'Preview history', exact: true });
  const fixture = () => page.getByRole('button', { name: 'Next fixture step', exact: true }).click();
  const next = () => page.getByRole('button', { name: 'Next banner', exact: true }).click();
  const select = value => page.getByRole('combobox', { name: 'Preview scenario' }).selectOption(value);
  const text = async expected => {
    await page.waitForFunction(expected => document.querySelector('.mn-sentence')?.textContent === expected, expected);
    assert.equal(await banner.locator('.mn-sentence').textContent(), expected);
    assert.equal(await banner.count(), 1);
  };
  const capture = name => page.screenshot({ path: path.join(evidence, name), fullPage: true, animations: 'disabled' });
  const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  try {
    await page.goto(process.env.NARRATION_URL || 'http://127.0.0.1:4318');
    await fixture(); await fixture(); await next();
    await text('Ilsa’s strike deals 6 slicing.');
    await banner.getByText('Arithmetic & source', { exact: true }).click();
    assert.match(await banner.innerText(), /8 rolled − 2 mitigation = 6 slicing/);
    assert.equal(await page.getByRole('status').count(), 1);
    assert.match(await page.getByRole('status').innerText(), /Accepted outcome/);
    await capture('desktop-routine.png');
    results.push('Routine hit: one banner, accepted label, optional arithmetic/source, polite status.');

    await select('counterspell');
    await fixture(); await fixture(); await fixture();
    assert.equal(await history.getByText('The Fireball collapses. Rocko’s intervention is unnecessary.', { exact: true }).count(), 0);
    await next(); await next();
    await text('Marcus counters. Rocko commits to intercepting.');
    const reactionButtons = page.getByRole('region', { name: 'Fixture reaction controls' });
    await page.getByRole('textbox', { name: 'Supplied countdown text' }).fill('0 s');
    await page.waitForTimeout(1100);
    assert.match(await reactionButtons.innerText(), /0 s supplied/);
    await reactionButtons.getByRole('button', { name: 'Intercept', exact: true }).click();
    assert.match(await reactionButtons.innerText(), /No combat action was submitted/);
    await capture('desktop-response.png');
    await fixture(); await next();
    await text('The Fireball collapses. Rocko’s intervention is unnecessary.');
    results.push('Counterspell: response precedes accepted collapse; supplied 0 s stays fixed and controls remain clickable.');

    await select('parry');
    for (let index = 0; index < 4; index++) { await fixture(); if (index) await next(); }
    await text('Ilsa’s Parry succeeds.');
    assert.equal(await page.getByRole('button', { name: 'Riposte', exact: true }).count(), 0);
    await fixture(); await next();
    await text('Riposte ready: your Parry succeeded.');
    assert.match(await banner.innerText(), /Reaction opportunity/);
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow();
    const riposte = page.getByRole('button', { name: 'Riposte', exact: true });
    await riposte.scrollIntoViewIfNeeded();
    const box = await riposte.boundingBox();
    assert.equal(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.textContent, {
      x: box.x + box.width / 2, y: box.y + box.height / 2
    }), 'Riposte');
    await riposte.click();
    await page.evaluate(() => scrollTo(0, 0));
    await capture('mobile-riposte.png');
    await fixture(); await next(); await fixture(); await next();
    await text('Ilsa’s riposte deals 4 slicing.');
    results.push('Parry: accepted success and new supplied Riposte opportunity remain separate; mobile Riposte button unobstructed.');

    await select('unknown'); await fixture(); await fixture(); await next();
    assert.match(await banner.innerText(), /Outcome pending/);
    await fixture(); await next();
    await text('Arcane Bolt’s outcome is unknown. A confirmed public result has not arrived.');
    await page.waitForTimeout(1100);
    assert.match(await banner.innerText(), /Outcome unknown/);
    assert.equal(await history.getByText('Confirmed: Arcane Bolt deals 3 arcane.', { exact: true }).count(), 0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await capture('desktop-unknown.png');
    await fixture(); await next();
    await text('Confirmed: Arcane Bolt deals 3 arcane.');
    assert.equal(await history.getByText('Outcome unknown', { exact: true }).count(), 1);
    results.push('Unknown: pending/unknown remain unconfirmed over time; only a new confirmed fixture supplies an accepted result.');

    await select('burst');
    await page.getByRole('button', { name: 'Send remaining fixtures', exact: true }).click();
    assert.equal(await history.locator('li').count(), 30);
    assert.match(await page.locator('.mn-queue-controls').innerText(), /4 \/ 4 queued/);
    assert.match(await page.locator('.mn-overflow').innerText(), /24 routine announcements grouped/);
    assert.match(await page.locator('.mn-overflow').innerText(), /1 priority announcement saved directly to history/);
    await noOverflow();
    await capture('desktop-burst.png');
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow();
    assert.equal(await banner.evaluate(element => getComputedStyle(element).animationName), 'none');
    await capture('mobile-long-text.png');
    await page.setViewportSize({ width: 320, height: 740 });
    await noOverflow();
    await page.getByRole('checkbox', { name: 'Priority only', exact: true }).check();
    assert.equal(await history.locator('li').count(), 5);
    for (let index = 0; index < 5; index++) await next();
    assert.match(await banner.innerText(), /24 routine announcements grouped/);
    assert.match(await banner.innerText(), /1 priority announcement saved directly to history/);
    results.push('Burst: 30 history entries, 4 waiting max, 24 routine grouped, all 5 priority entries retained, 320/390 px wrap, reduced motion.');

    assert.deepEqual(errors, []);
    assert.equal(connections.every(url => url.startsWith('http://127.0.0.1:4318/') || url.startsWith(process.env.NARRATION_URL + '/')), true);
    assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
    fs.writeFileSync(path.join(evidence, 'browser-snapshot.yml'), await page.locator('body').ariaSnapshot());
    fs.writeFileSync(path.join(evidence, 'verification.json'), JSON.stringify({
      scope: 'Isolated narration preview only; authored fixtures; no P9/live integration acceptance.',
      checkedAt: new Date().toISOString(), browser: await browser.version(),
      viewports: ['1440×1000', '390×844', '320×740'], results, pageErrors: errors,
      networkRequests: connections, storage: 'localStorage and sessionStorage empty',
      screenshots: ['desktop-routine.png', 'desktop-response.png', 'mobile-riposte.png', 'desktop-unknown.png', 'desktop-burst.png', 'mobile-long-text.png']
    }, null, 2));
    console.log(`${results.length} scenario checks passed; zero page errors; desktop/mobile evidence: ${evidence}`);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
