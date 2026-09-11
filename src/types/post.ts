export interface Post {
  slug: string;
  title: string;
  date: string; // ISO string
  excerpt?: string;
  content: string;
  coverImage?: string; // Added for card style compatibility
  socialImage?: string; // Derived from coverImage or first content image
  categories?: string[]; // Added for card style compatibility
  author?: {
    name: string;
    picture: string;
  };
}

