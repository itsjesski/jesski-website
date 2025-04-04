/* eslint-disable no-console */
import * as fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { PostItems } from '../types/Posts';

// Update to reference subdirectories within _content folder
// Use the directories that exist in your project
const postTypes = ['_content/_posts', '_content/_games', '_content/_art'];

function getPostSlugs(postType: string): string[] {
  const postsDirectory = join(process.cwd(), postType);
  // Check if directory exists before reading
  return fs.existsSync(postsDirectory) ? fs.readdirSync(postsDirectory) : [];
}

function getPostBySlug(postType: string, slug: string): PostItems {
  const postsDirectory = join(process.cwd(), postType);
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return {
      slug: realSlug,
      content: '',
      title: 'Missing Post',
      date: new Date().toISOString().split('T')[0],
      type: (() => {
        if (postType.includes('_games')) {
          return 'game-review';
        }
        if (postType.includes('_art')) {
          return 'artwork';
        }
        return 'blog';
      })(),
    };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const items: PostItems = {};

  items.slug = realSlug;
  items.content = content;

  // Set type based on directory
  if (postType.includes('_art')) {
    items.type = 'artwork';
  } else if (postType.includes('_games')) {
    items.type = 'game-review';
  } else {
    items.type = 'blog';
  }

  // Copy all frontmatter fields
  Object.entries(data).forEach((entry) => {
    const [key, value] = entry;
    items[key] = value;
  });

  return items;
}

function getPosts(postType: string): PostItems[] {
  const slugs = getPostSlugs(postType);
  const posts = slugs
    .filter((slug) => slug.endsWith('.md')) // Only process markdown files
    .map((slug) => getPostBySlug(postType, slug))
    // sort posts by date in descending order
    .sort((post1, post2) => {
      const date1 = post1.date as string;
      const date2 = post2.date as string;
      return date1 > date2 ? -1 : 1;
    });

  return posts;
}

function getPostsForCache(postType: string): string {
  const posts = getPosts(postType);
  return JSON.stringify(posts);
}

function generatePostTypeCache(postType: string): void {
  // Extract the actual post type name (remove _content/ prefix)
  const cacheFileName = postType.split('/').pop() || postType;

  const fileContents = `export const posts = ${getPostsForCache(postType)}`;

  // Ensure cache directory exists
  try {
    fs.mkdirSync('public/cache', { recursive: true });
  } catch (e) {
    // Directory already exists
  }

  fs.writeFile(`public/cache/${cacheFileName}.ts`, fileContents, (err) => {
    if (err) {
      console.log(`Error caching ${cacheFileName}.`);
    }
    console.log(`${cacheFileName} posts were cached.`);
  });
}

/**
 * This will create a file in /cache for each post type.
 * These files will contain a variable with post data for all of the related posts.
 */
postTypes.forEach((postType) => {
  generatePostTypeCache(postType);
});
