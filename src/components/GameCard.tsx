import React from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { FBGame } from '../utils/Posts';
import { GameScoreBox } from './GameScoreBox';

const GameCard: React.FC<{ game: FBGame; size: string }> = ({ game, size }) => {
  /**
   * Tailwind doesnt support dynamic classes as far as I can tell, so we're pairing up our size with classes.
   * @param tileSize
   * @returns
   */
  function getStyles(tileSize: string): string {
    switch (tileSize) {
      case 'large':
        return `xl:w-1/3 md:w-1/3 w-full`;
      case 'medium':
        return `xl:w-1/6 md:w-1/3 sm:w-1/2 w-full`;
      case 'small':
        return `xl:w-1/9 md:w-1/6 sm:w-1/2 w-full`;
      default:
        return `xl:w-1/6 md:w-1/3 sm:w-1/2 w-full`;
    }
  }

  return (
    <div className={`p-2  ${getStyles(size)}`}>
      <div className="group overflow-hidden relative w-full shadow-steam">
        <Link
          href="/games/[slug]"
          as={`/games/${game.slug}`}
          className="absolute z-10 top-0 bottom-0 left-0 right-0 text-cstyle-highlight"
        ></Link>
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={`https://${game.cover}`}
            alt="game image"
            className="block group-hover:opacity-40 transition-opacity duration-700 w-full"
          ></img>
        </div>

        <div className="bottom-0 left-0 w-full bg-white flex p-1 shadow-steam">
          <div className="smallTitle text-cstyle-highlight text-sm overflow-hidden truncate font-semibold w-3/4">
            {game.title}
          </div>
          <GameScoreBox score={game.score}></GameScoreBox>
        </div>

        <div className="absolute bg-black flex items-center group-hover:-top-0 group-hover:opacity-100 duration-700 top-full right-0 w-full opacity-0 h-1/3 transition-all">
          <div>
            {game?.image && (
              <img
                src={game?.image}
                alt="game image"
                className="block w-full h-full"
              ></img>
            )}
          </div>
        </div>
        <div
          className="absolute  bg-gradient-to-br duration-700 from-cstyle-lighttext to-cstyle-background  block left-0 right-0 top-full text-base h-2/3 w-full opacity-50 
    transition-all group-hover:top-1/3 group-hover:opacity-100"
        >
          <div className="py-4 text-xs px-7">
            <div className="text-lg font-bold text-cstyle-highlight">
              {game?.title}
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="text-cstyle-text whitespace-nowrap text-xs md:text-sm">
                Played on{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                <span className="text-cstyle-text whitespace-nowrap text-xs md:text-sm">
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
