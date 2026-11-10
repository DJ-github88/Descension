'use strict';

const path = require('path');

const verification = path.resolve(__dirname, '..');
const vttReact = path.resolve(verification, '..');

module.exports = {
  witness: 'formula-rider-save-cooldown-app-browser.cjs',
  baseDir: __dirname,
  outputEnv: 'FRSC_OUTPUT',
  buildEnv: 'APP_BUILD_DIR',
  appOutputEnv: 'APP_OUTPUT',
  appOutputSubdir: 'fixture',
  requireAbsolutePaths: true,
  buildFiles: ['index.html', 'asset-manifest.json'],
  requiredManifestEntries: ['main.js'],
  fixtureFiles: [
    { label: 'creature seed data', path: path.join(vttReact, 'public/data/creatures.json') },
    { label: 'socket.io browser client', path: path.join(vttReact, 'node_modules/socket.io-client/dist/socket.io.js') }
  ],
  modules: [
    'playwright',
    './m4b-fixture-characters.cjs',
    '../../src/services/authoredAbility',
    '../../src/services/sharedConditionProfile',
    '../../src/services/sharedEffectTiming',
    '../../src/services/authoredCooldown',
    '../../../server/services/actorConsequences',
    '../../../server/services/spellPayments',
    '../p9/integration/app-browser.cjs',
    '../p9/integration/app-server.cjs'
  ],
  server: { host: '127.0.0.1', port: 4180, module: '../p9/integration/app-server.cjs' }
};
