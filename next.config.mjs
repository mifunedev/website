import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    dest: "public",
    // PWA service worker breaks HMR and 404s /_next/static chunks in `next dev`.
    // Disable it outside production so dev (and the dev-served public tunnel) hot-reloads cleanly.
    disable: process.env.NODE_ENV !== "production",
    fallbacks: {
      //image: "/static/images/fallback.png",
      document: "/offline", // if you want to fallback to a custom page rather than /_offline
      // font: '/static/font/fallback.woff2',
      // audio: ...,
      // video: ...,
    },
    workboxOptions: {
      disableDevLogs: true,
    },
    // ... other options you like
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
    async redirects() {
      return [
        { source: '/services', destination: '/pricing', permanent: true },
        // Workflow Academy case study hidden until a real case study ships.
        // Temporary (307) so it can be re-enabled by removing this entry.
        { source: '/case-studies', destination: '/', permanent: false },
      ];
    },
  };
  
  export default withPWA(nextConfig);
