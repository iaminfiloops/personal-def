import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define image sizes for responsive images
const sizes = [300, 600, 900, 1200];

/**
 * Optimize blog images in the public directory
 * This script processes all images in the blog directory
 * and creates optimized and responsive versions
 */
async function optimizeBlogImages() {
  console.log('Starting blog image optimization...');

  try {
    // Define image directories to process
    const directories = [
      path.join(__dirname, '../public/images/blog'),
      path.join(__dirname, '../public/images/gallery')
    ];

    // Create output directories if they don't exist
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });

    // Process each directory
    for (const directory of directories) {
      // Use fs module directly instead of glob
      const imageFiles = [];

      try {
        // Read directory contents
        const files = fs.readdirSync(directory);
        console.log(`Directory contents: ${files.join(', ')}`);

        // Filter image files
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        files.forEach(file => {
          const ext = path.extname(file).toLowerCase();
          if (validExtensions.includes(ext)) {
            imageFiles.push(path.join(directory, file));
          }
        });
      } catch (error) {
        console.error(`Error reading directory ${directory}:`, error);
      }
      console.log(`Looking for images in: ${directory}`);
      console.log(`Found files: ${imageFiles.length > 0 ? imageFiles.join(', ') : 'none'}`);

      console.log(`Processing ${imageFiles.length} images in ${directory}...`);

      // Process each image
      for (const imagePath of imageFiles) {
        await optimizeImage(imagePath);
      }
    }

    console.log('Blog image optimization complete!');
  } catch (error) {
    console.error('Error optimizing blog images:', error);
  }
}

/**
 * Optimize a single image
 * @param {string} imagePath - Path to the image file
 */
async function optimizeImage(imagePath) {
  try {
    const filename = path.basename(imagePath);
    const extname = path.extname(filename);
    const basename = path.basename(filename, extname);
    const dirname = path.dirname(imagePath);

    console.log(`Optimizing: ${filename}`);

    // Load the image
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Skip if image is already small
    if (metadata.width <= 300 && metadata.size <= 100 * 1024) {
      console.log(`Image already optimized: ${filename}`);
      return;
    }

    // Convert to WebP format (better compression)
    const webpOutputPath = path.join(dirname, `${basename}.webp`);
    await image.webp({ quality: 80 }).toFile(webpOutputPath);
    console.log(`Created WebP version: ${basename}.webp`);

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

      console.log(`Created responsive version: ${width}px`);
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

// Run the optimization
optimizeBlogImages().catch(console.error);
