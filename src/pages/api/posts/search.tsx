import { posts } from '../../../../public/cache/_posts';

export default async function handler(
  req: { query: { s: string } },
  res: { json: (results: any) => void }
) {
  // Currently only searching titles.
  const result = req.query.s
    ? posts.filter((post) => post.title.toLowerCase().includes(req.query.s))
    : [];

  const response = {
    results: result,
    totalPosts: posts.length,
  };

  res.json(response);
}
