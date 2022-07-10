import React from 'react';

import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';

import { posts } from '../../../public/cache/_games';
import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { filterPostFields } from '../../utils/ApiHelper';
import { getGameByName, getGenreString, IGDBGame } from '../../utils/IGDB';
import { markdownToHtml } from '../../utils/Markdown';
import { GameResponse } from '../../utils/Posts';

type IPostUrl = {
  slug: string;
};

type GameDetails = {
  post: {
    title: string;
    description: string;
    date: string;
    modified_date: string;
    content: string;
    score: number;
  };
  igdb: IGDBGame;
};

function getPostBySlug(slug: string, fields: string): GameResponse {
  let result = posts.filter((post) => {
    return post.slug === slug;
  });

  result = filterPostFields(result, fields);

  return {
    results: result,
    totalPosts: posts.length,
  };
}

const DisplayPost = (props: GameDetails) => (
  <Main
    meta={
      <Meta
        title={props.post.title}
        description={props.post.description}
        post={{
          image:
            props.igdb.screenshots != null ? props.igdb.screenshots[0].url : '',
          date: props.post.date,
          modified_date: props.post.modified_date,
        }}
      />
    }
  >
    <div
      className="details-header bg-blend-overlay bg-no-repeat bg-cover bg-center pt-60 pb-60 flex justify-center items-center shadow-steam"
      style={{
        backgroundImage: `linear-gradient(rgba(22, 101, 52, 0.9), rgba(30, 64, 175, 0.9)),url(${props.igdb.screenshots[0].url})`,
      }}
    >
      <div className="bg-slate-800 pl-20 pr-20 pt-10 pb-10 shadow-steam">
        <h1 className="text-center font-bold text-3xl text-white text-shadow-lg">
          {props.post.title}
        </h1>
      </div>
    </div>

    <div className="details-content flex">
      <div className="details-sidebar shadow-steam bg-slate-800 p-4 mt-4 mr-4 w-1/4">
        <div className="firebottle-details border-b-slate-700 border-solid border-b-2 pb-2 mb-2">
          <div className="genre">
            <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
              Firebottle Rating:{' '}
            </span>
            <span className="relative z-20">{props.post.score}</span>
          </div>
          <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
            <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
              Played:{' '}
            </span>
            <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="text-positive">
                {format(new Date(props.post.date), 'LLL d, yyyy')}
              </span>
            </span>
          </div>
        </div>
        <div className="game-info">
          <div className="genre">
            <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
              Genre:{' '}
            </span>
            <span className="relative z-20">
              {props.igdb?.genres != null && getGenreString(props.igdb?.genres)}
            </span>
          </div>
          <div className="genre">
            <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
              Critics Rating:{' '}
            </span>
            <span className="relative z-20">
              {props.igdb?.aggregated_rating != null &&
                Math.floor(props.igdb?.aggregated_rating)}
              {props.igdb?.aggregated_rating == null && 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <Content>
          <div className="p-4 mt-4">
            {props.post.content === '' && (
              <div className="no-review mb-4">
                <h2>
                  Sorry, Firebottle either hasn&apos;t written a review for this
                  game yet! But, here is how IGDB describes the game:
                </h2>
              </div>
            )}
            <div
              className="content"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html:
                  props.post.content !== ''
                    ? props.post.content
                    : props.igdb.summary,
              }}
            />
          </div>
        </Content>
      </div>
    </div>
  </Main>
);

export const getStaticPaths: GetStaticPaths<IPostUrl> = async () => {
  return {
    paths: posts.map((post: { slug: string }) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  Partial<GameDetails>,
  IPostUrl
> = async ({ params }) => {
  const post = getPostBySlug(
    params!.slug,
    'title,description,date,modified_date,content,slug,score'
  );

  const postResult = post.results[0];
  const content = await markdownToHtml(postResult.content || '');

  const igdbData = await getGameByName(postResult.title, [
    'id',
    'name',
    'cover.url',
    'genres.name',
    'screenshots.url',
    'videos',
    'aggregated_rating',
    'summary',
  ]);
  const igdbGame = {
    igdb: igdbData[0],
  };

  const postData = {
    post: {
      title: postResult.title,
      description: postResult.description,
      date: postResult.date,
      modified_date: postResult.modified_date,
      score: postResult.score,
      content,
    },
  };

  const propsData = {
    ...postData,
    ...igdbGame,
  };

  return {
    props: propsData,
  };
};

export default DisplayPost;
