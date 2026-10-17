/* Research helpers. No application writes; unknown external imports are refused. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../..'), src = path.join(root, 'vtt-react/src');
const babel = require(path.join(root, 'vtt-react/node_modules/@babel/core'));
const parser = require(path.join(root, 'vtt-react/node_modules/@babel/parser'));
const plugin = require.resolve('@babel/plugin-transform-modules-commonjs', {paths:[path.join(root,'vtt-react')]});
const hashes = {}, cache = new Map();
const relative = file => path.relative(root,file).replaceAll('\\','/');
function read(file) { file=path.isAbsolute(file)?file:path.join(root,file); const bytes=fs.readFileSync(file); hashes[relative(file)]=crypto.createHash('sha256').update(bytes).digest('hex'); return bytes.toString('utf8'); }
function load(file) {
  file=path.isAbsolute(file)?file:path.join(src,file);
  if(!fs.existsSync(file))file+='.js';
  if(!file.startsWith(src+path.sep))throw Error(`Outside source: ${file}`);
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=babel.transformSync(read(file),{filename:file,babelrc:false,configFile:false,plugins:[plugin]}).code;
  const req=name=>{if(!name.startsWith('.'))throw Error(`External import refused: ${name}`);return load(path.resolve(path.dirname(file),name));};
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{},{filename:file,timeout:5000})(req,module,module.exports);
  return module.exports;
}
function locations(file, key) {
  const ast=parser.parse(read(file),{sourceType:'module',plugins:['jsx']});const found=[];
  function walk(n){if(!n||typeof n!=='object')return;if(['ObjectProperty','ObjectMethod'].includes(n.type)&&(n.key?.name||n.key?.value)===key)found.push(n.loc.start.line);for(const [k,v]of Object.entries(n))if(!['loc','start','end'].includes(k))Array.isArray(v)?v.forEach(walk):walk(v);}
  walk(ast);return found;
}
module.exports={fs,path,root,src,hashes,read,load,locations,relative};
