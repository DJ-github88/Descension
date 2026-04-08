const Jimp = require('jimp');

async function solve() {
    try {
        console.log('Loading Jimp...');
        // Jimp v1.0.0+ requires Jimp.read or Jimp.Jimp.read
        const read = (Jimp.read || (Jimp.Jimp && Jimp.Jimp.read));
        if (!read) { 
          console.error('Jimp.read not found. Available:', Object.keys(Jimp));
          process.exit(1);
        }
        
        const image = await read('D:/VTT/Images/Editor/Tiles/WaterTiles.png');
        const w = image.bitmap.width;
        const h = image.bitmap.height;
        const outDir = 'd:/VTT/vtt-react/public/assets/tiles';

        console.log(`Original: ${w}x${h}`);

        const isWater = (x, y) => {
            const hex = image.getPixelColor(x, y);
            const c = {
              r: (hex >> 24) & 0xFF,
              g: (hex >> 16) & 0xFF,
              b: (hex >> 8) & 0xFF
            };
            return (c.b > c.r * 1.2 || c.g > c.r * 1.2) && (c.r + c.g + c.b > 50) && (c.r < 100);
        };

        const cellW = Math.floor(w / 4);
        const cellH = Math.floor(h / 2);

        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 4; c++) {
                const centerX = c * cellW + Math.floor(cellW / 2);
                const centerY = r * cellH + Math.floor(cellH / 2);
                
                let coreX = -1, coreY = -1;
                for (let dx = -100; dx < 100 && coreX === -1; dx += 5) {
                    for (let dy = -100; dy < 100; dy += 5) {
                        try {
                          if (isWater(centerX + dx, centerY + dy)) {
                              coreX = centerX + dx;
                              coreY = centerY + dy;
                              break;
                          }
                        } catch(e) {}
                    }
                }

                if (coreX !== -1) {
                    let x1 = coreX, x2 = coreX, y1 = coreY, y2 = coreY;
                    while (x1 > c * cellW && isWater(x1 - 1, coreY)) x1--;
                    while (x2 < (c + 1) * cellW && isWater(x2 + 1, coreY)) x2++;
                    while (y1 > r * cellH && isWater(coreX, y1 - 1)) y1--;
                    while (y2 < (r + 1) * cellH && isWater(coreX, y2 + 1)) y2++;
                    
                    const tw = x2 - x1;
                    const th = y2 - y1;
                    
                    if (tw > 50 && th > 50) {
                        const idx = r * 4 + c + 1;
                        console.log(`Saving Tile ${idx}: ${x1},${y1} ${tw}x${th}`);
                        const tile = image.clone().crop(x1, y1, tw, th);
                        await tile.writeAsync(`${outDir}/Water${idx}.png`);
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

solve();
