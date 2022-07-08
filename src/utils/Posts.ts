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
): Promise<any[]> {
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
): Promise<any[]> {
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

export async function getBlogPosts(
  fields: string[],
  page: number = 1
): Promise<FBPost[]> {
  return getPosts('posts', fields, page);
}
export async function getBlogPostBySlug(
  slug: string,
  fields: string[]
): Promise<FBPost[]> {
  return getPostBySlug('posts', slug, fields);
}

export async function getReviewPosts(
  fields: string[],
  page: number = 1
): Promise<FBReview[]> {
  return getPosts('reviews', fields, page);
}
export async function getReviewPostBySlug(
  slug: string,
  fields: string[]
): Promise<FBReview[]> {
  return getPostBySlug('reviews', slug, fields);
}
