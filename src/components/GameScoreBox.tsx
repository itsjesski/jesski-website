import React from 'react';
import { GameScoreBoxProps } from '../types';

const GameScoreBox = (props: GameScoreBoxProps) => (
  <>
    <div
      className={`game-score align-middle text-sm text-cstyle-green w-1/4 text-right`}
    >
      {props.score}%
    </div>
  </>
);

export default GameScoreBox;
