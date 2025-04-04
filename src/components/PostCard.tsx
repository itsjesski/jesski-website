import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { PostCardProps } from '../types/Components';

const PostCard: React.FC<PostCardProps> = ({
  post,
  className = '',
  openLightbox,
}) => {
  // Different URL structure based on post type
  const getPostUrl = (): string => {
    switch (post.type) {
      case 'artwork':
        return `/art/${post.slug}/`;
      case 'game-review':
        return `/games/${post.slug}/`;
      default:
        return `/posts/${post.slug}/`;
    }
  };

  // Get the appropriate featured image
  const getFeaturedImage = (): string => {
    let imageUrl = '';

    if (post.type === 'artwork' && 'featuredImage' in post) {
      imageUrl = post.featuredImage || '/assets/images/placeholder.jpg';
    } else if (post.type === 'game-review' && 'cover' in post) {
      imageUrl = post.cover || '/assets/images/placeholder.jpg';
    } else if ('image' in post) {
      imageUrl = post.image || '/assets/images/placeholder.jpg';
    } else {
      imageUrl = '/assets/images/placeholder.jpg';
    }

    // Fix protocol-relative URLs by adding https:
    if (imageUrl.startsWith('//')) {
      imageUrl = `https:${imageUrl}`;
    }

    return imageUrl;
  };

  // Get a secondary image if available
  const getSecondaryImage = (): string => {
    let imageUrl = getFeaturedImage();

    // For artwork, use second image if available
    if (
      post.type === 'artwork' &&
      'images' in post &&
      Array.isArray(post.images) &&
      post.images.length > 1
    ) {
      const [, secondImage] = post.images;
      imageUrl = secondImage;
    }

    if (imageUrl.startsWith('//')) {
      imageUrl = `https:${imageUrl}`;
    }

    return imageUrl;
  };

  // Get post excerpt
  const getExcerpt = (): string => {
    if (post.type === 'artwork' && 'excerpt' in post) {
      return post.excerpt || '';
    }
    if ('description' in post) {
      return post.description || '';
    }
    return '';
  };

  // Get type badge text
  const getTypeBadge = (): string => {
    switch (post.type) {
      case 'artwork':
        return 'Art';
      case 'game-review':
        return 'Game';
      default:
        return 'Blog';
    }
  };

  // Get badge color based on post type
  const getBadgeColor = (): string => {
    switch (post.type) {
      case 'artwork':
        return 'bg-purple-500';
      case 'game-review':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  // Format the date like in GameCard
  const formattedDate = post.date
    ? format(new Date(post.date), 'LLL d, yyyy')
    : '';

  // Updated handleCardClick function with stopPropagation:
  const handleCardClick = (e: React.MouseEvent) => {
    // Only handle click if this is artwork and we have a lightbox function
    if (
      post.type === 'artwork' &&
      openLightbox &&
      'images' in post &&
      Array.isArray(post.images)
    ) {
      e.preventDefault();
      e.stopPropagation(); // Stop event propagation
      console.log('Opening lightbox with images:', post.images); // Debug
      openLightbox(post.images, 0);
    }
    // For other post types, let the Link handle navigation
  };

  // Check if we should show the lightbox overlay
  const isArtworkWithLightbox = post.type === 'artwork' && openLightbox;

  // Update the return statement in the component:

  return (
    <div className={`p-2 xl:w-1/6 md:w-1/3 sm:w-1/2 w-full ${className}`}>
      <div className="group overflow-hidden relative w-full shadow-steam h-[400px]">
        {/* Regular link for non-artwork posts or if no lightbox function provided */}
        <Link
          href={getPostUrl()}
          className="absolute z-10 top-0 bottom-0 left-0 right-0 text-cstyle-highlight"
          onClick={handleCardClick}
        />

        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={getFeaturedImage()}
            alt={post.title}
            width="232"
            height="310"
            className={`block transition-opacity duration-700 w-full h-full object-cover ${
              !isArtworkWithLightbox && 'group-hover:opacity-40'
            }`}
          />
        </div>

        {/* Add lightbox overlay for artwork posts */}
        {isArtworkWithLightbox && (
          <div
            className="absolute inset-0 cursor-pointer bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            onClick={handleCardClick}
          >
            <span className="text-white text-lg">Click to view image</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full bg-white flex justify-between items-center p-1 z-30">
          <div className="smallTitle text-cstyle-highlight text-sm overflow-hidden truncate font-semibold pr-2">
            {post.title}
          </div>
          <div
            className={`flex-shrink-0 rounded-sm ${getBadgeColor()} flex items-center justify-center text-white text-xs font-bold px-3 py-1`}
          >
            {getTypeBadge()}
          </div>
        </div>

        {/* Only show these hover effects for non-artwork posts */}
        {!isArtworkWithLightbox && (
          <>
            <div className="absolute bg-black flex items-center group-hover:-top-0 group-hover:opacity-100 duration-700 top-full right-0 w-full opacity-0 h-1/3 transition-all">
              <div className="w-full h-full">
                <Image
                  src={getSecondaryImage()}
                  alt={`${post.title} preview`}
                  width="232"
                  height="130"
                  className="block w-full h-full object-cover"
                />
              </div>
            </div>
            <div
              className="absolute bg-gradient-to-br duration-700 from-cstyle-lighttext to-cstyle-background block left-0 right-0 top-full text-base h-2/3 w-full opacity-50 
            transition-all group-hover:top-1/3 group-hover:opacity-100"
            >
              <div className="py-4 text-xs px-7">
                <div className="text-lg font-bold text-cstyle-highlight">
                  {post.title}
                </div>
                <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                  <span className="text-cstyle-text whitespace-nowrap text-xs md:text-sm">
                    Posted on{' '}
                  </span>
                  <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                    <span className="text-cstyle-text whitespace-nowrap text-xs md:text-sm">
                      {formattedDate}
                    </span>
                  </span>
                </div>
                {getExcerpt() && (
                  <div className="mt-2 text-sm text-cstyle-text line-clamp-2">
                    {getExcerpt()}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
