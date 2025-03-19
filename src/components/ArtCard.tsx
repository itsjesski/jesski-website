import React from 'react';
import Image from 'next/image';

interface ArtCardProps {
  gallery: {
    name: string;
    images: string[];
    featuredImage: string;
  };
  openLightbox: (images: string[], index: number) => void;
  size: string;
}

const ArtCard: React.FC<ArtCardProps> = ({ gallery, openLightbox, size }) => {
  return (
    <div className={`p-2 ${size === 'large' ? 'xl:w-1/3 md:w-1/2' : 'w-full'}`}>
      <div className="group overflow-hidden relative w-full shadow-steam">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={gallery.featuredImage}
            alt={`Artwork from ${gallery.name}`}
            width="232"
            height="310"
            className="block group-hover:opacity-40 transition-opacity duration-700 w-full h-80 object-cover object-top"
            onClick={() => openLightbox(gallery.images, 0)}
          />
        </div>
        <div
          className="absolute inset-0 cursor-pointer bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => openLightbox(gallery.images, 0)}
        >
          <span className="text-white text-lg">Click to view gallery</span>
        </div>
        <div className="bottom-0 left-0 w-full bg-white flex p-1 shadow-steam">
          <div className="smallTitle text-cstyle-highlight text-sm overflow-hidden truncate font-semibold w-3/4">
            {gallery.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
