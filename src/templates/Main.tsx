import React, { ReactNode } from 'react';

import Link from 'next/link';

import Header from '../components/Header';
import AppConfig from '../utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full ">
    {props.meta}

    <div className="mx-auto page-wrapper container bg-white drop-shadow-lg m-1 pl-3 pr-3">
      <div className="flex pt-3">
        <Header></Header>
      </div>

      <div className="text-xl py-5 mx-auto">{props.children}</div>

      <div className="border-t border-slate-300 text-center py-8 text-sm">
        © Copyright {new Date().getFullYear()} {AppConfig.title}. Game data from{' '}
        <Link href="https://igdb.com" target="_blank">
          IGDB.com
        </Link>
      </div>
    </div>
  </div>
);

export default Main;
