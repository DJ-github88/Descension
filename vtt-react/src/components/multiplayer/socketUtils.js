import io from 'socket.io-client';

/**
 * Robust socket factory that handles different import behaviors across environments.
 */
export const createSocket = (url, options) => {
    const socketFactory = typeof io === 'function' ? io : (io.io || io.default || io);

    if (typeof socketFactory !== 'function') {
        console.error('❌ Could not find socket.io-client "io" function. Import value:', io);
        throw new Error('socket.io-client is misconfigured');
    }

    return socketFactory(url, options);
};
