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

  const response = {
    results: result,
    totalPosts: posts.length,
  };

  res.json(response);
}
