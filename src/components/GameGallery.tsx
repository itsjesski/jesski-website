import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { FBGame, getGamePosts } from '../utils/Posts';
import GameCard from './GameCard';

const GameCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBGame[]>();
  const numberPosts = 18;

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
        <GameCard game={game} size="medium" key={game.slug}></GameCard>
      ))}
    </div>
  );
};

const GameGallery = () => (
  <>
    <section className="game-gallery gallery-widget">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap pl-2 pr-2">
        <h2 className="mb-0">
          Recent <span className="text-cstyle-green">Games</span>
        </h2>
        <div className="text-sm text-gray-400 font-bold">
          <Link href="/games">View All Games {'>'}</Link>
        </div>
      </div>
      <div className="gallery-content">
        <GameCardList></GameCardList>
      </div>
    </section>
  </>
);

export default GameGallery;
