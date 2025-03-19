/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import fs from 'fs';
import path from 'path';

const getFileSizeInBytes = (filePath: string): number => {
  const stats = fs.statSync(filePath);
  return stats.size;
};

const logFileSizes = (files: string[], message: string) => {
  console.log(message);
  files.forEach((file) => {
    const filePath = path.resolve(file);
    const fileSize = getFileSizeInBytes(filePath);
    console.log(`File: ${filePath}, Size: ${fileSize} bytes`);
  });
};

(async () => {
  const files = ['public/assets/images/art/**/*.{jpg,png,svg}'];

  // Log file sizes before compression
  logFileSizes(files, 'Before compression:');

  const optimizedFiles = await imagemin(files, {
    destination: 'public/assets/images/art/',
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.6, 0.8] }),
      imageminSvgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      }),
    ],
  });

  // Log file sizes after compression
  logFileSizes(
    optimizedFiles.map((file) => file.destinationPath),
    'After compression:'
  );
})();

export {};
