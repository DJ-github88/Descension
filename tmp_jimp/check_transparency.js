const Jimp = require('jimp');
const path = require('path');

async function check(filename) {
  const imagesDir = path.join(__dirname, '..', 'vtt-react', 'public', 'assets', 'images');
  const fullPath = path.join(imagesDir, filename);
  
  try {
    const image = await Jimp.Jimp.read(fullPath);
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    let transparent = 0;
    let opaque = 0;
    let semi = 0;
    
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const idx = (y * w + x) * 4;
        const a = image.bitmap.data[idx+3];
        if (a === 0) transparent++;
        else if (a === 255) opaque++;
        else semi++;
      }
    }
    
    console.log(`\n=== Transparency of ${filename} ===`);
    console.log(`Total pixels: ${w * h}`);
    console.log(`Fully transparent: ${transparent} (${((transparent/(w*h))*100).toFixed(1)}%)`);
    console.log(`Fully opaque: ${opaque} (${((opaque/(w*h))*100).toFixed(1)}%)`);
    console.log(`Semi-transparent: ${semi} (${((semi/(w*h))*100).toFixed(1)}%)`);
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  await check('watercolor_tome.png');
  await check('watercolor_dragon.png');
}

main();
