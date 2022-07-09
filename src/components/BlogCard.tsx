import React from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { FBPost } from '../utils/Posts';

const BlogCard: React.FC<{ post: FBPost }> = ({ post }) => {
  return (
    <div className="p-2 xl:w-1/6 md:w-1/3 sm:w-1/2 w-full">
      <div className="group overflow-hidden relative max-w-xs shadow-steam">
        <Link href="/posts/[slug]" as={`/posts/${post.slug}`}>
          <a className="absolute z-10 top-0 bottom-0 left-0 right-0"></a>
        </Link>
        <div>
          {post?.image && (
            <img
              src={post?.image}
              alt="post image"
              className="block group-hover:opacity-40 transition-opacity duration-700 w-full"
            ></img>
          )}
        </div>

        <div className="p-3">
          <h2>{post?.title}</h2>
          <div className="text-sm text-gray-400">
            {format(new Date(post.date), 'LLL d, yyyy')}
          </div>
        </div>
        <div
          className="absolute bg-gradient-to-br duration-700 from-green-800 to-blue-800 text-white block left-0 right-0 top-full text-base h-full w-full opacity-50 
    transition-all group-hover:top-0 group-hover:opacity-100"
        >
          <div className="py-4 text-xs px-7 p-2">
            <div className="title">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Title:{' '}
              </span>
              <span className="relative z-20">{post?.title}</span>
            </div>
            <div className="description">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Description:{' '}
              </span>
              <span className="relative z-20">{post?.description}</span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Posted:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                <span className="text-positive">
                  {format(new Date(post.date), 'LLL d, yyyy')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BlogCard };
