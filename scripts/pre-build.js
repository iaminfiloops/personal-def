import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Pre-build script to run before deployment
 * - Optimizes images
 * - Generates image sitemap
 */
async function preBuild() {
  console.log('Running pre-build tasks...');

  try {
    // Ensure image directories exist
    const imageDirectories = [
      path.join(__dirname, '../public/images'),
      path.join(__dirname, '../public/images/gallery'),
      path.join(__dirname, '../public/images/blog')
    ];

    for (const dir of imageDirectories) {
      if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Run image optimization
    console.log('Optimizing images...');
    try {
      const { stdout: optimizeOutput } = await execAsync('npm run optimize-images');
      console.log(optimizeOutput);
    } catch (error) {
      console.warn('Warning: Image optimization failed, but continuing build process:', error.message);
    }

    // Run blog image optimization
    console.log('Optimizing blog images...');
    try {
      const { stdout: blogOptimizeOutput } = await execAsync('npm run optimize-blog-images');
      console.log(blogOptimizeOutput);
    } catch (error) {
      console.warn('Warning: Blog image optimization failed, but continuing build process:', error.message);
    }

    // Generate image sitemap
    console.log('Generating image sitemap...');
    try {
      const { stdout: sitemapOutput } = await execAsync('npm run generate-image-sitemap');
      console.log(sitemapOutput);
    } catch (error) {
      console.warn('Warning: Image sitemap generation failed, but continuing build process:', error.message);
    }

    console.log('Pre-build tasks completed successfully!');
  } catch (error) {
    console.error('Error during pre-build tasks:', error);
    // Don't exit with error code to allow build to continue
    // process.exit(1);
  }
}

// Run the pre-build script
preBuild().catch(console.error);
