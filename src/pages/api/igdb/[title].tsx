import Cors from 'cors';

import { getGameByName, IGDBGame } from '../../../utils/IGDB';
import initMiddleware from '../../../utils/InitMiddleware';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

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
    'aggregated_rating',
    'summary',
  ]);

  const gameData = game[0];

  res.json({
    id: gameData?.id,
    name: gameData?.name,
    cover: gameData?.cover,
    genres: gameData?.genres,
    screenshots: gameData?.screenshots,
    videos: gameData?.videos,
    aggregated_rating: gameData?.aggregated_rating,
    summary: gameData?.summary,
  });
}
