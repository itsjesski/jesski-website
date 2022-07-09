import axios from 'axios';

export type PostItems = {
  [key: string]: string;
};

export type FBPost = {
  title: string;
  description: string;
  date: string;
  modified_date: string;
  image: string;
  slug: string;
  content: string;
};

type PostResponse = {
  results: FBPost[];
  totalPosts: number;
};

export type FBReview = {
  title: string;
  description: string;
  score: number;
  playtime: string;
  date: string;
  modified_date: string;
  screenshots: string[];
  slug: string;
  content: string;
};

type ReviewResponse = {
  results: FBReview[];
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
      baseURL: process.env.SITE_URL,
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
  page: number = 1
): Promise<any> {
  let apiUrl = `/api/${postType}/`;
  const encodedFields = encodeURIComponent(fields.join(','));

  apiUrl = `${apiUrl}?page=${page}`;

  if (fields.length > 0) {
    apiUrl = `${apiUrl}&fields=${encodedFields}`;
  }

  try {
    const response = await axios.request({
      url: apiUrl,
      baseURL: process.env.SITE_URL,
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
      baseURL: process.env.SITE_URL,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return [];
}

export async function searchBlogPosts(
  fields: string[],
  query: string
): Promise<PostResponse> {
  return searchPosts('posts', fields, query);
}
export async function getBlogPosts(
  fields: string[],
  page: number = 1
): Promise<PostResponse> {
  return getPosts('posts', fields, page);
}
export async function getBlogPostBySlug(
  slug: string,
  fields: string[]
): Promise<PostResponse> {
  return getPostBySlug('posts', slug, fields);
}

export async function searchReviewPosts(
  fields: string[],
  query: string
): Promise<PostResponse> {
  return searchPosts('reviews', fields, query);
}
export async function getReviewPosts(
  fields: string[],
  page: number = 1
): Promise<ReviewResponse> {
  return getPosts('reviews', fields, page);
}
export async function getReviewPostBySlug(
  slug: string,
  fields: string[]
): Promise<ReviewResponse> {
  return getPostBySlug('reviews', slug, fields);
}
