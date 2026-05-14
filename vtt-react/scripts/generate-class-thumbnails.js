/**
 * Generate optimized thumbnails for class icons.
 * 
 * Converts the large PNG class icons (~2MB each) into smaller PNG thumbnails
 * at various sizes for performant loading throughout the app.
 * 
 * Usage: node scripts/generate-class-thumbnails.js
 * 
 * Output sizes:
 *   - 64px   → tiny    (filter buttons, small badges)
 *   - 128px  → small   (card icons, list items)
 *   - 256px  → medium  (hover enlargement, modals)
 *   - 512px  → large   (detail views, full-size display)
 */

const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const ICON_DIR = path.resolve(__dirname, '../public/assets/icons/classes');
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/icons/classes/thumbs');

const SIZES = {
    tiny: 64,
    small: 128,
    medium: 256,
    large: 512
};

async function generateThumbnails() {
    // Create output directories
    for (const sizeName of Object.keys(SIZES)) {
        const dir = path.join(OUTPUT_DIR, sizeName);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    // Get all PNG files (skip _old files and subdirectories)
    const files = fs.readdirSync(ICON_DIR).filter(f => 
        f.endsWith('.png') && 
        !f.includes('_old') && 
        !fs.statSync(path.join(ICON_DIR, f)).isDirectory()
    );

    console.log(`Found ${files.length} class icons to process...`);

    for (const file of files) {
        const srcPath = path.join(ICON_DIR, file);
        const baseName = path.basename(file, '.png');
        
        console.log(`  Processing: ${file}`);

        try {
            const image = await Jimp.read(srcPath);

            for (const [sizeName, size] of Object.entries(SIZES)) {
                // Output as PNG (Jimp supports this natively)
                const outPath = path.join(OUTPUT_DIR, sizeName, `${baseName}.png`);
                
                // Skip if already generated and source hasn't changed
                if (fs.existsSync(outPath)) {
                    const srcStat = fs.statSync(srcPath);
                    const outStat = fs.statSync(outPath);
                    if (outStat.mtime > srcStat.mtime) {
                        continue;
                    }
                }

                const resized = image.clone()
                    .resize({ w: size, h: size });
                
                await resized.write(outPath);
                const outSize = fs.statSync(outPath).size;
                console.log(`    → ${sizeName} (${size}px): ${(outSize / 1024).toFixed(1)}KB`);
            }
        } catch (err) {
            console.error(`  ✗ Error processing ${file}:`, err.message);
        }
    }

    console.log('\n✓ Thumbnail generation complete!');
    
    // Print size comparison
    let totalOriginal = 0;
    let totalThumbs = 0;
    
    for (const file of files) {
        totalOriginal += fs.statSync(path.join(ICON_DIR, file)).size;
    }
    
    for (const sizeName of Object.keys(SIZES)) {
        const dir = path.join(OUTPUT_DIR, sizeName);
        if (fs.existsSync(dir)) {
            for (const f of fs.readdirSync(dir)) {
                totalThumbs += fs.statSync(path.join(dir, f)).size;
            }
        }
    }
    
    console.log(`\nOriginal PNGs: ${(totalOriginal / (1024 * 1024)).toFixed(1)}MB`);
    console.log(`All thumbnails: ${(totalThumbs / (1024 * 1024)).toFixed(1)}MB`);
    console.log(`Savings: ${((1 - totalThumbs / totalOriginal) * 100).toFixed(1)}%`);
}

generateThumbnails().catch(console.error);
