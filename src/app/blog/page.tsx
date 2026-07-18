import React, { Suspense } from "react";
import type { Metadata } from "next";
import TopNavbar from "@/components/nav/TopNavBar";
import Loading from "@/components/loaders/Loading";
import BlogCard from "@/components/cards/BlogCard";
import { getSortedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Deep dives into AI orchestration, agent development, and the future of intelligent workflows — from the team building managed AI workers at Mifune.",
  alternates: {
    canonical: "/blog",
  },
};

// Server Component
export default function BlogIndex() {
  const posts = getSortedPosts();
  console.log(`Rendering BlogIndex with ${posts.length} posts`);

  return (
    <main>
      <TopNavbar />
      {/* Added pt-32 to account for fixed navbar, z-0 to ensure it's behind navbar if needed, but navbar is z-50 */}
      <div className="min-h-screen bg-background bg-cover bg-center bg-no-repeat pb-20 pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-16 text-center">
            <h1 className="font-montserrat mb-6 text-5xl font-light leading-tight tracking-tight text-foreground sm:text-7xl">
              Mifune{" "}
              <span className="font-space font-bold text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                Blog
              </span>
            </h1>
            <p className="mx-auto max-w-2xl font-montserrat text-xl font-light leading-relaxed text-muted-foreground">
              Deep dives into AI orchestration, agent development, and the
              future of intelligent workflows.
            </p>
          </div>

          {posts.length === 0 && (
            <div className="text-center text-muted-foreground">
              <p>No posts found.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<Loading />}>
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
