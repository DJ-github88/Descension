const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function cleanGlobalCheckerboard(imagePath, filename) {
  try {
    console.log(`\n=== Globally Scanning & Erasing Background via Saturation for ${filename} ===`);
    const image = await Jimp.Jimp.read(imagePath);
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    let transparentCount = 0;
    
    // Saturation thresholding: if max(R,G,B) - min(R,G,B) is low, it's a grey/white background pixel.
    const isTargetBackground = (r, g, b, a) => {
      if (a < 15) return true;
      
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const saturation = maxVal - minVal;
      
      // Background grid lines and squares are all neutral greys/whites (saturation < 25)
      return saturation < 30;
    };
    
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const idx = (y * w + x) * 4;
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx+1];
        const b = image.bitmap.data[idx+2];
        const a = image.bitmap.data[idx+3];
        
        if (isTargetBackground(r, g, b, a)) {
          image.bitmap.data[idx+3] = 0; // Set alpha to 0 (fully transparent)
          transparentCount++;
        }
      }
    }
    
    console.log(`Global Saturation Scan: Knocked out ${transparentCount} background pixels.`);
    
    // Save processed file
    const write = image.writeAsync ? image.writeAsync.bind(image) : image.write.bind(image);
    await write(imagePath);
    console.log(`Successfully globally cleaned & saved: ${imagePath}`);
  } catch (error) {
    console.error(`Failed global background cleanup for ${filename}:`, error);
  }
}

async function cleanCheckerboard(imagePath, filename) {
  try {
    console.log(`Loading image: ${imagePath}`);
    const image = await Jimp.Jimp.read(imagePath);
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    console.log(`Image loaded: ${w}x${h}`);
    
    // Read the corner pixel (0,0) as the seed for background color
    const seedR = image.bitmap.data[0];
    const seedG = image.bitmap.data[1];
    const seedB = image.bitmap.data[2];
    const seedA = image.bitmap.data[3];
    console.log(`Background Seed color at (0,0): R=${seedR}, G=${seedG}, B=${seedB}, A=${seedA}`);
    
    const visited = new Uint8Array(w * h);
    const queue = [];
    
    // Seed queue with all edge pixels to perform flood fill from outside
    for (let x = 0; x < w; x++) {
      queue.push([x, 0]);
      queue.push([x, h - 1]);
      visited[x] = 1;
      visited[x + (h - 1) * w] = 1;
    }
    for (let y = 1; y < h - 1; y++) {
      queue.push([0, y]);
      queue.push([w - 1, y]);
      visited[y * w] = 1;
      visited[(w - 1) + y * w] = 1;
    }
    
    const getPixel = (x, y) => {
      const idx = (y * w + x) * 4;
      return {
        r: image.bitmap.data[idx],
        g: image.bitmap.data[idx + 1],
        b: image.bitmap.data[idx + 2],
        a: image.bitmap.data[idx + 3],
        idx
      };
    };
    
    const isBackgroundPixel = (p) => {
      if (p.a < 15) return true;
      
      // Match seed color within a tolerance of 40
      const dist = Math.sqrt(
        Math.pow(p.r - seedR, 2) +
        Math.pow(p.g - seedG, 2) +
        Math.pow(p.b - seedB, 2)
      );
      if (dist < 40) return true;
      
      // Fallback: Checkerboards are composed of white and grey squares
      const isWhite = p.r > 200 && p.g > 200 && p.b > 200;
      const diff1 = Math.abs(p.r - p.g);
      const diff2 = Math.abs(p.g - p.b);
      const diff3 = Math.abs(p.r - p.b);
      const isGrey = diff1 < 12 && diff2 < 12 && diff3 < 12 && p.r > 120;
      
      return isWhite || isGrey;
    };
    
    let head = 0;
    let transparentCount = 0;
    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      const cp = getPixel(cx, cy);
      
      if (isBackgroundPixel(cp)) {
        // Knock out the pixel (make fully transparent)
        if (image.bitmap.data[cp.idx + 3] !== 0) {
          image.bitmap.data[cp.idx + 3] = 0;
          transparentCount++;
        }
        
        // 4-connected neighbors
        const neighbors = [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1]
        ];
        
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const vIdx = ny * w + nx;
            if (!visited[vIdx]) {
              visited[vIdx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
    
    console.log(`Knocked out ${transparentCount} background pixels.`);
    
    // Save processed file
    const write = image.writeAsync ? image.writeAsync.bind(image) : image.write.bind(image);
    await write(imagePath);
    console.log(`Successfully saved: ${imagePath}\n`);
  } catch (error) {
    console.error(`Failed to clean background for ${imagePath}:`, error);
  }
}

const targetImages = [
  'watercolor_tome.png',
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
  'watercolor_compass.png'
];

async function main() {
  const imagesDir = path.join(__dirname, '..', 'vtt-react', 'public', 'assets', 'images');
  console.log(`Target images directory: ${imagesDir}`);
  
  for (const filename of targetImages) {
    const fullPath = path.join(imagesDir, filename);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File does not exist: ${fullPath}`);
      continue;
    }
    
    // Use the highly precise saturation sweep for these problematic images
    if (filename === 'watercolor_tome.png' || filename === 'watercolor_dragon.png' || filename === 'watercolor_hourglass.png') {
      await cleanGlobalCheckerboard(fullPath, filename);
    } else {
      await cleanCheckerboard(fullPath, filename);
    }
  }
  console.log('All target images cleaned!');
}

main();
