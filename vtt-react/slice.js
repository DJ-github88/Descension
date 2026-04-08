const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function slice() {
    try {
        const imagePath = 'D:/VTT/Images/Editor/Tiles/WaterTiles.png';
        const outDir = 'd:/VTT/vtt-react/public/assets/tiles';
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        
        console.log('Loading image:', imagePath);
        const image = await Jimp.read(imagePath);
        const w = image.bitmap.width;
        const h = image.bitmap.height;
        console.log(`Original Dimensions: ${w}x${h}`);
        
        const tileW = Math.floor(w / 4);
        const tileH = Math.floor(h / 2);
        console.log(`Tile Dimensions: ${tileW}x${tileH}`);
        
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 4; c++) {
                const idx = r * 4 + c + 1;
                console.log(`Slicing Tile ${idx} at (${c * tileW}, ${r * tileH})`);
                const tile = image.clone().crop(c * tileW, r * tileH, tileW, tileH);
                await tile.writeAsync(path.join(outDir, `Water${idx}.png`));
            }
        }
        console.log('Done.');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

slice();
