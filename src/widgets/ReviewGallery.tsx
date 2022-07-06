import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { ReviewScoreBox } from '../content/modules/ReviewScoreBox';
import { FBGame } from '../pages/api/games/[title]';
import { PostItems } from '../utils/Posts';

export type IReviewGalleryProps = {
  posts: PostItems[];
};

const axios = require('axios').default;

const ReviewCard: React.FC<{ review: PostItems }> = ({ review }) => {
  const [fbGame, setGameData] = useState<FBGame>();

  useEffect(() => {
    if (fbGame != null) return;

    async function getGameData() {
      axios
        .get(`/api/games/${review.title}`)
        .then((response: { data: FBGame }): void => {
          setGameData(response.data);
        })
        .catch(() => {});
    }

    getGameData();
  }, [fbGame, review.title]);
  return (
    <li key={review.slug} className="p-2 lg:w-1/6 md:w-1/2 w-full">
      <div className="border-solid border-fbstyle-300 border-2 shadow">
        <Link href="/reviews/[slug]" as={`/reviews/${review.slug}`}>
          <a>
            <div className="image relative">
              {fbGame?.cover && (
                <img
                  src={fbGame?.cover}
                  alt="review image"
                  className="w-full"
                ></img>
              )}
              <ReviewScoreBox score={review.score}></ReviewScoreBox>
            </div>
            <div className="text-left p-2 text-fbstyle-50">
              <h2>{review.title}</h2>
              <div className="text-left text-sm text-fbstyle-100">
                {fbGame?.genre}
              </div>
              <div className="text-left text-sm text-fbstyle-100">
                {format(new Date(review.date), 'LLL d, yyyy')}
              </div>
            </div>
          </a>
        </Link>
      </div>
    </li>
  );
};

const ReviewGallery = (props: IReviewGalleryProps) => (
  <>
    <h2 className="mb-3 p-2 border-b-fbstyle-400 border-solid border-b-2">
      Reviews
    </h2>
    <ul className="flex flex-wrap">
      {props.posts.map((review) => (
        <ReviewCard review={review} key={review.slug}></ReviewCard>
      ))}
    </ul>
  </>
);

export { ReviewGallery };
