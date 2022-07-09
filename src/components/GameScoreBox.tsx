import React from 'react';

export type IGameScoreProps = {
  score: number | string;
};

/**
 * Tailwind doesnt support dynamic classes as far as I can tell, so we're pairing up our score with colors here.
 * @param gameScore
 * @returns
 */
function getStyles(gameScore: number | string): string {
  switch (gameScore) {
    case 1:
      return `bg-reviewscore-1`;
    case 2:
      return `bg-reviewscore-2`;
    case 3:
      return `bg-reviewscore-3`;
    case 4:
      return `bg-reviewscore-4`;
    case 5:
      return `bg-reviewscore-5`;
    case 6:
      return `bg-reviewscore-6`;
    case 7:
      return `bg-reviewscore-7`;
    case 8:
      return `bg-reviewscore-8`;
    case 9:
      return `bg-reviewscore-9`;
    case 10:
      return `bg-reviewScore-10`;
    default:
      return `bg-slate-100`;
  }
}

const GameScoreBox = (props: IGameScoreProps) => (
  <>
    <div
      className={`game-score absolute bottom-0 right-0 text-slate-900 pt-1 pl-3 pr-3 pb-1 ${getStyles(
        props.score
      )}`}
    >
      {props.score}
    </div>
  </>
);

export { GameScoreBox };