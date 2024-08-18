import axios from 'axios';

export type PostItems = {
  [key: string]: string;
};

export type FBPost = {
  screenshots: any;
  title: string;
  description: string;
  date: string;
  modified_date: string;
  image: string;
  slug: string;
  content: string;
};

export type PostResponse = {
  results: FBPost[];
  totalPosts: number;
};

export type GameAwards = string[];

export type GameTags = string[];

export type FBGame = {
  id: number;
  title: string;
  description: string;
  score: number;
  date: string;
  modified_date: string;
  screenshots: string[];
  slug: string;
  content: string;
  cover: string;
  goty: GameAwards;
  tags: GameTags;
  image: string;
  completed: boolean;
  videos: string[];
};

export type GameResponse = {
  results: FBGame[];
  totalPosts: number;
};

/**
 * Gets a post by post slug.
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
  let apiUrl = `/api/${postType}/${slug}/`;
  const encodedFields = encodeURIComponent(fields.join(','));

  if (fields.length > 0) {
    apiUrl = `${apiUrl}?fields=${encodedFields}`;
  }

  try {
    const response = await axios.request({
      url: apiUrl,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return [];
}

/**
 * Gets X number of posts, up to the pagination limit.
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
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return [];
}

async function searchPosts(
  postType: string,
  fields: string[],
  query: string
): Promise<any> {
  const encodedFields = encodeURIComponent(fields.join(','));
  const encodedQuery = encodeURIComponent(query);
  let apiUrl = `/api/${postType}/search?s=${encodedQuery}`;

  if (fields.length > 0) {
    apiUrl = `${apiUrl}&fields=${encodedFields}`;
  }

  try {
    const response = await axios.request({
      url: apiUrl,
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
