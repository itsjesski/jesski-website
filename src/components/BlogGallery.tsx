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
      <div className="gallery-title  mb-3 flex justify-between items-end flex-wrap">
        <h1 className="">Blog</h1>
      </div>
      <div className="gallery-content">
        <BlogCardList></BlogCardList>
      </div>
      <div className="gallery-more flex justify-center mt-4">
        <Link href="/posts/">
          <a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white mt-4 lg:mt-0">
            View All {'>'}
          </a>
        </Link>
      </div>
    </section>
  </>
);

export { BlogGallery };
