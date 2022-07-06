import React from 'react';

import { GetStaticProps } from 'next';

import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { getPosts } from '../utils/Posts';
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
        posts: getPosts('_posts', ['title', 'date', 'slug', 'image'], 5),
      },
      reviews: {
        posts: getPosts(
          '_reviews',
          ['id', 'title', 'date', 'slug', 'score'],
          5
        ),
      },
    },
  };
};

export default Index;
