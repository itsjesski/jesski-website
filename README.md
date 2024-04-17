# firebottle-website

### What is this?
This project was built as a website for the Firebottle stream community.

### Features
- Static site generator
- Markdown files for posts
- Automatic SEO based on fields in the markdown files.
- API calls to Twitch and IGDB for pulling game and stream resources.

### Developer experience:

- [Next.js](https://nextjs.org) for Static Site Generator
- Integrate with [Tailwind CSS](https://tailwindcss.com)
- [PostCSS](https://postcss.org) for processing [Tailwind CSS](https://tailwindcss.com)
- Type checking [TypeScript](https://www.typescriptlang.org)
- Linter with [ESLint](https://eslint.org)
- Code Formatter with [Prettier](https://prettier.io)
- SEO metadata, [JSON-LD](https://developers.google.com/search/docs/guides/intro-structured-data) and [Open Graph](https://ogp.me/) tags with [Next SEO](https://github.com/garmeeh/next-seo)
- [Twurple](https://twurple.js.org) for making Twitch API calls.
- [IGDB API Node](https://www.npmjs.com/package/igdb-api-node) for IGDB API calls.
- [Flat Cache](https://github.com/royriojas/flat-cache) for caching API calls.

### Deployment
Deployment happens automatically when merging a branch into main. Digital Ocean picks up on the merge, builds everything, and deploys it to https://firebottle.info

![image](https://github.com/Firebottle/firebottle-website/assets/17416635/0f04b0f0-1364-4a67-b1af-e834dbf04a64)
