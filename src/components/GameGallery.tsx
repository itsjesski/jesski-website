import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { FBGame, getGamePosts } from '../utils/Posts';
import { GameCard } from './GameCard';

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
        <li
          key={game.slug}
          className="p-2 lg:w-1/6 md:w-1/2 w-full shadow-2xl bg-slate-700"
        >
          <GameCard game={game} key={game.slug}></GameCard>
        </li>
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
