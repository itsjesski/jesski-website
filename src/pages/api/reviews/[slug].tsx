import { posts } from '../../../../public/cache/_reviews';
import { filterPostFields } from '../../../utils/ApiHelper';

export default async function handler(
  req: { query: { slug: string; fields: string } },
  res: {
    json: (results: any[]) => void;
  }
) {
  const { slug, fields } = req.query;

  let result = posts.filter((post) => {
    return post.slug === slug;
  });

  result = filterPostFields(result, fields);

  res.json(result);
}
