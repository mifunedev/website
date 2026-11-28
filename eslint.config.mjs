import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      "@next/next/no-img-element": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/agro.js",
    "public/oh.js",
    "public/install.sh",
    "public/get-agro.sh",
    "public/sw.js",
    "public/swe-worker-*.js",
    "public/fallback-*.js",
    "public/workbox-*.js",
    ".source/**",
    "content/docs/agro/**",
  ]),
]);
