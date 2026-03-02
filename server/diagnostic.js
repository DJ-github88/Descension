try {
    require('chai');
    console.log('chai: OK');
} catch (e) {
    console.log('chai: MISSING', e.message);
}

try {
    require('sinon');
    console.log('sinon: OK');
} catch (e) {
    console.log('sinon: MISSING', e.message);
}

try {
    require('./handlers/socketHandlers');
    console.log('socketHandlers: OK');
} catch (e) {
    console.log('socketHandlers: ERROR', e.message, e.stack);
}
