import React from 'react';

import { GetStaticProps } from 'next';

import { BlogGallery, IBlogGalleryProps } from '../blog/BlogGallery';
import { Meta } from '../layout/Meta';
import { IPaginationProps } from '../pagination/Pagination';
import { IReviewGalleryProps, ReviewGallery } from '../reviews/ReviewGallery';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { getAllBlogPosts } from '../utils/Blog';
import { getAllReviewPosts } from '../utils/Reviews';

export type IndexProps = {
  blog: IBlogGalleryProps;
  reviews: IReviewGalleryProps;
};

const Index = (props: IndexProps) => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <ReviewGallery
      posts={props.reviews.posts}
      pagination={props.reviews.pagination}
    ></ReviewGallery>
    <BlogGallery posts={props.blog.posts} pagination={props.blog.pagination} />
  </Main>
);

export const getStaticProps: GetStaticProps = async () => {
  const blogPosts = getAllBlogPosts(['title', 'date', 'slug', 'image']);
  const blogPagination: IPaginationProps = {};

  if (blogPosts.length > AppConfig.pagination_size) {
    blogPagination.next = '/page2';
  }

  const reviewPosts = getAllReviewPosts(['id', 'title', 'date', 'slug']);
  const reviewPagination: IPaginationProps = {};

  if (reviewPosts.length > AppConfig.pagination_size) {
    reviewPagination.next = '/page2';
  }

  return {
    props: {
      blog: {
        posts: blogPosts.slice(0, AppConfig.pagination_size),
        pagination: blogPagination,
      },
      reviews: {
        posts: reviewPosts.slice(0, AppConfig.pagination_size),
        pagination: reviewPagination,
      },
    },
  };
};

export default Index;
