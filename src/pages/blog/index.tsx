import React, { useEffect, useState } from 'react';

import BlogCard from '../../components/BlogCard';
import PageIntroBox from '../../components/PageIntroBox';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import Content from '../../content/Content';
import Meta from '../../layout/Meta';
import Main from '../../templates/Main';
import AppConfig from '../../utils/AppConfig';
import { getBlogPosts } from '../../utils/Posts';
import { FBPost } from '../../types';

const PostsIndex: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(() => {
    return 1;
  });
  const [fbPosts, setPostData] = useState<FBPost[]>();
  const [totalPages, setTotalPages] = useState<number>(() => {
    return 1;
  });

  function updateBlogPosts(newPage: number) {
    getBlogPosts(['title', 'date', 'slug', 'image'], newPage).then(
      (blogPosts) => {
        setPostData(blogPosts.results);
        setTotalPages(
          Math.floor(blogPosts.totalPosts / AppConfig.pagination_size)
        );
      }
    );
  }

  const handlePrevPage = () => {
    const newPage = page - 1 > 1 ? page - 1 : 1;
    setPage(newPage);
    updateBlogPosts(newPage);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    const newPage = nextPage <= totalPages ? nextPage : totalPages;
    setPage(newPage);
    updateBlogPosts(newPage);
  };

  useEffect(() => {
    if (fbPosts == null) {
      updateBlogPosts(page);
    }
  });

  return (
    <Main
      meta={
        <Meta
          title="Blog Posts"
          description="Blog posts from the mind of Jesski."
        />
      }
    >
      <Content>
        <PageIntroBox>
          <h1 className="text-cstyle-green">Blog</h1>
          <p>
            Below you&apos;ll find a bunch of notes and ramblings on various
            different things I feel like writing about. To be honest, this may
            not get updated often. But, I hope what you do find is interesting.
          </p>
        </PageIntroBox>
        <div className="mb-3 flex justify-between items-end flex-wrap pb-2">
          <div className=""></div>
          <div className="search-container">
            <Search postType="posts"></Search>
          </div>
        </div>
        <div className="post-index">
          <div className="flex flex-wrap">
            {fbPosts?.map((elt) => (
              <BlogCard post={elt} key={elt.slug}></BlogCard>
            ))}
          </div>
        </div>
      </Content>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
      )}
    </Main>
  );
};

export default PostsIndex;
