import fs from 'fs';
import { join } from 'path';

import matter from 'gray-matter';

export type PostItems = {
  [key: string]: string;
};

export function getPostSlugs(postType: string) {
  const postsDirectory = join(process.cwd(), postType);
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(
  postType: string,
  slug: string,
  fields: string[] = []
) {
  const postsDirectory = join(process.cwd(), postType);
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const items: PostItems = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getPosts(
  postType: string,
  fields: string[] = [],
  numberPosts: number | string = 'all'
) {
  const slugs = getPostSlugs(postType);
  let posts = slugs
    .map((slug) => getPostBySlug(postType, slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  if (typeof numberPosts === 'number') {
    posts = posts.slice(0, numberPosts);
  }

  return posts;
}
