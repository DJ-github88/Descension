/** Keep the earlier R1–R6 evidence historical while recording this correction's
 * unchanged accepted-control runner. Use via NODE_OPTIONS=--require=<this file>. */
const fs = require('fs');
const path = require('path');
const write = fs.writeFileSync.bind(fs);
const oldOutput = path.resolve(__dirname, 'evidence/green.json');
const output = path.resolve(__dirname, 'evidence/remaining/accepted-r1-r6-green.json');
fs.writeFileSync = (file, ...args) => write(typeof file === 'string' && path.resolve(file) === oldOutput ? output : file, ...args);
