import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { FBPost, getBlogPosts } from '../utils/Posts';

const BlogCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBPost[]>();
  const numberPosts = 5;

  useEffect(() => {
    if (fbPosts != null) return;
    getBlogPosts(['title', 'date', 'slug', 'image']).then((blogPosts) => {
      setPostData(blogPosts.results.slice(0, numberPosts));
    });
  }, [fbPosts]);
  return (
    <ul className="flex flex-wrap justify-between">
      {fbPosts?.map((elt) => (
        <li
          key={elt.slug}
          className="p-2 lg:w-1/6 md:w-1/2 w-full shadow-2xl bg-slate-700"
        >
          <div className="">
            <Link href="/posts/[slug]" as={`/posts/${elt.slug}`}>
              <a>
                <div className="blog-image">
                  <img src={elt.image} alt="image"></img>
                </div>
                <div className="text-left p-2 text-slate-50">
                  <h2>{elt.title}</h2>
                  <span className="text-left text-sm text-slate-100">
                    {format(new Date(elt.date), 'LLL d, yyyy')}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        </li>
      ))}
    </ul>
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
