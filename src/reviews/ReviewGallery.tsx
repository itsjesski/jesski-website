import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { Pagination, IPaginationProps } from '../pagination/Pagination';
import { PostItems } from '../utils/Reviews';

export type IReviewGalleryProps = {
  posts: PostItems[];
  pagination: IPaginationProps;
};

const axios = require('axios').default;

const ReviewCard: React.FC<{ review: PostItems }> = ({ review }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null | undefined>(
    null
  );

  useEffect(() => {
    if (thumbnailUrl != null) return;

    async function getGameData() {
      axios
        .get(`/api/games/${review.title}`)
        .then((response: { data: any }): void => {
          console.log(response.data);
          setThumbnailUrl(response.data.cover);
        })
        .catch((error: any) => {
          // handle error
          console.log(error);
        });
    }

    getGameData();
  }, [review.title, thumbnailUrl]);
  return (
    <li key={review.slug} className="p-2 lg:w-1/4 md:w-1/2 sm:w-full">
      <div className="border-solid border-fbstyle-300 border-2 shadow">
        <Link href="/reviews/[slug]" as={`/reviews/${review.slug}`}>
          <a>
            <div className="image">
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="review image"
                  className="w-full"
                ></img>
              )}
            </div>
            <div className="text-left p-2 text-fbstyle-50">
              <h2>{review.title}</h2>
              <span className="text-left text-sm text-fbstyle-100">
                {format(new Date(review.date), 'LLL d, yyyy')}
              </span>
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
    <ul className="flex flex-wrap justify-between">
      {props.posts.map((review) => (
        <ReviewCard review={review} key={review.slug}></ReviewCard>
      ))}
    </ul>

    <Pagination
      previous={props.pagination.previous}
      next={props.pagination.next}
    />
  </>
);

export { ReviewGallery };
