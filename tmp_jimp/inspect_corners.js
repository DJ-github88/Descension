const Jimp = require('jimp');
const path = require('path');

async function inspect(filename) {
  const imagesDir = path.join(__dirname, '..', 'vtt-react', 'public', 'assets', 'images');
  const fullPath = path.join(imagesDir, filename);
  
  try {
    const image = await Jimp.Jimp.read(fullPath);
    console.log(`\n=== Inspecting ${filename} (${image.bitmap.width}x${image.bitmap.height}) ===`);
    
    // Print pixels along the top edge
    for (let x = 0; x < 20; x += 2) {
      const idx = (x) * 4;
      console.log(`x=${x}, y=0: R=${image.bitmap.data[idx]}, G=${image.bitmap.data[idx+1]}, B=${image.bitmap.data[idx+2]}, A=${image.bitmap.data[idx+3]}`);
    }
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  await inspect('watercolor_tome.png');
  await inspect('watercolor_dragon.png');
}

main();
