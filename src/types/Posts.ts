export interface BasePost {
  slug: string;
  title: string;
  date: string;
  content: string;
  [key: string]: any; // Allow for additional metadata fields
}

export interface BlogPost extends BasePost {
  type: 'blog';
  description?: string;
  image?: string;
  tags?: string[];
}

export interface GameReview extends BasePost {
  type: 'game-review';
  description?: string;
  cover?: string;
  score?: number;
  tags?: string[];
  platforms?: string[];
}

export interface ArtworkPost extends BasePost {
  type: 'artwork';
  featuredImage: string;
  images?: string[];
  description?: string;
  excerpt?: string;
  tags?: string[];
}

export type Post = BlogPost | GameReview | ArtworkPost;

// Post caching system
export interface PostItems {
  [key: string]: string | string[] | boolean | number | null;
}

export type FBPost = {
  screenshots?: any;
  title: string;
  description: string;
  date: string;
  modified_date: string;
  image: string;
  slug: string;
  content: string;
};

export type PostResponse = {
  results: FBPost[];
  totalPosts: number;
};

export type GameAwards = string[];

export type GameTags = string[];

export type FBGame = {
  id: number;
  title: string;
  description: string;
  score: number;
  date: string;
  modified_date: string;
  screenshots: string[];
  slug: string;
  content: string;
  cover: string;
  goty: GameAwards | [];
  tags?: GameTags;
  image: string;
  completed: boolean;
  videos?: string[];
  type?: string;
};

export type GameResponse = {
  results: FBGame[];
  totalPosts: number;
};
