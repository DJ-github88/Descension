const { Jimp } = require('jimp');
const path = require('path');

async function cleanIcons() {
    const icons = [
        'covenbane.png',
        'dreadnaught.png',
        'fate_weaver.png',
        'formbender.png',
        'exorcist.png',
        'false_prophet.png'
    ];
    
    const dir = 'd:/VTT/vtt-react/public/assets/icons/classes/';

    for (const icon of icons) {
        const filePath = path.join(dir, icon);
        
        try {
            const image = await Jimp.read(filePath);
            
            // Very subtle normalization and contrast boost
            image.normalize();
            image.contrast(0.15); 
            
            await image.write(filePath);
            console.log(`Successfully subtle-cleaned ${icon}`);
        } catch (err) {
            console.error(`Error subtle-cleaning ${icon}:`, err);
        }
    }
}

cleanIcons();
