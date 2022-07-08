import React from 'react';

import { GetStaticProps } from 'next';

import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { getBlogPosts, getReviewPosts } from '../utils/Posts';
import { BlogGallery, IBlogGalleryProps } from '../widgets/BlogGallery';
import { IReviewGalleryProps, ReviewGallery } from '../widgets/ReviewGallery';

export type IndexProps = {
  blog: IBlogGalleryProps;
  reviews: IReviewGalleryProps;
};

const Index = (props: IndexProps) => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <ReviewGallery posts={props.reviews.posts}></ReviewGallery>
    <BlogGallery posts={props.blog.posts} />
  </Main>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      blog: {
        posts: await getBlogPosts(['title', 'date', 'slug', 'image']),
      },
      reviews: {
        posts: await getReviewPosts(['id', 'title', 'date', 'slug', 'score']),
      },
    },
  };
};

export default Index;
