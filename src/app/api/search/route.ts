import { createSearchAPI, type AdvancedIndex } from "fumadocs-core/search/server";
import { source } from "@/lib/source";
import { getSortedPosts } from "@/lib/posts";

function docsIndexes(): AdvancedIndex[] {
  return source.getPages().map((page) => ({
    id: page.url,
    title: page.data.title ?? page.url,
    description: page.data.description,
    url: page.url,
    tag: "docs",
    structuredData: page.data.structuredData,
  }));
}

function postIndexes(): AdvancedIndex[] {
  return getSortedPosts().map((post) => ({
    id: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    tag: "blog",
    breadcrumbs: ["Blog"],
    structuredData: {
      headings: [],
      contents: post.excerpt ? [{ heading: undefined, content: post.excerpt }] : [],
    },
  }));
}

export const { GET } = createSearchAPI("advanced", {
  indexes: () => [...docsIndexes(), ...postIndexes()],
});
