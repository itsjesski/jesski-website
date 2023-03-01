import React from 'react';

export type IGameScoreProps = {
  score: number | string;
};

const GameScoreBox = (props: IGameScoreProps) => (
  <>
    <div
      className={`game-score align-middle text-sm text-slate-500 w-1/4 text-right`}
    >
      {props.score}%
    </div>
  </>
);

export { GameScoreBox };
