/* eslint-disable import/no-extraneous-dependencies */
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

(async () => {
  const files = await imagemin(
    ['public/assets/images/art/**/*.{jpg,png,svg}'],
    {
      destination: 'public/assets/images/art/',
      plugins: [
        imageminMozjpeg({ quality: 80 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
        imageminSvgo({
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        }),
      ],
    }
  );

  // eslint-disable-next-line no-console
  console.log('Images optimized:', files);
})();

export {};
