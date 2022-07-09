import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { ReviewScoreBox } from '../content/modules/ReviewScoreBox';
import { FBGame } from '../pages/api/games/[title]';
import { FBReview, getReviewPosts } from '../utils/Posts';

const axios = require('axios').default;

const ReviewCard: React.FC<{ review: FBReview }> = ({ review }) => {
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
    <li
      key={review.slug}
      className="p-2 lg:w-1/6 md:w-1/2 w-full shadow-2xl bg-slate-700"
    >
      <div className="">
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
            <div className="text-left p-2 text-slate-50">
              <h2>{review.title}</h2>
              <div className="text-left text-xs text-slate-100">
                {fbGame?.genre}
              </div>
              <div className="text-left text-xs text-slate-100">
                Played on {format(new Date(review.date), 'LLL d, yyyy')}
              </div>
            </div>
          </a>
        </Link>
      </div>
    </li>
  );
};

const ReviewCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBReview[]>();
  const numberPosts = 5;

  useEffect(() => {
    if (fbPosts != null) return;

    getReviewPosts(['id', 'title', 'date', 'slug', 'score']).then(
      (reviewPosts) => {
        // Always 6 reviews for the gallery.
        setPostData(reviewPosts.results.slice(0, numberPosts));
      }
    );
  }, [fbPosts]);
  return (
    <ul className="flex flex-wrap justify-between">
      {fbPosts?.map((review) => (
        <ReviewCard review={review} key={review.slug}></ReviewCard>
      ))}
    </ul>
  );
};

const ReviewGallery = () => (
  <>
    <section className="review-gallery gallery-widget mb-20">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap">
        <h1>Reviews</h1>
      </div>
      <div className="gallery-content">
        <ReviewCardList></ReviewCardList>
      </div>
      <div className="gallery-more flex justify-center mt-4">
        <Link href="/reviews/">
          <a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white mt-4 lg:mt-0">
            View All {'>'}
          </a>
        </Link>
      </div>
    </section>
  </>
);

export { ReviewGallery };
