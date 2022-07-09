import React, { useEffect, useState } from 'react';

import { GameCard } from '../../components/GameCard';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { AppConfig } from '../../utils/AppConfig';
import { FBGame, getGamePosts } from '../../utils/Posts';

const PostsIndex: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(() => {
    return 1;
  });
  const [fbPosts, setPostData] = useState<FBGame[]>();
  const [totalPages, setTotalPages] = useState<number>(() => {
    return 1;
  });

  function updateBlogPosts(newPage: number) {
    getGamePosts(['id', 'title', 'date', 'slug', 'score'], newPage).then(
      (gamePosts) => {
        setPostData(gamePosts.results);
        setTotalPages(
          Math.floor(gamePosts.totalPosts / AppConfig.pagination_size)
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
            <h1>Games</h1>
          </div>
          <div className="search-container">
            <Search postType="games"></Search>
          </div>
        </div>
        <div className="post-index">
          <div className="flex flex-wrap justify-between">
            {fbPosts?.map((elt) => (
              <GameCard game={elt} key={elt.slug}></GameCard>
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
