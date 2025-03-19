import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const getGalleries = async (_req: NextApiRequest, res: NextApiResponse) => {
  const galleriesDir = path.join(
    process.cwd(),
    'public/assets/images/art/learning'
  );
  const galleryFolders = fs.readdirSync(galleriesDir);

  const galleries = galleryFolders.map((folder) => {
    const folderPath = path.join(galleriesDir, folder);
    const images = fs
      .readdirSync(folderPath)
      .map((file) => `/assets/images/art/learning/${folder}/${file}`);
    const featuredImage =
      images.find((image) => image.includes('-f')) || images[0];
    return {
      name: folder,
      images,
      featuredImage,
    };
  });

  res.status(200).json(galleries);
};

export default getGalleries;
