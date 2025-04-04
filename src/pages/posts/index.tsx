import React, { useEffect, useState, useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import PageIntroBox from '../../components/PageIntroBox';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import Content from '../../content/Content';
import Meta from '../../layout/Meta';
import Main from '../../templates/Main';
import AppConfig from '../../utils/AppConfig';
import { getAllPosts } from '../../utils/Posts';
import { Post } from '../../types/Posts';
import PostCard from '../../components/PostCard';
import 'yet-another-react-lightbox/styles.css';

type FilterType = 'all' | 'artwork' | 'game-review' | 'blog';

const AllPostsPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lightbox, setLightbox] = useState({
    open: false,
    slides: [] as { src: string }[],
    index: 0,
  });

  // Load posts on component mount
  useEffect(() => {
    const posts = getAllPosts();
    setAllPosts(posts);

    // Calculate total pages based on post count
    const pageSize = AppConfig.pagination_size || 12;
    setTotalPages(Math.max(1, Math.ceil(posts.length / pageSize)));
  }, []);

  // Filter posts based on selected type
  const filteredPosts = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];

    return filter === 'all'
      ? allPosts
      : allPosts.filter((post) => post.type === filter);
  }, [allPosts, filter]);

  // Get current page of posts
  const currentPosts = useMemo(() => {
    if (!filteredPosts || filteredPosts.length === 0) return [];

    const pageSize = AppConfig.pagination_size || 12;
    const startIndex = (page - 1) * pageSize;
    return filteredPosts.slice(startIndex, startIndex + pageSize);
  }, [filteredPosts, page]);

  // Pagination handlers
  const handlePrevPage = () => {
    const newPage = page - 1 > 1 ? page - 1 : 1;
    setPage(newPage);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    const newPage = nextPage <= totalPages ? nextPage : totalPages;
    setPage(newPage);
  };

  // Function to open lightbox with given images
  const openLightbox = (images: string[], index: number) => {
    setLightbox({
      open: true,
      slides: images.map((src) => ({ src })),
      index,
    });
  };

  return (
    <Main
      meta={
        <Meta
          title="All Posts | Jesski"
          description="Browse all posts including art, games, and blog entries"
        />
      }
    >
      <Content>
        <PageIntroBox>
          <h1 className="text-white text-4xl">All Content</h1>
          <p className="text-white">
            Browse through all my posts, including art, games, and blog entries.
          </p>
        </PageIntroBox>

        <div className="index-header mb-3 items-end flex-wrap pb-2 flex justify-between">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === 'all'
                  ? 'bg-cstyle-highlight text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setFilter('all')}
            >
              All Posts
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'artwork'
                  ? 'bg-cstyle-highlight text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setFilter('artwork')}
            >
              Art
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'game-review'
                  ? 'bg-cstyle-highlight text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setFilter('game-review')}
            >
              Games
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === 'blog'
                  ? 'bg-cstyle-highlight text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setFilter('blog')}
            >
              Blog
            </button>
          </div>
          <div className="search-container">
            <Search postType="posts"></Search>
          </div>
        </div>

        {!currentPosts || currentPosts.length === 0 ? (
          <div className="text-center py-8 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl">No posts found</h3>
            <p className="text-gray-600 mt-2">
              There are currently no posts in this category.
            </p>
          </div>
        ) : (
          <div className="post-index">
            <div className="flex flex-wrap">
              {currentPosts.map((post) => (
                <PostCard
                  key={`${post.type}-${post.slug}`}
                  post={post}
                  openLightbox={
                    post.type === 'artwork' ? openLightbox : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
      </Content>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
      )}

      <Lightbox
        open={lightbox.open}
        close={() => setLightbox({ ...lightbox, open: false })}
        slides={lightbox.slides}
        index={lightbox.index}
      />
    </Main>
  );
};

export default AllPostsPage;
