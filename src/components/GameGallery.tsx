import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { IGDBGame } from '../pages/api/igdb/[title]';
import { FBGame, getGamePosts } from '../utils/Posts';
import { GameScoreBox } from './GameScoreBox';

const axios = require('axios').default;

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
    <li
      key={game.slug}
      className="p-2 lg:w-1/6 md:w-1/2 w-full shadow-2xl bg-slate-700"
    >
      <div className="">
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
    </li>
  );
};

const GameCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBGame[]>();
  const numberPosts = 5;

  useEffect(() => {
    if (fbPosts != null) return;

    getGamePosts(['id', 'title', 'date', 'slug', 'score']).then((gamePosts) => {
      // Always 6 games for the gallery.
      setPostData(gamePosts.results.slice(0, numberPosts));
    });
  }, [fbPosts]);
  return (
    <ul className="flex flex-wrap justify-between">
      {fbPosts?.map((game) => (
        <GameCard game={game} key={game.slug}></GameCard>
      ))}
    </ul>
  );
};

const GameGallery = () => (
  <>
    <section className="game-gallery gallery-widget mb-20">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap">
        <h1>Games</h1>
      </div>
      <div className="gallery-content">
        <GameCardList></GameCardList>
      </div>
      <div className="gallery-more flex justify-center mt-4">
        <Link href="/games/">
          <a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white mt-4 lg:mt-0">
            View All {'>'}
          </a>
        </Link>
      </div>
    </section>
  </>
);

export { GameGallery };
