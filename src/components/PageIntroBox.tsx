import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Link from 'next/link';

import { Spinner } from './Spinner';

const PageIntroBox: React.FC<{}> = (props) => {
  const [streamIsOnline, setStreamIsOnline] = useState<boolean>();
  const [firebotImage, setFirebotImage] = useState<string>();

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
    const logoUrl = `/assets/images/emotes/${logo}`;

    setFirebotImage(logoUrl);
  }

  async function getOnlineStatus() {
    try {
      const streamStatus = await axios.request({
        url: '/api/twitch/online',
        baseURL: process.env.SITE_URL,
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

    if (firebotImage == null) {
      pickFirebotImage();
    }
  }, [firebotImage, streamIsOnline]);

  return (
    <div className="index-header items-end flex-wrap flex justify-around mb-10 mt-10">
      {streamIsOnline == null && (
        <div className="pl-2">
          <Spinner></Spinner>
        </div>
      )}

      {streamIsOnline && (
        <div className="pl-2 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <h1 className="text-cstyle-highlight">Jesski is live!</h1>
            <p>
              The Twitch stream is on air right now, and you&apos;re missing
              out! If you&apos;d like to join in and become part of the
              community, just click the button below!
            </p>
            <Link href="https://twitch.tv/Jesski" target="_blank">
              <button
                type="button"
                className="flex items-center leading-none border  border-white hover:border-transparent hover:text-slate-500 hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
              >
                Watch Live
              </button>
            </Link>
          </div>
          <div className="col-span-2 md:col-span-3 lg:col-span-2 flex justify-center align-middle">
            <img
              src={firebotImage}
              alt="firebot logo"
              className="w-full h-fit"
            ></img>
          </div>
        </div>
      )}

      {streamIsOnline === false && (
        <div className="pl-2 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {props.children}
          </div>
          <div className="col-span-2 md:col-span-3 lg:col-span-2 hidden justify-end align-middle md:flex">
            <img
              src={firebotImage}
              alt="firebot logo"
              className="w-full h-fit"
            ></img>
          </div>
        </div>
      )}
    </div>
  );
};

export { PageIntroBox };
