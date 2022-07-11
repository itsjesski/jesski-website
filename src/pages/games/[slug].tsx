import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';

import { posts } from '../../../public/cache/_games';
import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { filterPostFields } from '../../utils/ApiHelper';
import { getGenreString, IGDBGame } from '../../utils/IGDB';
import { markdownToHtml } from '../../utils/Markdown';
import { GameResponse } from '../../utils/Posts';

type IPostUrl = {
  slug: string;
};

type GameDetails = {
  id: number;
  title: string;
  description: string;
  date: string;
  modified_date: string;
  content: string;
  score: number;
  image: string;
  cover: string;
  completed: boolean;
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

const GameDetailsPage: React.FC<{ post: GameDetails }> = (props) => {
  const [igdbData, setIgdbData] = useState<IGDBGame>();

  function getReviewDifference(
    fbReview: number,
    criticReview: number | undefined
  ) {
    if (criticReview == null) {
      return `N/A`;
    }

    const newCriticReview = Math.floor(criticReview);
    const newFBReview = Math.floor(fbReview * 10);

    const difference = Math.round(newFBReview - newCriticReview);
    let diffText = '';
    if (difference < 0) {
      diffText = `Firebottle's score was ${Math.abs(
        difference
      )} lower than the critics.`;
    } else if (difference === 0) {
      diffText = `Firebottle's score was exactly the same as the critics!`;
    } else {
      diffText = `Firebottle's score was ${difference} higher than the critics.`;
    }
    return diffText;
  }

  async function updateIGDBData(id: number) {
    if (id == null) return;
    axios({
      method: 'post',
      url: `/api/igdb/${id}`,
    })
      .then((response) => {
        setIgdbData(response.data);
      })
      .catch(() => {
        return '';
      });
  }

  useEffect(() => {
    if (igdbData == null) {
      updateIGDBData(props.post?.id);
    }
  });

  return (
    <div>
      <div
        className="details-header bg-blend-overlay bg-no-repeat bg-cover bg-center pt-60 pb-60 flex justify-center items-center shadow-steam"
        style={{
          backgroundImage: `linear-gradient(rgba(22, 101, 52, 0.9), rgba(30, 64, 175, 0.9)),url(${props.post.image})`,
        }}
      >
        <div className="bg-slate-800 pl-20 pr-20 pt-10 pb-10 shadow-steam">
          <h1 className="text-center font-bold text-3xl text-white text-shadow-lg">
            {props.post?.title}
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
              <span className="relative z-20">{props.post?.score}</span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Played:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                <span className="text-positive">
                  {format(new Date(props.post?.date), 'LLL d, yyyy')}
                </span>
              </span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Finished?:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
                <span className="text-positive">
                  {props.post?.completed === true ? 'Complete' : 'Incomplete'}
                </span>
              </span>
            </div>
          </div>
          <div className="game-info border-b-slate-700 border-solid border-b-2 pb-2 mb-2">
            <div className="genre">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Genre:{' '}
              </span>
              <span className="relative z-20">
                {igdbData?.genres != null && getGenreString(igdbData?.genres)}
              </span>
            </div>
            <div className="genre">
              <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
                Critics Rating:{' '}
              </span>
              <span className="relative z-20">
                {igdbData?.aggregated_rating != null &&
                  Math.floor(igdbData?.aggregated_rating)}
                {igdbData?.aggregated_rating == null && 'N/A'}
              </span>
            </div>
          </div>
          <div className="pb-2 mb-2">
            <span className="uppercase text-gray-400 whitespace-nowrap text-xs md:text-sm">
              Difference:{' '}
            </span>
            <span className="relative z-20">
              {getReviewDifference(
                props.post?.score,
                igdbData?.aggregated_rating
              )}
            </span>
          </div>
        </div>
        <div className="w-3/4">
          <Content>
            <div className="p-4 mt-4">
              {props.post.content !== '' && (
                <div>
                  <div className="review mb-4">
                    <h2>Firebottle&apos;s Review:</h2>
                  </div>
                  <div
                    className="content"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: props.post?.content,
                    }}
                  ></div>
                </div>
              )}
              {igdbData?.summary != null && (
                <div className="description">
                  <h2 className="mb-4">Description:</h2>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: igdbData?.summary,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </Content>
        </div>
      </div>
    </div>
  );
};

const DisplayPost = (props: GameDetails) => (
  <Main
    meta={
      <Meta
        title={props.title}
        description={props.description}
        post={{
          image: props.image,
          date: props.date,
          modified_date: props.modified_date,
        }}
      />
    }
  >
    <GameDetailsPage post={props}></GameDetailsPage>
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
    'title,description,date,modified_date,content,slug,score,cover,image,completed,id'
  );

  const postResult = post.results[0];
  const content = await markdownToHtml(postResult.content || '');

  const postData = {
    id: postResult.id ? postResult.id : 0,
    title: postResult.title ? postResult.title : '',
    description: postResult.description ? postResult.description : '',
    date: postResult.date ? postResult.date : '',
    modified_date: postResult.modified_date ? postResult.modified_date : '',
    score: postResult.score ? postResult.score : 0,
    cover: postResult.cover ? postResult.cover : '',
    image: postResult.image ? postResult.image : '',
    completed: postResult.completed ? postResult.completed : false,
    content,
  };

  return {
    props: postData,
  };
};

export default DisplayPost;
