const fs=require('fs'),cp=require('child_process'),path=require('path');
const name=process.argv[2], args=process.argv.slice(3),cwd=process.cwd(),started=Date.now();
const result=cp.spawnSync(process.execPath,args,{cwd,env:{...process.env,CI:'true',NODE_OPTIONS:'--require='+path.join(__dirname,'readonly-output.cjs')},encoding:'utf8',timeout:600000,maxBuffer:64*1024*1024});
fs.writeFileSync(path.join(__dirname,name+'.log'),(result.stdout||'')+(result.stderr||''));
const record={command:['node',...args],cwd,status:result.status,signal:result.signal,error:result.error?.message,durationMs:Date.now()-started,outputRedirectPreload:'readonly-output.cjs'};fs.writeFileSync(path.join(__dirname,name+'.json'),JSON.stringify(record,null,2));console.log(JSON.stringify(record,null,2));process.exitCode=result.status??1;
