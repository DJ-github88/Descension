const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

async function makeTransparent(filePath) {
    try {
        console.log(`Processing ${filePath}...`);
        const img = await Jimp.read(filePath);
        
        img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            
            // The images might have a pure white background (255, 255, 255)
            // Or near white. Let's target > 240
            if (red > 240 && green > 240 && blue > 240) {
                const brightness = (red + green + blue) / 3;
                if (brightness >= 250) {
                    this.bitmap.data[idx + 3] = 0;
                } else {
                    const opacity = Math.max(0, Math.min(255, ((250 - brightness) / 10) * 255));
                    this.bitmap.data[idx + 3] = opacity;
                }
            }
        });
        
        const outPath = filePath.replace('.png', '_transparent.png');
        await img.write(outPath); // note: write vs writeAsync in some versions
        console.log(`Saved transparent version to ${outPath}`);
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
    }
}

async function processAll() {
    const dir = path.join(__dirname, 'public', 'assets', 'icons', 'classes');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') && !f.includes('_transparent'));
    
    for (const file of files) {
        await makeTransparent(path.join(dir, file));
    }
}

processAll();
