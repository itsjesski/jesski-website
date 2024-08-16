import React, { ReactNode } from 'react';

import Link from 'next/link';

import { Header } from '../components/Header';
import { AppConfig } from '../utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full ">
    {props.meta}

    <div className="mx-auto page-wrapper">
      <div className="flex p-3">
        <Header></Header>
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
