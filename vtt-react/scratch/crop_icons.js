const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

async function processIcons() {
    const files = ['chronarch.png', 'deathcaller.png'];
    const dir = 'd:/VTT/vtt-react/public/assets/icons/classes/';

    for (const file of files) {
        const filePath = path.join(dir, file);
        console.log(`Processing ${file}...`);
        
        try {
            const image = await Jimp.read(filePath);
            
            // Autocrop based on white background
            // We can also just crop a fixed amount if autocrop is tricky
            // But let's try autocrop first
            image.autocrop();
            
            await image.write(filePath);
            console.log(`Successfully cropped ${file}`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
}

processIcons();
