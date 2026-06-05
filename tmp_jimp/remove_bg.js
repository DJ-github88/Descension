const Jimp = require('jimp');

async function removeBackground(inputPath, outputPath) {
  try {
    console.log('Loading Jimp...');
    const image = await Jimp.Jimp.read(inputPath);
    console.log(`Processing image ${image.bitmap.width}x${image.bitmap.height}...`);
    
    // Scan all pixels and knock out white background
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      
      // High threshold for solid white
      if (r > 248 && g > 248 && b > 248) {
        this.bitmap.data[idx + 3] = 0; // Fully transparent
      } 
      // Fade out off-white colors to prevent harsh halos
      else if (r > 230 && g > 230 && b > 230) {
        const factor = (255 - brightness) / (255 - 230); // 0 to 1
        this.bitmap.data[idx + 3] = Math.round(factor * 255);
      }
    });
    
    console.log('Saving processed transparent PNG...');
    const write = image.writeAsync ? image.writeAsync.bind(image) : image.write.bind(image);
    await write(outputPath);
    console.log(`Successfully removed background! Output saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error in background removal:', error);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node remove_bg.js <input_path> <output_path>');
  process.exit(1);
}

removeBackground(args[0], args[1]);
