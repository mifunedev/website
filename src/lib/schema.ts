import { socialIcons, SITE_URL } from "@/config/app";
import type { Post } from "@/types/post";

/**
 * Single source of truth for the site's Schema.org / JSON-LD structured data.
 * Brand facts (name, logo, socials, founder) are pulled from config/app.ts so the
 * SERP entity, blog rich results, and breadcrumbs stay consistent with the site.
 */

const ORG_NAME = "Mifune";
const ORG_LEGAL_NAME = "Mifune Dev";
const ORG_EMAIL = "hello@mifune.dev";
const LOGO_URL = `${SITE_URL}/pe-logo.png`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Only real, resolvable profile URLs belong in sameAs (drops placeholder "#" links).
const sameAs = socialIcons
  .map((s) => s.link)
  .filter((link) => link.startsWith("http"));

function toAbsolute(src: string): string {
  if (src.startsWith("http")) return src;
  try {
    return new URL(src, SITE_URL).href;
  } catch {
    return LOGO_URL;
  }
}

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    legalName: ORG_LEGAL_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    description:
      "Mifune builds and manages AI workers inside your business — done-with-you AI automation for non-technical business owners.",
    email: ORG_EMAIL,
    founder: {
      "@type": "Person",
      name: "Ryan Eggleston",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saint George",
      addressRegion: "UT",
      addressCountry: "US",
    },
    areaServed: "US",
    sameAs,
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: ORG_NAME,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
  };
}

export function blogPostingSchema(post: Post): Record<string, unknown> {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.socialImage ? toAbsolute(post.socialImage) : LOGO_URL;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    image,
    datePublished: post.date,
    dateModified: post.date,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.picture ? { image: post.author.picture } : {}),
        }
      : { "@type": "Organization", name: ORG_NAME },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    ...(post.categories && post.categories.length
      ? { keywords: post.categories.join(", ") }
      : {}),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageSchema(
  faqs: { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
