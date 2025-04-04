import { Post } from './Posts';

// General props
export interface ChildrenProps {
  children: React.ReactNode;
}

// PostCard component
export interface PostCardProps {
  post: Post;
  className?: string;
}

// ArtCard component
export interface ArtCardProps {
  gallery: {
    name: string;
    images: string[];
    featuredImage: string;
  };
  openLightbox: (images: string[], index: number) => void;
  size: string;
}

// Navigation component
export interface NavItemProps {
  href: string;
  text: string;
  isActive?: boolean;
}

// Lightbox component
export interface LightboxProps {
  images: string[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
}

// GameScoreBox component
export type GameScoreBoxProps = {
  score: number | string;
};

// Pagnation component
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handleNextPage: (page: number) => void;
  handlePrevPage: (page: number) => void;
}

// Search component
export interface SearchProps {
  postType: string;
}
