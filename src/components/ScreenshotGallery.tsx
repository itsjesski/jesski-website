import React, { useEffect, useState } from 'react';

import { FBPost, getGamePostsWithScreenshots } from '../utils/Posts';
import { ScreenshotCard } from './ScreenshotCard';

const ScreenshotCardList: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBPost[]>();
  const numberPosts = 3;

  function shuffle(a: any[]) {
    // eslint-disable-next-line no-plusplus
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line no-param-reassign
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    if (fbPosts != null) return;
    getGamePostsWithScreenshots([
      'title',
      'date',
      'slug',
      'image',
      'description',
      'screenshots',
    ]).then((gamePosts) => {
      const shuffled = shuffle(gamePosts.results);
      setPostData(shuffled.slice(0, numberPosts));
    });
  }, [fbPosts]);
  return (
    <div className="flex flex-wrap">
      {fbPosts?.map((elt) => (
        <ScreenshotCard post={elt} key={elt.slug}></ScreenshotCard>
      ))}
    </div>
  );
};

const ScreenshotGallery = () => (
  <>
    <section className="screenshot-gallery gallery-widget mb-32">
      <div className="gallery-title mb-3 flex justify-between items-end flex-wrap pl-2 pr-2">
        <h1 className="mb-0">
          Random{' '}
          <span className="text-fbstyle-highlight">Screenshot Galleries</span>{' '}
        </h1>
      </div>
      <div className="gallery-content">
        <ScreenshotCardList></ScreenshotCardList>
      </div>
    </section>
  </>
);

export { ScreenshotGallery };
