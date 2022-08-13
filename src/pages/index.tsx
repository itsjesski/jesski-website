import React from 'react';

import { BlogGallery } from '../components/BlogGallery';
import { GameGallery } from '../components/GameGallery';
import { PageIntroBox } from '../components/PageIntroBox';
import { ScreenshotGallery } from '../components/ScreenshotGallery';
import { Content } from '../content/Content';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';

const Index = () => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <Content>
      <PageIntroBox>
        <h1 className="text-fbstyle-highlight">Welcome!</h1>
        <p>
          You&apos;ve entered the world of Firebottle. Here you&apos;ll find
          tidbits from all of my different passions from video games, to
          development, books, entertainment, and more. This site serves as a hub
          for my ramblings and sharing info with amazing friends I&apos;ve met
          while pursuing all of these fun hobbies.
        </p>
      </PageIntroBox>
      <GameGallery></GameGallery>
      <ScreenshotGallery></ScreenshotGallery>
      <BlogGallery></BlogGallery>
    </Content>
  </Main>
);

export default Index;
