import React from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { Pagination, IPaginationProps } from '../pagination/Pagination';
import { PostItems } from '../utils/Reviews';

export type IReviewGalleryProps = {
  posts: PostItems[];
  pagination: IPaginationProps;
};

const ReviewGallery = (props: IReviewGalleryProps) => (
  <>
    <h2 className="mb-3 p-2 border-b-fbstyle-400 border-solid border-b-2">
      Reviews
    </h2>
    <ul className="flex flex-wrap justify-between">
      {props.posts.map((elt) => (
        <li key={elt.slug} className="p-2 lg:w-1/4 md:w-1/2 sm:w-full">
          <div className="border-solid border-fbstyle-300 border-2 shadow">
            <Link href="/posts/[slug]" as={`/posts/${elt.slug}`}>
              <a>
                <div className="image">
                  <img src={elt.image} alt="review image"></img>
                </div>
                <div className="text-left p-2 text-fbstyle-50">
                  <h2>{elt.title}</h2>
                  <span className="text-left text-sm text-fbstyle-100">
                    {format(new Date(elt.date), 'LLL d, yyyy')}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        </li>
      ))}
    </ul>

    <Pagination
      previous={props.pagination.previous}
      next={props.pagination.next}
    />
  </>
);

export { ReviewGallery };
