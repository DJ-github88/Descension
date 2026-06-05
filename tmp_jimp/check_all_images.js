const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const targetImages = [
  'watercolor_dragon.png',
  'watercolor_anvil.png',
  'watercolor_tree.png',
  'watercolor_candle.png',
  'watercolor_sigil.png',
  'watercolor_map.png',
  'watercolor_hourglass.png',
  'watercolor_void.png',
  'watercolor_breastplate.png',
  'watercolor_backpack.png',
  'watercolor_campfire.png',
  'watercolor_skull.png',
  'watercolor_seal.png',
  'watercolor_shackles.png',
  'watercolor_staff.png',
  'watercolor_flask.png',
  'watercolor_scroll.png',
  'watercolor_crystal.png',
  'watercolor_shield.png',
  'watercolor_quill.png',
  'watercolor_d20.png',
  'watercolor_scales.png'
];

async function check(filename) {
  const imagesDir = path.join(__dirname, '..', 'vtt-react', 'public', 'assets', 'images');
  const fullPath = path.join(imagesDir, filename);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`${filename}: FILE NOT FOUND`);
    return;
  }

  try {
    const image = await Jimp.Jimp.read(fullPath);
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    let transparent = 0;
    let opaque = 0;
    let semi = 0;
    
    let cornerOpaqueCount = 0;
    for (let x = 0; x < 15; x++) {
      for (let y = 0; y < 15; y++) {
        const idx = (y * w + x) * 4;
        const a = image.bitmap.data[idx+3];
        if (a > 10) {
          cornerOpaqueCount++;
        }
      }
    }

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const idx = (y * w + x) * 4;
        const a = image.bitmap.data[idx+3];
        if (a === 0) transparent++;
        else if (a === 255) opaque++;
        else semi++;
      }
    }
    
    const total = w * h;
    const cornerOpaquePct = (cornerOpaqueCount / 225) * 100;
    console.log(`${filename}: corner opaque count = ${cornerOpaqueCount}/225 (${cornerOpaquePct.toFixed(1)}%), transparent = ${((transparent/total)*100).toFixed(1)}%`);
  } catch (e) {
    console.error(`Error checking ${filename}:`, e.message);
  }
}

async function main() {
  for (const f of targetImages) {
    await check(f);
  }
}

main();
