import React from 'react';

import { BlogGallery } from '../components/BlogGallery';
import { GameGallery } from '../components/GameGallery';
import { Content } from '../content/Content';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';

const Index = () => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <Content>
      <div className="index-header mb-10 items-end flex-wrap pb-2 flex justify-between bg-slate-700 p-3 shadow-steam">
        <div className="pl-2">
          <h1>Welcome!</h1>
          <p>
            You&apos;ve entered the world of Firebottle. Here you&apos;ll find
            tidbits from all of my different passions from video games, to
            developement, books, entertainment, and more. This site serves as a
            hub for my ramblings and sharing info with amazing friends I&apos;ve
            met while pursuing all of these fun hobbies.
          </p>
        </div>
      </div>
      <GameGallery></GameGallery>
      <BlogGallery></BlogGallery>
    </Content>
  </Main>
);

export default Index;
