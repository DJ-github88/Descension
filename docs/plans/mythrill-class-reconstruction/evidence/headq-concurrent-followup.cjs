/* Hash-only follow-up for simultaneous writers; no source/library mutations. */
const {fs,path,read,hashes}=require('./headq-source-tools.cjs');
const files=[
 'vtt-react/src/components/books/BookSpellPickerModal.jsx',
 'vtt-react/src/components/books/BookDocumentEditor.jsx',
 'vtt-react/src/components/books/BookTtrpgBlocks.jsx',
 'vtt-react/src/utils/WallGeometry.js',
 'vtt-react/src/components/grid/CameraCompass.jsx',
 'vtt-react/src/components/level-editor/three/ThreeDWorldLayer.jsx'
];for(const file of files)read(file);
fs.writeFileSync(path.join(__dirname,'headq-concurrent-followup.json'),JSON.stringify({observedAt:new Date().toISOString(),scope:'Concurrent source reading/hash capture only, not build/test acceptance; not part of original169-input baseline',sourceHashes:hashes,findings:[
 'BookSpellPickerModal.normalizeBookSpellData:83–139 creates a projection from ap/manaCost/resourceCosts and enumerates fields; no classResourceProgram or canonical singular resourceCost is carried by this projection.',
 'BookSpellPickerModal:210–233 can forge/live merge/save into the personal library; this is another schema/copy consumer, not server admission. No actor_consequence/routeSpell call found in inspected book modules.',
 'BookDocumentEditor imports/mounts the picker and receives spell_formula blocks. Later canonical/admission work must preserve immutable definition refs through that consumer.',
 'WallGeometry exports wall endpoints/heights/footprints/projection/render helpers. This is not evidence that server P7 now validates range, line of effect or area membership.',
 'Captured actor-consequence/spell authority files remain unchanged. Full live-App book/camera/wall integration is not accepted by this investigation.'
]},null,2)+'\n');
console.log(JSON.stringify({capturedFiles:files.length,sourceWrites:0},null,2));
