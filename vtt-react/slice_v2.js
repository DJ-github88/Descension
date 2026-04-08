const Jimp = require('jimp');
const fs = require('fs');

async function findAndSlice() {
    try {
        const image = await Jimp.read('D:/VTT/Images/Editor/Tiles/WaterTiles.png');
        const w = image.bitmap.width;
        const h = image.bitmap.height;
        console.log(`Dimensions: ${w}x${h}`);

        // Define our search regions to avoid labels
        // Top row is roughly at y=50 to y=350?
        // Let's scan for the first non-background pixel in the middle of where tiles should be
        
        const isBg = (x, y) => {
            const c = Jimp.intToRGBA(image.getPixelColor(x, y));
            // Background is dark, tiles are blue
            return (c.r < 40 && c.g < 40 && c.b < 40) || (c.r === c.g && c.g === c.b && c.r > 200); // Also avoid white labels
        };

        // We know there are 4 columns and 2 rows.
        // Let's find the first tile in the top group.
        // It should be around x=50, y=50?
        
        function getTileRect(startX, startY) {
            let x1 = startX, y1 = startY;
            // Move until we hit a tile pixel
            while (x1 < w && isBg(x1, y1)) x1++;
            if (x1 >= w) return null;
            while (y1 < h && isBg(x1, y1)) y1++;
            if (y1 >= h) return null;
            
            // Now x1, y1 is the top-left of a tile
            let x2 = x1, y2 = y1;
            while (x2 < w && !isBg(x2, y1)) x2++;
            while (y2 < h && !isBg(x1, y2)) y2++;
            
            return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
        }

        // Manual offsets based on typical sheet layouts and screenshot
        // Top row starts after labels
        const tiles = [];
        
        // Let's just use jimp to save a 4x4 grid of where it thinks the tiles are
        // Based on the 1376x768 image:
        // Columns: ~250px each. Gutters: ~30px.
        // Row 1: y=~50
        // Row 2: y=~400
        
        // Actually, let's just scan for the 8 largest blocks.
        const outDir = 'd:/VTT/vtt-react/public/assets/tiles';
        
        // I will use FIXED COORDINATES derived from common sprite sheets of this type
        // if it's 1376x768.
        // 4 columns: 1376 / 5 segments = ~275?
        // Padding is usually around 50px.
        
        // Let's try to detect the boundaries
        let colStarts = [];
        for (let x = 0; x < w; x++) {
            let hasTile = false;
            for (let y = 100; y < 300; y++) { if (!isBg(x, y)) { hasTile = true; break; } }
            if (hasTile && (colStarts.length === 0 || x > colStarts[colStarts.length-1] + 100)) colStarts.push(x);
        }
        
        let rowStarts = [];
        for (let y = 0; y < h; y++) {
            let hasTile = false;
            for (let x = colStarts[0]; x < colStarts[0] + 100; x++) { if (!isBg(x, y)) { hasTile = true; break; } }
            if (hasTile && (rowStarts.length === 0 || y > rowStarts[rowStarts.length-1] + 100)) rowStarts.push(y);
        }
        
        console.log('Columns found at:', colStarts);
        console.log('Rows found at:', rowStarts);

        for (let r = 0; r < rowStarts.length; r++) {
            for (let c = 0; c < colStarts.length; c++) {
                const idx = r * 4 + c + 1;
                if (idx > 8) break;
                
                let x = colStarts[c];
                let y = rowStarts[r];
                
                // Find tile size
                let tw = 0; while (x + tw < w && !isBg(x + tw, y + 10)) tw++;
                let th = 0; while (y + th < h && !isBg(x + 10, y + th)) th++;
                
                console.log(`Saving Water${idx}: ${x},${y} ${tw}x${th}`);
                const tile = image.clone().crop(x, y, tw, th);
                await tile.writeAsync(`${outDir}/Water${idx}.png`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}
findAndSlice();
