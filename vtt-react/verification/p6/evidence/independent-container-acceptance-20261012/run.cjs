const fs=require('fs'),path=require('path'),cp=require('child_process');
const label=process.argv[2],args=process.argv.slice(3);
const result=cp.spawnSync(args[0],args.slice(1),{cwd:'D:/VTT/vtt-react',env:{...process.env,NODE_OPTIONS:'--require='+path.join(__dirname,'output.cjs'),BABEL_CACHE_PATH:path.join(__dirname,'babel-cache.json'),JEST_CACHE_DIRECTORY:path.join(__dirname,'jest-cache')},encoding:'utf8',maxBuffer:64*1024*1024,shell:args[0]==='npm.cmd'});
fs.writeFileSync(path.join(__dirname,label+'.utf8.log'),(result.stdout||'')+(result.stderr||''));
fs.writeFileSync(path.join(__dirname,label+'.exit.json'),JSON.stringify({command:args.join(' '),status:result.status,error:result.error?.message},null,2));
console.log(JSON.stringify({label,status:result.status,error:result.error?.message}));process.exitCode=result.status??1;
