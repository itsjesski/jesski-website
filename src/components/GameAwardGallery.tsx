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
    <section className="game-gallery gallery-widget flex-auto w-2/5 md:w--full m-2">
      <div className="gallery-title mb-3 border-b-slate-700 border-solid border-b-2 pb-2 pl-2 pr-2">
        <h2 className="mb-0">
          Best Games of <span className="text-cstyle-highlight">{year}</span>
        </h2>
      </div>
      <div className="gallery-content">
        <GameCardList year={year}></GameCardList>
      </div>
    </section>
  </>
);

export { GameAwardGallery };
