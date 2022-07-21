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
    <div className="flex flex-wrap">
      {fbPosts?.map((elt) => (
        <BlogCard post={elt} key={elt.slug}></BlogCard>
      ))}
    </div>
  );
};

const BlogGallery = () => (
  <>
    <section className="blog-gallery gallery-widget mb-32">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap pl-2 pr-2">
        <h1 className="mb-0">
          Recent <span className="text-fbstyle-highlight">Posts</span>
        </h1>
        <div className="text-sm text-gray-400 font-bold">
          <Link href="/posts">
            <a>View All Posts {'>'}</a>
          </Link>
        </div>
      </div>
      <div className="gallery-content">
        <BlogCardList></BlogCardList>
      </div>
    </section>
  </>
);

export { BlogGallery };
