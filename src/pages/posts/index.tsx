import React, { useEffect, useState } from 'react';

import { BlogCard } from '../../components/BlogCard';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { AppConfig } from '../../utils/AppConfig';
import { FBPost, getBlogPosts } from '../../utils/Posts';

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
          description="Blog posts from the mind of Firebottle."
        />
      }
    >
      <Content>
        <div className="index-header border-b-slate-400 border-solid border-b-2 mb-3 flex justify-between items-end flex-wrap pb-2">
          <div className="">
            <h1>Blog</h1>
          </div>
          <div className="search-container">
            <Search postType="posts"></Search>
          </div>
        </div>
        <div className="post-index">
          <ul className="flex flex-wrap">
            {fbPosts?.map((elt) => (
              <li key={elt.slug} className="p-2 lg:w-1/5 md:w-1/2 w-full">
                <BlogCard post={elt}></BlogCard>
              </li>
            ))}
          </ul>
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
