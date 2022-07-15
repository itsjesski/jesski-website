import React from 'react';

import { GameAwards } from '../utils/Posts';

/**
 * Tailwind doesnt support dynamic classes as far as I can tell, so we're pairing up our score with colors here.
 * @param awardType
 * @returns
 */
function getStyles(awardType: string): string {
  switch (awardType) {
    case 'Gold':
      return `bg-awards-gold`;
    case 'Silver':
      return `bg-awards-silver`;
    case 'Bronze':
      return `bg-awards-bronze`;
    default:
      return `bg-slate-100`;
  }
}

const GameAwardBox = (props: { awards: GameAwards }) => (
  <>
    <div
      className={`game-award text-slate-900 pt-1 pl-3 pr-3 pb-1 align-middle shadow-steam ${getStyles(
        props.awards[0].type
      )}`}
    >
      <div className="text-xs">{props.awards[0].name}</div>
      <div className="text-xs">
        {props.awards[0].type} - {props.awards[0].year}
      </div>
    </div>
  </>
);

export { GameAwardBox };
