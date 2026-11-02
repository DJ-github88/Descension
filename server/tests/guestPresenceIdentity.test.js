/**
 * Guest identity at the socket boundary (production mode).
 *
 * FIXTURE-BACKED: real socket.io transport, real createSocketAuthMiddleware and
 * real registerSocketHandlers via helpers/productionStackServer.js. Only
 * Firebase token verification is an in-memory map; no signed tokens are
 * invented and no authorization is bypassed. This is NOT live Firebase.
 *
 * Contract the client now relies on (presenceStore / useSocketConnection):
 *   - a production guest connects TOKENLESS and is admitted as a guest;
 *   - an unverifiable `dev-token-<uid>` is REJECTED at the handshake in
 *     production, so clients must never send it there;
 *   - presence identity comes from the verified socket, never from the
 *     client-supplied uid, so a guest cannot claim another uid.
 *
 * Run: npx mocha tests/guestPresenceIdentity.test.js --timeout 10000 --exit
 */

const { expect } = require('chai');
const { createProductionStackServer } = require('./helpers/productionStackServer');

const connectOutcome = (socket) => new Promise((resolve) => {
  const timer = setTimeout(() => resolve({ connected: false, error: 'timeout' }), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve({ connected: true }); });
  socket.once('connect_error', (err) => { clearTimeout(timer); resolve({ connected: false, error: err.message }); });
});
const once = (socket, event, ms = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for ${event}`)), ms);
  socket.once(event, (p) => { clearTimeout(timer); resolve(p); });
});

describe('Guest identity at the socket boundary (production mode, fixture-backed)', function() {
  this.timeout(20000);

  const savedEnv = {
    NODE_ENV: process.env.NODE_ENV,
    ALLOW_DEV_AUTH: process.env.ALLOW_DEV_AUTH,
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
  };
  let server;
  let clients;

  beforeEach(async() => {
    process.env.NODE_ENV = 'production';
    delete process.env.ALLOW_DEV_AUTH; // a hosted deploy never opts in
    delete process.env.RAILWAY_ENVIRONMENT;
    server = createProductionStackServer({ debounceMs: 80 });
    await server.start();
    clients = [];
  });

  afterEach(async() => {
    for (const c of clients) { try { c.disconnect(); } catch (_) { /* noop */ } }
    try { await server.stop(); } catch (_) { /* noop */ }
    for (const [k, v] of Object.entries(savedEnv)) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
  });

  const open = (opts) => {
    const c = server.connect(opts);
    clients.push(c);
    return c;
  };

  it('a tokenless production guest connects and is marked guest', async() => {
    const c = open({});
    expect((await connectOutcome(c)).connected).to.equal(true);
    const s = server.io.sockets.sockets.get(c.id);
    expect(s.data.isGuest).to.equal(true);
    expect(s.data.authenticated).to.equal(false);
    expect(s.data.userId).to.equal(null);
  });

  it('a fabricated dev-token-<uid> is rejected at the production handshake (why clients must not send it)', async() => {
    const c = open({ token: 'dev-token-anon-1' });
    const out = await connectOutcome(c);
    expect(out.connected).to.equal(false);
    expect(out.error).to.match(/Authentication/);
  });

  it('dev-user / admin / mock / test tokens are also rejected in production', async() => {
    for (const token of ['dev-user-123', 'admin-dev-user', 'admin', 'mock-token', 'test-token']) {
      const out = await connectOutcome(open({ token }));
      expect(out.connected, token).to.equal(false);
    }
  });

  it('guest presence ignores a client-supplied (substituted) uid and stays a guest identity', async() => {
    const victim = server.nextUserId('victim');
    const c = open({});
    await connectOutcome(c);
    const ack = once(c, 'presence_registered');
    c.emit('register_presence', { userId: victim, name: 'Impostor' });
    expect((await ack).success).to.equal(true);
    const s = server.io.sockets.sockets.get(c.id);
    expect(s.data.userId).to.equal(`guest-${c.id}`);
    expect(s.data.userId).to.not.equal(victim);
  });

  it('a verified token still yields the VERIFIED uid, regardless of a different uid in the payload', async() => {
    const uid = server.nextUserId('acct');
    server.registerAuthToken(`tok:${uid}`, uid);
    const c = open({ token: `tok:${uid}` });
    expect((await connectOutcome(c)).connected).to.equal(true);
    const ack = once(c, 'presence_registered');
    c.emit('register_presence', { userId: 'someone-else', name: 'X' });
    await ack;
    expect(server.io.sockets.sockets.get(c.id).data.userId).to.equal(uid);
  });

  it('reconnect with a different guest socket gets a fresh guest identity, never the previous one', async() => {
    const a = open({});
    await connectOutcome(a);
    const aAck = once(a, 'presence_registered');
    a.emit('register_presence', { name: 'G' });
    await aAck;
    const firstId = server.io.sockets.sockets.get(a.id).data.userId;
    a.disconnect();

    const b = open({});
    await connectOutcome(b);
    const bAck = once(b, 'presence_registered');
    b.emit('register_presence', { userId: firstId, name: 'G' });
    await bAck;
    const secondId = server.io.sockets.sockets.get(b.id).data.userId;
    expect(secondId).to.equal(`guest-${b.id}`);
    expect(secondId).to.not.equal(firstId);
  });

  it('a guest is refused a restricted (requireAuth) action in production, with an ack failure rather than a hang', async() => {
    const c = open({});
    await connectOutcome(c);
    const authError = once(c, 'auth_error').catch(() => null);
    const ack = await new Promise((resolve) => {
      const t = setTimeout(() => resolve('no-ack'), 4000);
      c.emit('create_room', { roomName: 'Nope', gmName: 'G', userId: 'victim-uid' }, (r) => { clearTimeout(t); resolve(r); });
    });
    expect(ack).to.not.equal('no-ack');
    expect(ack.success).to.equal(false);
    expect(await authError).to.not.equal(null);
  });
});
