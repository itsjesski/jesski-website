import { posts } from '../../../../public/cache/_games';
import {
  filterPostFields,
  getPageResults,
  getPostsWithScreenshots,
  sortPosts,
} from '../../../utils/ApiHelper';

export default async function handler(
  req: { query: { page: string; fields: string; sort: string } },
  res: {
    json: (results: any) => void;
  }
) {
  if (req.query.page == null) {
    res.json([]);
    return;
  }

  const { page, fields, sort } = req.query;

  let result = posts;

  // Only use posts with screenshots.
  result = getPostsWithScreenshots(posts);

  // Always sort first, then trim and filter after.
  if (sort) {
    result = sortPosts(result, sort);
  }

  // Paginate
  result = getPageResults(result, page);

  // Filter post fields
  result = filterPostFields(result, fields);

  const response = {
    results: result,
    totalPosts: posts.length,
  };

  res.json(response);
}
