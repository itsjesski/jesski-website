import Cors from 'cors';

import { getGameByName } from '../../../utils/IGDB';
import initMiddleware from '../../../utils/InitMiddleware';

export type IGDBGame = {
  id: string;
  name: string;
  cover: string;
  genre: string;
  screenshot: string;
  video: string;
};

type Genres = [
  {
    id: number;
    name: string;
  }
];

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

function getBigCoverImage(coverUrl: string): string {
  if (coverUrl == null) {
    return '';
  }
  return coverUrl.replace('t_thumb', 't_cover_big');
}

function getBigScreenshotImage(coverArray: any[]): string {
  if (coverArray == null) {
    return '';
  }

  const cover = coverArray[Math.floor(Math.random() * coverArray.length)];

  return cover.url.replace('t_thumb', 't_screenshot_big');
}

function getGenreString(genres: Genres): string {
  const genresMap = genres.map((item) => {
    return item.name;
  });

  return genresMap.join(', ');
}

export default async function handler(
  req: { query: { title: string } },
  res: { json: (results: IGDBGame) => void }
) {
  await cors(req, res);

  const { title } = req.query;
  const game = await getGameByName(title, [
    'id',
    'name',
    'cover.url',
    'genres.name',
    'screenshots.url',
    'videos',
  ]);

  const gameData = game[0];

  res.json({
    id: gameData?.id,
    name: gameData?.name,
    cover: getBigCoverImage(gameData?.cover?.url),
    genre: getGenreString(gameData?.genres),
    screenshot: getBigScreenshotImage(gameData?.screenshots),
    video: gameData?.videos[0],
  });
}
