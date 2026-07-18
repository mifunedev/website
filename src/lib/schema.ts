import { socialIcons, SITE_URL } from "@/config/app";
import { OFFERING_URLS } from "@/config/offerings";
import type { Post } from "@/types/post";

const ORG_NAME = "Mifune";
const ORG_LEGAL_NAME = "Mifune Dev";
const ORG_EMAIL = OFFERING_URLS.supportEmail;
const LOGO_URL = `${SITE_URL}/pe-logo.png`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const CLOUD_SERVICE_ID = `${SITE_URL}/#openharness-cloud`;
const OPEN_SOURCE_ID = `${OFFERING_URLS.openSource}#software`;
const SUPPORT_SERVICE_ID = `${SITE_URL}/services/#service`;

const sameAs = socialIcons
  .map((social) => social.link)
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
      "Mifune maintains the MIT-licensed Open Harness coding-agent workspace, operates Open Harness Cloud, and offers forward-deployed engineering support for Cloud customers.",
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
    description:
      "Mifune workspaces for coding agents: managed Open Harness Cloud, MIT-licensed Open Harness, and engineering support for Cloud customers.",
    publisher: { "@id": ORG_ID },
  };
}

export function cloudServiceSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": CLOUD_SERVICE_ID,
    name: "Open Harness Cloud",
    serviceType: "Managed coding-agent workspace",
    category: "Coding agent workspace",
    description:
      "A managed path to an isolated, persistent Open Harness workspace for coding agents, with Mifune operating the environment.",
    url: OFFERING_URLS.cloud,
    provider: { "@id": ORG_ID },
    subjectOf: {
      "@type": "WebSite",
      name: "Open Harness Documentation",
      url: OFFERING_URLS.docs,
    },
  };
}

export function openHarnessSoftwareSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": OPEN_SOURCE_ID,
    name: "Open Harness",
    description:
      "MIT-licensed source for an isolated, persistent Docker workspace that keeps one coding-agent project and its toolchain off the host.",
    url: OFFERING_URLS.openSource,
    codeRepository: OFFERING_URLS.openSource,
    license: `${OFFERING_URLS.openSource}/blob/main/LICENSE`,
    runtimePlatform: "Docker",
    isAccessibleForFree: true,
    author: { "@id": ORG_ID },
  };
}

export function supportServiceSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": SUPPORT_SERVICE_ID,
    name: "Open Harness Cloud Engineering Support",
    serviceType: "Forward-deployed engineering support",
    category: "Engineering support for managed coding-agent workspaces",
    description:
      "Mifune engineering help for Open Harness Cloud customers to plan, implement, integrate, troubleshoot, and hand off a deployment.",
    url: `${SITE_URL}/services`,
    provider: { "@id": ORG_ID },
    audience: {
      "@type": "Audience",
      audienceType: "Open Harness Cloud customers",
    },
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
    ...(post.categories?.length
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
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
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
