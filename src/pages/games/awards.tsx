import React, { useEffect, useState } from 'react';

import { GameAwardGallery } from '../../components/GameAwardGallery';
import { PageIntroBox } from '../../components/PageIntroBox';
import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { FBGame, getGamePosts } from '../../utils/Posts';

const PostsIndex: React.FC<{}> = () => {
  const [fbPosts, setPostData] = useState<FBGame[]>();
  const [validYears, setValidYears] = useState<number[]>();

  function updateValidYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    let startYear = 2015;
    while (startYear < currentYear) {
      // eslint-disable-next-line no-plusplus
      years.push(startYear++);
    }
    setValidYears(years.reverse());
  }

  function updateBlogPosts() {
    getGamePosts([
      'id',
      'title',
      'date',
      'slug',
      'score',
      'image',
      'cover',
      'goty',
    ]).then((gamePosts) => {
      setPostData(gamePosts.results);
    });
  }

  useEffect(() => {
    if (fbPosts == null) {
      updateBlogPosts();
    }

    if (validYears == null) {
      updateValidYears();
    }
  });

  return (
    <Main
      meta={
        <Meta
          title="Best of the best games | Jesski"
          description="Game reviews by Jesski."
        />
      }
    >
      <Content>
        <PageIntroBox>
          <h1 className="text-cstyle-highlight">Game of the Year Awards</h1>
          <p>
            Since 2015 I&apos;ve selected three games to win the Game of the
            Year award. These are all selected from games I played, not
            nessessarily games released that year. I started keeping track in
            December 2015, so 2015 is a strange year. Regardless, all of my
            choices are below!
          </p>
        </PageIntroBox>
        <div className="post-index">
          <div className="flex">
            <div className="award-wrap flex flex-wrap">
              {validYears?.map((year: number) => (
                <GameAwardGallery
                  year={year.toString()}
                  key={year.toString()}
                ></GameAwardGallery>
              ))}
            </div>
          </div>
        </div>
      </Content>
    </Main>
  );
};

export default PostsIndex;
