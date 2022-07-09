import FuzzySearch from 'fuzzy-search';

import { posts } from '../../../../public/cache/_posts';
import { filterPostFields } from '../../../utils/ApiHelper';

export default async function handler(
  req: { query: { s: string; fields: string } },
  res: { json: (results: any) => void }
) {
  const { s, fields } = req.query;

  const searcher = new FuzzySearch(posts, ['title', 'description'], {
    caseSensitive: false,
  });

  // Currently only searching titles.
  const search = decodeURIComponent(s);
  let result = searcher.search(search);

  // We're only going to return 10 results, as we're using fuzzy search with a dropdown from a search bar instead of a search page.
  result = result.slice(0, 10);

  result = filterPostFields(result, fields);

  const response = {
    results: result,
    totalPosts: posts.length,
  };

  res.json(response);
}
