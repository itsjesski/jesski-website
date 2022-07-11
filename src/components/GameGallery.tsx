import React, { useState, useEffect } from 'react';

import { FBGame, getGamePosts } from '../utils/Posts';
import { GameCard } from './GameCard';

const GameCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBGame[]>();
  const numberPosts = 6;

  useEffect(() => {
    if (fbPosts != null) return;

    getGamePosts([
      'id',
      'title',
      'date',
      'slug',
      'score',
      'cover',
      'image',
    ]).then((gamePosts) => {
      // Always 6 games for the gallery.
      setPostData(gamePosts.results.slice(0, numberPosts));
    });
  }, [fbPosts]);
  return (
    <div className="flex flex-wrap justify-between">
      {fbPosts?.map((game) => (
        <GameCard game={game} key={game.slug}></GameCard>
      ))}
    </div>
  );
};

const GameGallery = () => (
  <>
    <section className="game-gallery gallery-widget mb-20">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap border-b-slate-700 border-solid border-b-2 pb-2">
        <h1>Games</h1>
        <div className="text-sm text-gray-400">
          Checkout the latest games Firebottle has played!
        </div>
      </div>
      <div className="gallery-content">
        <GameCardList></GameCardList>
      </div>
    </section>
  </>
);

export { GameGallery };
