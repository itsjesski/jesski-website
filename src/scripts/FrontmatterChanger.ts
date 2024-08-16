// @ts-check

/**
 * This file allows me to easily add or remove frontmatter to all of the md posts.
 */

import { readdir, readFile, writeFile } from 'fs/promises';

import matter from 'gray-matter';
import { stringify } from 'yaml';

const directory = './_games';

async function updateFrontMatter(filename: string) {
  const filepath = `${directory}/${filename}`;

  const { data: frontMatter, content } = matter(await readFile(filepath));

  // remove desc attribute
  // if (frontMatter.desc === '') {
  //   delete frontMatter.desc;
  // }

  // parse created date attribute and convert it as timestamp
  // if (typeof frontMatter.created === 'string') {
  //   frontMatter.created = new Date(frontMatter.created).getTime();
  // }

  // delete frontmatter.tags;

  frontMatter.videos = [];

  const newContent = `---\n${stringify(frontMatter)}---\n${content}`;
  await writeFile(filepath, newContent);

  // eslint-disable-next-line no-console
  console.log(`- [x] ${filepath}`);
}

async function main() {
  const filenames = await readdir(directory);
  const markdownFilenames = filenames.filter((f: string) => f.endsWith('.md'));

  await Promise.all(markdownFilenames.map(updateFrontMatter));
}

// eslint-disable-next-line no-console
main().catch(console.error);
