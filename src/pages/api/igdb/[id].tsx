import Cors from 'cors';

import { getGameByID } from '../../../utils/IGDB';
import { IGDBGame } from '../../../types';
import initMiddleware from '../../../utils/InitMiddleware';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

export default async function handler(
  req: { query: { id: string } },
  res: { json: (results: IGDBGame) => void }
) {
  await cors(req, res);

  const { id } = req.query;
  const newId = parseInt(id, 10);

  const game = await getGameByID(newId, [
    'id',
    'name',
    'cover.url',
    'genres.name',
    'screenshots.url',
    'videos',
    'aggregated_rating',
    'summary',
    'release_dates.date',
  ]);

  const gameData = game[0];

  res.json(gameData);
}
