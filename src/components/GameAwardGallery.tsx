import React, { useState, useEffect } from 'react';

import { FBGame, getGamePostByAward } from '../utils/Posts';
import { GameCard } from './GameCard';

const GameCardList: React.FC<{ year: string }> = ({ year }) => {
  const [fbPosts, setPostData] = useState<FBGame[]>();

  useEffect(() => {
    if (fbPosts != null) return;

    getGamePostByAward(year).then((gamePosts) => {
      // We only have 1st through 3rd place.
      setPostData(gamePosts.results);
    });
  }, [fbPosts, year]);
  return (
    <div className="flex flex-wrap justify-between">
      {fbPosts?.map((game) => (
        <GameCard game={game} size="large" key={game.slug}></GameCard>
      ))}
    </div>
  );
};

const GameAwardGallery: React.FC<{ year: string }> = ({ year }) => (
  <>
    <section className="game-gallery gallery-widget mb-20 w-full">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap border-b-slate-700 border-solid border-b-2 pb-2 pl-2 pr-2">
        <h1 className="mb-0">Games of the Year</h1>
        <span className="font-bold text-fbstyle-highlight">{year}</span>
      </div>
      <div className="gallery-content">
        <GameCardList year={year}></GameCardList>
      </div>
    </section>
  </>
);

export { GameAwardGallery };
