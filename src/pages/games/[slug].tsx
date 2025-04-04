import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import ReactPlayer from 'react-player';
import { posts } from '../../../public/cache/_games';
import Content from '../../content/Content';
import Meta from '../../layout/Meta';
import Main from '../../templates/Main';
import { filterPostFields } from '../../utils/ApiHelper';
import { getGenreString } from '../../utils/IGDB';
import markdownToHtml from '../../utils/Markdown';
import {
  IGDBGame,
  IPostUrl,
  GameDetails,
  GameResponse,
  FBGame,
} from '../../types';

function getPostBySlug(slug: string, fields: string): GameResponse {
  let result = posts.filter((post) => {
    return post.slug === slug;
  });

  result = filterPostFields(result, fields);

  return {
    results: result as FBGame[],
    totalPosts: posts.length,
  };
}

const GameDetailsPage: React.FC<{ post: GameDetails }> = (props) => {
  const [igdbData, setIgdbData] = useState<IGDBGame>();
  const [photoIndex, setPhotoIndex] = useState<number>();

  function getReviewDifference(
    fbReview: number,
    criticReview: number | undefined
  ) {
    if (criticReview == null) {
      return `N/A`;
    }

    const newCriticReview = Math.floor(criticReview);
    const newFBReview = Math.floor(fbReview);

    const difference = Math.round(newFBReview - newCriticReview);
    let diffText = '';
    if (difference < 0) {
      diffText = `-${Math.abs(difference)} points`;
    } else if (difference === 0) {
      diffText = `Nailed it`;
    } else {
      diffText = `+${difference} points`;
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

  const getReleaseDate = (releaseDate: number | undefined) => {
    return releaseDate
      ? format(new Date(releaseDate * 1000), 'LLL d, yyyy')
      : 'Unknown';
  };

  useEffect(() => {
    if (igdbData == null) {
      updateIGDBData(props.post?.id);
    }

    if (photoIndex == null) {
      setPhotoIndex(0);
    }
  }, [igdbData, photoIndex, props.post.id]);

  return (
    <div>
      <div
        className="details-header bg-blend-overlay bg-no-repeat bg-cover bg-center pt-60 pb-60 flex justify-center items-center shadow-steam"
        style={{
          backgroundImage: `linear-gradient(rgba(22, 101, 52, 0.9), rgba(30, 64, 175, 0.9)),url(${props.post.image})`,
        }}
      >
        <div className="bg-cstyle-text pl-20 pr-20 pt-10 pb-10 shadow-steam">
          <h1 className="text-center font-bold text-3xl text-cstyle-green text-shadow-lg before:content-none">
            {props.post?.title}
          </h1>
        </div>
      </div>

      <div className="details-content md:flex">
        <div className="details-sidebar shadow-steam bg-cstyle-green p-4 mt-4 mr-4 md:w-1/4 w-full">
          <div className="jesski-details border-b-cstyle-text border-solid border-b-2 pb-2 mb-2">
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="text-cstyle-text whitespace-nowrap font-bold">
                Release Date:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20 text-cstyle-text">
                <span className="text-positive">
                  {getReleaseDate(igdbData?.release_dates[0]?.date)}
                </span>
              </span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="text-cstyle-text whitespace-nowrap font-bold">
                Played:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20 text-cstyle-text">
                <span className="text-positive">
                  {format(new Date(props.post?.date), 'LLL d, yyyy')}
                </span>
              </span>
            </div>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20">
              <span className="text-cstyle-text whitespace-nowrap font-bold">
                Completed:{' '}
              </span>
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis relative z-20 text-cstyle-text">
                <span className="text-positive">
                  {props.post?.completed === true ? 'Yes' : 'No'}
                </span>
              </span>
            </div>
            <div className="genre">
              <span className="text-cstyle-text whitespace-nowrap font-bold">
                Genre:{' '}
              </span>
              <span className="relative z-20 text-cstyle-text">
                {igdbData?.genres != null && getGenreString(igdbData?.genres)}
              </span>
            </div>
            <div className="relative z-20">
              <span className="text-cstyle-text font-bold">Awards: </span>
              <span className="relative z-20 text-cstyle-text">
                {props.post?.goty.length === 0 && (
                  <span className="text-positive">None</span>
                )}
                {props.post?.goty?.map((goty) => (
                  <div key={goty}>
                    <span className="text-positive">GOTY {goty}</span>
                  </div>
                ))}
              </span>
            </div>
          </div>
          <div className="game-info border-b-slate-700 border-solid border-b-2 pb-2 mb-2">
            <div className="genre">
              <span className="text-cstyle-text whitespace-nowrap font-bold">
                Jesski Rating:{' '}
              </span>
              <span className="relative z-20 text-cstyle-text">
                {props.post?.score}
              </span>
            </div>
            <div className="crating">
              <span className="text-cstyle-text whitespace-nowrap font-bold">
                Critics Rating:{' '}
              </span>
              <span className="relative z-20 text-cstyle-text">
                {igdbData?.aggregated_rating != null &&
                  Math.floor(igdbData?.aggregated_rating)}
                {igdbData?.aggregated_rating == null && 'N/A'}
              </span>
            </div>
            <div className="cdifference">
              <span className="text-cstyle-text whitespace-nowrap font-bold">
                Difference:{' '}
              </span>
              <span className="relative z-20 text-cstyle-text">
                {getReviewDifference(
                  props.post?.score,
                  igdbData?.aggregated_rating
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="md:w-3/4 w-full">
          <Content>
            <div className="p-4 mt-4">
              {props.post.content !== '' && (
                <div>
                  <div className="review">
                    <h2>
                      Jesski <span className="text-cstyle-green">Review</span>
                    </h2>
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
                <div className="description mt-14">
                  <h2 className="mb-6">
                    IGDB <span className="text-cstyle-green">Description</span>
                  </h2>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: igdbData?.summary,
                    }}
                  ></div>
                </div>
              )}
              {props.post.videos.length > 0 && (
                <div className="description mt-14">
                  <h2 className="mb-6">
                    Archive <span className="text-cstyle-green">Video</span>
                  </h2>
                  <div className="content">
                    <ReactPlayer
                      url={props.post.videos[0]}
                      controls={true}
                      className="aspect-video"
                      width="100%"
                      height="100%"
                    />
                  </div>
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
    'title,description,date,modified_date,content,slug,score,cover,image,completed,id,goty,videos,screenshots'
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
    goty: postResult.goty,
    videos: postResult.videos,
    screenshots: postResult.screenshots,
    content,
  };

  return {
    props: postData,
  };
};

export default DisplayPost;
