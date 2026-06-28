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
  return async (socket, next) => {
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
