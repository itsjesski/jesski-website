import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import PostCard from './PostCard';
import { getAllPosts } from '../utils/Posts';
import { Post } from '../types/Posts';
import 'yet-another-react-lightbox/styles.css';

const PostCardList: React.FC<{ limit?: number }> = ({ limit = 6 }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lightbox, setLightbox] = useState({
    open: false,
    slides: [{ src: '' }],
    index: 0,
  });

  useEffect(() => {
    if (posts.length > 0) return;

    // Get posts from our unified content system
    const allPosts = getAllPosts();
    setPosts(allPosts.slice(0, limit));
  }, [posts, limit]);

  // Function to open lightbox with given images
  const openLightbox = (images: string[], index: number) => {
    setLightbox({
      open: true,
      slides: images.map((image) => ({ src: image })),
      index,
    });
  };

  return (
    <>
      <div className="flex flex-wrap justify-between">
        {posts?.map((post) => (
          <PostCard
            key={`${post.type}-${post.slug}`}
            post={post}
            className=""
            openLightbox={openLightbox}
          />
        ))}
      </div>
      <Lightbox
        open={lightbox.open}
        close={() => setLightbox({ ...lightbox, open: false })}
        slides={lightbox.slides.map((slide) => ({ src: slide.src }))}
        index={lightbox.index}
        plugins={[Counter]}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
          root: {
            position: 'fixed',
            top: '10%',
            bottom: '10%',
            left: '10%',
            right: '10%',
            width: '80%',
            height: '80%',
          },
        }}
        counter={{
          container: {
            style: {
              position: 'absolute',
              top: 'auto',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '16px',
              zIndex: 10,
            },
          },
        }}
      />
    </>
  );
};

const PostGallery: React.FC<{ limit?: number }> = ({ limit = 6 }) => (
  <>
    <section className="post-gallery gallery-widget">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap pl-2 pr-2">
        <h2 className="mb-0">
          Recent <span className="text-cstyle-green">Posts</span>
        </h2>
        <div className="text-sm text-gray-400 font-bold">
          <Link href="/posts">View All Posts {'>'}</Link>
        </div>
      </div>
      <div className="gallery-content">
        <PostCardList limit={limit} />
      </div>
    </section>
  </>
);

export default PostGallery;
