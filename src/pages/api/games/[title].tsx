import Cors from 'cors';

import { getGameByName } from '../../../utils/IGDB';
import initMiddleware from '../../../utils/InitMiddleware';

export type FBGame = {
  id: string | number | null | undefined;
  name: string | null | undefined;
  cover: string | null | undefined;
  genre: string | null | undefined;
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

function getGenreString(genres: Genres): string {
  const genresMap = genres.map((item) => {
    return item.name;
  });

  return genresMap.join(', ');
}

export default async function handler(
  req: { query: { title: string } },
  res: { json: (arg0: FBGame) => void }
) {
  await cors(req, res);

  const { title } = req.query;
  const game = await getGameByName(title, [
    'id',
    'name',
    'cover.url',
    'genres.name',
  ]);

  const gameData = game[0];

  res.json({
    id: gameData?.id,
    name: gameData?.name,
    cover: getBigCoverImage(gameData?.cover?.url),
    genre: getGenreString(gameData?.genres),
  });
}
