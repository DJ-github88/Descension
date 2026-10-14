// Replay captured before-fix production bytes, never rewrite the checkout.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), Module = require('module'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const before = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/p7-final-20261013/bounds/source-before.json', 'utf8'));
const overlay = new Map();
for (const [file, encoded] of Object.entries(before.files)) {
  const bytes = Buffer.from(encoded, 'base64');
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), before.identity.hashes[file], file);
  if (file.startsWith('server/') && !file.startsWith('server/tests/')) overlay.set(path.join(root, file).toLowerCase(), bytes);
}
const original = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
  const bytes = overlay.get(filename.toLowerCase());
  if (bytes) module._compile(bytes.toString('utf8'), filename); else original(module, filename);
};
