import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types/post';

function extractFirstImage(content: string): string | null {
  const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (mdMatch) return mdMatch[1];
  const htmlMatch = content.match(/<img[^>]+src=["'](.*?)["']/);
  if (htmlMatch) return htmlMatch[1];
  return null;
}

export function getSortedPosts(): Post[] {
  let postsDirectory = path.join(process.cwd(), 'posts');
  
  // Try alternative path if default doesn't exist (e.g. running from root vs website dir)
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
      const { content, data } = matter(fileContents);

      const socialImage = data.coverImage || extractFirstImage(content);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string | undefined,
        content,
        coverImage: data.coverImage as string | undefined,
        socialImage: socialImage as string | undefined,
        categories: data.categories as string[] | undefined,
        author: data.author as { name: string; picture: string } | undefined,
      };
    });

  // Sort by date descending
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
    const { content, data } = matter(fileContents);

    const socialImage = data.coverImage || extractFirstImage(content);

    return {
      slug: realSlug,
      title: data.title as string,
      date: data.date as string,
      excerpt: data.excerpt as string | undefined,
      content,
      coverImage: data.coverImage as string | undefined,
      socialImage: socialImage as string | undefined,
      categories: data.categories as string[] | undefined,
      author: data.author as { name: string; picture: string } | undefined,
    };
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
