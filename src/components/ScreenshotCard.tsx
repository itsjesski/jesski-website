import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';
import Lightbox from 'react-image-lightbox';

import { FBPost } from '../utils/Posts';

import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const ScreenshotCard: React.FC<{ post: FBPost }> = ({ post }) => {
  const [photoIndex, setPhotoIndex] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>();
  const images = post.screenshots;

  useEffect(() => {
    if (photoIndex == null) {
      setPhotoIndex(0);
    }
  }, [photoIndex]);

  function getPhotoIndex() {
    if (photoIndex == null) {
      return 0;
    }
    return photoIndex;
  }

  return (
    <div className="p-2 xl:w-1/3 md:w-full w-full">
      <div className="group overflow-hidden relative w-full shadow-steam">
        <a
          className="absolute z-10 top-0 bottom-0 left-0 right-0"
          onClick={() => setIsOpen(true)}
        ></a>

        <div>
          {post?.image && (
            <img
              src={
                post.screenshots[
                  Math.floor(Math.random() * post.screenshots.length)
                ]
              }
              alt="post image"
              className="block group-hover:opacity-40 transition-opacity duration-700 w-full"
            ></img>
          )}
        </div>

        <div
          className="absolute bg-gradient-to-br duration-700 from-green-800 to-blue-800 text-white block left-0 right-0 top-full text-base h-full w-full opacity-50 
    transition-all group-hover:top-0 group-hover:opacity-100"
        >
          <div className="py-4 text-xs px-7 p-2">
            <div className="title">
              <span className="relative z-20 text-2xl font-bold">
                {post?.title}
              </span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20 mb-5">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Posted:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                <span className="text-positive">
                  {format(new Date(post.date), 'LLL d, yyyy')}
                </span>
              </span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                <span className="text-positive">
                  Want to see more from this game? Just click here!
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={images[getPhotoIndex()]}
          nextSrc={images[(getPhotoIndex() + 1) % images.length]}
          prevSrc={
            images[(getPhotoIndex() + images.length - 1) % images.length]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((getPhotoIndex() + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((getPhotoIndex() + 1) % images.length)
          }
        />
      )}
    </div>
  );
};

export { ScreenshotCard };
