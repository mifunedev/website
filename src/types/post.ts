export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  socialImage?: string;
  categories?: string[];
  archived?: boolean;
  author?: {
    name: string;
    picture: string;
  };
}

