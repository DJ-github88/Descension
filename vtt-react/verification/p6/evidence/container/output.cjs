const fs = require('fs'), path = require('path');
const write = fs.writeFileSync.bind(fs);
const oldRoot = 'D:/VTT/vtt-react/verification/p6/evidence';
fs.writeFileSync = (file, ...args) => {
  const absolute = typeof file === 'string' ? path.resolve(file).replace(/\\/g, '/') : '';
  return write(absolute.startsWith(oldRoot + '/') ? path.join(__dirname, absolute === oldRoot + '/green.json' ? 'accepted-r1-r6-green.json' : path.relative(oldRoot, absolute).replace(/[\\/]/g, '-')) : file, ...args);
};
