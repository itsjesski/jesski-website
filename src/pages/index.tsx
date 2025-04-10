import React from 'react';
import GameGallery from '../components/GameGallery';
import PostGallery from '../components/PostGallery';
import PageIntroBox from '../components/PageIntroBox';
import Content from '../content/Content';
import Meta from '../layout/Meta';
import Main from '../templates/Main';
import AppConfig from '../utils/AppConfig';

const Index: React.FC = () => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <Content>
      <PageIntroBox>
        <h1 className="text-white font-semibold text-4xl">
          Hi, my name is Jessica.
        </h1>
        <p className="text-white">
          You&apos;ve entered the world of Jesski, aka Jessica. Here you&apos;ll
          find tidbits from all of my different passions from video games, to
          web development, books, crafts, and more. I also livestream on Twitch
          and upload videos to YouTube. Feel free to explore and reach out to
          me!
        </p>
      </PageIntroBox>
      <PostGallery limit={6} />
      <GameGallery />
    </Content>
  </Main>
);

export default Index;
