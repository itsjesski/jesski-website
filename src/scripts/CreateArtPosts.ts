/* eslint-disable no-console */

/**
 * This script creates art post markdown files from images in subdirectories of art/learning.
 * Uses file creation date as the post date when possible.
 */

import { writeFile } from 'fs/promises';
import { stringify } from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const BASE_IMAGE_DIR = './public/assets/images/art/learning';
const ART_POSTS_DIR = './_content/_art';

/**
 * Converts a filename to a human-readable title
 * Handles "Day-33" and "Day-33-2" formats
 */
function convertToTitle(filename: string): string {
  // Remove -f suffix if present (for featured images)
  const cleanFilename = filename.replace(/-f$/g, '');

  // Check if this matches the "Day-Number" or "Day-Number-Number" pattern
  const dayPattern = /^Day-(\d+)(?:-(\d+))?$/i;
  const match = cleanFilename.match(dayPattern);

  if (match) {
    const dayNumber = match[1];
    const secondNumber = match[2];

    if (secondNumber) {
      // Format is "Day-33-2"
      return `Day ${dayNumber} (#${secondNumber})`;
    }

    // Format is "Day-33"
    return `Day ${dayNumber}`;
  }

  // Fall back to standard formatting for other filenames
  return cleanFilename
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Converts a filename to a URL-friendly slug
 * Handles "Day-33" and "Day-33-2" formats
 */
function convertToSlug(filename: string): string {
  // Remove -f suffix if present
  const cleanFilename = filename.replace(/-f$/g, '');

  // Check if this matches the "Day-Number" or "Day-Number-Number" pattern
  const dayPattern = /^Day-(\d+)(?:-(\d+))?$/i;
  const match = cleanFilename.match(dayPattern);

  if (match) {
    const dayNumber = match[1];
    const secondNumber = match[2];

    if (secondNumber) {
      // For "Day-33-2" format, slug should be "day33-2"
      return `day${dayNumber}-${secondNumber}`;
    }

    // For "Day-33" format, slug should be "day33"
    return `day${dayNumber}`;
  }

  // Fall back to a default slug if no match is found
  return cleanFilename.toLowerCase().replace(/[^\w]+/g, '-');
}

/**
 * Formats a date into YYYY-MM-DD format
 */
function formatDate(date: Date): string {
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  const year = date.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

/**
 * Gets file creation date or falls back to current date
 */
function getFileDate(filePath: string): string {
  try {
    // Get file stats
    const stats = fs.statSync(filePath);

    // Use birthtime (creation date) if available, otherwise modification date
    const fileDate = stats.birthtime || stats.mtime;
    return formatDate(fileDate);
  } catch (error) {
    console.warn(`Could not get date for ${filePath}, using current date`);
    return formatDate(new Date());
  }
}

/**
 * Recursively find all image files in directory and subdirectories
 */
function findAllImageFiles(dir: string): string[] {
  let results: string[] = [];

  // List contents of directory
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach((item) => {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(findAllImageFiles(itemPath));
    } else {
      // Check if this is an image file
      const ext = path.extname(item.name).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

      if (imageExts.includes(ext)) {
        results.push(itemPath);
      }
    }
  });

  return results;
}

/**
 * Process a single image file and create a markdown post
 */
async function processImageFile(imagePath: string): Promise<void> {
  try {
    const filename = path.basename(imagePath);
    const filenameWithoutExt = path.basename(filename, path.extname(filename));

    // Clean the filename by removing -f (for featured images)
    const cleanFilename = filenameWithoutExt.replace(/-f$/g, '');

    const title = convertToTitle(cleanFilename);
    const slug = convertToSlug(cleanFilename);
    const postPath = `${ART_POSTS_DIR}/${slug}.md`;

    // Skip if post already exists
    if (fs.existsSync(postPath)) {
      return;
    }

    // Get file date
    const fileDate = getFileDate(imagePath);

    // First get the relative path - fixing the public path removal
    const relativePath = imagePath
      .replace(/^\.\/public/, '') // Remove ./public prefix
      .replace(/^public/, '') // Remove public prefix without ./
      .replace(/\\/g, '/'); // Replace backslashes with forward slashes

    // Make sure we don't have "/public/" in the middle of the path either
    const cleanPath = relativePath.replace(/\/public\//g, '/');

    // Handle spaces in image paths by encoding URL components
    const pathSegments = cleanPath.split('/').map((segment) =>
      // Encode each path segment, but preserve forward slashes
      encodeURIComponent(segment)
    );
    const encodedPath = pathSegments.join('/');

    // Ensure the path starts with a slash
    const imageUrl = encodedPath.startsWith('/')
      ? encodedPath
      : `/${encodedPath}`;

    // Create frontmatter for the post
    const frontMatter = {
      slug,
      title,
      type: 'artwork',
      date: fileDate,
      modified_date: formatDate(new Date()),
      featuredImage: imageUrl,
      images: [imageUrl],
      description: `${title}`,
      tags: ['art', 'learning'],
      // Add subdirectory as a tag to help with organization
      folder: path.dirname(imageUrl).split('/').pop(),
    };

    // Write the markdown file with empty content
    const newContent = `---\n${stringify(frontMatter)}---\n`;
    await writeFile(postPath, newContent);

    console.log(`Created ${slug}.md with date ${fileDate}`);
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

/**
 * Main function to scan directories and create art posts
 */
async function createArtFiles(): Promise<void> {
  console.log(
    'Creating art posts from images in learning directory and subdirectories...'
  );

  try {
    // Create the posts directory if it doesn't exist
    if (!fs.existsSync(ART_POSTS_DIR)) {
      fs.mkdirSync(ART_POSTS_DIR, { recursive: true });
    }

    // Check if base image directory exists
    if (!fs.existsSync(BASE_IMAGE_DIR)) {
      console.error(`Error: Base image directory ${BASE_IMAGE_DIR} not found`);
      return;
    }

    // Find all image files recursively
    const imageFiles = findAllImageFiles(BASE_IMAGE_DIR);

    const totalFiles = imageFiles.length;
    console.log(
      `Found ${totalFiles} image files to process in all subdirectories.`
    );

    await Promise.all(
      imageFiles.map(async (imagePath, index) => {
        await processImageFile(imagePath);

        // Log progress periodically
        if ((index + 1) % 10 === 0) {
          console.log(`Progress: ${index + 1}/${totalFiles}`);
        }
      })
    );

    console.log(`Finished creating art posts.`);
  } catch (error) {
    console.error('Error creating art posts:', error);
  }
}

// Run the script
createArtFiles();
