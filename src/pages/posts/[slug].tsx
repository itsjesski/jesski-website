import React from 'react';

import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';

import { posts } from '../../../public/cache/_posts';
import Content from '../../content/Content';
import Meta from '../../layout/Meta';
import Main from '../../templates/Main';
import { filterPostFields } from '../../utils/ApiHelper';
import markdownToHtml from '../../utils/Markdown';
import { FBPost, PostResponse } from '../../utils/Posts';

type IPostUrl = {
  slug: string;
};

function getPostBySlug(slug: string, fields: string): PostResponse {
  let result = posts.filter((post) => {
    return post.slug === slug;
  });

  result = filterPostFields(result, fields);

  return {
    results: result,
    totalPosts: posts.length,
  };
}

const DisplayPost = (props: FBPost) => (
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
    <div
      className="details-header bg-blend-overlay bg-no-repeat bg-cover bg-center pt-60 pb-60 flex justify-center items-center shadow-steam mb-10"
      style={{
        backgroundImage: `linear-gradient(rgba(22, 101, 52, 0.9), rgba(30, 64, 175, 0.9)),url(${props.image})`,
      }}
    >
      <div className="bg-slate-800 pl-20 pr-20 pt-10 pb-10 shadow-steam">
        <h1 className="text-center font-bold text-3xl  text-shadow-lg">
          {props.title}
          <div className="text-center text-sm">
            {format(new Date(props.date), 'LLLL d, yyyy')}
          </div>
        </h1>
      </div>
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
  Partial<FBPost>,
  IPostUrl
> = async ({ params }) => {
  const post = await getPostBySlug(
    params!.slug,
    'title,description,date,modified_date,image,content,slug'
  );

  const postResult = post.results[0];
  const content = await markdownToHtml(postResult.content || '');

  return {
    props: {
      title: postResult.title,
      description: postResult.description,
      date: postResult.date,
      modified_date: postResult.modified_date,
      image: postResult.image,
      content,
    },
  };
};

export default DisplayPost;
