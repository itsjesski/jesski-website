import { ParsedUrlQuery } from 'querystring';
import { FBPost, GameAwards } from './Posts';

// URL parameter types
export interface IPostUrl extends ParsedUrlQuery {
  slug: string;
}

// Game details page
export interface GameDetails {
  id: number;
  title: string;
  description: string;
  date: string;
  modified_date: string;
  content: string;
  score: number;
  image: string;
  cover: string;
  completed: boolean;
  goty: GameAwards | [];
  videos: string[];
  screenshots: string[];
}

// Page props types
export interface GamePageProps {
  post: GameDetails;
}

export interface PostPageProps {
  post: FBPost;
}

// Game sort type
export interface GameSort {
  id: number;
  name: string;
  unavailable: boolean;
  value: string;
}
