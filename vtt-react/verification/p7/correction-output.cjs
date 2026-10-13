const fs = require('fs'), path = require('path'), Module = require('module');
const out = path.join(__dirname, 'evidence/corrections-20261013');
const redirect = file => {
  if (typeof file !== 'string') return file;
  const value = path.resolve(file).replace(/\\/g, '/');
  for (const [from, to] of [['D:/VTT/vtt-react/verification/p7/evidence', out + '/controls'], ['D:/VTT/server/logs', out + '/server-logs']]) {
    if (value.startsWith(from + '/corrections-20261013/')) return file;
    if (value === from || value.startsWith(from + '/')) return to + value.slice(from.length);
  }
  return file;
};
const write = fs.writeFileSync;
fs.writeFileSync = (file, ...args) => {const target = redirect(file); fs.mkdirSync(path.dirname(target), { recursive: true }); return write(target, ...args);};
const mkdir = fs.mkdirSync;
fs.mkdirSync = (file, ...args) => mkdir(redirect(file), ...args);
const load = Module._load;
Module._load = function(request, parent, main) {if (request === 'dotenv') return { config: () => ({ parsed: {} }) }; return load.call(this, request, parent, main);};
for (const key of Object.keys(process.env)) if (/^(GOOGLE_|FIREBASE_SERVICE_ACCOUNT|FIREBASE_PRIVATE_KEY|FIREBASE_CLIENT_EMAIL)/.test(key)) delete process.env[key];
