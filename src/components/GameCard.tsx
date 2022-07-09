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
    <div>
      <div
        className="group 
  overflow-hidden
   relative shadow-lg max-w-xs"
      >
        <Link href="/games/[slug]" as={`/games/${game.slug}`}>
          <a className="absolute z-10 top-0 bottom-0 left-0 right-0"></a>
        </Link>
        {fbGame?.cover && (
          <img
            src={fbGame?.cover}
            alt="game image"
            className="block group-hover:opacity-40 transition-opacity duration-700"
          ></img>
        )}
        <GameScoreBox score={game.score}></GameScoreBox>
        <div className="absolute bg-black flex items-center group-hover:-top-0 group-hover:opacity-100 duration-700 top-full right-0 w-full opacity-0 h-1/3 transition-all">
          <div>
            {fbGame?.screenshot && (
              <img
                src={fbGame?.screenshot}
                alt="game image"
                className="block w-full h-full"
              ></img>
            )}
          </div>
        </div>
        <div
          className="absolute  bg-gradient-to-br duration-700 from-green-800 to-blue-800 text-white block left-0 right-0 top-full text-base h-2/3 w-full opacity-50 
    transition-all group-hover:top-1/3 group-hover:opacity-100"
        >
          <div className="py-4 text-xs px-7">
            <div className="text-lg font-bold">{fbGame?.name}</div>
            <div className="genre">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Genre:{' '}
              </span>
              <span className="relative z-20">{fbGame?.genre}</span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Played:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                <span className="text-positive">
                  {format(new Date(game.date), 'LLL d, yyyy')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GameCard };
