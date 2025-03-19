import React from 'react';
import Main from '../../templates/Main';
import PageIntroBox from '../../components/PageIntroBox';
import Content from '../../content/Content';
import Meta from '../../layout/Meta';
import DailyArtChallenge from '../../components/ArtChallenge';

const ArtJourney: React.FC = () => {
  return (
    <Main
      meta={
        <Meta
          title="My Art Learning Journey"
          description="Welcome to my art journey! Here you can see my progress as I create a new piece of art every day."
        />
      }
    >
      <Content>
        <PageIntroBox>
          <h1 className="text-white text-4xl">Art</h1>
          <p className="text-white">
            In February 2025, I decided to start a new journey to learn how to
            draw. On this page you can see my progress so far as I attempt to
            learn.
          </p>
        </PageIntroBox>
        <DailyArtChallenge />
      </Content>
    </Main>
  );
};

export default ArtJourney;
