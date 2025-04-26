import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate an image sitemap for better SEO
 * This script scans the public/images directory
 * and creates a sitemap specifically for images
 */
async function generateImageSitemap() {
  console.log('Generating image sitemap...');

  try {
    // Start XML content
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://google.com/schemas/sitemap-image/1.1">
`;

    // Define image directories to scan
    const directories = {
      '/gallery': path.join(__dirname, '../public/images/gallery'),
      '/blog': path.join(__dirname, '../public/images/blog'),
      '/': path.join(__dirname, '../public/images')
    };

    // Process each directory
    for (const [urlPath, dirPath] of Object.entries(directories)) {
      if (!fs.existsSync(dirPath)) {
        console.log(`Directory does not exist: ${dirPath}`);
        continue;
      }

      // Find all images in the directory
      console.log(`Looking for images in: ${dirPath}`);
      // Use fs module directly instead of glob
      const imageFiles = [];

      try {
        // Read directory contents
        const files = fs.readdirSync(dirPath);
        console.log(`Directory contents: ${files.join(', ')}`);

        // Filter image files
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        files.forEach(file => {
          const ext = path.extname(file).toLowerCase();
          if (validExtensions.includes(ext)) {
            imageFiles.push(path.join(dirPath, file));
          }
        });
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
      }
      console.log(`Found files: ${imageFiles.length > 0 ? imageFiles.map(f => path.basename(f)).join(', ') : 'none'}`);

      if (imageFiles.length === 0) {
        console.log(`No images found in ${dirPath}`);
        continue;
      }

      console.log(`Found ${imageFiles.length} images in ${dirPath}`);

      // Add URL entry for this path
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>https://ajiteshmondal.com${urlPath}</loc>\n`;

      // Add each image to the sitemap
      for (const imagePath of imageFiles) {
        const filename = path.basename(imagePath);
        const filenameWithoutExt = path.basename(imagePath, path.extname(imagePath));

        // Generate title and caption from filename
        // Convert kebab-case to readable text
        const readableTitle = filenameWithoutExt
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        xmlContent += `    <image:image>\n`;
        xmlContent += `      <image:loc>https://ajiteshmondal.com/images${urlPath === '/' ? '' : urlPath}/${filename}</image:loc>\n`;
        xmlContent += `      <image:title>${escapeXml(readableTitle)}</image:title>\n`;
        xmlContent += `      <image:caption>${escapeXml(readableTitle)}</image:caption>\n`;
        xmlContent += `    </image:image>\n`;
      }

      xmlContent += `  </url>\n`;
    }

    // Add static gallery page
    xmlContent += `  <url>
    <loc>https://ajiteshmondal.com/gallery</loc>
    <image:image>
      <image:loc>https://ajiteshmondal.com/images/gallery/ajitesh-mondal-education-workshop-kolkata.jpg</image:loc>
      <image:title>Ajitesh Mondal conducting education workshop in Kolkata</image:title>
      <image:caption>Ajitesh Mondal leading an educational workshop for underprivileged students in Kolkata</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://ajiteshmondal.com/images/gallery/ajitesh-mondal-scholarship-ceremony-bengaluru.jpg</image:loc>
      <image:title>Ajitesh Mondal at scholarship award ceremony in Bengaluru</image:title>
      <image:caption>Scholarship distribution ceremony organized by Ajitesh Mondal for backward class students in Bengaluru</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://ajiteshmondal.com/images/gallery/ajitesh-mondal-mentoring-engineering-students.jpg</image:loc>
      <image:title>Ajitesh Mondal mentoring engineering students</image:title>
      <image:caption>Ajitesh Mondal providing mentorship to aspiring engineering students from underprivileged backgrounds</image:caption>
    </image:image>
  </url>
`;

    // Close XML
    xmlContent += `</urlset>`;

    // Write to file
    const outputPath = path.join(__dirname, '../public/image-sitemap.xml');
    fs.writeFileSync(outputPath, xmlContent);

    console.log(`Image sitemap generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating image sitemap:', error);
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Run the generator
generateImageSitemap().catch(console.error);
