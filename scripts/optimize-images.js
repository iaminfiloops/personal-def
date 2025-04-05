const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

// Define image sizes for responsive images
const sizes = [300, 600, 900, 1200];

// Define image directories to process
const directories = [
  path.join(__dirname, '../public/images/gallery'),
  path.join(__dirname, '../public/images/blog'),
  path.join(__dirname, '../public/images/portfolio/logos'),
  path.join(__dirname, '../public/images/portfolio/gallery')
];

// Create output directories if they don't exist
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Process all images in the specified directories
async function processImages() {
  console.log('Starting image optimization...');
  
  // Process each directory
  for (const directory of directories) {
    const imageFiles = glob.sync(path.join(directory, '*.{jpg,jpeg,png,webp}'));
    
    console.log(`Processing ${imageFiles.length} images in ${directory}...`);
    
    // Process each image
    for (const imagePath of imageFiles) {
      const filename = path.basename(imagePath);
      const extname = path.extname(filename);
      const basename = path.basename(filename, extname);
      const dirname = path.dirname(imagePath);
      
      console.log(`Optimizing: ${filename}`);
      
      try {
        // Load the image
        const image = sharp(imagePath);
        const metadata = await image.metadata();
        
        // Convert to WebP format (better compression)
        const webpOutputPath = path.join(dirname, `${basename}.webp`);
        await image.webp({ quality: 80 }).toFile(webpOutputPath);
        
        // Generate responsive sizes
        for (const width of sizes) {
          // Skip if the target width is larger than the original
          if (metadata.width && width >= metadata.width) continue;
          
          // Create resized WebP version
          const resizedWebpPath = path.join(dirname, `${basename}-${width}w.webp`);
          await sharp(imagePath)
            .resize(width)
            .webp({ quality: 80 })
            .toFile(resizedWebpPath);
          
          // Create resized original format version
          const resizedOrigPath = path.join(dirname, `${basename}-${width}w${extname}`);
          await sharp(imagePath)
            .resize(width)
            .toFile(resizedOrigPath);
        }
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
      }
    }
  }
  
  console.log('Image optimization complete!');
}

// Run the optimization
processImages().catch(err => {
  console.error('Error during image optimization:', err);
  process.exit(1);
});
