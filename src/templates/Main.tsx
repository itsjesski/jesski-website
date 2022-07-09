import React, { ReactNode } from 'react';

import Link from 'next/link';

import { Logo } from '../content/modules/Logo';
import { Navbar } from '../navigation/Navbar';
import { AppConfig } from '../utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full text-white bg-slate-900">
    {props.meta}

    <div className="mx-auto page-wrapper">
      <div className="flex bg-slate-700 p-3 border-b-2 border-slate-300">
        <nav className="container mx-auto items-center justify-between flex flex-wrap">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <Logo></Logo>
            <span className="font-semibold text-xl tracking-tight text-white">
              {AppConfig.title}
            </span>
          </div>
          <div className="block lg:hidden">
            <button className="flex items-center px-3 py-2 border rounded text-slate-200 border-slate-400 hover:text-white hover:border-white">
              <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <Navbar>
              <li className="mr-6">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li className="mr-6">
                <Link href="/about/">
                  <a>About</a>
                </Link>
              </li>
              <li className="mr-6">
                <a href="https://github.com/firebottle">GitHub</a>
              </li>
            </Navbar>
            <div>
              <a
                href="https://twitch.tv/FirebottleTV"
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white mt-4 lg:mt-0"
              >
                Twitch
              </a>
            </div>
          </div>
        </nav>
      </div>

      <div className="text-xl py-5 container mx-auto">{props.children}</div>

      <div className="border-t border-slate-300 text-center py-8 text-sm">
        © Copyright {new Date().getFullYear()} {AppConfig.title}. Game data from{' '}
        <Link href="https://igdb.com" target="_blank">
          <a>IGDB.com</a>
        </Link>
      </div>
    </div>
  </div>
);

export { Main };
