import { posts } from '../../../../public/cache/_games';
import { getPostsByGOTYYear } from '../../../utils/ApiHelper';

export default async function handler(
  req: { query: { fields: string; award: string; year: string } },
  res: {
    json: (results: any) => void;
  }
) {
  const { year } = req.query;

  let result = posts;

  // Get only posts that have an award.
  result = getPostsByGOTYYear(result, year);

  const response = {
    results: result,
    totalPosts: posts.length,
  };

  res.json(response);
}
