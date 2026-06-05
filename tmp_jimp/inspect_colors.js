const Jimp = require('jimp');
const path = require('path');

async function analyze(filename) {
  const imagesDir = path.join(__dirname, '..', 'vtt-react', 'public', 'assets', 'images');
  const fullPath = path.join(imagesDir, filename);
  
  try {
    const image = await Jimp.Jimp.read(fullPath);
    console.log(`\n=== Analyzing Colors in ${filename} ===`);
    
    // Count color frequencies of edge/corner pixels to find background shades
    const counts = {};
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    // Check border pixels (10 pixels inset to get solid square colors)
    for (let x = 0; x < w; x += 4) {
      for (const y of [0, 5, h - 6, h - 1]) {
        const idx = (y * w + x) * 4;
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx+1];
        const b = image.bitmap.data[idx+2];
        const key = `${r},${g},${b}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    }
    
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    console.log('Most frequent edge colors:');
    sorted.forEach(([color, count]) => {
      console.log(`Color [${color}]: seen ${count} times`);
    });
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  await analyze('watercolor_tome.png');
  await analyze('watercolor_dragon.png');
  await analyze('watercolor_hourglass.png');
}

main();
