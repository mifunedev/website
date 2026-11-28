import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types/post';
import { resolveAuthors } from '@/config/authors';

function extractFirstImage(content: string): string | null {
  const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (mdMatch) return mdMatch[1];
  const htmlMatch = content.match(/<img[^>]+src=["'](.*?)["']/);
  if (htmlMatch) return htmlMatch[1];
  return null;
}

function parsePost(slug: string, fileContents: string): Post {
  const { content, data } = matter(fileContents);
  const authors = Array.isArray(data.authors) ? resolveAuthors(data.authors) : undefined;
  const author = authors?.[0]
    ? { name: authors[0].name, picture: authors[0].imageUrl }
    : (data.author as { name: string; picture: string } | undefined);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string | undefined,
    content,
    coverImage: data.coverImage as string | undefined,
    socialImage: (data.coverImage || extractFirstImage(content)) as string | undefined,
    categories: data.categories as string[] | undefined,
    authors,
    author,
    archived: data.archived === true,
  };
}

export function getSortedPosts(): Post[] {
  let postsDirectory = path.join(process.cwd(), 'posts');
  
  if (!fs.existsSync(postsDirectory)) {
    console.log(`Posts directory not found at ${postsDirectory}, trying website/posts`);
    postsDirectory = path.join(process.cwd(), 'website', 'posts');
  }

  console.log(`Looking for posts in: ${postsDirectory}`);

  if (!fs.existsSync(postsDirectory)) {
    console.error(`Posts directory not found at ${postsDirectory}`);
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  console.log(`Found files: ${fileNames.join(', ')}`);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return parsePost(slug, fileContents);
    })
    .filter((post) => !post.archived);

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  try {
    let postsDirectory = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDirectory)) {
        postsDirectory = path.join(process.cwd(), 'website', 'posts');
    }

    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return parsePost(realSlug, fileContents);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  let postsDirectory = path.join(process.cwd(), 'posts');
  if (!fs.existsSync(postsDirectory)) {
    postsDirectory = path.join(process.cwd(), 'website', 'posts');
  }

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}
