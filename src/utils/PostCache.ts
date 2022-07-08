import * as fs from 'fs';
import { join } from 'path';

import matter from 'gray-matter';

const postTypes = ['_posts', '_reviews'];

export type PostItems = {
  [key: string]: string;
};

function getPostSlugs(postType: string) {
  const postsDirectory = join(process.cwd(), postType);
  return fs.readdirSync(postsDirectory);
}
function getPostBySlug(postType: string, slug: string) {
  const postsDirectory = join(process.cwd(), postType);
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const items: PostItems = {};

  items.slug = realSlug;
  items.content = content;
  Object.entries(data).forEach((entry) => {
    const [key, value] = entry;
    items[key] = value;
  });

  return items;
}

function getPosts(postType: string) {
  const slugs = getPostSlugs(postType);
  const posts = slugs
    .map((slug) => getPostBySlug(postType, slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}

function getPostsForCache(postType: string) {
  const posts = getPosts(postType);
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
