// External test isolation only: do not load workspace cloud credentials.
const Module = require('module');
const load = Module._load;
Module._load = function(request, parent, main) {
  if (request === 'dotenv') return { config: () => ({ parsed: {} }) };
  return load.call(this, request, parent, main);
};
for (const key of Object.keys(process.env)) if (/^(GOOGLE_|FIREBASE_SERVICE_ACCOUNT|FIREBASE_PRIVATE_KEY|FIREBASE_CLIENT_EMAIL)/.test(key)) delete process.env[key];
