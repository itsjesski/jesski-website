import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Link from 'next/link';

import { Navbar } from '../navigation/Navbar';
import { AppConfig } from '../utils/AppConfig';
import { Logo } from './Logo';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from '@headlessui/react';

const Header: React.FC<{}> = () => {
  const [streamIsOnline, setStreamIsOnline] = useState();

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
    if (streamIsOnline != null) return;
    getOnlineStatus();
  }, [streamIsOnline]);

  return (
    <nav className="py-2.5 rounded w-full bg-cstyle-background">
      <div className="flex flex-wrap justify-between items-center mx-auto">
        <div className="mr-3 h-6 sm:h-9 flex items-center">
          <Logo></Logo>
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            <Link href="/" className="text-cstyle-darktext">
              {AppConfig.title}
            </Link>
          </span>
        </div>

        <div id="navbar">
          <Navbar>
            <li className="block rounded md:bg-transparent md:p-0">
              <Menu>
                <MenuButton className="pr-4">
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="text-cstyle-darktext"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    className="hidden w-6 h-6"
                    aria-hidden="true"
                    fill="text-cstyle-darktext"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </MenuButton>
                <MenuItems
                  anchor="bottom end"
                  className="bg-cstyle-background p-4 drop-shadow-lg rounded"
                >
                  <MenuItem>
                    <Link
                      className="block text-cstyle-green hover:text-cstyle-darkblue font-semibold"
                      href="/"
                    >
                      Home
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      className="block text-cstyle-green hover:text-cstyle-darkblue font-semibold"
                      href="/about"
                    >
                      About Me
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href="https://twitch.tv/Jesski"
                      target="_blank"
                      className="block text-cstyle-green hover:text-cstyle-darkblue font-semibold"
                    >
                      Twitch
                      {streamIsOnline && (
                        <svg height="20" width="20">
                          <circle cx="10" cy="10" r="5" fill="green" />
                        </svg>
                      )}
                    </Link>
                  </MenuItem>
                  <MenuSeparator className="my-1 h-px bg-cstyle-deepbrown"></MenuSeparator>
                  <MenuItem>
                    <Link
                      className="block text-cstyle-green hover:text-cstyle-darkblue font-semibold"
                      href="/games"
                    >
                      Played Games
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      className="block text-cstyle-green hover:text-cstyle-darkblue font-semibold"
                      href="/games/awards"
                    >
                      Game of the Year
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </li>
          </Navbar>
        </div>
      </div>
    </nav>
  );
};
export { Header };
