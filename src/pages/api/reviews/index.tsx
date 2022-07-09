import { posts } from '../../../../public/cache/_reviews';
import { filterPostFields, getPageResults } from '../../../utils/ApiHelper';

export default async function handler(
  req: { query: { page: string; fields: string } },
  res: {
    json: (results: any) => void;
  }
) {
  if (req.query.page == null) {
    res.json([]);
    return;
  }

  const { page, fields } = req.query;
  let result = getPageResults(posts, page);
  result = filterPostFields(result, fields);

  const response = {
    results: result,
    totalPosts: posts.length,
  };

  res.json(response);
}
