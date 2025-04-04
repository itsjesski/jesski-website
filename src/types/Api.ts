import { Post, FBGame, FBPost } from './Posts';

// IGDB types
export type Genres = [
  {
    id: number;
    name: string;
  }
];

export type Cover = {
  id: number;
  url: string;
};

export type Screenshots = Array<{
  id: number;
  url: string;
}>;

export type IGDBGame = {
  id: number;
  name: string;
  cover: Cover;
  genres: Genres;
  screenshots: Screenshots;
  videos: number[];
  aggregated_rating: number;
  summary: string;
  release_dates: Array<{ date: number; id: number }>;
};

// Twitch types
export type TwitchCache = {
  status: {
    online: boolean;
    time: number;
  };
};

export type TwitchSecrets = {
  client_id: string;
  client_secret: string;
};

// General API response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface SearchResponse {
  results: Post[] | FBGame[] | FBPost[];
  query: string;
  totalResults: number;
}
