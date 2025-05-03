import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the mapping of old filenames to new SEO-friendly filenames
const imageMapping = [
  { old: 'IMG-20250317-WA0002.jpg', new: 'pinky-paul-mondal-education-workshop-kolkata.jpg' },
  { old: 'IMG-20250317-WA0005.jpg', new: 'pinky-paul-mondal-scholarship-ceremony-bengaluru.jpg' },
  { old: 'IMG-20250317-WA0016.jpg', new: 'pinky-paul-mondal-mentoring-engineering-students.jpg' },
  { old: 'IMG-20250317-WA0019.jpg', new: 'pinky-paul-mondal-medical-education-support-program.jpg' },
  { old: 'IMG-20250317-WA0092.jpg', new: 'pinky-paul-mondal-backward-class-education-jharkhand.jpg' },
  { old: 'IMG-20250317-WA0094.jpg', new: 'pinky-paul-mondal-social-entrepreneurship-conference.jpg' },
  { old: 'IMG-20250317-WA0098.jpg', new: 'pinky-paul-mondal-education-activist-calcutta.jpg' },
  { old: 'IMG-20250317-WA0100.jpg', new: 'pinky-paul-mondal-scholarship-distribution-bangalore.jpg' },
  { old: 'IMG-20250320-WA0002.jpg', new: 'pinky-paul-mondal-rural-education-initiative.jpg' },
  { old: 'IMG-20250320-WA0004.jpg', new: 'pinky-paul-mondal-stem-education-workshop.jpg' },
  { old: 'IMG-20250320-WA0005.jpg', new: 'pinky-paul-mondal-education-technology-seminar.jpg' },
  { old: 'IMG-20250320-WA0006.jpg', new: 'pinky-paul-mondal-community-outreach-program.jpg' },
  { old: 'IMG-20250320-WA0007.jpg', new: 'pinky-paul-mondal-education-policy-discussion.jpg' },
  { old: 'IMG-20250320-WA0008.jpg', new: 'pinky-paul-mondal-student-mentorship-program.jpg' },
  { old: 'IMG-20250320-WA0009.jpg', new: 'pinky-paul-mondal-educational-resource-distribution.jpg' },
  { old: 'IMG-20250324-WA0001.jpg', new: 'pinky-paul-mondal-career-guidance-workshop.jpg' },
  { old: 'IMG-20250403-WA0001.jpg', new: 'pinky-paul-mondal-education-conference-speaker.jpg' },
  { old: 'IMG-20250403-WA0002.jpg', new: 'pinky-paul-mondal-underprivileged-student-support.jpg' },
  { old: 'IMG-20250403-WA0003.jpg', new: 'pinky-paul-mondal-education-ngo-collaboration.jpg' },
  { old: 'IMG-20250403-WA0004.jpg', new: 'pinky-paul-mondal-digital-literacy-program.jpg' },
  { old: 'IMG-20250403-WA0005.jpg', new: 'pinky-paul-mondal-education-fundraising-event.jpg' },
  { old: 'IMG-20250403-WA0006.jpg', new: 'pinky-paul-mondal-teacher-training-workshop.jpg' },
  { old: 'IMG-20250403-WA0007.jpg', new: 'pinky-paul-mondal-educational-material-development.jpg' },
  { old: 'IMG-20250403-WA0008.jpg', new: 'pinky-paul-mondal-scholarship-selection-committee.jpg' },
  { old: 'IMG-20250403-WA0009.jpg', new: 'pinky-paul-mondal-education-award-recipient.jpg' },
  { old: 'IMG-20250403-WA0010.jpg', new: 'pinky-paul-mondal-educational-leadership-summit.jpg' },
  { old: 'IMG-20250403-WA0011.jpg', new: 'pinky-paul-mondal-education-innovation-showcase.jpg' }
];

// Directory where the images are located
const galleryDir = path.join(__dirname, 'public', 'images', 'gallery');

// Function to rename the files
async function renameFiles() {
  console.log('Starting image renaming process...');

  // Create a backup directory
  const backupDir = path.join(galleryDir, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
    console.log('Created backup directory');
  }

  // Copy original files to backup
  for (const mapping of imageMapping) {
    const oldPath = path.join(galleryDir, mapping.old);
    const backupPath = path.join(backupDir, mapping.old);

    if (fs.existsSync(oldPath)) {
      fs.copyFileSync(oldPath, backupPath);
      console.log(`Backed up ${mapping.old}`);
    } else {
      console.log(`Warning: Original file ${mapping.old} not found`);
    }
  }

  // Rename files
  for (const mapping of imageMapping) {
    const oldPath = path.join(galleryDir, mapping.old);
    const newPath = path.join(galleryDir, mapping.new);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${mapping.old} to ${mapping.new}`);
    } else {
      console.log(`Warning: Original file ${mapping.old} not found for renaming`);
    }
  }

  console.log('Image renaming completed!');
}

// Execute the renaming function
renameFiles().catch(err => {
  console.error('Error during renaming:', err);
});
