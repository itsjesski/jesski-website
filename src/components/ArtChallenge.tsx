import React, { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import ArtCard from './ArtCard';

const DailyArtChallenge: React.FC = () => {
  const [galleries, setGalleries] = useState<
    { name: string; images: string[]; featuredImage: string }[]
  >([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);

  useEffect(() => {
    const fetchGalleries = async () => {
      const response = await fetch('/api/art/monthly');
      const fetchedGalleries = await response.json();
      setGalleries(fetchedGalleries);
    };

    fetchGalleries();
  }, []);

  const openLightbox = (images: string[], index: number) => {
    setCurrentGallery(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Daily Art <span className="text-cstyle-green">Challenge</span>
      </h1>
      <p className="mb-4">
        Here you can see my progress as I create a new piece of art every day.
        Hopefully by drawing every day, even if its a quick drawing, I&apos;ll
        be able to improve my skills and learn new techniques. Click on one of
        the months to view the full gallery.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {galleries.map((gallery, galleryIndex) => (
          <ArtCard
            key={galleryIndex}
            gallery={gallery}
            openLightbox={openLightbox}
            size={''}
          />
        ))}
      </div>
      {lightboxOpen && (
        <Lightbox
          slides={currentGallery.map((image) => ({ src: image }))}
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={currentImageIndex}
        />
      )}
    </div>
  );
};

export default DailyArtChallenge;
