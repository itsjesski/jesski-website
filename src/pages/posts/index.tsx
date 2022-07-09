import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import Pagination from '../../components/Pagination';
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
        <div className="post-index">
          <ul className="flex flex-wrap">
            {fbPosts?.map((elt) => (
              <li key={elt.slug} className="p-2 lg:w-1/6 md:w-1/2 w-full">
                <div className="border-solid border-fbstyle-300 border-2 shadow">
                  <Link href="/posts/[slug]" as={`/posts/${elt.slug}`}>
                    <a>
                      <div className="blog-image">
                        <img src={elt.image} alt="image"></img>
                      </div>
                      <div className="text-left p-2 text-fbstyle-50">
                        <h2>{elt.title}</h2>
                        <span className="text-left text-sm text-fbstyle-100">
                          {format(new Date(elt.date), 'LLL d, yyyy')}
                        </span>
                      </div>
                    </a>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Content>
      {totalPages >= 1 && (
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
