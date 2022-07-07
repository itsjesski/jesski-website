import * as fs from 'fs';

import { getPosts } from './Posts';

const postTypes = ['_posts', '_reviews'];

function getPostsForCache(postType: string) {
  const posts = getPosts(postType, ['*']);
  return JSON.stringify(posts);
}

function generatePostTypeCache(postType: string) {
  const fileContents = `export const posts: any[] = ${getPostsForCache(
    postType
  )}`;

  try {
    fs.readdirSync('public/cache');
  } catch (e) {
    fs.mkdirSync('public/cache');
  }

  fs.writeFile(`public/cache/${postType}.ts`, fileContents, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(`Error caching ${postType}.`);
    }
    // eslint-disable-next-line no-console
    console.log(`${postType} posts were cached.`);
  });
}

/**
 * When this script is run it'll create a file in /cache for each post type.
 * These files will contain a variable with post data for all of the related posts.
 * This is used in searches and other areas of the site to make things faster.
 */
postTypes.forEach((postType) => {
  generatePostTypeCache(postType);
});
