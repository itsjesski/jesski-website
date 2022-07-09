import React from 'react';

import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';

import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { markdownToHtml } from '../../utils/Markdown';
import {
  FBReview,
  getReviewPostBySlug,
  getReviewPosts,
} from '../../utils/Posts';

type IPostUrl = {
  slug: string;
};

const DisplayPost = (props: FBReview) => (
  <Main
    meta={
      <Meta
        title={props.title}
        description={props.description}
        post={{
          image: props.screenshots != null ? props.screenshots[0] : '',
          date: props.date,
          modified_date: props.modified_date,
        }}
      />
    }
  >
    <h1 className="text-center font-bold text-3xl text-slate-400">
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
  const posts = await getReviewPosts(['slug']);

  return {
    paths: posts.results.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  Partial<FBReview>,
  IPostUrl
> = async ({ params }) => {
  const post = await getReviewPostBySlug(params!.slug, [
    'title',
    'description',
    'date',
    'modified_date',
    'image',
    'content',
    'slug',
  ]);

  const postResult = post.results[0];
  const content = await markdownToHtml(postResult.content || '');

  return {
    props: {
      title: postResult.title,
      description: postResult.description,
      date: postResult.date,
      modified_date: postResult.modified_date,
      content,
    },
  };
};

export default DisplayPost;
