import React, { useEffect, useState } from 'react';

import { Listbox } from '@headlessui/react';
import Link from 'next/link';

import { GameCard } from '../../components/GameCard';
import { PageIntroBox } from '../../components/PageIntroBox';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { AppConfig } from '../../utils/AppConfig';
import { FBGame, getGamePosts } from '../../utils/Posts';

type GameSort = {
  id: number;
  name: string;
  unavailable: boolean;
  value: string;
};

const PostsIndex: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(() => {
    return 1;
  });
  const [fbPosts, setPostData] = useState<FBGame[]>();
  const [totalPages, setTotalPages] = useState<number>(() => {
    return 1;
  });
  const sorters = [
    { id: 1, name: 'Played (ASC)', value: 'date:asc', unavailable: false },
    { id: 2, name: 'Played (DESC)', value: 'date:desc', unavailable: false },
    { id: 3, name: 'Score (ASC)', value: 'score:asc', unavailable: false },
    { id: 4, name: 'Score (DESC)', value: 'score:desc', unavailable: false },
  ];
  const [selectedSort, setSelectedSort] = useState<GameSort>(sorters[1]);

  function updateBlogPosts(newPage: number, sort: string = '') {
    getGamePosts(
      ['id', 'title', 'date', 'slug', 'score', 'image', 'cover', 'awards'],
      newPage,
      sort
    ).then((gamePosts) => {
      setPostData(gamePosts.results);
      setTotalPages(
        Math.floor(gamePosts.totalPosts / AppConfig.pagination_size)
      );
    });
  }

  function handleSortChange(event: any) {
    setSelectedSort(event);
    updateBlogPosts(page, event.value);
  }

  const handlePrevPage = () => {
    const newPage = page - 1 > 1 ? page - 1 : 1;
    setPage(newPage);
    updateBlogPosts(newPage, selectedSort.value);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    const newPage = nextPage <= totalPages ? nextPage : totalPages;
    setPage(newPage);
    updateBlogPosts(newPage, selectedSort.value);
  };

  useEffect(() => {
    if (fbPosts == null) {
      updateBlogPosts(page, selectedSort.value);
    }
  });

  return (
    <Main
      meta={
        <Meta
          title="Video Game Reviews | Firebottle"
          description="Game reviews by Firebottle."
        />
      }
    >
      <Content>
        <PageIntroBox>
          <h1 className="text-fbstyle-highlight">Games</h1>
          <p>
            Since 2015 I&apos;ve been keeping track of all the games I have
            played and creating tiny reviews. Below you will find games of all
            types and sizes. I am very thankful to all of the devs for the
            thousands of hours of enjoyment.
          </p>
          <div className="mt-6">
            <Link href="/games/awards">
              <a>
                <button type="button" className="">
                  Game of the Year Picks {'>'}
                </button>
              </a>
            </Link>
          </div>
        </PageIntroBox>
        <div className="index-header mb-3 items-end flex-wrap pb-2 flex justify-between">
          <div className="pl-2"></div>
          <div className="flex justify-between items-center pl-2 pr-2">
            <div className="filter relative w-1/2 mr-2  md:w-1/2 sm:w-full">
              <Listbox value={sorters} onChange={handleSortChange}>
                <Listbox.Button className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 w-full p-2.5 pr-4 flex justify-between">
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {selectedSort.name}
                </Listbox.Button>
                <Listbox.Options className="absolute w-full bg-slate-50 text-slate-400 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 shadow-2xl z-20 mt-1">
                  {sorters.map((sorter) => (
                    <Listbox.Option
                      key={sorter.id}
                      value={sorter}
                      disabled={sorter.unavailable}
                      className="text-slate-900 hover:bg-slate-100 pl-4 pr-4 pt-2 pb-2 flex justify-between flex-col border rounded-lg border-slate-50 text-sm cursor-pointer"
                    >
                      {sorter.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
            <div className="search-container">
              <Search postType="games"></Search>
            </div>
          </div>
        </div>
        <div className="post-index">
          <div className="flex flex-wrap">
            {fbPosts?.map((elt) => (
              <GameCard game={elt} size="medium" key={elt.slug}></GameCard>
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
