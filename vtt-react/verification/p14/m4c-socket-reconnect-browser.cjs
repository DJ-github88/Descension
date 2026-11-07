// Separate socket evidence on the SAME integrated build. Compiled production setup/store paths;
// fixture principals and token verification, real browser socket.io transport. No live Firebase claim.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.M4C_SOCKET_OUTPUT;
assert(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR); fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');
const report = { checks: {}, handshakes: [], limits: ['Mounted production App; production campaign setupSocketConnection and presence initializeGlobalSocket execute from the identified bundle.',
  'Principal selection/getIdToken and backend verification are fixtures; real browser socket.io transport and registered middleware execute. Not real Firebase, token revocation, a real-service login journey or a second device.',
  'Transport loss and token rotation are deterministic test stimuli. Reviewed timeout/fallback code is not modified.'] };
async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  for (const [token, uid] of [['reconnect-A-v1', 'reconnect-A'], ['reconnect-A-v2', 'reconnect-A'], ['reconnect-B-v1', 'reconnect-B']]) host.backend.registerAuthToken(token, uid);
  host.backend.io.on('connection', socket => report.handshakes.push({ id: socket.id, token: socket.handshake.auth?.token, uid: socket.data.userId }));
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    const backend = host.backend.url();
    await page.addInitScript(({ backend }) => {
      const Native = window.WebSocket;
      window.WebSocket = class extends Native { constructor(url, protocols) {
        const u = new URL(url); if (/\.railway\.app$/.test(u.hostname)) { const local = new URL(backend); u.protocol = 'ws:'; u.host = local.host; }
        super(u.href, protocols);
      } };
    }, { backend });
    await page.route('**/socket.io/**', async route => {
      const u = new URL(route.request().url());
      if (!/\.railway\.app$/.test(u.hostname)) return route.continue();
      const request = route.request();
      const response = await page.request.fetch(backend + u.pathname + u.search, { method: request.method(), data: request.postDataBuffer(), headers: request.headers() });
      await route.fulfill({ response });
    });
    await page.goto(host.url + '/game'); await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
    const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
    await consent.waitFor({ timeout: 5000 }).catch(() => {}); if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
    const initial = await page.evaluate(async backend => {
      const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99139], {}, r => window.__req = r]);
      const moduleWith = text => { const found = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!found) throw Error('Missing module ' + text); return __req(found[0]); };
      const registry = moduleWith('registerStore:'); window.S = name => registry.getStore(name);
      window.version = 'v1'; window.__tokenReads = [];
      const user = { uid: 'reconnect-A', displayName: 'Reconnect A', getIdToken: async() => { const token = `reconnect-A-${window.version}`; __tokenReads.push(token); return token; } };
      for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
      S('authStore').getState().setUser(user); await new Promise(r => setTimeout(r, 1000));
      // Load the ordinary lazy Multiplayer route without replacing the production bundle or principal.
      history.pushState({}, '', '/multiplayer'); window.dispatchEvent(new PopStateEvent('popstate'));
      for (let i = 0; i < 150 && !Object.values(__req.m).some(f => f.toString().includes('Multiplayer socket CONNECTED:')); i++) await new Promise(r => setTimeout(r, 100));
      const mod = moduleWith('Multiplayer socket CONNECTED:');
      // Let the mounted route call its hook normally; never invoke a possibly mangled React export.
      for (let i = 0; i < 150; i++) {
        const socket = S('presenceStore')?.getState().socket;
        if (socket?.connected && socket.io.opts.autoConnect === false) { window.__campaign = socket; break; }
        await new Promise(r => setTimeout(r, 100));
      }
      if (!window.__campaign) throw Error('Mounted Multiplayer route did not publish its campaign socket');
      return { moduleKeys: Object.keys(mod), route: location.pathname, path: 'mounted production hook' };
    }, backend);
    await page.waitForFunction(() => window.__campaign?.connected, null, { timeout: 15000 });
    const campaignId = await page.evaluate(() => __campaign.id);
    await page.evaluate(() => { window.version = 'v2'; }); host.backend.io.sockets.sockets.get(campaignId).conn.close();
    await page.waitForFunction(old => window.__campaign?.connected && __campaign.id !== old, campaignId, { timeout: 15000 });
    const campaignAfter = await page.evaluate(() => ({ id: __campaign.id, reads: __tokenReads.slice() }));
    assert(report.handshakes.some(h => h.id === campaignAfter.id && h.token === 'reconnect-A-v2' && h.uid === 'reconnect-A'));
    report.checks.campaignRotation = { initial, before: campaignId, after: campaignAfter };
    await page.evaluate(async() => {
      const presence = S('presenceStore'); if (!presence) throw Error('Presence store missing');
      presence.setState({ socket: null, isConnected: false }); window.version = 'v1';
      window.__presence = await presence.getState().initializeGlobalSocket();
    });
    await page.waitForFunction(() => window.__presence?.connected, null, { timeout: 15000 });
    const presenceId = await page.evaluate(() => __presence.id);
    await page.evaluate(() => { window.version = 'v2'; }); host.backend.io.sockets.sockets.get(presenceId).conn.close();
    await page.waitForFunction(old => window.__presence?.connected && __presence.id !== old, presenceId, { timeout: 15000 });
    const presenceAfter = await page.evaluate(() => ({ id: __presence.id, reads: __tokenReads.slice() }));
    assert(report.handshakes.some(h => h.id === presenceAfter.id && h.token === 'reconnect-A-v2' && h.uid === 'reconnect-A'));
    report.checks.presenceRotation = { before: presenceId, after: presenceAfter };
    const cutoff = report.handshakes.length;
    report.checks.accountIsolation = await page.evaluate(async() => {
      const readAuth = socket => new Promise((resolve, reject) => { let settled = false; socket.auth(value => { if (!settled) { settled = true; resolve(value); } }); setTimeout(() => { if (!settled) reject(Error('auth callback hung')); }, 12000); });
      const auth = S('authStore'), retired = [window.__campaign, window.__presence];
      auth.getState().setUser(null); await new Promise(r => setTimeout(r, 400));
      const logout = await Promise.all(retired.map(readAuth));
      auth.getState().setUser({ uid: 'reconnect-B', displayName: 'Reconnect B', getIdToken: async() => { __tokenReads.push('reconnect-B-v1'); return 'reconnect-B-v1'; } });
      await new Promise(r => setTimeout(r, 700)); const switched = await Promise.all(retired.map(readAuth));
      return { logout, switched, reads: __tokenReads.slice(), retiredConnected: retired.map(s => s.connected) };
    });
    for (const value of [...report.checks.accountIsolation.logout, ...report.checks.accountIsolation.switched]) assert.equal(value.token, 'reconnect-A-v2');
    assert.deepEqual(report.checks.accountIsolation.retiredConnected, [false, false]);
    assert(!report.handshakes.slice(cutoff).some(h => [campaignAfter.id, presenceAfter.id].includes(h.id) && h.uid === 'reconnect-B'));
    report.passed = true;
  } catch (e) { report.failure = e.stack; fs.writeFileSync(path.join(out, 'failure.aria.yml'), await page.locator('body').ariaSnapshot().catch(() => 'unavailable')); throw e; }
  finally { fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(report, null, 2)); await browser.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
