const Jimp = require('jimp');
const fs = require('fs');

async function solve() {
    try {
        const image = await Jimp.read('D:/VTT/Images/Editor/Tiles/WaterTiles.png');
        const w = image.bitmap.width;
        const h = image.bitmap.height;
        const outDir = 'd:/VTT/vtt-react/public/assets/tiles';

        console.log(`Original: ${w}x${h}`);

        // Helper to check if a pixel is likely a water tile pixel
        function isWater(x, y) {
            const c = Jimp.intToRGBA(image.getPixelColor(x, y));
            // Water is blue/teal (r < g/b, and not black/grey)
            return (c.b > c.r * 1.2 || c.g > c.r * 1.2) && (c.r + c.g + c.b > 50);
        }

        const regions = [];
        const cellW = Math.floor(w / 4);
        const cellH = Math.floor(h / 2);

        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 4; c++) {
                // Search for water core in this cell
                const centerX = c * cellW + Math.floor(cellW / 2);
                const centerY = r * cellH + Math.floor(cellH / 2);
                
                // Find a water pixel nearby
                let coreX = -1, coreY = -1;
                for (let dx = -100; dx < 100 && coreX === -1; dx += 5) {
                    for (let dy = -100; dy < 100; dy += 5) {
                        if (isWater(centerX + dx, centerY + dy)) {
                            coreX = centerX + dx;
                            coreY = centerY + dy;
                            break;
                        }
                    }
                }

                if (coreX !== -1) {
                    // Expand core to find bounding box of THIS tile
                    let x1 = coreX, x2 = coreX, y1 = coreY, y2 = coreY;
                    
                    // Crude expansion
                    while (x1 > c * cellW && isWater(x1 - 1, coreY)) x1--;
                    while (x2 < (c + 1) * cellW && isWater(x2 + 1, coreY)) x2++;
                    while (y1 > r * cellH && isWater(coreX, y1 - 1)) y1--;
                    while (y2 < (r + 1) * cellH && isWater(coreX, y2 + 1)) y2++;
                    
                    // Final tight crop
                    const tw = x2 - x1;
                    const th = y2 - y1;
                    
                    // Ensure it's a reasonable size
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
