const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

// A simple queue for flood fill
class Queue {
    constructor() { this.items = []; this.head = 0; }
    enqueue(item) { this.items.push(item); }
    dequeue() { const item = this.items[this.head]; this.head++; if(this.head > 10000) { this.items = this.items.slice(this.head); this.head = 0; } return item; }
    isEmpty() { return this.head >= this.items.length; }
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt(Math.pow(r1-r2, 2) + Math.pow(g1-g2, 2) + Math.pow(b1-b2, 2));
}

async function processImage(imagePath) {
    try {
        const image = await Jimp.read(imagePath);
        const w = image.bitmap.width;
        const h = image.bitmap.height;
        
        // We will sample the 4 corners to find the background color.
        // Usually, the top-left pixel is a good representation of the solid background.
        const idx0 = 0;
        const bgR = image.bitmap.data[idx0];
        const bgG = image.bitmap.data[idx0 + 1];
        const bgB = image.bitmap.data[idx0 + 2];
        
        // If the corner is already transparent, maybe it's already processed
        if (image.bitmap.data[idx0 + 3] === 0) {
            console.log(`Skipped (already transparent corner): ${imagePath}`);
            return;
        }

        // We use a flood-fill approach starting from the edges to make the background transparent.
        // This avoids making inner parts of the parchment transparent if they happen to be the same color.
        
        const visited = new Uint8Array(w * h);
        const q = new Queue();
        
        // Add all border pixels to the queue if they match the bg color
        const tolerance = 25; // Tolerance for background color variation
        
        for (let x = 0; x < w; x++) {
            checkAndEnqueue(x, 0);
            checkAndEnqueue(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
            checkAndEnqueue(0, y);
            checkAndEnqueue(w - 1, y);
        }
        
        function checkAndEnqueue(x, y) {
            const i = y * w + x;
            if (visited[i]) return;
            const ptr = i * 4;
            const r = image.bitmap.data[ptr];
            const g = image.bitmap.data[ptr + 1];
            const b = image.bitmap.data[ptr + 2];
            
            // If it's pure white, or close to the sampled corner background
            if ((r > 240 && g > 240 && b > 240) || colorDistance(r, g, b, bgR, bgG, bgB) < tolerance) {
                visited[i] = 1;
                q.enqueue({x, y});
                image.bitmap.data[ptr + 3] = 0; // Make transparent
            }
        }
        
        while (!q.isEmpty()) {
            const {x, y} = q.dequeue();
            
            if (x > 0) checkAndEnqueue(x - 1, y);
            if (x < w - 1) checkAndEnqueue(x + 1, y);
            if (y > 0) checkAndEnqueue(x, y - 1);
            if (y < h - 1) checkAndEnqueue(x, y + 1);
        }
        
        await image.write(imagePath);
        console.log(`Processed: ${imagePath}`);
    } catch (err) {
        console.error(`Error processing ${imagePath}:`, err);
    }
}

async function main() {
    const dir = path.join(__dirname, 'public', 'assets', 'icons', 'classes');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') && !f.includes('_old'));
    
    console.log(`Found ${files.length} class icons to process.`);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        await processImage(fullPath);
    }
}

main();
