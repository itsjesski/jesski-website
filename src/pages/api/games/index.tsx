import { posts } from '../../../../public/cache/_games';
import {
  filterPostFields,
  getPageResults,
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

  // for each post, add https: to the "cover" and "image" fields
  result = result.map((post) => {
    if (post.cover && !post.cover.startsWith('https:')) {
      post.cover = `https:${post.cover}`;
    }
    if (post.image && !post.image.startsWith('https:')) {
      post.image = `https:${post.image}`;
    }
    return post;
  });

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
