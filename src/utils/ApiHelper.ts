import { AppConfig } from './AppConfig';
import { FBGame } from './Posts';

const sortArray = require('sort-array');

function pick<T extends object, U extends keyof T>(
  obj: T,
  paths: Array<U>
): Pick<T, U> {
  const ret = Object.create(null);
  // eslint-disable-next-line no-restricted-syntax
  for (const k of paths) {
    ret[k] = obj[k];
  }
  return ret;
}

function insertAt(array: any[], index: any, ...elements: any[]) {
  array.splice(index, 0, ...elements);
}

export function filterPostFields(posts: any, fields: string): any[] {
  if (fields == null) {
    return [];
  }
  const filter = fields.split(',');
  return posts.map((post: any) => pick(post, filter));
}

export function getPostsByAward(
  posts: any,
  award: string,
  year: string
): any[] {
  const awardPosts = posts.reduce((awardedGames: FBGame[], post: FBGame) => {
    const { awards } = post;
    if (awards.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const gameAward of awards) {
        if (
          gameAward.name.toLowerCase() === award.toLowerCase() &&
          gameAward.year === year
        ) {
          switch (gameAward.type.toLowerCase()) {
            case 'gold':
              insertAt(awardedGames, 0, post);
              break;
            case 'silver':
              insertAt(awardedGames, 1, post);
              break;
            default:
              awardedGames.push(post);
          }
        }
      }
    }
    return awardedGames;
  }, []);

  return awardPosts;
}

export function getPostsWithScreenshots(posts: any): any[] {
  const screenshotPosts = posts.reduce(
    (screenshotGames: FBGame[], post: FBGame) => {
      const { screenshots } = post;
      if (screenshots.length > 0) {
        screenshotGames.push(post);
      }
      return screenshotGames;
    },
    []
  );

  return screenshotPosts;
}

export function getPageResults(posts: any[], page: string): any[] {
  // eslint-disable-next-line no-restricted-globals
  const pageNum = !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
  const pagination = AppConfig.pagination_size;

  if (pageNum === 1) {
    return posts.slice(0, pagination);
  }

  const resultsMin = pagination * (pageNum - 1);
  const resultsMax = resultsMin + pagination;

  return posts.slice(resultsMin, resultsMax);
}

export function sortPosts(posts: any[], sort: string) {
  if (sort == null) {
    return [];
  }

  // formatted like played:asc
  const key = sort.split(':')[0];
  const sortType = sort.split(':')[1];

  return sortArray(posts, {
    by: key,
    order: sortType,
  });
}
