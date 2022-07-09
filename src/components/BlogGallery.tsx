import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { FBPost, getBlogPosts } from '../utils/Posts';

const BlogCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBPost[]>();

  useEffect(() => {
    if (fbPosts != null) return;
    getBlogPosts(['title', 'date', 'slug', 'image']).then((blogPosts) => {
      setPostData(blogPosts.results.slice(0, 6));
    });
  }, [fbPosts]);
  return (
    <ul className="flex flex-wrap">
      {fbPosts?.map((elt) => (
        <li key={elt.slug} className="p-2 lg:w-1/6 md:w-1/2 w-full">
          <div className="border-solid border-fbstyle-300 border-2 shadow">
            <Link href="/posts/[slug]" as={`/posts/${elt.slug}`}>
              <a>
                <div className="blog-image">
                  <img src={elt.image} alt="image"></img>
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
  );
};

const BlogGallery = () => (
  <>
    <div className="blog-gallery gallery-widget mb-10">
      <div className="gallery-title border-b-fbstyle-400 border-solid border-b-2 mb-3 flex justify-between items-end flex-wrap">
        <h2 className="">Blog</h2>
      </div>
      <div className="gallery-content">
        <BlogCardList></BlogCardList>
      </div>
      <div className="gallery-more flex justify-center mt-4">
        <Link href="/posts/">
          <a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-fbstyle-500 hover:bg-white mt-4 lg:mt-0">
            View All {'>'}
          </a>
        </Link>
      </div>
    </div>
  </>
);

export { BlogGallery };
