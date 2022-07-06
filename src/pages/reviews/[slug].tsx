import React from 'react';

import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';

import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { markdownToHtml } from '../../utils/Markdown';
import { getAllReviewPosts, getReviewBySlug } from '../../utils/Reviews';

type IPostUrl = {
  slug: string;
};

type IPostProps = {
  title: string;
  date: string;
  modified_date: string;
  score: any; // TODO: Fix the any type?
  screenshots: any; // TODO: Fix the any type?
  content: string;
  description: string;
};

const DisplayPost = (props: IPostProps) => (
  <Main
    meta={
      <Meta
        title={props.title}
        description={props.description}
        post={{
          image: props.screenshots[0],
          date: props.date,
          modified_date: props.modified_date,
        }}
      />
    }
  >
    <h1 className="text-center font-bold text-3xl text-fbstyle-400">
      {props.title}
    </h1>
    <div className="text-center text-sm mb-8">
      {format(new Date(props.date), 'LLLL d, yyyy')}
    </div>

    <Content>
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    </Content>
  </Main>
);

export const getStaticPaths: GetStaticPaths<IPostUrl> = async () => {
  const posts = getAllReviewPosts(['slug']);

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<IPostProps, IPostUrl> = async ({
  params,
}) => {
  const post = getReviewBySlug(params!.slug, [
    'title',
    'description',
    'score',
    'date',
    'modified_date',
    'playtime',
    'screenshots',
    'content',
    'slug',
  ]);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      title: post.title,
      description: post.description,
      score: post.score,
      date: post.date,
      modified_date: post.modified_date,
      playtime: post.playtime,
      screenshots: post.screenshots,
      content,
    },
  };
};

export default DisplayPost;
