import { posts } from '../../../../public/cache/_games';
import { getPostsByAward } from '../../../utils/ApiHelper';

export default async function handler(
  req: { query: { fields: string; award: string; year: string } },
  res: {
    json: (results: any) => void;
  }
) {
  const { award, year } = req.query;

  let result = posts;

  // Get only posts that have an award named after the award variable.
  result = getPostsByAward(result, award, year);

  const response = {
    results: result,
    totalPosts: posts.length,
  };

  res.json(response);
}
