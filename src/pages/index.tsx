import React from 'react';

import GameGallery from '../components/GameGallery';
import PageIntroBox from '../components/PageIntroBox';
import Content from '../content/Content';
import Meta from '../layout/Meta';
import Main from '../templates/Main';
import AppConfig from '../utils/AppConfig';

const Index = () => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <Content>
      <PageIntroBox>
        <h1 className="text-white font-semibold text-4xl">
          Hi, my name is Jessica.
        </h1>
        <p className="text-white">
          You&apos;ve entered the world of Jesski, aka Jessica. Here you&apos;ll
          find tidbits from all of my different passions from video games, to
          web development, books, entertainment, and more. This site serves as a
          hub for my ramblings and sharing info with amazing friends I&apos;ve
          met while pursuing all of these fun hobbies.
        </p>
      </PageIntroBox>
      <GameGallery></GameGallery>
    </Content>
  </Main>
);

export default Index;
