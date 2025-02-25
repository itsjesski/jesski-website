import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Spinner from './Spinner';

const PageIntroBox: React.FC<{}> = (props) => {
  const [streamIsOnline, setStreamIsOnline] = useState<boolean | null>(null);
  const [firebotImage, setFirebotImage] = useState<string>('');

  function pickFirebotImage() {
    const logos = [
      'bat.png',
      'cheer.png',
      'dum.png',
      'heart-eyes.png',
      'heart.png',
      'judging.png',
      'kiss.png',
      'music.png',
      'pointing.png',
      'queen.png',
      'smile.png',
      'wink.png',
    ];

    const logo = logos[Math.floor(Math.random() * logos.length)];
    const logoUrl = `https://jesski.com/assets/images/emotes/${logo}`;

    setFirebotImage(logoUrl);
  }

  async function getOnlineStatus() {
    try {
      const streamStatus = await axios.request({
        url: '/api/twitch/online',
        baseURL: process.env.JESSKI_URL,
      });
      setStreamIsOnline(streamStatus.data.status);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  useEffect(() => {
    if (streamIsOnline == null) {
      getOnlineStatus();
    }

    if (!firebotImage) {
      pickFirebotImage();
    }
  }, [firebotImage, streamIsOnline]);

  return (
    <div className="index-header items-end flex-wrap flex justify-around mb-3 bg-cstyle-green rounded p-2">
      {streamIsOnline == null && (
        <div className="pl-2">
          <Spinner />
        </div>
      )}
      {streamIsOnline && (
        <div className="pl-2 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-6 text-white flex flex-col justify-center">
            <h1 className="text-4xl">Jesski is live streaming right now!</h1>
            <p>
              Jess is live right now and you&apos;re missing out! You can click
              the link below to join in and become part of the community.
            </p>
            <Link
              href="https://twitch.tv/Jesski"
              target="_blank"
              className="text-white font-bold mt-4"
            >
              Watch Now {'>'}
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-6 flex justify-center items-center">
            <iframe
              src="https://player.twitch.tv/?channel=Jesski&parent=jesski.com"
              height="480"
              width="100%"
              allowFullScreen={true}
              frameBorder="0"
              className="w-full m-4"
            ></iframe>
          </div>
        </div>
      )}
      {streamIsOnline === false && (
        <div className="pl-2 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {props.children}
          </div>
          <div className="col-span-2 md:col-span-3 lg:col-span-2 hidden justify-end align-middle md:flex">
            {firebotImage && (
              <Image
                src={firebotImage}
                alt="jesski emote"
                className="w-full h-fit"
                width="178"
                height="178"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageIntroBox;
