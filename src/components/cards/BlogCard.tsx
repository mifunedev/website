import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types/post";
import { formatDate } from "@/utils/format";

// Helper for Author Info, extracted from original page.tsx
const AuthorInfo = ({
  name,
  published,
  img = "https://avatars.githubusercontent.com/u/40816745?s=400&u=f2d7532a21510a6d122dfb725453daf88d614947&v=4",
}: {
  name: string;
  published: Date;
  img?: string;
}) => (
  <div className="flex items-center rounded-b-lg pt-3">
    <Image
      src={img}
      alt={name}
      width={50}
      height={50}
      className="rounded-full"
    />
    <div className="ml-3">
      <div className="text-sm font-semibold text-card-foreground">{name}</div>
      <div className="text-xs text-muted-foreground">
        {formatDate(published.getTime())}
      </div>
    </div>
  </div>
);

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Use coverImage from frontmatter or fallback
  const imageSrc = post.coverImage || "/images/placeholder-blog.jpg";

  return (
    <div
      style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      className="flex h-full cursor-pointer flex-col rounded-lg border border-border bg-card shadow transition duration-300 ease-in-out hover:shadow-lg"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-video w-full overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          className="rounded-t-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-grow flex-col p-4 text-card-foreground">
        {post.categories && (
          <div className="no-scrollbar mb-2 flex flex-nowrap overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {post.categories.map((category: string, index: number) => (
              <div
                key={index}
                className="m-1 flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-2 py-1 font-medium text-primary"
              >
                <div
                  className="max-w-full flex-initial whitespace-nowrap text-xs font-normal leading-none"
                  title={category}
                >
                  {category}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="my-1 text-lg font-semibold text-card-foreground transition-colors hover:text-primary">
            {post.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-3 flex-grow text-xs text-muted-foreground">
          {post.excerpt}
        </p>

        <AuthorInfo
          name={post.author?.name || "Mifune Team"}
          published={new Date(post.date)}
          img={post.author?.picture}
        />
      </div>
    </div>
  );
};

export default BlogCard;
