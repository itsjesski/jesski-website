import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Link from 'next/link';

import { Spinner } from './Spinner';

const PageIntroBox: React.FC<{}> = (props) => {
  const [streamIsOnline, setStreamIsOnline] = useState();

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
    if (streamIsOnline != null) return;
    getOnlineStatus();
  }, [streamIsOnline]);

  return (
    <div className="index-header mb-10 items-end flex-wrap pb-2 flex justify-around bg-slate-700 p-3 shadow-steam">
      {streamIsOnline == null && (
        <div className="pl-2">
          <Spinner></Spinner>
        </div>
      )}

      {streamIsOnline && (
        <div className="pl-2">
          <h1>Firebottle is live!</h1>
          <p>
            The Twitch stream is on air right now, and you&apos;re missing out!
            If you&apos;d like to join in and become part of the community, just
            click the button below!
          </p>
          <Link href="https://twitch.tv/FirebottleTV" target={'_blank'}>
            <a>
              <button
                type="button"
                className="flex items-center leading-none border text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
              >
                Watch Live
              </button>
            </a>
          </Link>
        </div>
      )}

      {streamIsOnline === false && props.children}
    </div>
  );
};

export { PageIntroBox };
