import withPWAInit from "@ducanh2912/next-pwa";
import { createMDX } from "fumadocs-mdx/next";
import { agroHostRedirects } from "./src/config/agro-redirects.ts";

const withMDX = createMDX();

const INSTALLER_FILES = ["install.sh", "get-agro.sh", "agro.js", "oh.js"];

const withPWA = withPWAInit({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  swcMinify: true,
  dest: "public",
  publicExcludes: ["!noprecache/**/*", ...INSTALLER_FILES.map((file) => `!${file}`)],
  extendDefaultRuntimeCaching: true,
  disable: process.env.NODE_ENV !== "production",
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https?:\/\/[^/]+\/(?:install\.sh|get-agro\.sh|agro\.js|oh\.js)(?:[?#].*)?$/i,
        handler: "NetworkOnly",
        options: { cacheName: "agro-installers" },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "secure.meetupstatic.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async headers() {
    return INSTALLER_FILES.map((file) => ({
      source: `/${file}`,
      headers: [
        {
          key: "Content-Type",
          value: file.endsWith(".sh")
            ? "text/plain; charset=utf-8"
            : "application/javascript; charset=utf-8",
        },
        { key: "Cache-Control", value: "no-cache" },
      ],
    }));
  },
  async redirects() {
    return [
      ...agroHostRedirects(INSTALLER_FILES),
      { source: "/case-studies", destination: "/", permanent: false },
      {
        source: "/blog/openharness-getting-started",
        destination: "/blog/agro-getting-started",
        permanent: true,
      },
    ];
  },
};

export default withMDX(withPWA(nextConfig));
