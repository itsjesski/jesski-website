import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { FBPost, getBlogPosts } from '../utils/Posts';
import { BlogCard } from './BlogCard';

const BlogCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBPost[]>();
  const numberPosts = 6;

  useEffect(() => {
    if (fbPosts != null) return;
    getBlogPosts(['title', 'date', 'slug', 'image', 'description']).then(
      (blogPosts) => {
        setPostData(blogPosts.results.slice(0, numberPosts));
      }
    );
  }, [fbPosts]);
  return (
    <div className="flex flex-wrap justify-between">
      {fbPosts?.map((elt) => (
        <BlogCard post={elt} key={elt.slug}></BlogCard>
      ))}
    </div>
  );
};

const BlogGallery = () => (
  <>
    <section className="blog-gallery gallery-widget mb-10">
      <div className="gallery-title  mb-3 flex justify-between items-end flex-wrap border-b-slate-700 border-solid border-b-2 pb-2 pl-2 pr-2">
        <h1 className="">Blog</h1>
        <div className="text-sm text-gray-400">
          Ramblings from the mind of a crazy person.
        </div>
      </div>
      <div className="gallery-content">
        <BlogCardList></BlogCardList>
      </div>
      <div className="view-more align-middle justify-center flex mt-2 mb-2">
        <Link href="/games">
          <a>
            <button
              type="button"
              className="leading-none border text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
            >
              View all
            </button>
          </a>
        </Link>
      </div>
    </section>
  </>
);

export { BlogGallery };
