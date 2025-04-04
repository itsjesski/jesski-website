/* eslint-disable no-console */
import axios from 'axios';
import {
  Post,
  ArtworkPost,
  GameReview,
  BlogPost,
  PostResponse,
  GameResponse,
} from '../types';

// Import cached posts if available
let artPosts: any[] = [];
let gamePosts: any[] = [];
let blogPosts: any[] = [];

try {
  // Try to import cached posts - use dynamic imports to avoid build errors if files don't exist
  import('../../public/cache/_art')
    .then((module) => {
      artPosts = module.posts || [];
    })
    .catch(() => {
      console.warn('Art posts cache not found');
    });

  import('../../public/cache/_games')
    .then((module) => {
      gamePosts = module.posts || [];
    })
    .catch(() => {
      console.warn('Game posts cache not found');
    });

  import('../../public/cache/_posts')
    .then((module) => {
      blogPosts = module.posts || [];
    })
    .catch(() => {
      console.warn('Blog posts cache not found');
    });
} catch (error) {
  console.warn('Failed to import cached posts:', error);
}

/**
 * Normalizes post fields across different content types
 */
function normalizePost(post: any): Post {
  const basePost = {
    ...post,
    slug: post.slug || '',
    title: post.title || 'Untitled',
    date: post.date || new Date().toISOString().split('T')[0],
    content: post.content || '',
  };

  if (post.type === 'artwork') {
    return {
      ...basePost,
      type: 'artwork',
      featuredImage: post.featuredImage || post.image || '',
      images: post.images || (post.featuredImage ? [post.featuredImage] : []),
      description: post.description || '',
    } as ArtworkPost;
  }

  if (post.type === 'game-review') {
    return {
      ...basePost,
      type: 'game-review',
      cover: post.cover || post.image || '',
      score: typeof post.score === 'number' ? post.score : null,
      description: post.description || '',
    } as GameReview;
  }

  // Default to blog post type
  return {
    ...basePost,
    type: 'blog',
    description: post.description || '',
    image: post.image || '',
  } as BlogPost;
}

/**
 * Gets all posts across all content types from cache
 */
export function getAllPosts(): Post[] {
  try {
    // Normalize posts from each content type
    const normalizedArtPosts = Array.isArray(artPosts)
      ? artPosts.map(normalizePost)
      : [];
    const normalizedGamePosts = Array.isArray(gamePosts)
      ? gamePosts.map(normalizePost)
      : [];
    const normalizedBlogPosts = Array.isArray(blogPosts)
      ? blogPosts.map(normalizePost)
      : [];

    // Combine all posts
    const allPosts = [
      ...normalizedArtPosts,
      ...normalizedGamePosts,
      ...normalizedBlogPosts,
    ];

    // Sort by date (newest first)
    return allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

/**
 * Gets posts by content type from cache
 */
export function getPostsByType(type: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.type === type);
}

/**
 * Gets a specific number of recent posts from cache
 */
export function getRecentPosts(count: number = 6): Post[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, count);
}

/**
 * Gets a specific post by slug and type from cache
 */
export function getPostBySlugFromCache(
  slug: string,
  type?: string
): Post | null {
  const posts = type ? getPostsByType(type) : getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

// Preserve existing API functions below this line

/**
 * Gets a post by post slug from API.
 * @param postType
 * @param slug
 * @param fields
 * @returns
 */
async function getPostBySlug(
  postType: string,
  slug: string,
  fields: string[]
): Promise<any> {
  // Existing API function implementation...
  let apiUrl = `/api/${postType}/${slug}/`;
  const encodedFields = encodeURIComponent(fields.join(','));

  if (fields.length > 0) {
    apiUrl = `${apiUrl}?fields=${encodedFields}`;
  }

  try {
    const response = await axios.request({
      url: apiUrl,
      baseURL: process.env.JESSKI_URL,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return [];
}

/**
 * Gets X number of posts, up to the pagination limit from API.
 * @param postType
 * @param page
 * @param fields
 * @returns
 */
async function getPosts(
  postType: string,
  fields: string[],
  page: number = 1,
  sort: string = ''
): Promise<any> {
  // Existing implementation...
  let apiUrl = `/api/${postType}/`;
  const encodedFields = encodeURIComponent(fields.join(','));
  const encodedSort = encodeURIComponent(sort);

  apiUrl = `${apiUrl}?page=${page}`;

  if (fields.length > 0) {
    apiUrl = `${apiUrl}&fields=${encodedFields}`;
  }

  if (sort.length > 0) {
    apiUrl = `${apiUrl}&sort=${encodedSort}`;
  }

  try {
    const response = await axios.request({
      url: apiUrl,
      baseURL: process.env.JESSKI_URL,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return [];
}

// Rest of your existing API functions...
async function searchPosts(
  postType: string,
  fields: string[],
  query: string
): Promise<any> {
  // Existing implementation...
  const encodedFields = encodeURIComponent(fields.join(','));
  const encodedQuery = encodeURIComponent(query);
  let apiUrl = `/api/${postType}/search?s=${encodedQuery}`;

  if (fields.length > 0) {
    apiUrl = `${apiUrl}&fields=${encodedFields}`;
  }

  try {
    const response = await axios.request({
      url: apiUrl,
      baseURL: process.env.JESSKI_URL,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return {
    results: [],
    totalPosts: 0,
  };
}

// Keep all your existing export functions
export async function searchBlogPosts(
  fields: string[],
  query: string
): Promise<PostResponse> {
  return searchPosts('posts', fields, query);
}

export async function getBlogPosts(
  fields: string[],
  page: number = 1,
  sort: string = ''
): Promise<PostResponse> {
  return getPosts('posts', fields, page, sort);
}

export async function getBlogPostBySlug(
  slug: string,
  fields: string[]
): Promise<PostResponse> {
  return getPostBySlug('posts', slug, fields);
}

// Existing game post functions...
export async function searchGamePosts(
  fields: string[],
  query: string
): Promise<GameResponse> {
  return searchPosts('games', fields, query);
}

export async function getGamePosts(
  fields: string[],
  page: number = 1,
  sort: string = ''
): Promise<GameResponse> {
  return getPosts('games', fields, page, sort);
}

export async function getGamePostBySlug(
  slug: string,
  fields: string[]
): Promise<GameResponse> {
  return getPostBySlug('games', slug, fields);
}

export async function getGamePostByAward(year: string): Promise<GameResponse> {
  let apiUrl = `/api/games/awards`;
  const encodedYear = encodeURIComponent(year);

  apiUrl = `${apiUrl}?year=${encodedYear}`;

  try {
    const response = await axios.request({
      url: apiUrl,
      baseURL: process.env.JESSKI_URL,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return {
    results: [],
    totalPosts: 0,
  };
}

export async function getGamePostsWithScreenshots(
  fields: string[],
  page: number = 1,
  sort: string = ''
): Promise<GameResponse> {
  let apiUrl = `/api/games/screenshots`;
  const encodedFields = encodeURIComponent(fields.join(','));
  const encodedSort = encodeURIComponent(sort);

  apiUrl = `${apiUrl}?page=${page}`;

  if (fields.length > 0) {
    apiUrl = `${apiUrl}&fields=${encodedFields}`;
  }

  if (sort.length > 0) {
    apiUrl = `${apiUrl}&sort=${encodedSort}`;
  }

  try {
    const response = await axios.request({
      url: apiUrl,
      baseURL: process.env.JESSKI_URL,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return {
    results: [],
    totalPosts: 0,
  };
}
