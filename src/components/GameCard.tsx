import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';

import { IGDBGame } from '../pages/api/igdb/[title]';
import { FBGame } from '../utils/Posts';
import { GameScoreBox } from './GameScoreBox';

const GameCard: React.FC<{ game: FBGame }> = ({ game }) => {
  const [fbGame, setGameData] = useState<IGDBGame>();

  useEffect(() => {
    if (fbGame != null) return;

    async function getGameData() {
      axios
        .get(`/api/igdb/${game.title}`)
        .then((response: { data: IGDBGame }): void => {
          setGameData(response.data);
        })
        .catch(() => {});
    }

    getGameData();
  }, [fbGame, game.title]);
  return (
    <div className="game-card">
      <Link href="/games/[slug]" as={`/games/${game.slug}`}>
        <a>
          <div className="image relative">
            {fbGame?.cover && (
              <img
                src={fbGame?.cover}
                alt="game image"
                className="w-full"
              ></img>
            )}
            <GameScoreBox score={game.score}></GameScoreBox>
          </div>
          <div className="text-left p-2 text-slate-50">
            <h2>{game.title}</h2>
            <div className="text-left text-xs text-slate-100">
              {fbGame?.genre}
            </div>
            <div className="text-left text-xs text-slate-100">
              Played on {format(new Date(game.date), 'LLL d, yyyy')}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export { GameCard };
