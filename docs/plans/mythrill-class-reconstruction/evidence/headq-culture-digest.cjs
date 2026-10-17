const {fs,path,read,load,hashes}=require('./headq-source-tools.cjs');
const groups=['CR0-H1-humans','CR0-H2-stellar-industrial','CR0-H3-body-and-grove','CR0-H4-threshold','CR0-H5-fire-and-water'];
const lore=JSON.parse(read('vtt-react/public/data/lore.json'));
const links=text=>[...new Set([...JSON.stringify(text).matchAll(/termId=\\?"([^"\\]+)\\?"/g)].map(m=>m[1]))];
const orders={};const linkAudit=[];
for(const group of groups){const bundle=JSON.parse(fs.readFileSync(path.join(__dirname,`${group}-source.json`),'utf8'));let md=`# ${group} — bounded cultural reading\n\n`;
 for(const row of bundle.rows){const sub=row.subrace;md+=`## ${row.name} / ${row.heritageId}\n\nSource ${row.raceFile}; subrace ${sub.id||sub.name}.\n\n`;
  for(const[k,v]of Object.entries(sub))if(typeof v==='string'&&!['id','name','icon','image','illustration','crest','raceId'].includes(k))md+=`**${k}:** ${v}\n\n`;
  for(const list of ['traits','racialTraits','abilities'])if(Array.isArray(sub[list]))for(const t of sub[list])md+=`Trait ${t.name}: ${t.description||''}\n\n`;
  md+=`Current native: ${row.classes.join(', ')}.\n\n`;
  for(const p of row.pairings){orders[p.className]=p.order;const v=p.variant,e=p.edge;
   md+=`- **${p.className}** (${p.classFile}:${p.variantLines.join('/')}): ${v?.title||'NO VARIANT'}. ${v?.signatureAbility?.name||''}: ${v?.signatureAbility?.description||''}\n`;
   if(['Gambit','Revenant','Shaper','Apex'].includes(p.className))md+=`  Native reframe: ${v?.reframe||'Absent'}\n  Crisis: ${v?.currentCrisisAngle||'Absent'}\n`;
   md+=`  Edge (${e?.edge?.condition?.type}=${e?.edge?.condition?.value}): ${e?.description}. Cost: ${e?.costDescription}. Access: ${p.access.status}; requirements ${p.access.requirements?.join(', ')}.\n\n`;
   const refs=links({variant:v,order:p.order});linkAudit.push({heritageId:row.heritageId,className:p.className,refs:refs.map(id=>({id,present:Boolean(lore[id]),type:lore[id]?.type||null}))});
  }
  for(const e of row.rareEdges)md+=`Rare ${e.className}: ${e.description}; COST ${e.costDescription}; when ${JSON.stringify(e.edge.condition)}.\n\n`;
 }
 fs.writeFileSync(path.join(__dirname,`${group}-digest.md`),md);
}
let md='# Current class orders: unique referenced institutions\n\n';for(const[n,o]of Object.entries(orders)){md+=`## ${n}\n\n${JSON.stringify(o,null,2)}\n\n`;}
fs.writeFileSync(path.join(__dirname,'headq-order-digest.md'),md);
fs.writeFileSync(path.join(__dirname,'headq-lore-reference-audit.json'),JSON.stringify({sourceHashes:hashes,scope:'Existence of dictionary IDs only, not verification of every fullEntry claim',pairings:linkAudit},null,2)+'\n');
console.log(JSON.stringify({cohorts:groups,pairings:linkAudit.length,missingDistinctIds:[...new Set(linkAudit.flatMap(r=>r.refs.filter(t=>!t.present).map(t=>t.id)))],sourceOrders:Object.keys(orders).length},null,2));
