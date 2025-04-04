import React, { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
// Option 1: Keep using the Counter plugin but with improved styling
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';
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
          plugins={[Counter]}
          styles={{
            container: {
              backgroundColor: 'rgba(0, 0, 0, 1)',
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
                color: '#fff',
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default DailyArtChallenge;
