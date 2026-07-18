import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import "./code-highlight.css";
import TopNavbar from "@/components/nav/TopNavBar";
import { ImageWithPreview } from "@/components/ui/ImageWithPreview";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { formatDate } from "@/utils/format";
import JsonLd from "@/components/seo/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/config/app";

interface Props {
  params: {
    slug: string;
  };
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mifune.dev";
  // Fallback to a default image if no specific image is found
  // Note: Ensure /static/social-default.png exists or use a valid URL
  const defaultImage = `${siteUrl}/static/social-default.png`;

  let imageUrl = post.socialImage || defaultImage;

  // Ensure absolute URL
  if (imageUrl && !imageUrl.startsWith("http")) {
    try {
      imageUrl = new URL(imageUrl, siteUrl).href;
    } catch (e) {
      console.error("Failed to construct absolute URL for social image", e);
      imageUrl = defaultImage;
    }
  }

  const description =
    post.excerpt ||
    post.content.slice(0, 160).replace(/\n/g, " ").trim() + "...";

  return {
    title: post.title,
    description: description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    keywords: post.categories,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: post.author ? [post.author.name] : undefined,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default function BlogPost({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ])}
      />
      <header>
        <TopNavbar />
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen scroll-mt-20 bg-background"
      >
        <div className="absolute inset-0 h-[50vh] bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <article className="container relative z-10 mx-auto max-w-5xl px-4 py-32">
          <header className="mb-12">
            {post.categories && (
              <div className="mb-4 flex gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 font-space text-xs font-bold text-green-500"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-cormorant mb-6 text-4xl font-light tracking-tight text-foreground md:text-5xl">
              {post.title}
            </h1>

            <div className="flex items-center font-montserrat text-muted-foreground">
              {post.author && (
                <div className="mr-6 flex items-center">
                  {post.author.picture && (
                    <Image
                      src={post.author.picture}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="mr-3 rounded-full"
                    />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
              <time>{formatDate(new Date(post.date).getTime())}</time>
            </div>
          </header>

          {post.coverImage && (
            <ImageWithPreview
              src={post.coverImage}
              alt={post.title}
              containerClassName="relative mb-12 aspect-video w-full overflow-hidden rounded-xl md:aspect-auto md:h-[400px]"
              imageClassName="h-full w-full object-cover"
            />
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MarkdownContent content={post.content} />
          </div>
        </article>
      </main>
    </>
  );
}
