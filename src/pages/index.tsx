import React from 'react';

import { GetStaticProps } from 'next';

import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { getBlogPosts } from '../utils/Posts';
import { BlogGallery, IBlogGalleryProps } from '../widgets/BlogGallery';
import { IReviewGalleryProps, ReviewGallery } from '../widgets/ReviewGallery';

export type IndexProps = {
  blog: IBlogGalleryProps;
  reviews: IReviewGalleryProps;
};

const Index = (props: IndexProps) => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <ReviewGallery></ReviewGallery>
    <BlogGallery posts={props.blog.posts} />
  </Main>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      blog: {
        posts: await getBlogPosts(['title', 'date', 'slug', 'image']),
      },
    },
  };
};

export default Index;
