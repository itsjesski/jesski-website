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
  const posts = await getReviewPosts(['slug']);

  return {
    paths: posts.map((post) => ({
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

  const content = await markdownToHtml(post[0].content || '');

  return {
    props: {
      title: post[0].title,
      description: post[0].description,
      date: post[0].date,
      modified_date: post[0].modified_date,
      content,
    },
  };
};

export default DisplayPost;
