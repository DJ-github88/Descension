/**
 * Socket.io authentication middleware factory.
 *
 * Auth boundary for multiplayer connections. Policy:
 *   - No token        -> guest (anonymous multiplayer is a first-class feature).
 *   - Valid token     -> authenticated.
 *   - Invalid token   -> reject in production, downgrade to guest in development.
 *   - Verification    -> reject in production, downgrade to guest in development.
 *     error
 *
 * Extracted from server.js so the boundary can be unit-tested. Behavior matches
 * the previous inline implementation except for the production-strictness on
 * invalid/error tokens.
 */

function createSocketAuthMiddleware({ firebaseService, logger }) {
  return async(socket, next) => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        socket.data.authenticated = false;
        socket.data.userId = null;
        socket.data.isGuest = true;
        logger.debug('Guest connection allowed for multiplayer', { socketId: socket.id });
        return next();
      }

      // Handle development tokens in non-production environments
      if (!isProduction && typeof token === 'string' && (token.startsWith('dev-token') || token.startsWith('dev-user-') || token === 'dev-user-123' || token === 'admin-dev-user' || token === 'admin' || token === 'mock-token' || token === 'test-token')) {
        const devUid = token.startsWith('dev-token-')
          ? token.replace('dev-token-', '')
          : (token === 'admin-dev-user' || token === 'admin' ? 'admin-dev-user' : (token === 'mock-token' || token === 'test-token' ? 'dev-user-123' : token));
        socket.data.authenticated = true;
        socket.data.userId = devUid;
        socket.data.email = `${devUid}@example.com`;
        socket.data.isGuest = false;
        logger.info('Socket authenticated via development token', { socketId: socket.id, userId: devUid });
        return next();
      }

      // In development mode, if it is a JWT token (3 parts), decode the payload
      if (!isProduction && typeof token === 'string' && token.includes('.')) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            const uid = payload.user_id || payload.sub || payload.uid;
            if (uid) {
              socket.data.authenticated = true;
              socket.data.userId = uid;
              socket.data.email = payload.email || `${uid}@example.com`;
              socket.data.isGuest = false;
              logger.info('Socket authenticated via decoded development JWT', { socketId: socket.id, userId: uid });
              return next();
            }
          }
        } catch (jwtErr) {
          logger.debug('Could not decode JWT in development, falling back to verifyIdToken', { error: jwtErr.message });
        }
      }

      const decodedToken = await firebaseService.verifyIdToken(token);
      if (decodedToken) {
        socket.data.authenticated = true;
        socket.data.userId = decodedToken.uid;
        socket.data.email = decodedToken.email;
        socket.data.isGuest = false;
        logger.info('Socket authenticated', { socketId: socket.id, userId: decodedToken.uid });
      } else if (isProduction) {
        logger.warn('Socket authentication rejected: invalid token (production)', { socketId: socket.id });
        return next(new Error('Authentication failed: invalid token'));
      } else {
        socket.data.authenticated = false;
        socket.data.userId = null;
        socket.data.isGuest = true;
        logger.warn('Socket authentication failed, allowing as guest (development)', { socketId: socket.id });
      }

      next();
    } catch (error) {
      logger.error('Socket authentication error', { socketId: socket.id, error: error.message });
      if (isProduction) {
        return next(new Error('Authentication error'));
      }
      socket.data.authenticated = false;
      socket.data.userId = null;
      socket.data.isGuest = true;
      next();
    }
  };
}

module.exports = { createSocketAuthMiddleware };
