/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob';

const resizeImage = async (
  inputPath: string,
  width: number,
  height: number
) => {
  const image = sharp(inputPath).resize(width, height, {
    fit: sharp.fit.inside,
    withoutEnlargement: true,
  });

  return image.toBuffer();
};

const compressImage = async (buffer: Buffer, ext: string) => {
  const image = sharp(buffer);

  if (ext === '.jpg' || ext === '.jpeg') {
    return image.jpeg({ quality: 60, mozjpeg: true }).toBuffer();
  }
  if (ext === '.png') {
    return image.png({ quality: 60, compressionLevel: 9 }).toBuffer();
  }
  if (ext === '.svg') {
    return image.toBuffer();
  }

  return buffer;
};

const processImage = async (
  inputPath: string,
  width: number,
  height: number
) => {
  try {
    const ext = path.extname(inputPath).toLowerCase();

    // Resize the image
    const resizedBuffer = await resizeImage(inputPath, width, height);

    // Compress the resized image
    const compressedBuffer = await compressImage(resizedBuffer, ext);

    // Write the compressed image back to the original location
    await fs.writeFile(inputPath, new Uint8Array(compressedBuffer));

    return true;
  } catch (error) {
    console.error(`Error processing file ${inputPath}:`, error);
    return false;
  }
};

(async () => {
  const files = glob.sync('public/assets/images/art/**/*.{jpg,jpeg,png,svg}');

  await Promise.all(
    files.map(async (file: string) => {
      const success = await processImage(file, 1920, 1080); // Resize to 1920x1080
      if (success) {
        console.log(`Compressed and resized: ${file}`);
      }
    })
  );
})();
