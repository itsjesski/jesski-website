import React from 'react';

import { GetStaticProps } from 'next';

import { BlogGallery, IBlogGalleryProps } from '../blog/BlogGallery';
import { Meta } from '../layout/Meta';
import { IReviewGalleryProps, ReviewGallery } from '../reviews/ReviewGallery';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { getPosts } from '../utils/Posts';

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
        posts: getPosts('_posts', ['title', 'date', 'slug', 'image'], 5),
      },
      reviews: {
        posts: getPosts('_reviews', ['id', 'title', 'date', 'slug'], 5),
      },
    },
  };
};

export default Index;
