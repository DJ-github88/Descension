/**
 * Socket auth middleware tests.
 *
 * Guards the auth boundary policy: anonymous (no token) is always allowed as a
 * guest; valid tokens authenticate; invalid tokens and verification errors are
 * rejected in production but downgraded to guest in development.
 *
 * Run: npx mocha tests/socketAuthMiddleware.test.js --timeout 10000 --exit
 */

const { expect } = require('chai');
const { createSocketAuthMiddleware } = require('../services/socketAuthMiddleware');

const makeSocket = (token) => ({
  id: 'socket-1',
  data: {},
  handshake: {
    auth: token !== undefined && token !== null ? { token } : {},
    headers: {}
  }
});

const makeLogger = () => ({
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {}
});

describe('socketAuthMiddleware', function () {
  this.timeout(10000);

  const origNodeEnv = process.env.NODE_ENV;
  let firebaseService;
  let logger;

  beforeEach(() => {
    firebaseService = { verifyIdToken: async () => null };
    logger = makeLogger();
    delete process.env.RAILWAY_ENVIRONMENT;
  });

  afterEach(() => {
    process.env.NODE_ENV = origNodeEnv;
    delete process.env.RAILWAY_ENVIRONMENT;
  });

  it('allows a missing token as a guest (anonymous multiplayer)', async () => {
    process.env.NODE_ENV = 'production';
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = makeSocket(null);
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(nextArg).to.equal(undefined);
    expect(socket.data.isGuest).to.equal(true);
    expect(socket.data.authenticated).to.equal(false);
    expect(socket.data.userId).to.equal(null);
  });

  it('authenticates a valid token', async () => {
    process.env.NODE_ENV = 'production';
    firebaseService.verifyIdToken = async () => ({ uid: 'user-123', email: 'a@b.c' });
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = makeSocket('valid-token');
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(nextArg).to.equal(undefined);
    expect(socket.data.authenticated).to.equal(true);
    expect(socket.data.userId).to.equal('user-123');
    expect(socket.data.email).to.equal('a@b.c');
    expect(socket.data.isGuest).to.equal(false);
  });

  it('rejects an invalid token in production', async () => {
    process.env.NODE_ENV = 'production';
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = makeSocket('expired');
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(nextArg).to.be.an('error');
    expect(nextArg.message).to.match(/invalid token/);
  });

  it('downgrades an invalid token to guest in development', async () => {
    process.env.NODE_ENV = 'development';
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = makeSocket('expired');
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(nextArg).to.equal(undefined);
    expect(socket.data.isGuest).to.equal(true);
    expect(socket.data.authenticated).to.equal(false);
  });

  it('rejects on verification error in production', async () => {
    process.env.NODE_ENV = 'production';
    firebaseService.verifyIdToken = async () => { throw new Error('network failure'); };
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = makeSocket('any-token');
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(nextArg).to.be.an('error');
    expect(nextArg.message).to.match(/Authentication error/);
  });

  it('downgrades to guest on verification error in development', async () => {
    process.env.NODE_ENV = 'development';
    firebaseService.verifyIdToken = async () => { throw new Error('network failure'); };
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = makeSocket('any-token');
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(nextArg).to.equal(undefined);
    expect(socket.data.isGuest).to.equal(true);
    expect(socket.data.authenticated).to.equal(false);
  });

  it('treats RAILWAY_ENVIRONMENT as production', async () => {
    process.env.NODE_ENV = 'development';
    process.env.RAILWAY_ENVIRONMENT = 'production';
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = makeSocket('expired');
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(nextArg).to.be.an('error');
    expect(nextArg.message).to.match(/invalid token/);
  });

  it('accepts an Authorization Bearer header as the token source', async () => {
    process.env.NODE_ENV = 'production';
    firebaseService.verifyIdToken = async () => ({ uid: 'bearer-user' });
    const mw = createSocketAuthMiddleware({ firebaseService, logger });
    const socket = {
      id: 's2',
      data: {},
      handshake: { auth: {}, headers: { authorization: 'Bearer bearer-token' } }
    };
    let nextArg = 'not-called';
    await mw(socket, (err) => { nextArg = err; });

    expect(socket.data.authenticated).to.equal(true);
    expect(socket.data.userId).to.equal('bearer-user');
  });
});
