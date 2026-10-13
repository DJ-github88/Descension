const fs=require('fs'),path=require('path');
for(const name of fs.readdirSync(__dirname).filter(n=>n.endsWith('.log')&&!n.endsWith('.utf8.log'))){
 const bytes=fs.readFileSync(path.join(__dirname,name));
 const text=bytes[0]===255&&bytes[1]===254?bytes.subarray(2).toString('utf16le'):bytes.toString('utf8');
 fs.writeFileSync(path.join(__dirname,name.replace(/\.log$/,'.utf8.log')),text);
}
